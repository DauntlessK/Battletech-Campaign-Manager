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
- Frontend: `src/` with Vite + React + TypeScript
- Backend: `server/` Node/Express-like routes and services
- Data: `server/data/`, `src/assets/data/`, and generated unit catalog files
- Scripts: `scripts/` for tooling and import automation

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

When in doubt about unit stats, BV, or repair cost behavior, consult these rulebooks and record any derived rules in `docs/CampaignManual.md` or the data dictionary.
