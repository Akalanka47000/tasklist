# Task List Client

React + Vite application for Task List

## File Structure

- assets - To hold custom assets such as images and fonts
- components - Database configurations and augmentations
  - auth - Components related to authentication pages
  - common - Shared components between pages
    - core - Atomic components unaffected by business logic
  - home - Components related to the home page
- constants - Global constant definitions
- hooks - Custom hooks
  - services - Service central react query hooks
- pages - Page and routing configurations
- providers - App level global providers
- services - External API connectivity layer
- store - Zustand stores
- locales - Translations if needed
- styles - Custom styles
- type - Type definitions
- utils - Shared utilities

</br>

## Basic Commands

- `pnpm dev` - Starts the server in dev mode
- `pnpm build` - Builds the server
- `pnpm start` - Runs the built server
