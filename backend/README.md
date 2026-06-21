# Backend

This folder contains all backend-related code, API endpoints, and database configurations.

## Structure

```
backend/
  src/
    index.js          ← Express API server entry point
  supabase/
    config.toml       ← Supabase project configuration
    migrations/       ← Database schema migrations (SQL)
    functions/        ← Edge Functions (serverless backend logic)
  package.json        ← Backend dependencies
  .env               ← Backend environment variables
  README.md          ← You are here
```

## Getting Started

### Install Dependencies

```sh
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory (use `.env.example` as template):

```env
PORT=3000
NODE_ENV=development
```

### Run Development Server

```sh
npm run dev
```

The backend server will start on http://localhost:3000

### API Endpoints

- `GET /api` - Welcome message
- `GET /api/health` - Health check endpoint

## Backend Services (Powered by Supabase)

The backend uses **Supabase** for database, authentication, and serverless functions:

### 🗄️ Database
- **Table: `profiles`** — Stores user display name and avatar URL, linked to auth users
- Migrations are in `supabase/migrations/`
- Row Level Security (RLS) is enabled on all tables
- PostgreSQL database with real-time subscriptions

### 🔐 Authentication
- Email/Password login & signup
- Google OAuth integration
- Auto-creates a profile record on new user signup via the `handle_new_user` trigger
- JWT-based authentication

### ⚡ Edge Functions
- Located in `supabase/functions/`
- Deploy using Supabase CLI: `supabase functions deploy`
- Deno-based serverless functions

## Frontend
All frontend code lives in `../frontend/`. See [Frontend Documentation](../frontend/README.md) for details.
