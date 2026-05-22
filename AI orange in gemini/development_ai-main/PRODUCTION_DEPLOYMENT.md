# Production Deployment Security & Environment Setup

## 🚀 Current Deployment Status

- **Domain:** `development-ai.vercel.app`
- **Status:** ✅ Ready
- **Branch:** `main`
- **Last Commit:** `92d0055ba3281e815ebe7da3c3fee391cf09b92b`

---

## ⚠️ **CRITICAL: Security Issue - API Key Exposed in Frontend**

### Current Setup (❌ **INSECURE**)
```typescript
// src/lib/api.ts - FRONTEND
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // ❌ Exposed in browser
const genAI = new GoogleGenerativeAI(apiKey);
```

**Problem:**
- API key visible in network requests
- Anyone can inspect browser and find it
- Attackers can use your key and deplete quota
- No rate limiting or usage monitoring

---

## ✅ **Production Setup (RECOMMENDED)**

### Architecture: Frontend → Backend Proxy → Gemini API

```
┌──────────────┐        ┌─────────────────────────┐        ┌─────────────┐
│   Browser    │───────→│   Vercel Function       │───────→│  Gemini API │
│   (React)    │ (POST) │   /api/chat             │        │             │
└──────────────┘        │                         │        └─────────────┘
                        │ - Rate Limiting         │
                        │ - Key Protected         │
                        │ - Logging & Monitoring  │
                        └─────────────────────────┘
```

---

## 🔧 **Step 1: Update Environment Variables**

### On Vercel Dashboard:
**Settings → Environment Variables**

**Add these:**
```
GEMINI_API_KEY = your_actual_api_key_here
NODE_ENV = production
```

**Remove from Vercel:**
- ❌ `VITE_GEMINI_API_KEY` (no longer needed)

### Local Development (.env.local):
```dotenv
# Backend (kept secret, never exposed to frontend)
GEMINI_API_KEY=your_actual_api_key_here

# Frontend (safe public values only)
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🔧 **Step 2: Backend API Endpoint**

**File:** `api/chat.ts` (already created)

**What it does:**
- ✅ Receives prompt from frontend
- ✅ Keeps API key in backend only
- ✅ Rate limits (10 req/min per IP)
- ✅ Error handling & logging
- ✅ CORS enabled for frontend

**Usage:**
```bash
POST /api/chat
Content-Type: application/json

{
  "prompt": "What is React?",
  "modelType": "default"  // optional: default|reasoning|fast|lite
}
```

**Response:**
```json
{
  "success": true,
  "response": "React is a JavaScript library...",
  "model": "gemini-2.5-flash",
  "timestamp": "2026-05-17T17:35:00Z"
}
```

---

## 🔧 **Step 3: Update Frontend**

### Option A: Use Backend Proxy (RECOMMENDED)

Replace `src/lib/api.ts` imports in `AIChat.tsx`:

```typescript
// OLD (insecure)
import { streamChatCompletion } from '../lib/api';

// NEW (secure)
import { streamChatCompletionViaProxy } from '../lib/api-proxy';

// Usage (same API, just different function)
await streamChatCompletionViaProxy({
  prompt: currentInput,
  onChunk,
  onFinish,
  onError,
  modelType: 'default' // optional
});
```

### Option B: Keep Direct API (For Local Dev Only)

Use `src/lib/api.ts` locally, but set `VITE_GEMINI_API_KEY` only in `.env.local`

---

## 🔧 **Step 4: Vercel Deployment**

### Automatic (already set up):
- Vercel detects `api/` folder
- Automatically creates serverless functions
- Handles CORS, scaling, monitoring

### Manual Trigger:
```bash
# Push to main branch
git add .
git commit -m "Add backend API proxy for secure Gemini integration"
git push origin main

# Or manually trigger on Vercel dashboard → Deployments → Redeploy
```

---

## ✅ **Security Checklist**

- [ ] ✅ API key in Vercel environment variables (not in code)
- [ ] ✅ Backend proxy (`api/chat.ts`) created
- [ ] ✅ Frontend uses `api-proxy.ts` instead of direct API
- [ ] ✅ CORS configured on backend
- [ ] ✅ Rate limiting enabled (10 req/min)
- [ ] ✅ `.env.local` added to `.gitignore`
- [ ] ✅ Removed `VITE_GEMINI_API_KEY` from `.env.example`

---

## 🔐 **.env.example** (Updated)

```dotenv
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Backend Configuration (never expose frontend)
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend Base URL
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🚀 **Deployment Flow**

1. **Local Dev:**
   - `.env.local` has `GEMINI_API_KEY`
   - Frontend calls `http://localhost:3000/api/chat`
   - Backend handles requests

2. **Production (Vercel):**
   - Vercel env vars have `GEMINI_API_KEY`
   - Frontend calls `https://development-ai.vercel.app/api/chat`
   - Backend handles requests
   - API key never exposed to browser

---

## 📊 **Monitoring & Logging**

### Vercel Dashboard:
- **Functions → Logs:** See backend requests/errors
- **Analytics → Usage:** Monitor API calls
- **Environment:** Verify variables are set

### Local Development:
```bash
# See backend logs
tail -f .vercel/output.log
```

---

## 🆘 **Troubleshooting**

### Issue: "GEMINI_API_KEY is not set"
```
Solution: Add GEMINI_API_KEY to Vercel Environment Variables
```

### Issue: "CORS error"
```
Solution: Verify CORS headers in api/chat.ts are set correctly
```

### Issue: "Too many requests"
```
Solution: Rate limit is 10 req/min per IP. Wait and retry.
```

### Issue: "404 on /api/chat"
```
Solution: Ensure api/chat.ts is in api/ folder, not src/
```

---

## 📈 **Cost Optimization**

1. **Rate Limiting:** Prevents abuse (10 req/min per IP)
2. **Model Selection:** Use `lite` for simple queries, saves costs
3. **Prompt Optimization:** Shorter prompts = lower costs
4. **Caching:** Consider Redis for frequently asked questions

---

## ✨ **Features Added**

| File | Purpose |
|------|---------|
| `api/chat.ts` | Secure backend endpoint with rate limiting |
| `src/lib/api-proxy.ts` | Client wrapper for backend communication |
| `.env.example` | Updated with secure configuration |
| `PRODUCTION_DEPLOYMENT.md` | This guide |

---

## 🎯 **Next Steps**

1. ✅ Add `GEMINI_API_KEY` to Vercel Environment Variables
2. ✅ Push updated code to GitHub
3. ✅ Vercel auto-deploys `api/chat.ts`
4. ✅ Update AIChat.tsx to use `api-proxy.ts`
5. ✅ Test in production: `https://development-ai.vercel.app`

---

**Status:** Ready for secure production deployment! 🚀
