# Project Structure

## Root Directory
```
├── src/                 # Source code
├── public/              # Static assets (favicon, robots.txt)
├── .kiro/               # Kiro configuration and steering
├── node_modules/        # Dependencies
├── package.json         # Project configuration
├── vite.config.ts       # Vite build configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── components.json      # shadcn/ui configuration
└── tsconfig.json        # TypeScript configuration
```

## Source Structure (`src/`)
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (auto-generated)
│   ├── ChirpCard.tsx   # Custom components for app features
│   ├── ChirpComposer.tsx
│   ├── Header.tsx
│   └── ...
├── pages/              # Route components (one per page)
│   ├── Index.tsx       # Home/feed page
│   ├── Login.tsx       # Authentication pages
│   ├── Profile.tsx     # User profile pages
│   └── ...
├── store/              # Redux store and state management
│   ├── slices/         # Redux slices (authSlice, uiSlice)
│   ├── middleware/     # Custom middleware
│   ├── selectors/      # Reusable selectors
│   └── hooks.ts        # Typed Redux hooks
├── hooks/              # Custom React hooks
│   ├── use-toast.ts    # UI-related hooks
│   └── useQuery.ts     # Data fetching hooks
├── lib/                # Utility functions and configurations
│   └── utils.ts        # Common utilities (cn, etc.)
├── services/           # API and external service integrations
│   └── api.ts          # API client and endpoints
├── assets/             # Images, fonts, and other static files
├── App.tsx             # Main app component with routing
├── main.tsx            # React app entry point
└── index.css           # Global styles and Tailwind imports
```

## Naming Conventions
- **Components**: PascalCase (e.g., `ChirpCard.tsx`)
- **Pages**: PascalCase matching route names (e.g., `Profile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useQuery.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Files**: Use `.tsx` for React components, `.ts` for utilities

## Component Organization
- Place reusable UI components in `components/`
- Keep shadcn/ui components in `components/ui/` (auto-managed)
- Put page-specific components in `pages/`
- Use custom hooks in `hooks/` for shared logic
- Centralize API calls in `services/`

## Routing Structure
All routes defined in `App.tsx`:
- `/` - Home feed
- `/login`, `/signup` - Authentication
- `/explore` - Content discovery
- `/profile/:userId` - User profiles
- `/chirp/:chirpId` - Individual chirp view
- `/notifications` - User notifications
- `*` - 404 Not Found (catch-all)