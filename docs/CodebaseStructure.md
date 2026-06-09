# Codebase Structure

**Current baseline:** v71

## Application layers

```text
src/       React/Vite frontend
server/    Express/TypeScript API and business services
scripts/   unit-index/detail generation and maintenance tools
docs/      product, architecture, rules, and implementation documentation
.btcm/     development persistence directory outside the repository at runtime
```

## Frontend

### `src/App.tsx`

Application shell and current navigation/state coordinator. It loads authenticated-user, campaign, force, unit, battle, notification, and live-resource data. Mutation workflows should refresh affected aggregates rather than require a browser reload.

### Important pages

- `CampaignsPage.tsx` — campaign list/dashboard, control progress, turns, resources, force status, and entry points to battle logging/Mechbay.
- `LogBattlePage.tsx` — post-tabletop battle report, participants, outcome, pilot result, detailed damage, ammo expenditure, and confirmation payload.
- `MechbayPage.tsx` — all units, awaiting repairs, repair queue, parts requisitions, disposition actions, repair estimates, and detailed current condition.
- `UnitsPage.tsx` — searchable static unit catalog and detailed unit viewer.
- `ForcesPage.tsx` — original-force construction and management.
- `AdminPage.tsx` — development reset and campaign audit tools.

### Shared components

- `BattleMechLocationLayout.tsx` — shared responsive body placement for Head, CT, side torsos, arms, and legs. Battle Log and Mechbay supply their own cards and behavior.
- `AppHeader.tsx`
- `PageTitle.tsx`

### Frontend types

`src/types/app.ts` contains transport/view models. API responses may hydrate relational data, for example:

```ts
ForceUnit & {
  snapshot: UnitDefinition;
  pilot?: Pilot;
  currentDamage?: CampaignUnitDamageOverlay;
}
```

Hydration is an API convenience and does not imply those objects are persisted inside the force-unit row.

## Backend

### Routes

`server/routes/` exposes authenticated REST endpoints for auth, users, campaigns, forces, battles, objectives, resources, units, and admin/dev actions.

Routes should remain thin: validate request/authentication, call a service, and return the result.

### Services

- `storageService.ts` — loads/saves split JSON collections and reconstructs `StoreData`.
- `campaignService.ts` — campaign creation, participation, turns, and campaign state.
- `battleService.ts` — battle-log matching, official resolution, objective control, current damage, repairability/stock rolls, BV changes, and repair-order creation.
- `forceService.ts` — forces, force-unit actions, Chaos repair, disposition, resource mutations, and hydrated force responses.
- resource/auth/user services — their corresponding business domains.

### Backend types

`server/types/models.ts` defines persisted records and service/API shapes. Persisted types should be database-friendly and avoid deeply duplicated aggregates.

## Development persistence

Runtime development files normally live at:

```text
%USERPROFILE%\.btcm\
```

Each JSON file is an array representing a future table. `storageService.ts` reads the arrays into one in-memory `StoreData`, serializes writes, and writes collection files atomically via temporary files/backups.

Current table-like collections:

```text
users
campaigns
campaignParticipants
forces
forceUnits
pilots
battles
unitDamage
unitLocationDamage
unitEquipmentDamage
unitAmmoState
repairOrders
objectives
resourceAccounts
resourceTransactions
authTokens
notifications
friendRequests
```

## Unit data pipeline

### Search index

Generated summary data supports filtering/sorting without constructing every full unit object.

### Unit details

Generated unit-detail JSON is served by the units API and includes the authoritative static definition. It should include:

- armor/structure and locations;
- critical slots;
- weapons/equipment/ammunition;
- BV and C-bill cost;
- location assembly cost;
- tech rating;
- era availability;
- formula-resolved or fixed costs needed by repair processing.

### Instance data

`forceUnits` references static definitions through `baseUnitId`. The API joins/hydrates static and dynamic data for the frontend.

## Repair pipeline files

- `src/data/repair_time.csv` — repair-time and complexity reference used when official damage creates orders.
- weapon/component definition data — replacement cost, tech rating, aliases, and availability.
- generated unit details — unit-specific location assembly values and slot metadata.

## Data-flow examples

### Official battle

```text
LogBattlePage
  -> battles route/service
  -> match/confirm battle
  -> objective/turn/resource updates
  -> current damage tables
  -> repairability and stock rolls
  -> repairOrders
  -> hydrated campaigns/forces refreshed in App
```

### Mechbay

```text
MechbayPage
  <- hydrated force units
     <- forceUnits + unit definitions + pilots + current damage + repair orders
```

### Future MySQL migration

The service/repository layer should change from JSON-array access to SQL queries. Routes and frontend response shapes should remain substantially stable.
