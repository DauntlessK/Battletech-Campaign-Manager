# Database Design and Data Dictionary

**Current baseline:** v71  
The current `.btcm/*.json` collections are development stand-ins for these relational tables.

## Design principles

1. Static unit definitions are reusable catalog data.
2. A force unit is one player/campaign-owned unit instance.
3. Pilots are independent records and may be assigned or unassigned.
4. Historical battle reports and current mutable damage are separate.
5. Repair outcomes are snapshotted when damage becomes official.
6. The API may return hydrated aggregates even when storage is normalized.
7. All ownership and destructive restrictions must be enforced server-side.

## Core relationships

```text
users
  -> campaign_participants -> campaigns
  -> forces -> force_units -> unit_definitions
                         -> pilots
                         -> unit_damage
                              -> unit_location_damage
                              -> unit_equipment_damage
                              -> unit_ammo_state
                              -> repair_orders
campaigns -> battles -> battle_logs / submitted damage snapshots
campaigns + users -> resource_accounts -> resource_transactions
```

## `users`

| Field | Purpose |
|---|---|
| `id` | UUID primary key |
| `email` | Unique login email |
| `displayName` | Public/player name |
| `friendCode` | Unique friend lookup code |
| `passwordHash` | Password hash |
| `role` | Player/admin role |
| `status` | Account status |
| timestamps | Audit fields |

## `campaigns`

| Field | Purpose |
|---|---|
| `id` | UUID primary key |
| `ownerId` | Campaign owner |
| `name`, `description` | Identity |
| `status` | Draft/Active/Completed/etc. |
| `settings` | Development JSON object; normalized or JSON column later |
| `turnNumber` / current turn | Shared campaign reference |
| timestamps | Lifecycle fields |

Important settings currently include:

- campaign type;
- era/rules level;
- force BV limit;
- maximum players;
- maximum turns ahead;
- objectives/victory conditions;
- starting resources;
- `turnLengthDays` default 5;
- `techTeams` default half unit count, rounded up;
- `techTeamSize` default 4;
- `techTeamExperience` default `Regular`;
- `workDayMinutes` default 480.

## `campaign_participants`

| Field | Purpose |
|---|---|
| `id` | UUID |
| `campaignId` | Parent campaign |
| `userId` | Player |
| `role`, `status` | Owner/participant and invite state |
| `forceId` | Campaign-copy force |
| `color` | Objective/control UI color |
| player-turn fields | Individual campaign progress |

## `forces`

| Field | Purpose |
|---|---|
| `id` | UUID |
| `ownerId` | User owner |
| `campaignId` | Null for original roster; campaign ID for copy |
| `originalForceId` | Source roster for campaign reset/rebuild |
| `origin` | UserCreated/CampaignCopy |
| `startingBV`, `totalBV` | Starting/current aggregate values |
| metadata | Name, faction, era, rules level, etc. |

## `force_units`

| Field | Purpose |
|---|---|
| `id` | UUID instance ID |
| `forceId` | Owning force |
| `baseUnitId` | Static unit-definition ID |
| `assignedPilotId` | Nullable pilot reference |
| `status` | Ready/Damaged/Crippled/Destroyed/etc. |
| `currentBV` | Current damaged BV |
| `kills` | Campaign kills |
| `isDestroyed` | Destruction flag |
| `teamNumber`, `sortOrder` | Organization/UI order |
| timestamps | Audit fields |

Do not persist embedded pilot or damage aggregates here.

## `pilots`

| Field | Purpose |
|---|---|
| `id` | UUID |
| `ownerId` | User owner |
| `campaignId` | Campaign context |
| `forceId` | Current/original force affiliation |
| `assignedUnitId` | Nullable force-unit assignment |
| `name` | Pilot name |
| `gunnery`, `piloting` | Skills |
| `wounds` | Current wounds |
| `kills`, `experience` | Campaign progression |
| `status` | Assigned/Unassigned/Wounded/Captured/Missing/Killed |
| `isAlive`, `isCaptured` | Explicit state flags |
| timestamps | Audit fields |

