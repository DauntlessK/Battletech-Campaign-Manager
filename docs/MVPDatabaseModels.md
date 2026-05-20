# MVP Database Models

This document captures the initial minimal data model for the BattleTech Campaign Manager. It is intended to support the first implementation phase: user authentication, account management, campaign creation, force creation, campaign participation, battle logging, resources, and objective control.

## Core Tables

### users
- `id`: string
- `email`: string
- `displayName`: string
- `friendCode`: string
- `passwordHash`: string
- `role`: `player` | `admin`
- `status`: `active` | `disabled` | `pending`
- `authProvider`: `local`
- `createdAt`: string
- `updatedAt`: string

### campaigns
- `id`: string
- `ownerId`: string
- `name`: string
- `description`: string?
- `status`: `Setup` | `Active` | `Paused` | `Completed` | `Archived`
- `settings`: JSON object
- `createdAt`: string
- `updatedAt`: string
- `startDate`: string?
- `finishDate`: string?

### campaign_participants
- `id`: string
- `campaignId`: string
- `userId`: string
- `role`: `Owner` | `Participant` | `Spectator`
- `status`: `Pending` | `Accepted` | `Declined` | `Removed`
- `invitedById`: string?
- `invitedAt`: string
- `joinedAt`: string?
- `leftAt`: string?
- `forceId`: string?

### forces
- `id`: string
- `ownerId`: string
- `name`: string
- `description`: string?
- `era`: string?
- `rulesLevel`: string?
- `totalBV`: number?
- `currencyCBills`: number?
- `unitIds`: string[]
- `createdAt`: string
- `updatedAt`: string
- `campaignId`: string?
- `originalForceId`: string?
- `origin`: `UserCreated` | `CampaignCopy`
- `status`: `Active` | `Archived` | `Assigned` | `Deleted`

### force_units
- `id`: string
- `forceId`: string
- `baseUnitId`: string
- `snapshot`: JSON object of base unit information
- `currentBV`: number
- `status`: `Available` | `Destroyed` | `InRepair` | `Reserved` | `Unavailable`
- `kills`: number
- `damageDescription`: string?
- `isDestroyed`: boolean
- `assignedPilotId`: string?

### battles
- `id`: string
- `campaignId`: string
- `turnNumber`: number?
- `date`: string
- `location`: string?
- `status`: `Proposed` | `Confirmed` | `Disputed` | `Finalized`
- `submittedByUserId`: string
- `defendingUserId`: string?
- `winnerUserId`: string?
- `attackerForceId`: string?
- `defenderForceId`: string?
- `attackerScore`: number?
- `defenderScore`: number?
- `summary`: string?
- `confirmedAt`: string?
- `createdAt`: string
- `updatedAt`: string

### objectives
- `id`: string
- `campaignId`: string
- `name`: string
- `description`: string?
- `type`: `Factory` | `Depot` | `City` | `Fort` | `Medical` | `Comms` | `Spaceport` | `Custom`
- `controlType`: `Binary` | `Percentage`
- `currentOwnerId`: string?
- `currentControl`: JSON array of control percentages by user
- `bonusDescription`: string?
- `createdAt`: string
- `updatedAt`: string

### resource_accounts
- `id`: string
- `campaignId`: string
- `userId`: string
- `balances`: JSON object keyed by resource type
- `lastUpdatedAt`: string

### resource_transactions
- `id`: string
- `campaignId`: string
- `userId`: string
- `type`: `CBills` | `RepairPoints` | `Warchest` | `Time` | `Salvage`
- `amount`: number
- `reason`: string
- `createdAt`: string

## MVP Model Principles

- `users` captures authentication identity and social metadata.
- `campaigns` stores campaign configuration and lifecycle state.
- `campaign_participants` separates campaign membership from user accounts.
- `forces` represents both original player forces and campaign-specific force copies.
- `force_units` preserves a snapshot of the base unit while tracking campaign state.
- `battles` stores battle records and result status for confirmation workflows.
- `objectives` supports objective control state needed for campaign scoring.
- `resource_accounts` and `resource_transactions` support currency and repair tracking.

## Next implementation step

The next concrete task is to wire these models into the backend as TypeScript data types and an in-memory or file-backed persistence layer, then add basic auth and account routes.

## References

- `docs/rulebook_references/BattleTech TechManual.pdf` — authoritative source for base unit specs, component costs, BV calculations, and c-bill cost tables; use when designing `force_units`, `forces`, and cost-related fields.
- `docs/rulebook_references/BattleTech Campaign Operations.pdf` — authoritative campaign rules and repair/maintenance mechanics; use when designing `resource_accounts`, `resource_transactions`, repair workflows, and campaign lifecycle rules.
- `docs/rulebook_references/BattleTech Tactical Operations Advanced Rules.pdf` — optional advanced rules (ejection, forced withdrawal, advanced combat outcomes) for future optional features and edge-case handling.
