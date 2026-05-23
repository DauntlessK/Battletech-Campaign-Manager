# Project Context

## Project Name
BattleTech Campaign Manager

## Purpose
A web application to support persistent Classic BattleTech campaigns for PvP groups. It helps players manage campaigns, forces, battles, damage, repairs, resources, objectives, and standings without playing the tabletop battles inside the app.

## Key Features
- Campaign creation and configuration
- Player invitations and force assignment
- Battle result logging and campaign progression
- Unit status tracking, damage, repairs, kills, and availability
- Resource management and campaign scoring
- Objective control and Conquest-style map play
- Support for Classic BattleTech only (not Alpha Strike)

## Current Documentation
- `docs/Overview.txt` — high-level pitch and product concept
- `docs/CampaignManual.md` — gameplay rules, campaign concepts, and supported campaign types
- `README.md` — project purpose and product summary
- `docs/UseCases.md` — user stories and functional scenarios
- `docs/SRS.md` — software requirements specification
- `docs/DatabaseDesign_DataDictionary.md` — schema and data definitions
- `docs/Traceability-matrix.md` — requirements traceability
- `docs/Lifecycle_StateDiagrams.md` — campaign lifecycle and state diagrams
- `docs/APIEndpointPlan.md` — API plan and endpoints
- `docs/EmailNotificationGuide.md` — backend mail mode, mock email testing, and SMTP setup

## Codebase Overview
- **Frontend**: `src/` with Vite + React 18 + TypeScript + Tailwind CSS + lucide-react icons.
  - `src/App.tsx` is the app shell and page router.
  - `src/pages/` contains page views: `AccountPage`, `CampaignsPage`, `ForcesPage`, `BattlesPage`, and `UnitsPage`.
  - `src/components/` contains shared UI components like `AppHeader` and `PageTitle`.
  - `src/types/app.ts` holds frontend TypeScript models.
  - `src/constants/appOptions.tsx` stores navigation and static UI options.
  - `src/utils/` stores helper functions such as unit normalization.
- **Backend**: `server/` with Node.js + Express + TypeScript.
  - `server/index.ts` starts the Express API and mounts route modules.
  - `server/routes/` defines REST endpoints for auth, users, campaigns, forces, battles, objectives, resources, and units.
  - `server/services/` implements business logic and store updates.
  - `server/middleware/` contains authentication middleware.
  - `server/types/models.ts` defines backend data schemas.
- **Data**: `server/data/store.json` (file-based JSON persistence), unit catalog in `server/data/generated/`, and raw MTF files in `server/data/mtf/`.
- **Scripts**: `scripts/` for tooling and unit catalog generation.
- **Architecture docs**: `docs/CodebaseStructure.md` describes where frontend and backend code now live and what each folder contains.

## Current MVP Status (Completed)
- ✅ User authentication (registration, login, logout with PBKDF2 hashing)
- ✅ Campaign management (create, invite players, accept/decline invitations)
- ✅ Force management (create, assign units, view force composition)
- ✅ Battle tracking (create, confirm, finalize battles)
- ✅ Objective tracking (create, update, delete objectives)
- ✅ Resource accounts (track C-Bills, repair points, salvage, etc. per player per campaign)
- ✅ Notifications system with email integration (invite, notifications polling)
- ✅ All HTTP APIs with authentication middleware
- ✅ File-based persistence with `loadStore()`/`saveStore()` pattern

## Technology Stack
- **Frontend**: React 18, TypeScript, Vite (dev server proxies to localhost:3001), Tailwind CSS, lucide-react
- **Backend**: Node.js, Express, TypeScript
- **Storage**: JSON file-based (server/data/store.json) — suitable for MVP
- **Auth**: Bearer tokens with localStorage, PBKDF2 password hashing
- **Email**: Configurable MAIL_MODE (smtp/mock) for notifications

## Project Focus
- Build a campaign management UI for players and campaign owners
- Keep tabletop combat external to the app, logging post-game results
- Support campaign persistence, force continuity, and turn/resource mechanics
- Deliver a lightweight alternative to full campaigns like MekHQ

## Known Scope
- Classic BattleTech campaign rules only
- PvP campaign management rather than GM-driven campaigns
- Campaign, force, unit, resource, objective, and map systems
- No Alpha Strike support at this stage

## Reference Rulebooks

The repository includes a set of official rulebook PDFs under `docs/rulebook_references/` that should be used as authoritative reference when implementing rules and data models:

- `docs/rulebook_references/BattleTech TechManual.pdf`: Primary reference for unit construction, component definitions, Battle Value calculations, and c-bill cost tables. Use this when modeling base unit data, BV calculations, and cost/repair estimates.
- `docs/rulebook_references/BattleTech Campaign Operations.pdf`: Primary campaign rules reference (including Chaos campaign details). Contains campaign operation guidance and repair/maintenance rules that directly inform campaign resource and repair workflows.
- `docs/rulebook_references/BattleTech Tactical Operations Advanced Rules.pdf`: Advanced tactical rules useful as optional reference for ejection, forced withdrawal, and other advanced combat outcomes; include when implementing optional/advanced mechanics.
- `docs/rulebook_references/Strategic Operations.pdf`: Advanced strategic rules, contains necessary rules for maintenance (not used), salvage (not used), repair and customization. This rulebook is mainly needed for the section on repairing and replacing components (Determining if it is too badly damaged, replacement rules), rearm table, and the master repair time table.

When in doubt about unit stats, BV, or repair cost behavior, consult these rulebooks and record any derived rules in `docs/CampaignManual.md` or the data dictionary.

## GitHub Repository and Project Roadmap

- **Repository:** `https://github.com/DauntlessK/Battletech-Campaign-Manager`
- **Roadmap source:** `docs/btcm_github_import/data/milestones.csv`
- **Issue import payload:** `docs/btcm_github_import/data/github_issues.csv`
- **GitHub issue bodies:** `docs/btcm_github_import/issue_bodies/`
- **Recommended import commands:**
  ```powershell
  cd docs/btcm_github_import
  .\scripts\02_create_milestones.ps1 -Repo DauntlessK/Battletech-Campaign-Manager
  .\scripts\03_import_issues.ps1 -Repo DauntlessK/Battletech-Campaign-Manager
  ```

## Current Implementation Status

- ✅ Backend MVP completed for M1–M6: accounts, friends, notifications, unit catalog, forces, campaigns, battle logging, objectives, and resource accounts.
- ✅ UI skeleton exists for auth, campaigns, forces, units, and account pages.
- ⚠️ Remaining work is primarily UI and gameplay workflow implementation for M5/M6/M7.
- 🎯 Next priority is to complete battle logging UI, objective management UI, and campaign dashboard UI, then resource/repair flows.

## GitHub Project Guidance

- Use milestones to reflect roadmap phases:
  - M1: Project Foundation and Documentation
  - M2: Accounts, Friends, and Notifications
  - M3: Unit Catalog and Force Management
  - M4: Campaign Setup and Campaign-Specific Forces
  - M5: Battle Logging and Confirmation
  - M6: Objectives, Control, and Chaos Campaign MVP
  - M7: Advanced Campaign Resources and Repairs
  - M8: Conquest Campaign Map and Orders
  - M9: Leaderboards, Polish, and Final Release
- Track progress by linking completed tasks to the appropriate epic/use case issue.
- Keep the issue body acceptance criteria aligned with `docs/UseCases.md`, `docs/SRS.md`, and `docs/APIEndpointPlan.md`.

