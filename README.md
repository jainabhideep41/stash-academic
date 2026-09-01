# Stash - Academic Student Portal

A modern, deployable academic web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **NextAuth.js v5** with Google OAuth single sign-on.

---

## 🚀 Features

- 🎓 **Student Google Authentication**: One-click Google OAuth 2.0 sign-in.
- 📁 **Centralized Academic Vault**: Organize notes, syllabus guides, past papers, and lecture slides.
- 📊 **Protected Student Dashboard**: Real-time course tracking, deadline reminders, and academic stats.
- ⚡ **Deployable on Vercel**: Zero-config deployment with serverless authentication.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js v18+ and npm installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in the environment variables in `.env.local`:
```env
AUTH_SECRET="your-32-byte-secret-string"
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
```

> **Note**: You can generate a random secret via terminal:
> `npx auth secret` or `openssl rand -hex 32`

---

## 🔑 Setting Up Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., **Stash Academic Portal**).
3. Navigate to **APIs & Services > OAuth consent screen**:
   - Select **External** (or Internal if using Google Workspace for Education).
   - Fill in App Name ("Stash"), User support email, and Developer contact email.
   - Save and continue through Scopes (`.../auth/userinfo.email` and `.../auth/userinfo.profile`).
4. Navigate to **APIs & Services > Credentials**:
   - Click **Create Credentials > OAuth client ID**.
   - Application type: **Web application**.
   - Name: `Stash Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (Local)
     - `https://<your-app-name>.vercel.app` (Vercel deployment)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (Local)
     - `https://<your-app-name>.vercel.app/api/auth/callback/google` (Vercel deployment)
5. Copy the generated **Client ID** and **Client Secret** into your `.env.local` and Vercel Environment Variables.

---

## 🚢 Deploying to Vercel

### Option 1: Vercel CLI (Recommended)
```bash
npx vercel
```
Follow the prompts, then add Environment Variables in Vercel settings:
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `NEXTAUTH_URL` (Set to your Vercel deployment URL e.g. `https://stash-academic.vercel.app`)

### Option 2: Deploy via GitHub / GitLab Repository
1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Add the Environment Variables (`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `NEXTAUTH_URL`).
4. Click **Deploy**.

---

## 🧪 Testing Locally

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
