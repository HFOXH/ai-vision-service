# AI Vision Analyzer

AI Vision Analyzer is a full-stack application that allows users to upload images and receive detailed AI-powered descriptions using OpenAI's GPT-4o-mini Vision model.

Built with:

- **Next.js + TailwindCSS** (Frontend)
- **FastAPI** (Backend API)
- **Clerk Authentication**
- **OpenAI API**

---

## 🚀 Features

- Secure authentication with Clerk
- Upload and preview images instantly
- AI-generated descriptions (objects, mood, colors, composition)
- Free tier limit (1 analysis)
- Premium tier with unlimited usage
- Beautiful modern UI

---

---

## ⚙️ Requirements

Backend dependencies:

```
fastapi
uvicorn
openai
python-multipart
fastapi-clerk-auth
python-dotenv
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder:

```env
OPENAI_API_KEY=your_openai_api_key
CLERK_JWKS_URL=https://your-clerk-domain/.well-known/jwks.json
```

---

## ▶️ Running the Backend (FastAPI)

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API server for development mode:

```bash
uvicorn main:app --reload --port 8000
```

API will be available at:

```
http://127.0.0.1:8000
```

---

## ▶️ Running the Frontend (Next.js)

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:3000
```

---

## 🔍 API Endpoints

| Method | Endpoint        | Description |
|--------|----------------|-------------|
| GET    | `/api/health`  | Health check |
| GET    | `/api/usage`   | Usage + tier info |
| POST   | `/api/analyze` | Upload + analyze image |

---

## 🧠 AI Vision Analysis

The backend sends the uploaded image as Base64 and uses:

```python
model="gpt-4o-mini"
```

Prompt:

> Describe this image in detail, including objects, colors, mood, and notable features.

---

## 💎 Subscription Logic

- Free users: **1 analysis**
- Premium users: **Unlimited**

Usage tracked in-memory:

```python
usage_tracker = {}
```

---

## 📌 Notes

- File size limit: **5MB**
- Supported formats: JPG, JPEG, PNG, WEBP

---

## 👨‍🎓 Academic Project

Built by:  
Santiago Cardenas  

Built for:
**AIE1018 - Cambrian College**  
© 2026 AI Vision Analyzer

---

Powered by OpenAI + Clerk + FastAPI + Next.js

