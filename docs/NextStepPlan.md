# Next Step Plan

**Current baseline:** v71

## Immediate validation

1. Test official battle confirmation without manual refresh.
2. Verify live WP/C-bill totals and resource capitulation percentages after every transaction.
3. Test objective percentage transfer with 2, 3, and 4 players; uninvolved shares must remain unchanged.
4. Validate current BV changes for:
   - armor-only damage;
   - rear armor;
   - internal structure;
   - destroyed equipment;
   - destroyed limbs/locations;
   - Center Torso destruction.
5. Validate repair-time CSV matching for every repair category.
6. Regenerate unit details and confirm location assembly cost, tech rating, and availability are captured in new repair orders.

## Repair execution milestone

- Schedule work against tech-team capacity.
- Use hidden defaults:
  - 5 days per turn;
  - 480 work minutes per day;
  - 4 technicians per team;
  - Regular team experience (7+);
  - team count = unit count / 2, rounded up.
- Attempt repairs/replacements at end-of-turn.
- Record repair attempt rolls and failures.
- Prevent work when required parts have not arrived.
- Complete repair rows and remove resolved current damage.
- Restore BV/status incrementally or after complete repair, according to final rules decision.

## Requisition and delivery milestone

- Implement requisition roll against rarity/availability.
- Apply faction and campaign-location modifiers.
- Store failed attempts and retry eligibility.
- Roll delivery time.
- Decrement delivery time each campaign turn.
- Move delivered parts back into eligible repair work.
- Add inventory/salvaged-part bonus model.

## Rearm milestone

- Execute Advanced/Conquest rearm orders.
- Deduct exact C-bill cost.
- Restore ammunition state.
- Complete/remove rearm orders.
- Validate Chaos WP rearm behavior.

## Personnel milestone

- Build pilot roster page.
- Assign/swap/unassign pilots.
- Track recovery from wounds.
- Display captured/missing/killed pilot history.
- Preserve campaign ownership when units transfer.
- Add pilot XP and skill advancement later.

## Persistence/deployment milestone

- Introduce repository interfaces for current JSON services.
- Define MySQL migrations for current table-like collections.
- Import existing `.btcm` arrays preserving UUIDs.
- Store indexed unit summaries in SQL.
- Choose generated unit-detail files versus MySQL JSON column for complete static definitions.
- Add transactions around official battle resolution, repair execution, and disposition.

## UI polish

- Ensure Mechbay queue columns remain aligned at all breakpoints.
- Preserve one shared location-layout component.
- Add clearer “remaining” versus “damage taken” labels.
- Improve repair/requisition status tags.
- Add confirmation/error feedback for all resource actions.
- Keep main tables scrollable and avoid oversized modals.

## Dev tools

Potential high-value additions:

- seed damage scenarios;
- force a stock/requisition/delivery result;
- advance one campaign turn;
- recompute current BV for a selected unit;
- rebuild repair orders from current damage;
- export campaign diagnostic bundle;
- compare hydrated API state against underlying table rows.
