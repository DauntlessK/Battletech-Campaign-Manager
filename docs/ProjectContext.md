# BattleTech Campaign Manager — Project Context

**Current implementation baseline:** v71  
**Last documentation refresh:** June 2026

## 1. Purpose

BattleTech Campaign Manager (BTCM) is a web application for running persistent Classic BattleTech campaigns whose tabletop battles are played outside the application. BTCM manages the campaign state around those battles: players, forces, unit instances, pilots, battle confirmation, damage, repair work, resources, objectives, turns, and campaign progress.

BTCM is intended to sit between a spreadsheet and a full MekHQ-style campaign. It keeps persistent consequences and campaign logistics while avoiding automation of tabletop combat itself.

## 2. Supported campaign types

### Chaos

- Uses Warchest Points (WP).
- Simplified repair and rearm costs.
- Repair actions are immediate from the Mechbay when sufficient WP exists.
- Destroyed units are not repairable.
- Damaged or destroyed units cannot be sold.
- Salvage and sale values are based on unit tonnage.

### Advanced

- Uses C-bills.
- Tracks detailed armor, internal, equipment, limb, and ammunition repair work.
- Supports repair complexity, repair time, stock checks, requisitions, and deliveries.
- Damaged units may be sold at a reduced value.

### Conquest

- Uses the Advanced repair/resource model.
- Adds objective/map-control concepts and combat-team/strategic play.
- Current implementation is still evolving toward the complete strategic turn workflow.

## 3. Current technical stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, lucide-react.
- **Backend:** Node.js, Express, TypeScript.
- **Development persistence:** split JSON collections under `.btcm/`.
- **Deployment target:** MySQL-backed repositories using the same domain boundaries.
- **Authentication:** bearer-token workflow with locally stored auth tokens during development.
- **Unit catalog:** generated searchable unit index plus generated unit-detail JSON served through the API.

The split JSON files are intentionally shaped like database tables. They are not intended as a permanent production storage strategy.

## 4. Core domain model

### Unit definition

A reusable static unit catalog entry such as an Atlas AS7-D. The searchable index contains summary fields; the generated unit-detail JSON contains locations, armor, structure, slots, weapons, equipment, costs, tech ratings, availability, and other construction data.

### Force

A user-created roster or a campaign-specific copy of that roster.

### Force unit

A player’s specific instance of a catalog unit. It references the static definition through `baseUnitId` and stores instance state such as force ownership, status, current BV, kills, sort order, and assigned pilot ID.

The full static unit definition is not duplicated into the eventual database row. API responses may hydrate a force unit with its unit definition, current damage, and pilot for frontend convenience.

### Pilot

Pilots are standalone records in `pilots.json`. A force unit stores only `assignedPilotId`. A pilot can belong to a force without being assigned to a unit.

### Battle log

A player-submitted historical report. A battle becomes official when the required matching/confirming log is accepted. Historical battle damage remains part of the battle record; current unrepaired damage is maintained separately.

### Current damage and repair work

Current unit condition is stored in table-like collections related to a force unit:

- `unitDamage.json`
- `unitLocationDamage.json`
- `unitEquipmentDamage.json`
- `unitAmmoState.json`
- `repairOrders.json`

This maps cleanly to future relational tables while still allowing the API to return one hydrated force-unit object.

## 5. Current storage collections

The active development store is normally under:

```text
C:\Users\<user>\.btcm\
```

Collections currently include:

```text
users.json
campaigns.json
campaignParticipants.json
forces.json
forceUnits.json
pilots.json
battles.json
unitDamage.json
unitLocationDamage.json
unitEquipmentDamage.json
unitAmmoState.json
repairOrders.json
objectives.json
resourceAccounts.json
resourceTransactions.json
authTokens.json
notifications.json
friendRequests.json
```

`storageService.ts` reconstructs the in-memory `StoreData` aggregate from these files. The same service boundary is intended to be replaced by MySQL repositories without forcing the frontend API contract to change.

## 6. Battle confirmation and damage processing

When a battle becomes official, the backend:

1. Applies the official result to both campaign forces.
2. Updates player/campaign turn state.
3. Applies objective control as a strict transfer between the winner and loser only.
4. Updates live resource/victory progress.
5. Updates force-unit status and current BV.
6. Persists current armor, rear armor, internal, equipment, limb, and ammunition damage.
7. Resolves each damaged weapon/equipment item with one 2D6 roll:
   - 10+ = repairable.
   - Below 10 = replacement required.
   - Destroyed equipment automatically requires replacement.
8. Captures repair metadata at that moment: cost, tech rating, availability, repair/replace outcome, and estimated time.
9. Creates repair-order rows for armor, internal structure, locations, equipment, and rearming.
10. Refreshes frontend campaign and force state so users do not need a manual page reload.

Battle logs are historical. Repair orders/current damage are mutable operational state.

## 7. Pilot decisions

- Pilots are not embedded in force units.
- Captured units never receive an automatically generated replacement pilot.
- A surviving pilot whose unit is destroyed/captured returns to the original force as unassigned.
- Killed pilots remain as historical records with `Killed` status.
- Captured or wounded pilots retain their own status independently from any unit.
- Battle logs may retain pilot snapshots for historical accuracy even if the pilot is later reassigned.

## 8. Mechbay decisions

