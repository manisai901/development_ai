# Mani AI - Deployment & Setup Guide

## 🚀 Quick Deploy Steps

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd mani-ai
   vercel
   ```

3. **Or use GitHub Integration**
   - Push to GitHub repo
   - Connect repo at vercel.com
   - Deploy automatically

### Option 2: Netlify

1. **Build the project**
   ```bash
   cd mani-ai
   pnpm build
   ```

2. **Drag dist folder to Netlify**
   - Go to netlify.com/drop

3. **Or use CLI**
   ```bash
   npm install -g netlify-cli
   cd mani-ai
   netlify deploy
   ```

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it "mani-ai"
4. Disable Google Analytics (optional)

### Step 2: Get Firebase Config

1. Go to **Project Settings** > **General**
2. Scroll to "Your apps" > Click **Web** icon
3. Register app with nickname "Mani AI"
4. Copy the `firebaseConfig` object:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "mani-ai.firebaseapp.com",
     projectId: "mani-ai",
     storageBucket: "mani-ai.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

### Step 3: Install Firebase SDK

```bash
cd mani-ai
pnpm add firebase
```

### Step 4: Create Firebase Config File

Create `src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "mani-ai.firebaseapp.com",
  projectId: "mani-ai",
  storageBucket: "mani-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
```

### Step 5: Enable Firebase Authentication

1. Go to **Authentication** in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable **Google**
5. Add your email in "Authorized domains"

---

## 🔐 Google Authentication Setup

### Step 1: Enable Google Sign-In

1. Firebase Console > **Authentication** > **Sign-in method**
2. Click "Google"
3. Toggle to **Enable**
4. Select your project email
5. Click "Save"

### Step 2: Configure OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Go to **APIs & Services** > **OAuth consent screen**
4. Choose **External** > Click "Create"
5. Fill in:
   - App name: Mani AI
   - User support email: manikantasaivootla@gmail.com
   - Developer contact: manikantasaivootla@gmail.com
6. Click "Save and continue"
7. Add scopes (click "Add or Remove Scopes"):
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
8. Add test users (your email)
9. Click "Back to dashboard"

### Step 3: Update Auth Component

Update `src/components/Auth.tsx`:
```typescript
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const handleGoogleAuth = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('User:', result.user);
    onNavigate?.('dashboard');
  } catch (error) {
    console.error('Auth error:', error);
  }
};

const handleSignOut = async () => {
  await signOut(auth);
};
```

---

## 🌐 Custom Domain Setup

### Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** > **Domains**
4. Add your domain (e.g., mani.ai)
5. Update DNS records as shown
6. Wait for SSL certificate

### Netlify

1. Go to Netlify Dashboard
2. Select your site
3. Go to **Domain management**
4. Click "Add custom domain"
5. Add your domain
6. Configure DNS

---

## 📁 Project Structure for Production

```
mani-ai/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   ├── lib/
│   │   └── firebase.ts      # Add this
│   ├── App.tsx
│   └── main.tsx
├── .env.local                # Environment variables
├── firebase.json            # Firebase config (if using Firebase hosting)
└── package.json
```

---

## 🔧 Environment Variables

Create `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=mani-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mani-ai
VITE_FIREBASE_STORAGE_BUCKET=mani-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Update `src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
```

---

## 🚀 Build & Deploy Commands

```bash
# Development
cd mani-ai
pnpm install
pnpm dev

# Production build
pnpm build

# Preview production build locally
pnpm preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

---

## ✅ Checklist Before Deploying

- [ ] Remove "Created by MiniMax Agent" from footer
- [ ] Add your Firebase config
- [ ] Enable Google Auth in Firebase
- [ ] Set up environment variables
- [ ] Test locally with `pnpm dev`
- [ ] Build with `pnpm build`
- [ ] Deploy to hosting

---

## 📞 Support

For support, contact: **manikantasaivootla@gmail.com**