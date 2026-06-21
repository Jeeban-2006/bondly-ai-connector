# Startup & Setup Guide

## Quick Start

### Install Dependencies
```sh
npm run install:all
```

### Development Servers
```sh
# Run frontend and backend concurrently
npm run dev

# Or run separately
npm run dev:frontend  # Frontend on port 8080
npm run dev:backend   # Backend on port 3000
```

## AI Setup (OpenAI)
1. Get an API key from the [OpenAI Platform](https://platform.openai.com/).
2. Add the API key to your backend environment:
   Create or edit `backend/.env` and add:
   ```env
   OPENAI_API_KEY=sk-your_actual_key_here
   ```
3. Restart the backend server. You should see `🤖 AI: ✅ Configured`.

## Authentication Setup
**Email/Password** is currently configured and working by default via Supabase.

*(Optional)* **Google OAuth**:
To enable Google OAuth:
1. Create OAuth credentials in the Google Cloud Console.
2. Add the Client ID and Secret to your Supabase Auth Providers dashboard.
3. Uncomment the Google login button in `frontend/src/pages/AuthPage.tsx`.

## Server Status Checking
- **Frontend**: Navigate to `http://localhost:8080`
- **Backend API**: `http://localhost:3000/api`
- **Backend Health Check**: `http://localhost:3000/api/health`
