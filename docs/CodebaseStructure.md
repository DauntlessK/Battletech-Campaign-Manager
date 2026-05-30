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

### Scripts

generateUnitIndex
Responsible for generating the main unit index CSV, such as meks.csv. It parses MTF files, extracts high-level unit data, performs BV and C-bill calculations, and writes summary catalog rows used by the app/API.

Common command:

npm run index:units -- --type=meks

Useful optional parameters:

npm run index:units -- --type=meks --model=AS7-D
npm run index:units -- --type=meks --model=ARC-9M --debug
npm run index:units -- --type=meks --debug

Notes:

--type=meks       Limits indexing to BattleMechs
--model=AS7-D     Runs only matching model(s), useful for testing
--debug           Prints detailed BV and C-bill calculation breakdowns

auditMtfWeapons
Runs through MTF unit files and checks weapon/equipment names found in the MTF against entries in weapons.ts. Useful for finding missing altNames, shorthand names, or equipment that needs to be added to the weapon definitions.

Example:

npm run audit:mtf-weapons

Possible examples depending on how the script is wired:

npm run audit:mtf-weapons -- --type=meks
npm run audit:mtf-weapons -- --model=AS7-D
npm run audit:mtf-weapons -- --out reports/mtfWeaponAudit.json

Purpose:

Finds names like ISSRM6, ISLBXAC10, CLERMediumLaser, etc.
Helps identify missing altNames or missing weapon definitions.

unitIndexAudit
Compares generated unit index values against known/audited expected values, usually from MegaMekLab text reports. This is mainly used to validate calculated BV and C-bill cost after changes to the indexer.

Example:

npm run audit:unit-index

Useful examples:

npm run audit:unit-index -- --unit "Atlas AS7-D"
npm run audit:unit-index -- --model=AS7-D
npm run audit:unit-index -- --verbose

Purpose:

Confirms generated BV/cost against known expected values.
Flags mismatches.
Helps catch calculation regressions in generateUnitIndex.

generateUnitDetails
Generates full per-unit JSON files from MTFs and the unit index CSV. These are detailed unit records for the app, including catalog data, fluff, mounted weapons, locations, armor, critical slots, normalized weapon/ammo/component IDs, and warnings.

Common command:

npm run details:units

Generate one unit:

npm run details:units -- --unit "Atlas AS7-D"

Generate a random sample:

npm run details:units -- --random 25

Repeat the same random sample:

npm run details:units -- --random 25 --seed test-run-1

Generate random units from one chassis:

npm run details:units -- --chassis Atlas --random 10 --seed atlas-test

Useful optional parameters:

--unit "Atlas AS7-D"      Strict unit/name/model match
--model AS7-D             Model-specific test run
--chassis Atlas           All units with matching chassis
--id some-unit-id         Specific catalog id
--ids id1,id2,id3         Multiple specific catalog ids
--random 25               Generate X random units
--random-count 25         Same as --random
--sample 25               Same as --random
--seed test1              Repeatable random selection
--out path/to/output      Custom output directory
--refs-only               Do not embed full weapon definitions
--minify                  Minified JSON output

Purpose:

Produces the detailed JSON that the frontend/API will use for full unit pages.
Normalizes raw slot names into weapon/ammo/component IDs while preserving raw MTF text.

slotAuditor
Runs through MTF critical slots and reports unmatched or suspicious slot entries. This is used before generating the full detail catalog to find missing weapons, ammo, components, armor systems, industrial equipment, or bad parser boundaries.

Common command:

npm run audit:slots

Test one unit:

npm run audit:slots -- --unit "Atlas AS7-D"

Test a chassis:

npm run audit:slots -- --chassis Atlas

Include matched slots too:

npm run audit:slots -- --include-matched

Output to a custom file:

npm run audit:slots -- --out server/data/generated/unitDetails/slotAudit.test.json

Useful optional parameters:

--unit "Atlas AS7-D"      Audit one unit
--chassis Atlas           Audit one chassis
--id some-unit-id         Audit one catalog id
--ids id1,id2,id3         Audit multiple ids
--out path/to/file.json   Custom report path
--include-matched         Include matched/resolved slots in report
--max-examples 25         More examples per unmatched slot

Purpose:

Finds unresolved slots like ISArtemisIV, ISClaw, CLPartialWing, unusual ammo names, etc.
Helps decide whether to add altNames, add missing weapons/ammo/components, or fix parsing.

generateUnitDetails / slotAuditor random sampling workflow
Useful workflow before processing the whole catalog:

npm run details:units -- --random 25 --seed sanity-1
npm run audit:slots -- --random 50 --seed sanity-1

Purpose:

Spot-check a repeatable random batch before running the entire catalog.
Good for catching parser regressions without waiting on thousands of units.

weapon/ammo/component data files
These are not scripts, but they are central to the scripts.

src/data/weapons.ts       All weapon and mounted-equipment definitions
src/data/ammo.ts          All ammo definitions
src/data/components.ts    Component/system definitions
src/data/weaponTypes.ts   Shared weapon/ammo TypeScript types

Scripts that resolve MTF slot names should generally use:

import { WEAPONS, AMMO } from "../src/data/weapons";
import { COMPONENTS } from "../src/data/components";

Purpose:

WEAPONS resolves weapon slots and mounted weapons.
AMMO resolves ammo bins and ammo BV/cost/shots-per-ton.
COMPONENTS resolves systems like Endo-Composite, CASE, cockpit systems, heat sinks, etc.

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
