# Tech Stack

## Core Technologies
- **React 18** - Frontend framework with hooks and functional components
- **TypeScript** - Type-safe JavaScript with relaxed settings (noImplicitAny: false)
- **Vite** - Build tool and dev server (port 8080)
- **React Router DOM** - Client-side routing

## UI & Styling
- **shadcn/ui** - Component library built on Radix UI primitives
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Radix UI** - Headless UI components for accessibility
- **Lucide React** - Icon library
- **next-themes** - Theme switching (dark/light mode)

## State Management & Data
- **TanStack Query (React Query)** - Server state management and caching
- **React Hook Form** - Form handling with Zod validation
- **Zod** - Schema validation
- **Redux Toolkit** - Global state management with middleware and DevTools

## Development Tools
- **ESLint** - Code linting with React-specific rules
- **PostCSS** - CSS processing with Tailwind
- **SWC** - Fast TypeScript/JavaScript compiler via Vite plugin

## Common Commands

```bash
# Development
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Package Management
npm i                # Install dependencies
```

## Path Aliases
- `@/*` maps to `./src/*` for clean imports
- Use `@/components`, `@/lib`, `@/hooks`, etc. instead of relative paths