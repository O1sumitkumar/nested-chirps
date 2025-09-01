---
inclusion: always
---

# Project Structure & Architecture

## File Organization Rules

### Path Aliases
- Always use `@/` imports instead of relative paths
- `@/components` for UI components
- `@/pages` for route components
- `@/hooks` for custom hooks
- `@/lib` for utilities
- `@/services` for API integration
- `@/store` for Redux state management

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives (DO NOT modify manually)
│   └── [Feature].tsx   # Custom components (ChirpCard, Header, etc.)
├── pages/              # Route components (one component per route)
├── hooks/              # Custom React hooks with 'use' prefix
├── lib/                # Utilities and shared configurations
├── services/           # API clients and external integrations
├── store/              # Redux Toolkit store, slices, and selectors
├── assets/             # Static files (images, fonts)
├── App.tsx             # Main router and layout
└── main.tsx            # Application entry point
```

## Naming Conventions

### Files & Components
- **React Components**: PascalCase with `.tsx` extension (`ChirpCard.tsx`)
- **Pages**: PascalCase matching route names (`Profile.tsx`, `Login.tsx`)
- **Hooks**: camelCase with `use` prefix (`useQuery.ts`, `useAuth.ts`)
- **Utilities**: camelCase with `.ts` extension (`utils.ts`, `api.ts`)
- **Types**: PascalCase with `Type` or `Interface` suffix

### Code Patterns
- Use functional components with hooks (no class components)
- Prefer named exports over default exports for better refactoring
- Use TypeScript interfaces for props and data structures
- Implement proper error boundaries for component isolation

## Architecture Patterns

### Component Hierarchy
1. **Pages** - Route-level components, handle data fetching and layout
2. **Feature Components** - Business logic components (ChirpCard, ChirpComposer)
3. **UI Components** - Reusable primitives from shadcn/ui library

### State Management
- **Redux Toolkit** for global application state
- **TanStack Query** for server state and caching
- **React Hook Form** for form state management
- Local component state for UI-only concerns

### Data Flow
- Pages fetch data using TanStack Query hooks
- Global state managed through Redux slices
- Props flow down, events bubble up
- Use custom hooks to encapsulate complex logic

## Development Guidelines

### Component Creation
- Keep components focused on single responsibility
- Extract reusable logic into custom hooks
- Use proper TypeScript typing for all props and state
- Implement proper loading and error states

### Import Organization
1. React and external libraries
2. Internal components (using `@/` aliases)
3. Types and interfaces
4. Relative imports (only when necessary)

### Routing Structure
All routes defined in `App.tsx` using React Router:
- `/` - Home feed (Index.tsx)
- `/login`, `/signup` - Authentication pages
- `/explore` - Content discovery
- `/profile/:userId` - User profiles
- `/chirp/:chirpId` - Individual chirp view
- `/notifications` - User notifications