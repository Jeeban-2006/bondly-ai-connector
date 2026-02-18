# Backend

This folder is the entry point for all backend-related code documentation and organization.

## Structure

```
backend/
  README.md           ← you are here

supabase/
  config.toml         ← Lovable Cloud (Supabase) project config
  migrations/         ← Database schema migrations (SQL)
  functions/          ← Edge Functions (serverless backend logic)
```

## Backend Services (Powered by Lovable Cloud)

All backend functionality is handled by **Lovable Cloud**, which uses Supabase under the hood:

### 🗄️ Database
- **Table: `profiles`** — Stores user display name and avatar URL, linked to auth users
- Migrations are in `supabase/migrations/`
- Row Level Security (RLS) is enabled on all tables

### 🔐 Authentication
- Email/Password login & signup
- Google OAuth (managed by Lovable Cloud)
- Auto-creates a profile record on new user signup via the `handle_new_user` trigger

### ⚡ Edge Functions
- Located in `supabase/functions/`
- Deployed automatically by Lovable Cloud

## Frontend
All frontend code lives in `src/`. See the main [README.md](../README.md) for details.