## `battles`

Stores the battle identity, participants, objective, submitted logs, confirmation state, official result, and immutable historical damage snapshots.

Historical logs should retain enough pilot/unit data to remain understandable after later reassignments or catalog regeneration.

## `unit_damage`

One active current-damage header per force unit.

| Field | Purpose |
|---|---|
| `id` | UUID |
| `campaignId`, `forceId`, `forceUnitId` | Ownership/references |
| `status` | Current damaged state |
| `repairComplexity` | Simple/Intermediate/Difficult/Impossible |
| aggregate totals | Armor, rear, structure, engine, gyro, etc. |
| `notes` | Current condition notes |
| timestamps | Creation/update |

An undamaged unit normally has no active damage header.

## `unit_location_damage`

| Field | Purpose |
|---|---|
| `id` | UUID |
| `unitDamageId`, `forceUnitId` | Parent references |
| `locationId`, `locationName` | Unit location |
| `armorDamage` | Current unrepaired front armor damage |
| `rearArmorDamage` | Current unrepaired rear damage |
| `structureDamage` | Current unrepaired internal damage |
| `isMissing`, `isDestroyed` | Location state |
| slot arrays/metadata | Damaged or destroyed critical slots if retained in current implementation |

## `unit_equipment_damage`

Each damaged or destroyed weapon/component item.

| Field | Purpose |
|---|---|
| `id` | UUID |
| `unitDamageId`, `forceUnitId` | Parent references |
| location/slot | Physical position |
| equipment ID/name | Static item identity and snapshot label |
| `condition` | Damaged/Destroyed/Missing |
| `repairRoll` | Stored 2D6 result when applicable |
| `disposition` | Repair or Replace |
| `replacementCostCBills` | Stored resolved replacement cost |
| `techRating` | Stored rating |
| `availabilityRating` | Stored campaign-era availability |

## `unit_ammo_state`

| Field | Purpose |
|---|---|
| `id` | UUID |
| `forceUnitId` | Unit instance |
| ammo identity | Type/bin label |
| `shotsSpent` | Shots requiring rearm |
| capacity/tonnage metadata | Used for cost/time |
| timestamps | Audit fields |

## `repair_orders`

Operational work generated when battle damage becomes official.

| Field | Purpose |
|---|---|
| `id` | UUID |
| campaign/force/unit references | Ownership |
| damage/equipment/location references | Source damage |
| `category` | Armor, Internal, Location Assembly, Equipment, Rearm, etc. |
| `itemName` | Human-readable work item |
| `quantity` | Points/items/bins |
| `action` | Repair/Replace/Rearm |
| `repairRoll` | Stored repairability roll if relevant |
| `stockRoll`, `stockTarget`, `inStock` | Replacement stock result |
| `techRating`, `availabilityRating` | Stored snapshots |
| `replacementCostCBills` | Estimated part/material cost |
| `repairTimeMinutes` | Time from repair-time table |
| `status` | Queued/Needs Order/Ordered/Awaiting Delivery/etc. |
| requisition fields | Future turn processing |

Repair orders are snapshots. Catalog regeneration does not rewrite them automatically.

## `resource_accounts`

One account per campaign/user/resource type.

| Field | Purpose |
|---|---|
| `campaignId`, `userId` | Owner/context |
| `resourceType` | Warchest or CBills |
| `balance` | Live balance |

Victory/capitulation calculations and headers must use this live balance.

## `resource_transactions`

Immutable ledger entries for repair, sale, salvage, starting balance, and future expenses/income.

## MySQL deployment guidance

Recommended production approach:

- Normal relational columns/tables for users, campaigns, forces, force units, pilots, current damage, repair orders, resources, and relationships.
- Static unit table with indexed summary columns plus a JSON column for complete unit details, or generated detail files served by the API.
- Immutable battle report payloads may use a JSON column alongside relational searchable fields.
- Repository/service methods should shield routes and frontend from the storage implementation.
