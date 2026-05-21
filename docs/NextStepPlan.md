# Next Step Plan

## Status: MVP Backend Complete ✅ — Aligning with GitHub Milestones

All core backend services and data models are now implemented. The project uses a structured 9-milestone roadmap (defined in `docs/btcm_github_import/data/milestones.csv`):

- **M1: Project Foundation and Documentation** ✅
- **M2: Accounts, Friends, and Notifications** ✅ (backend complete, UI partial)
- **M3: Unit Catalog and Force Management** ✅ (backend complete, UI partial)
- **M4: Campaign Setup and Campaign-Specific Forces** ✅ (backend complete, UI partial)
- **M5: Battle Logging and Confirmation** ✅ (backend complete, UI incomplete)
- **M6: Objectives, Control, and Chaos Campaign MVP** ✅ (backend complete, UI incomplete)
- **M7: Advanced Campaign Resources and Repairs** ⏳ (next phase)
- **M8: Conquest Campaign Map and Orders** 🔮 (v1 phase)
- **M9: Leaderboards, Polish, and Final Release** 🔮 (v1 phase)

## Completed Work (M1-M6 Backend)
- ✅ User authentication (registration, login, logout with PBKDF2 hashing)
- ✅ Account management and profile endpoints
- ✅ Notification system with email integration and polling
- ✅ Campaign creation, invitations, and participation
- ✅ Force management with unit assignment
- ✅ Battle tracking (create, confirm, finalize)
- ✅ Objective tracking (create, update)
- ✅ Resource accounts and transaction history
- ✅ All HTTP endpoints with auth middleware
- ✅ File-based persistence (server/data/store.json)

## Next: Complete M2-M6 UI (Battle and Objective Pages)

These 127 GitHub issues are organized by epic (use case) and milestone. The **immediate priority** should align with completing M6 (Chaos Campaign MVP):

### M5: Battle Logging UI & API (High Priority)
- **Build battle logging UI** — Create/list battles, confirm/finalize, view participants
  - Related GitHub issues: `uc-019-build-battle-logging-ui`, `uc-019-create-battle-tables-models`, `uc-019-implement-battle-crud-endpoints`
- **Build battle confirmation UI** — Approve/dispute battle outcomes
  - Related GitHub issues: `uc-020-*`
- **Effort**: ~60-80 lines per page

### M6: Objectives & Chaos Campaign UI (High Priority)
- **Build objective management UI** — Create/list objectives, track control, update status
  - Related GitHub issues: `uc-025-*`
- **Build campaign dashboard** — Overview of forces, battles, objectives, resources
  - Related GitHub issues: `uc-016-build-campaign-dashboard-ui`
- **Implement Chaos campaign defaults** — Resource loop and defaults
  - Related GitHub issues: `uc-028-*`
- **Effort**: ~40-60 lines per page, plus Chaos-specific business logic

### M7: Repair & Resource Management (Medium Priority)
- **Build repair UI** — Create repair orders, track repairs, resolve orders
- **Build requisition UI** — Request and allocate new gear
- **Build resource tracking UI** — View C-bills, repair points, salvage balances
  - Related GitHub issues: `uc-033-*`
- **Effort**: ~100-150 lines per feature

## How to Work with GitHub Issues

1. **Browse issues locally** in `docs/btcm_github_import/issue_bodies/` to see acceptance criteria
2. **Reference issue numbers** in commits/PRs (e.g., `#25 Build battle logging UI`)
3. **Import issues into GitHub** when ready:
   ```powershell
   cd docs/btcm_github_import
   .\scripts\02_create_milestones.ps1 -Repo DauntlessK/Battletech-Campaign-Manager
   .\scripts\03_import_issues.ps1 -Repo DauntlessK/Battletech-Campaign-Manager
   ```
4. **Use milestones** to organize sprints (M5 → M6 → M7 → M8)
5. **Track progress** with GitHub Project board

## Suggested Priority (Top to Bottom)
1. **Battle Page UI (M5)** — Most gameplay happens here; enables testing battle mechanics
2. **Objective Page UI (M6)** — Supports Chaos campaign cycle
3. **Campaign Dashboard (M6)** — Provides strategic overview
4. **Repair/Requisition UI (M7)** — Enables C-bill tracking and repair mechanics
5. **Battle damage tracking (M7)** — Gameplay mechanics depth
6. *(Then)* Leaderboards and statistics (M9)
7. *(Then)* Conquest map features (M8)

## Notes
- All 127 GitHub issues are ready for import; use the import scripts when ready to track in GitHub
- The project is oriented around Classic BattleTech campaigns per SRS.md and CampaignManual.md
- Reference rulebooks: Tech Manual (units/BV/c-bills), Campaign Operations (campaign/repair), Tactical Operations (advanced rules)
- Current tech stack: React 18 + TypeScript + Tailwind CSS (frontend), Node.js + Express + TypeScript (backend), file-based JSON persistence
- File-based persistence is sufficient for MVP; migration to database deferred to v2
