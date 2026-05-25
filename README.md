# 🚀 Mani AI - AI-Powered Development Assistant

Mani AI is a premium, high-performance web application designed for next-generation software development and conversational assistance. The platform features an immersive, rich dark-mode user experience, clean visual layout hierarchies, real-time secure AI streaming, and voice/audio integrations optimized for both desktop and mobile viewports.

---

## 🏗️ System Architecture

Mani AI is engineered using a modern client-serverless decoupling pattern:

```
┌─────────────────────────────────┐
│       Browser / Client          │
│  React + Vite + Tailwind CSS    │
└─────────────────────────────────┘
                 │
                 │ POST /api/chat (SSE Stream)
                 ▼
┌─────────────────────────────────┐
│     Backend Secure Proxy        │
│ Vercel Node.js Serverless Func  │
│    - Keeps API Keys Private     │
│    - Implements Rate Limiting   │
│    - Routes Model Engines       │
└─────────────────────────────────┘
                 │
                 │ Secure API Request
                 ▼
┌─────────────────────────────────┐
│       Google Gemini API         │
│  gemini-2.5-flash / 2.5-pro     │
└─────────────────────────────────┘
```

### 1. The Frontend (Client)
- **Vite & React**: A blazing-fast bundling setup utilizing TypeScript.
- **Custom Hash Routing**: Utilizes a lightweight, performance-tuned routing mechanism (`window.location.hash`) that preserves the client routing context. This avoids heavy external router modules and guarantees instant transitions.
- **State Management & History**: Manages user conversations locally and persists state across pages using Firebase integrations and reactive React Hooks.

### 2. The Backend Proxy (`api/chat.ts`)
- **API Shielding**: Resolves critical security concerns by keeping your `GEMINI_API_KEY` hidden inside Vercel's backend environment variables. The browser never sees or exposes your API key.
- **True Event Streaming (SSE)**: Standardizes chunk delivery to the client using Server-Sent Events (`text/event-stream`). This provides real-time streaming answers without standard HTTP latency.
- **Abuse Prevention**: Enforces a rate limit of **10 requests per minute per IP address** to safeguard your Gemini API quota.
- **Model Intelligence**: Maps UI selections to premium AI models:
  - ✨ `default` ──> `gemini-2.5-flash`
  - 🧠 `reasoning` ──> `gemini-2.5-pro`
  - ⚡ `fast` ──> `gemini-2.0-flash`
  - 🎈 `lite` ──> `gemini-2.5-flash-lite`

---

## 📱 Mobile Layout & Viewport Optimization

Standard web layouts often collapse or squish on mobile screens. Mani AI is strictly optimized for visual excellence:

- **Anti-Squish Viewport**: The chat area utilizes dynamic viewport classes (`h-screen h-[100dvh] overflow-hidden`). This locks the viewport height, preventing mobile address bars from cutting off input widgets.
- **Hidden Double Headers**: The global layout hides the website-wide Navbar and Footer on the chat screen. This reclaims 100% of the screen's height exclusively for messages and input fields.
- **Flex-Wrap & Boundary Containment**: Message bubbles enforce `min-w-0 flex-1 w-full overflow-hidden break-words`. Code block widgets are locked within scroll boundaries (`w-full max-w-full overflow-x-auto`). Unbreakable text strings, inline backticks, and lists wrap gracefully and will **never** cause horizontal scrolling on mobile screens.

---

## 🎙️ Voice & Audio Features

Mani AI integrates hands-free voice dictation and speech output:

1. **HTML5 Speech Recognition (Voice-to-Text)**:
   - Built on top of the native browser Web Speech API.
   - Activated via a microphone button in the input bar.
   - Animates with a custom pulsating orange design when listening.
   - Automatically appends transcribed text to the active chat box.

2. **Smart Speech Synthesis (Text-to-Speech)**:
   - Activated by clicking the volume speaker icon (`Volume2` / `VolumeX`) on any AI message bubble.
   - Uses native `window.speechSynthesis` to speak responses clearly.
   - **Intelligent Filter**: A regex pre-processor automatically strips code blocks (pre-formatted blocks are ignored to avoid reading raw syntax out loud), markdown identifiers (`**`, `*`, `_`, `#`, `` ` ``), and HTML tags before dictation begins.

3. **Clickable Branding Logo**:
   - A stunning animated SVG Logo (imported from `Navbar`) is integrated in both the chat header and the top of the sidebar.
   - Both logos are wrapped in clickable buttons that navigate back to the home page (`onNavigate('landing')`).

---

## 🔧 Local Development & Environment Setup

1. Clone this repository.
2. In the root directory, create a `.env.local` file:
   ```dotenv
   # Backend (kept secret, never exposed to frontend)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Run `npm install` and start local development via `npm run dev`.

---

## 🚀 Troubleshooting Vercel Deployments (Why updates aren't appearing)

If you pushed new commits to GitHub but the Vercel Production Deployment continues serving the older commit (`087a4cc` from May 18) and shows newer commits as "Stale", here is why and how to fix it:

### 🔴 The Main Causes

1. **Missing `@vercel/node` in dependencies**:
   Vercel compiles the serverless TypeScript functions under `api/` during the build step. Previously, `@vercel/node` was not declared in `package.json`, causing TypeScript compilation to crash on Vercel. Vercel automatically rolls back or defaults to the last successful deployment (`087a4cc`).
   * **Status**: **RESOLVED**. I added `@vercel/node` to `package.json` devDependencies under commit `3f9eae1`.

2. **Unconnected Git Repository (Vercel Checklist 2/5)**:
   Your Vercel dashboard shows `Connect Git Repository` is uncompleted in the **Production Checklist**. This means Vercel does not have active repository hooks to auto-deploy new pushes to the `main` or `development_ai` branches.

---

### 🟢 How to Trigger the Latest Updates

#### **Method 1: Connect your Git Repository in Vercel (Recommended)**
1. Go to your **Vercel Dashboard**.
2. Select your project `development_ai`.
3. Locate the **Production Checklist** (showing `2/5` completed).
4. Click **Connect Git Repository**.
5. Connect your GitHub account and select your repository `manisai901/development_ai`.
6. Once connected, Vercel will automatically build and deploy every time you push to the `main` branch.

#### **Method 2: Force Manual Redeployment via Vercel Dashboard**
If you already connected the repository but the build did not trigger:
1. Go to your **Vercel Project Dashboard** ──> **Deployments** tab.
2. Find the newest deployment or click the **three dots** next to the active deployment.
3. Click **Redeploy** and choose the latest commit from `main` (`3f9eae1` or newer).
4. The deployment will rebuild successfully with the updated packages.

#### **Method 3: Deploy via Vercel CLI**
If you prefer deploying directly from your terminal:
1. Open your terminal in the project directory.
2. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
3. Link the project (follow the prompts):
   ```bash
   vercel link
   ```
4. Push a new deployment to production:
   ```bash
   vercel --prod
   ```
