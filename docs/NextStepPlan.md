# Next Step Plan

## Goal
Prepare the project for the next development phase by clarifying the current state, defining immediate tasks, and identifying the best entry points in the codebase.

## Immediate Next Steps
1. Define MVP database models for users, accounts, campaigns, forces, units, battles, resources, and objectives.
2. Build authentication and account flow, including sign-up, sign-in, profile, and campaign membership.
3. Validate backend campaign and unit services in `server/services/` against the MVP schema.
4. Confirm data model alignment between UI state and backend types.
5. Wire frontend auth, login/register/logout flows, and document email/mock notification configuration.

## Recommended Work Items
- `backend`: design and implement core database models and auth/account APIs.
- `frontend`: map current screens to auth flows and core campaign/account interactions.
- `data`: inspect existing unit catalog data to ensure it fits the MVP models.
- `docs`: update `docs/ProjectContext.md` and `docs/CampaignManual.md` as the MVP model is locked down.

## Suggested Priority
1. MVP database schema and auth/account flow
2. Campaign setup and invitation flow
3. Force assignment and campaign-specific force copy behavior
4. Battle result entry and campaign state updates
5. Resource repair/maintenance mechanics
6. Conquest map and combat team order support

## Notes
- The project is currently oriented around Classic BattleTech campaigns and should maintain that focus.
- Use `docs/CampaignManual.md` as the source of truth for gameplay rules while implementing features.
- The next sprint should target one campaign type path first, then expand to the other campaign styles.
 - Reference rulebooks are available in `docs/rulebook_references/`: use the Tech Manual for unit/BV/c-bill data, Campaign Operations for campaign and repair rules, and Tactical Operations Advanced Rules for optional advanced mechanics (ejection, forced withdrawal, etc.).
