# Frontend

The frontend is a modern React application built with TypeScript, Vite, and Tailwind CSS.

## Structure

```
frontend/
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
      supabase/         ← Supabase client & types
    lib/
      mockData.ts       ← Temporary mock data (to be replaced with real DB data)
      utils.ts          ← Utility helpers
    index.css           ← Global styles & design tokens
    App.tsx             ← Root app with routing
    main.tsx            ← Vite entry point
  public/               ← Static assets
  index.html            ← HTML entry point
  vite.config.ts        ← Vite configuration
  tailwind.config.ts    ← Tailwind CSS configuration
  package.json          ← Frontend dependencies
  .env                  ← Frontend environment variables (Supabase keys)
```

## Getting Started

### Install Dependencies

```sh
cd frontend
npm install
```

### Environment Variables

The `.env` file should contain:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### Development

```sh
npm run dev
```

The frontend will start on http://localhost:8080

### Build for Production

```sh
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```sh
npm run preview
```

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling with design tokens in `index.css`)
- **shadcn/ui** (component library)
- **React Router v6** (routing)
- **TanStack Query** (data fetching)
- **React Three Fiber** (3D scenes)
- **Supabase Client** (authentication & database)

## Backend
All backend logic is in `../backend/`. See [Backend Documentation](../backend/README.md).
