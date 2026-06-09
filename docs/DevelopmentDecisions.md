# Development Decisions Log

**Current baseline:** v71

This file records decisions that should not be casually reversed during later refactors.

## Storage and deployment

- Development JSON collections model future database tables.
- The old single `store.json` is retired in favor of split collections.
- The API/service layer must hide whether storage is JSON or MySQL.
- Static unit definitions and mutable force-unit instances are separate concepts.
- Hydrated API responses do not imply embedded persistence.

## Force units and pilots

- `forceUnits` store `assignedPilotId`, not an embedded pilot object.
- All pilot state belongs in `pilots`.
- Surviving pilots from lost/captured units become unassigned in their original force.
- Killed pilots remain historical records.
- Captured units never receive an automatic pilot.

## Damage

- Historical battle damage remains in the battle report.
- Current unrepaired damage is stored in current-damage tables.
- Damage and repair metadata are related to `forceUnitId`.
- Battle Log records damage taken; Mechbay displays remaining armor/structure.
- Current BV must reflect armor, structure, equipment, and location losses.

## Repair orders

- Repairability roll occurs once when the battle becomes official.
- 10+ repairs the item; lower results require replacement.
- Destroyed equipment requires replacement without a repairability roll.
- Cost, tech rating, availability, roll, disposition, and time are snapshotted.
- Existing orders do not automatically change when unit data is regenerated.
- Integral actuators/shoulders/hips/feet/hands are included with a replacement limb and are not separate purchase orders.
- Weapons and other installed equipment are not included automatically with a replacement location.
- Rearming is repair-queue work.

## Repair complexity

- Simple, Intermediate, Difficult, Impossible are stored outcomes.
- Center Torso destruction always means Impossible and salvage-only.

## Stock and requisitions

- Always-stock: heat sinks, small lasers, medium lasers.
- Stock targets are configurable constants A 3+, B 4+, C 5+, D 7+, E 9+, F 10+.
- Do not roll stock if an open requisition/delivery for the same item exists.
- In-stock replacement remains repair work; unavailable replacement enters requisitions.

## Mechbay

- Dedicated page, no pilot-management UI.
- Main views: All Units, Awaiting Repairs, Repair Queue.
- Parts Requisitions is derived from repair-order status.
- Shared `BattleMechLocationLayout` controls location placement site-wide.
- Repair queue times are minutes; unit/summary estimates are turns.

## Campaign turns

- Player current turn and maximum turns ahead are separate values.
- Campaign turn is a shared reference based on player progress.
- A player at the turns-ahead limit cannot create another new battle log but may match/confirm an existing one.
- Default campaign turn duration is 5 days.

## Resources

- UI and capitulation use live resource accounts.
- Starting resources are initialization data only.
- Resource mutations create ledger transactions.
- Advanced/Conquest sale and salvage percentages are documented in Project Context.

## Objective control

- Percentage changes are strict winner/loser transfers.
- Uninvolved players never gain or lose control from another pair’s battle.
- No normalization step may redistribute their percentages.

## Dev reset

- Reset is a campaign rebuild from original forces, not an attempt to reverse each mutation.
- Reset must include battles, pilots, current damage, ammo, repair orders, resources, objectives, and turns.
