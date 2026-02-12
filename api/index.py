from fastapi import FastAPI, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials
from mangum import Mangum

from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer

from openai import OpenAI

from dotenv import load_dotenv
load_dotenv() 

import os
import base64
import pathlib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


clerk_config = ClerkConfig(jwks_url=os.getenv("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# -----------------------------
# Usage Tracker (In-memory)
# -----------------------------

usage_tracker = {}

def check_and_increment_usage(user_id: str, tier: str) -> bool:
    """Returns True if user can proceed, False if limit exceeded"""

    if tier == "premium_subscription":
        return True
    current = usage_tracker.get(user_id, 0)
    if current >= 1:
        return False
    usage_tracker[user_id] = current + 1
    return True

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Vision Service"
    }

@app.get("/usage")
def check_usage(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    user_id = creds.decoded["sub"]

    public_metadata = creds.decoded.get("public_metadata", {})
    tier = public_metadata.get("subscription_tier", "free_user")

    used = usage_tracker.get(user_id, 0)

    return {
        "user_id": user_id,
        "tier": tier,
        "analyses_used": used,
        "limit": "unlimited" if tier == "premium_subscription" else 1
    }

@app.post("/analyze")
async def analyze_image(
    file: UploadFile,
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard)
):
    user_id = creds.decoded["sub"]

    public_metadata = creds.decoded.get("public_metadata", {})
    tier = public_metadata.get("subscription_tier", "free_user")

    ext = pathlib.Path(file.filename).suffix.lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Only jpg, jpeg, png, webp allowed.")

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max size is 5MB.")

    allowed = check_and_increment_usage(user_id, tier)

    if not allowed:
        raise HTTPException(status_code=429, detail="Free tier limit reached. Upgrade to Premium.")

    image_data = base64.b64encode(contents).decode("utf-8")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this image in detail, including objects, colors, mood, and any notable features."},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}}
                    ]
                }
            ],
            max_tokens=300
        )

        description = None
        if response.choices and len(response.choices) > 0:
            description = response.choices[0].message.content
        if not description:
            raise HTTPException(status_code=500, detail="No description returned from OpenAI")

        return {
            "user_id": user_id,
            "tier": tier,
            "description": description
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI Vision API error: {str(e)}")
    
handler = Mangum(app)
