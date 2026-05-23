# Codebase Structure

## Overview

This project is split into two main application layers:

- `src/` — frontend UI built with Vite, React, TypeScript, Tailwind CSS, and lucide-react icons.
- `server/` — backend API built with Node.js, Express, TypeScript, and file-based JSON persistence.

The current architecture is intentionally small and MVP-focused, with the frontend coordinating page state and data fetching and the backend exposing authenticated REST APIs.

---

## Frontend Structure (`src/`)

### `src/App.tsx`

- The main application shell.
- Holds global state for auth, campaigns, forces, battles, units, invites, and notifications.
- Manages page routing using an internal `activePage` state.
- Contains fetch logic for:
  - current user
  - campaigns
  - forces
  - units
  - battles for a selected campaign
  - notification polling
- Passes state and callbacks down into page components.

### `src/pages/`

Page-level components are the main UI screens:

- `AccountPage.tsx` — login/register, account actions, invites, and notifications.
- `CampaignsPage.tsx` — campaign list and campaign management.
- `ForcesPage.tsx` — force management, listing forces, and creating new forces.
- `BattlesPage.tsx` — battle logging, confirm/delete battle operations, and battle history.
- `UnitsPage.tsx` — unit catalog browsing, filters, and selected unit details.

Each page component receives props from `App.tsx` rather than managing global state itself.

### `src/components/`

Shared UI components:

- `AppHeader.tsx` — top navigation bar, mobile menu, notifications button, and logout.
- `PageTitle.tsx` — page title, eyebrow text, and description layout used by each page.

### `src/constants/`

- `appOptions.tsx` — navigation items, sidebar children, and other static UI options.

### `src/types/`

- `app.ts` — typed models used by the frontend for pages, units, campaigns, forces, battles, users, invites, and notifications.

### `src/utils/`

- `unitNormalization.ts` — helper to normalize incoming unit payloads from the API into consistent frontend unit objects.

### Styling & entrypoint

- `src/App.css` — application-level component styles.
- `src/index.css` — Tailwind and global styles.
- `src/main.tsx` — bootstraps the React app into the DOM.

---

## Backend Structure (`server/`)

### `server/index.ts`

- Express server entrypoint.
- Loads middleware and route modules.
- Exposes `/api/...` endpoints.
- Uses `cors()` and `express.json()`.

### `server/routes/`

Route modules define API endpoints and validation logic:

- `auth.ts` — registration, login, logout.
- `users.ts` — current user, invites, notifications, profile actions.
- `campaigns.ts` — campaign create, list, and campaign-specific actions.
- `forces.ts` — create forces, list forces, and assign forces to campaigns.
- `battles.ts` — create/list battles, confirm battles, delete battles.
- `objectives.ts` — objective CRUD endpoints.
- `resources.ts` — resource account and transaction endpoints.
- `units.ts` — unit catalog and unit detail endpoints.

### `server/services/`

Business logic and persistence operations:

- `battleService.ts` — battle creation, listing, update, confirm, delete.
- `campaignService.ts` — campaign CRUD, participant invites, objectives, and notifications related to campaigns.
- `forceService.ts` — force creation, listing, and campaign assignment.
- `resourceService.ts` — resource account and transaction management.
- `storageService.ts` — shared JSON load/save for `server/data/store.json`.
- `unitCatalogService.ts` / `serverUnitFetch.ts` — unit catalog loading.

### `server/middleware/`

- `authMiddleware.ts` — bearer token auth, `requireAuth`, current user injection.

### `server/types/`

- `models.ts` — backend data model definitions, including campaigns, forces, battles, objectives, resources, and users.

### `server/data/`

- `store.json` — file-backed persistence for the MVP.
- `generated/` — pre-generated unit catalog CSV exports and indexes.
- `mtf/` — archived MegaMek MTF files used for unit parsing.

---

## Documentation Relationship

The current docs are intended to map directly to the code:

- `docs/ProjectContext.md` — high-level project mission and current status.
- `docs/APIEndpointPlan.md` — REST API design that the backend follows.
- `docs/DatabaseDesign_DataDictionary.md` — data model reference for backend storage and frontend types.
- `docs/UseCases.md` / `docs/SRS.md` — user stories and requirements that guide feature implementation.
- `docs/MVPDatabaseModels.md` — database model mapping for MVP data structures.

This file explains where the page components, shared components, backend route/services, and type definitions live.

---

## How to navigate the project

1. Start with `src/App.tsx` to understand page routing and app-level state.
2. Open `src/pages/*` to see individual screen implementations.
3. Use `src/components/*` for shared UI pieces.
4. Open `server/index.ts` to see how the API is mounted.
5. Inspect `server/routes/*` to learn endpoint definitions.
6. Inspect `server/services/*` for the business logic behind each route.
7. Review `server/types/models.ts` for the backend data schema.
8. Review `docs/` for feature and requirement context.
