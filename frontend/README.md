# Frontend

The frontend source code lives in `src/`. This folder serves as the frontend entry point for documentation.

## Structure

```
src/
  pages/              ← Route-level page components
  components/
    auth/             ← Authentication guards (ProtectedRoute)
    contacts/         ← Contact-specific components
    dashboard/        ← Dashboard widgets
    layout/           ← App shell (Navbar, Sidebar, AppLayout)
    ui/               ← shadcn/ui base components
  hooks/              ← Custom React hooks (useProfile, use-toast, etc.)
  integrations/
    supabase/         ← Auto-generated Supabase client & types
    lovable/          ← Lovable Cloud auth integration
  lib/
    mockData.ts       ← Temporary mock data (to be replaced with real DB data)
    utils.ts          ← Utility helpers
  index.css           ← Global styles & design tokens
  App.tsx             ← Root app with routing
  main.tsx            ← Vite entry point
```

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling with design tokens in `index.css`)
- **shadcn/ui** (component library)
- **React Router v6** (routing)
- **TanStack Query** (data fetching)

## Backend
All backend logic is in `backend/` and `supabase/`. See [backend/README.md](../backend/README.md).
