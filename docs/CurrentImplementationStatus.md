# Current Implementation Status

**Baseline:** v71

## Implemented

- Split table-like JSON persistence.
- Standalone pilots with force/unit assignments.
- Campaign-specific force copies.
- Official matched battle logging.
- Player turns, campaign reference turn, and turns-ahead limiting.
- Strict pairwise objective percentage transfers.
- Live resource accounts and transaction ledger.
- Chaos immediate repair and disposition flows.
- Advanced/Conquest Mechbay UI.
- Current damage tables for location/equipment/ammo state.
- Stored repair complexity.
- Stored repairability roll and repair/replace outcome.
- Stored replacement cost, tech rating, availability, and repair time.
- Repair queue and requisition views.
- Initial replacement stock check.
- Shared BattleMech location-layout component.
- Dev campaign rebuild/reset and audit.

## Partially implemented / mocked

- Parts requisitions UI derives from repair orders, but complete between-turn requisition/delivery execution is pending.
- Tech-team count/capacity and experience settings exist; actual repair scheduling/attempt execution is pending.
- Advanced/Conquest repair-selection dropdown is UI state, not the complete end-turn repair processor.
- Salvage repair bonus is described but not implemented.
- Pilot roster and assignment management are pending.
- Conquest strategic-map/order workflow remains incomplete.

## Data dependencies requiring validation

- Regenerated unit-detail JSON must include location cost, tech rating, and availability.
- `repair_time.csv` matching must cover all generated repair categories.
- Weapon/component aliases must resolve damage slots to catalog definitions.
- Existing repair orders may contain older snapshots and require reset/relogging or migration.

## Known testing priorities

- Armor-only BV reduction.
- Post-official-log frontend refresh.
- Resource capitulation after spending/gaining resources.
- Location assembly replacement cost capture.
- CT-destroyed salvage-only enforcement.
- Reset integrity after capture, sale, salvage, pilot loss, and repair.
