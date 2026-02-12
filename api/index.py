from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Vision Service"
    }

@app.get("/api/usage")
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

@app.post("/api/analyze")
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