The Mechbay is a dedicated campaign page and is unit-focused; pilot management will be handled elsewhere.

Views:

- All Units
- Awaiting Repairs
- Repair Queue

Advanced/Conquest also expose Parts Requisitions. The selected-unit damage view uses the shared `BattleMechLocationLayout` component, matching the battle damage reporter.

Mechbay displays remaining armor/structure, while Battle Log inputs record damage received. This intentional difference is user-facing:

- Battle Log: “5 damage taken.”
- Mechbay: “10 / 15 armor remaining.”

## 9. Repair and requisition decisions

### Repair complexity

Stored at official-log time:

- **Simple:** armor/structure plus A–C items.
- **Intermediate:** up to three D items and/or one E item; maximum one limb replacement.
- **Difficult:** beyond Intermediate limits and/or one F item.
- **Impossible:** two or more F repairs, or a destroyed Center Torso.

A destroyed Center Torso is salvage-only:

- complexity is Impossible;
- repair selection is locked to `-`;
- sell is disabled;
- salvage remains available;
- backend repair/sell requests must also be rejected.

### Replacement stock check

After an item fails the 10+ repairability roll:

1. If an open requisition/delivery for the same item exists, do not perform another stock roll.
2. Always-stock items are immediately available:
   - heat sinks;
   - small lasers;
   - medium lasers.
3. Otherwise roll 2D6 against configurable availability targets:
   - A: 3+
   - B: 4+
   - C: 5+
   - D: 7+
   - E: 9+
   - F: 10+
4. In-stock parts remain repair jobs and do not enter requisitions.
5. Out-of-stock parts become `Needs Order` and appear in Parts Requisitions.

Future between-turn processing will implement requisition success and delivery-time rolls.

### Repair time and capacity

Repair times come from `src/data/repair_time.csv` and are captured on repair orders when official damage is processed.

- Repair queue displays minutes.
- Unit totals and Mechbay summary display turns.
- Default turn length: 5 days.
- Default workday: 480 minutes.
- Default tech team size: 4.
- Default tech-team experience: Regular.
- Default tech-team count: half the force’s unit count, rounded up.

Experience repair targets:

- Green: 9+
- Regular: 7+
- Veteran: 6+
- Elite: 5+

## 10. Resource decisions

- Chaos uses live Warchest accounts.
- Advanced/Conquest use live C-bill accounts.
- Dashboard resource displays and capitulation progress must use live account balances, not campaign starting-resource settings.
- Resource mutations create transaction records and the frontend refreshes live balances after actions.

Disposition values currently decided:

- Advanced/Conquest undamaged sale: 75% of original C-bill cost.
- Advanced/Conquest damaged sale: 12.5% of original cost.
- Advanced/Conquest salvage: 10% of original cost plus a future salvage repair bonus.
- Chaos sale: full tonnage in WP.
- Chaos salvage: half tonnage in WP, rounded down.

## 11. Turn decisions

- A player’s displayed turn is based on completed official battles for that player.
- Campaign turn is a shared behind-the-scenes reference derived from player progress.
- `maxTurnsAhead` is displayed separately and does not replace the player’s current turn.
- Turns-ahead never displays as negative.
- Battle logging is disabled when a player reaches the allowed turns-ahead limit, except when confirming/matching an already-created battle.

## 12. Objective-control decisions

- Percentage campaigns begin with equal player shares.
- A battle transfers control only between the winner and loser.
- Uninvolved players’ percentages must not change.
- Transfer is capped by the loser’s available percentage, winner’s remaining capacity, and calculated swing.
- Planetary control is read from stored/calculated live control rather than a permanently equal visual fallback.

## 13. Shared UI decisions

`src/components/BattleMechLocationLayout.tsx` is the reusable body-layout component for location displays. It is used by Battle Log and Mechbay so the body arrangement cannot drift between pages.

Interactive behavior belongs to the page-specific location cards; body placement belongs to the shared component.

## 14. Development tools

The dev panel includes:

- true campaign reset by rebuilding campaign-copy forces from their original forces;
- cleanup of battles, damage, repair orders, pilots, resources, and transactions;
- restoration of objectives, turns, starting resources, units, pilots, and assignments;
- campaign audit for broken participant/force/unit/pilot/damage/order relationships and useful record counts.

## 15. Important implementation cautions

- Repair orders are snapshots. Regenerating unit-detail JSON does not retroactively update existing orders.
- Location assembly costs, tech ratings, and availability must be present in regenerated unit-detail locations before logging new official damage.
- Do not reintroduce embedded `pilot`, `currentDamage`, or `damageOverlay` as persisted fields in `forceUnits.json`.
- Do not use battle history as the sole source of current damage.
- Do not calculate mutable repair outcomes on every page render; capture them when the battle becomes official.
- Backend validation must mirror UI restrictions for repairs, sales, capture, and ownership.

## 16. Immediate development focus

1. Validate v71 repair-time matching against all CSV rows.
2. Validate current-BV reduction for armor, structure, equipment, and destroyed locations.
3. Finish between-turn repair attempts and tech-team scheduling.
4. Implement requisition and delivery rolls/status transitions.
5. Implement rearm execution and resource deduction for Advanced/Conquest.
6. Build pilot assignment/personnel management.
7. Migrate development repositories to MySQL without changing public API shapes.
