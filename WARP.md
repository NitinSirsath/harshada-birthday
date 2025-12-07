# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Tooling & commands

This is a React + TypeScript SPA built with Vite, Tailwind CSS v4, and TanStack Router.

### Dependency installation

Use your preferred Node.js package manager; examples below use `npm` (no lockfile is committed).

- Install deps: `npm install`

### Core scripts

- Start dev server: `npm run dev`
- Type-check and build for production: `npm run build`
  - Runs `tsc -b` (project references: `tsconfig.app.json`, `tsconfig.node.json`) and then `vite build`.
- Lint: `npm run lint`
- Preview production build locally: `npm run preview`

### Linting & TypeScript

- Linting uses ESLint flat config in `eslint.config.js` with:
  - `@eslint/js` recommended rules
  - `typescript-eslint` recommended rules
  - `eslint-plugin-react-hooks` (`recommended-latest`)
  - `eslint-plugin-react-refresh` Vite config
- Type-checking is performed via `tsc -b` (either directly or as part of `npm run build`).

### Tests

No test runner or `test` script is currently configured in `package.json`.
If tests are added later, inspect `package.json` for the relevant `test` script and prefer running a single test file via that script (for example, `npm test -- path/to/file.test.ts`) rather than invoking the test runner directly.

## Architecture overview

### High-level runtime flow

- **Entry point**: `src/main.tsx`
  - Imports global styles from `src/index.css`.
  - Mounts React via `createRoot(document.getElementById('root')!)` and renders `<App />` inside `React.StrictMode`.
- **Application shell**: `src/App.tsx`
  - Creates a TanStack Router instance using a generated `routeTree` from `@/routeTree.gen`.
  - Configures router defaults (`defaultPreload: "intent"`, `defaultStaleTime: 5000`, `scrollRestoration: true`).
  - Exports `<App />` that renders `<RouterProvider router={router} />`.
- **Route tree generation**:
  - `vite.config.ts` configures `@tanstack/router-plugin/vite` with:
    - `target: "react"`
    - `autoCodeSplitting: true`
    - `routeFilePrefix: "r&"`
  - The plugin scans `src/routes` for files whose names start with `r&` and generates `src/routeTree.gen.ts`.
  - Treat `routeTree.gen.ts` as generated code; edit route files instead and let Vite regenerate it during `npm run dev`/`npm run build`.

### Routing structure

Routes live under `src/routes` and are defined using TanStack Router APIs.

- **Root route**: `src/routes/r&__root.tsx`
  - Uses `createRootRoute` and renders an `<Outlet />` inside a simple `RootComponent`.
  - All other routes are nested under this root.
- **Index route (`/`)**: `src/routes/r&index.tsx`
  - Uses `createFileRoute("/")` to define the home page.
  - Renders a full-screen black background with the `Vortex` visual effect (`@/components/ui/shadcn-io/vortex`).
  - Inside the vortex, shows a centered card explaining the command palette and guiding the user to press `Cmd + K` / `Ctrl + K`.

**Adding new routes**:

- Create a new file in `src/routes` whose name starts with the configured `routeFilePrefix` (`r&`).
- Define the route with `createFileRoute("/desired-path")({ component: YourComponent })`.
- The TanStack Router plugin will pick it up and regenerate `routeTree.gen.ts` when the dev server or build runs.

### UI component system

The UI layer follows a shadcn-style pattern: Tailwind CSS utility classes combined with small, composable primitives.

- **Utility helpers**:
  - `src/lib/utils.ts` defines `cn(...inputs: ClassValue[])`, which composes class names using `clsx` and merges Tailwind classes using `tailwind-merge`.
  - Most components accept `className` props and pass them through `cn`.
- **Primitive components** (`src/components/ui`):
  - `button.tsx` exports `Button` and `buttonVariants` using `class-variance-authority` and Radix `Slot`. Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`.
  - `card.tsx` exports `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`, all using `data-slot` attributes for consistent styling and composition.
  - `alert.tsx` exports `Alert`, `AlertTitle`, `AlertDescription` with `variant` support via `cva` (currently `default` and `destructive`).
- **Visual effect components** (`src/components/ui/shadcn-io`):
  - `vortex/index.tsx` renders a full-screen animated particle vortex using a `<canvas>`, `simplex-noise`, and `framer-motion`. It relies on `window`, so it is browser-only and assumes a client-side environment.
  - `meteors/index.tsx` renders animated “meteor” particles using Tailwind classes and `requestAnimationFrame`, also assuming access to `window`.

### Feature components

- `src/components/harshada-birthday/index.tsx` is a simple presentational component rendering a centered "Happy Birthday Harshada" message with Tailwind-based styling. It is not directly wired into routing at the moment; it can be mounted from a route or higher-level component as needed.

### Configuration & path aliases

- **Vite configuration** (`vite.config.ts`):
  - Registers plugins: TanStack Router (`tanstackRouter`), React (`@vitejs/plugin-react`), and Tailwind v4 (`@tailwindcss/vite`).
  - Defines an alias `@` that resolves to `./src`.
- **TypeScript configuration**:
  - `tsconfig.json` sets `baseUrl` to the repo root and maps `@/*` to `./src/*`. This must stay in sync with `vite.config.ts`.
  - `tsconfig.app.json` and `tsconfig.node.json` are used by `tsc -b` for the app and node-side tooling (e.g., Vite config) respectively.

When adding new modules, prefer importing via the `@` alias (e.g., `@/components/ui/button`) to keep imports consistent across the app and tooling.
