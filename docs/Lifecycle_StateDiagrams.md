# Lifecycle and State Diagrams

**Current baseline:** v71

## Campaign lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Inviting: owner configures campaign
    Inviting --> Ready: participants accept and assign forces
    Ready --> Active: campaign starts
    Active --> Completed: victory/capitulation/end condition
    Active --> Reset: dev reset only
    Reset --> Active: rebuild campaign-copy state
```

## Battle-log lifecycle

```mermaid
stateDiagram-v2
    [*] --> Submitted
    Submitted --> AwaitingMatch
    AwaitingMatch --> Official: matching/confirming log accepted
    AwaitingMatch --> Disputed: incompatible report
    Submitted --> Cancelled
    Official --> [*]
```

On `Official`, the system updates turns, objective control, force-unit condition, current BV, pilots, resources, current damage, and repair orders.

## Force-unit condition

```mermaid
stateDiagram-v2
    Ready --> Damaged: official battle damage
    Ready --> Crippled: severe official damage
    Ready --> Destroyed: destruction
    Damaged --> Crippled: additional damage
    Damaged --> Ready: all current work completed
    Crippled --> Ready: all current work completed
    Destroyed --> Salvaged
    Destroyed --> Captured
    Destroyed --> Repaired: only where campaign rules allow
```

A destroyed Center Torso is a terminal salvage-only condition for the current Advanced/Conquest workflow. It cannot be repaired or sold.

## Pilot lifecycle

```mermaid
stateDiagram-v2
    Assigned --> Wounded: survives with wounds
    Assigned --> Unassigned: unit lost/captured but pilot returns
    Assigned --> Captured: pilot captured
    Assigned --> Missing: unresolved outcome
    Assigned --> Killed: KIA
    Unassigned --> Assigned: future personnel assignment
    Wounded --> Assigned: recovered and assigned
    Wounded --> Unassigned: recovered without assignment
```

No replacement pilot is automatically created when a pilot is killed or a unit is captured.

## Damage-to-repair lifecycle

```mermaid
flowchart TD
    A[Battle becomes official] --> B[Persist current damage]
    B --> C{Weapon/equipment damaged?}
    C -->|Yes| D[Roll 2D6 repairability]
    D -->|10+| E[Repair order]
    D -->|Below 10| F{Existing open requisition?}
    C -->|No, armor/internal/location/ammo| G[Create appropriate repair order]
    F -->|Yes| H[Needs part / skip stock roll]
    F -->|No| I{Always-stock item?}
    I -->|Yes| J[Replacement job; in stock]
    I -->|No| K[2D6 stock roll vs availability]
    K -->|Success| J
    K -->|Failure| H
    E --> L[Repair Queue]
    G --> L
    J --> L
    H --> M[Parts Requisitions]
```

## Future between-turn requisition lifecycle

```mermaid
stateDiagram-v2
    NeedsOrder --> RequisitionFailed: requisition roll fails
    NeedsOrder --> Ordered: requisition roll succeeds
    RequisitionFailed --> NeedsOrder: next eligible turn
    Ordered --> AwaitingDelivery: delivery time assigned
    AwaitingDelivery --> Delivered: delivery countdown completes
    Delivered --> Queued: repair may proceed
    Queued --> Complete: repair succeeds
    Queued --> Failed: repair attempt fails
```

## Objective percentage transfer

```mermaid
flowchart LR
    W[Winner control] -->|+ capped swing| W2[Winner new control]
    L[Loser control] -->|- same capped swing| L2[Loser new control]
    U[Uninvolved players] -->|no change| U2[Same control]
```

## Campaign reset lifecycle

The dev reset is a rebuild, not a field-by-field reversal:

```text
remove campaign battles/damage/orders/resources/pilots/current units
    -> retain participant and campaign-copy force IDs
    -> copy units and pilots from original forces
    -> restore starting resources
    -> reset objective/planet control
    -> reset campaign/player turns
    -> audit relationships
```
