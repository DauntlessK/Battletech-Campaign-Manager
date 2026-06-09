# BattleTech Campaign Manager: API Endpoint Plan

**Document Version:** 0.1
**Document Type:** API Planning / Backend Design
**Related Documents:** Clean SRS v0.2, Revised Use Cases v0.2, Database Design and Data Dictionary v0.1, Lifecycle and State Diagrams v0.1

---

# 1. Purpose

This document defines the initial REST API endpoint plan for the BattleTech Campaign Manager.

The goal is to map the application's major use cases to backend endpoints before implementation begins. This plan is not final code. It is a design guide for how the React frontend, backend API, and database should communicate.

---

# 2. API Design Principles

## 2.1 General Pattern

Use REST-style endpoints with JSON request and response bodies.

Example:

```txt
GET    /api/campaigns
POST   /api/campaigns
GET    /api/campaigns/{campaignId}
PATCH  /api/campaigns/{campaignId}
DELETE /api/campaigns/{campaignId}
```

## 2.2 Versioning

Recommended base path:

```txt
/api/v1
```

Example:

```txt
GET /api/v1/campaigns
```

## 2.3 Response Format

Recommended success response:

```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

Recommended error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": {}
  }
}
```

## 2.4 Common Error Codes

```txt
AUTH_REQUIRED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
CONFLICT
INVALID_STATE_TRANSITION
CAMPAIGN_NOT_ACTIVE
CAMPAIGN_FINALIZED
INSUFFICIENT_RESOURCES
UNSUPPORTED_CAMPAIGN_TYPE
```

## 2.5 Authentication

Most write endpoints require an authenticated user.

Public endpoints include:

* Public site/help data if served through API.
* Public leaderboards.
* Public campaign summaries where enabled.

## 2.6 Authorization

Authorization should be role and ownership based.

Common permission checks:

* User owns the force.
* User is Campaign Owner.
* User is a campaign participant.
* User is authorized to confirm a battle.
* User is administrator.
* Campaign is in the correct state for the requested action.

---

# 3. Endpoint Group Overview

## 3.1 Endpoint Groups

1. Authentication and user accounts
2. Friends and social connections
3. Notifications
4. Base unit catalog
5. Original forces
6. Campaigns and campaign setup
7. Campaign participants and invitations
8. Campaign-specific forces and units
9. Objectives and objective control
10. Battles and battle confirmation
11. Resources, repairs, and requisition
12. Conquest maps, combat teams, orders, and turns
13. Leaderboards and statistics
14. Admin rule constants

---

# 4. Authentication and User Account Endpoints

## 4.1 Register User

```txt
POST /api/v1/auth/register
```

**Use Cases:** UC-003
**Auth Required:** No
**State Change:** Creates user account and friend code.

### Request

```json
{
  "email": "player@example.com",
  "password": "password123",
  "displayName": "Commander Kyle"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "player@example.com",
    "displayName": "Commander Kyle",
    "friendCode": "KYLE-4812"
  }
}
```

---

## 4.2 Log In

```txt
POST /api/v1/auth/login
```

**Use Cases:** UC-004
**Auth Required:** No
**State Change:** Creates authenticated session or token.

### Request

```json
{
  "email": "player@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "player@example.com",
      "displayName": "Commander Kyle",
      "role": "user"
    },
    "token": "jwt-or-session-token"
  }
}
```

---

## 4.3 Log Out

```txt
POST /api/v1/auth/logout
```

**Use Cases:** UC-005
**Auth Required:** Yes
**State Change:** Ends session or invalidates token if applicable.

---

## 4.4 Get Current User

```txt
GET /api/v1/me
```

**Use Cases:** UC-006
**Auth Required:** Yes

---

## 4.5 Update Current User

```txt
PATCH /api/v1/me
```

**Use Cases:** UC-006
**Auth Required:** Yes

### Request

```json
{
  "displayName": "Commander Breen",
  "preferredFaction": "Federated Suns",
  "profileImageUrl": "https://example.com/image.png"
}
```

---

# 5. Friends and Social Endpoints

## 5.1 List Friends

```txt
GET /api/v1/friends
```

**Use Cases:** UC-007
**Auth Required:** Yes

---

## 5.2 Send Friend Request

```txt
POST /api/v1/friend-requests
```

**Use Cases:** UC-007
**Auth Required:** Yes

### Request

```json
{
  "friendCode": "ABCD-1234",
  "message": "Want to join my campaign?"
}
```

---

## 5.3 List Friend Requests

```txt
GET /api/v1/friend-requests
```

**Use Cases:** UC-007
**Auth Required:** Yes

Optional filters:

```txt
?status=pending
?direction=incoming
?direction=outgoing
```

---

## 5.4 Respond to Friend Request

```txt
POST /api/v1/friend-requests/{requestId}/respond
```

**Use Cases:** UC-007
**Auth Required:** Yes

### Request

```json
{
  "response": "accepted"
}
```

Allowed responses:

```txt
accepted
rejected
cancelled
```

---

## 5.5 Remove Friend

```txt
DELETE /api/v1/friends/{friendshipId}
```

**Use Cases:** UC-007
**Auth Required:** Yes

---

# 6. Notification Endpoints

## 6.1 List Notifications

```txt
GET /api/v1/notifications
```

**Use Cases:** UC-008
**Auth Required:** Yes

Optional filters:

```txt
?read=false
?archived=false
?type=campaign_invite
```

---

## 6.2 Mark Notification Read

```txt
PATCH /api/v1/notifications/{notificationId}/read
```

**Use Cases:** UC-008
**Auth Required:** Yes

---

## 6.3 Archive Notification

```txt
PATCH /api/v1/notifications/{notificationId}/archive
```

**Use Cases:** UC-008
**Auth Required:** Yes

---

## 6.4 Dismiss Notification

```txt
DELETE /api/v1/notifications/{notificationId}
```

**Use Cases:** UC-008
**Auth Required:** Yes

---

# 7. Base Unit Catalog Endpoints

## 7.1 Search Base Units

```txt
GET /api/v1/units
```

**Use Cases:** UC-010, UC-023
**Auth Required:** Usually yes, but could be public if desired.

Query parameters:

```txt
?search=atlas
?era=Late%20Succession%20Wars
?rulesLevel=standard
?techBase=inner_sphere
?type=mech
?minBv=500
?maxBv=2000
?minTonnage=20
?maxTonnage=100
```

---

## 7.2 Get Base Unit Details

```txt
GET /api/v1/units/{unitId}
```

**Use Cases:** UC-010, UC-017
**Auth Required:** Usually yes.

---

# 8. Original Force Endpoints

## 8.1 List User Forces

```txt
GET /api/v1/forces
```

**Use Cases:** UC-009, UC-012, UC-023
**Auth Required:** Yes

---

## 8.2 Create Force

```txt
POST /api/v1/forces
```

**Use Cases:** UC-009
**Auth Required:** Yes
**State Change:** Creates original force.

### Request

```json
{
  "name": "Black Talon Company",
  "faction": "Mercenary",
  "era": "Late Succession Wars",
  "rulesLevel": "standard",
  "bvLimit": 6000,
  "background": "Independent mercenary command.",
  "constraints": {
    "unitTypes": ["mech"],
    "maxTonnage": 100
  }
}
```

---

## 8.3 Get Force Details

```txt
GET /api/v1/forces/{forceId}
```

**Use Cases:** UC-012
**Auth Required:** Yes

---

## 8.4 Update Force

```txt
PATCH /api/v1/forces/{forceId}
```

**Use Cases:** UC-011, UC-012
**Auth Required:** Yes
**Permission:** Force owner.

---

## 8.5 Archive or Delete Force

```txt
DELETE /api/v1/forces/{forceId}
```

**Use Cases:** UC-012
**Auth Required:** Yes
**Permission:** Force owner.

Notes:

* This affects the original force only.
* Campaign-specific force copies remain preserved.

---

## 8.6 Add Unit to Force

```txt
POST /api/v1/forces/{forceId}/units
```

**Use Cases:** UC-010
**Auth Required:** Yes
**Permission:** Force owner.

### Request

```json
{
  "baseUnitId": 1001,
  "customName": "Old Reliable",
  "pilotName": "Lt. Morgan Hale"
}
```

---

## 8.7 Update Force Unit

```txt
PATCH /api/v1/forces/{forceId}/units/{forceUnitId}
```

**Use Cases:** UC-011, UC-012
**Auth Required:** Yes

---

## 8.8 Remove Unit from Force

```txt
DELETE /api/v1/forces/{forceId}/units/{forceUnitId}
```

**Use Cases:** UC-012
**Auth Required:** Yes

---

# 9. Campaign Endpoints

## 9.1 List User Campaigns

```txt
GET /api/v1/campaigns
```

**Use Cases:** UC-016, UC-023
**Auth Required:** Yes

Query parameters:

```txt
?status=active
?campaignType=chaos
?role=owner
```

---

## 9.2 Create Campaign

```txt
POST /api/v1/campaigns
```

**Use Cases:** UC-013, UC-024
**Auth Required:** Yes
**State Change:** Creates campaign in setup state.

### Request

```json
{
  "name": "Fall of New Avalon",
  "campaignType": "advanced",
  "description": "Persistent campaign with repairs and resources.",
  "sourceForceId": 12,
  "settings": {
    "era": "Late Succession Wars",
    "rulesLevel": "standard",
    "forceBvLimit": 6000,
    "startingCbills": 5000000,
    "objectiveControlType": "percentage",
    "turnLengthDays": 3,
    "maxTurnsAhead": 2,
    "victoryConditions": ["domination", "turn_limit"]
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "campaignId": 55,
    "status": "setup",
    "campaignForceId": 101
  }
}
```

---

## 9.3 Get Campaign Details

```txt
GET /api/v1/campaigns/{campaignId}
```

**Use Cases:** UC-016
**Auth Required:** Depends on visibility and permission.

---

## 9.4 Update Campaign

```txt
PATCH /api/v1/campaigns/{campaignId}
```

**Use Cases:** UC-024
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Rule:** Some fields editable only in setup.

---

## 9.5 Start Campaign

```txt
POST /api/v1/campaigns/{campaignId}/start
```

**Use Cases:** UC-013, UC-024
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Transition:** setup → active.

---

## 9.6 Pause Campaign

```txt
POST /api/v1/campaigns/{campaignId}/pause
```

**Use Cases:** UC-016
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Transition:** active → paused.

---

## 9.7 Resume Campaign

```txt
POST /api/v1/campaigns/{campaignId}/resume
```

**Use Cases:** UC-016
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Transition:** paused → active.

---

## 9.8 Finalize Campaign

```txt
POST /api/v1/campaigns/{campaignId}/finalize
```

**Use Cases:** UC-022
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Transition:** active/paused → finalized.

### Request

```json
{
  "finalNotes": "Campaign ended after turn 8. Davion player controls 77% of objectives."
}
```

---

## 9.9 Cancel Campaign

```txt
POST /api/v1/campaigns/{campaignId}/cancel
```

**Use Cases:** UC-022
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Transition:** setup/active/paused → cancelled.

---

# 10. Campaign Invitation and Participant Endpoints

## 10.1 Invite User to Campaign

```txt
POST /api/v1/campaigns/{campaignId}/invitations
```

**Use Cases:** UC-014
**Auth Required:** Yes
**Permission:** Campaign Owner.

### Request

```json
{
  "userId": 22
}
```

Alternative request by friend code:

```json
{
  "friendCode": "ABCD-1234"
}
```

---

## 10.2 List Campaign Invitations

```txt
GET /api/v1/campaigns/{campaignId}/invitations
```

**Use Cases:** UC-014
**Auth Required:** Yes
**Permission:** Campaign Owner or participant depending on visibility.

---

## 10.3 Respond to Campaign Invitation

```txt
POST /api/v1/campaign-invitations/{invitationId}/respond
```

**Use Cases:** UC-015
**Auth Required:** Yes
**State Change:** invitation pending → accepted/declined.

### Request

```json
{
  "response": "accepted",
  "sourceForceId": 12
}
```

If accepted, the system creates campaign participant and campaign-specific force copy.

---

## 10.4 List Campaign Participants

```txt
GET /api/v1/campaigns/{campaignId}/participants
```

**Use Cases:** UC-016, UC-017
**Auth Required:** Yes or public if campaign allows.

---

## 10.5 Remove Campaign Participant

```txt
DELETE /api/v1/campaigns/{campaignId}/participants/{participantId}
```

**Use Cases:** Campaign management support
**Auth Required:** Yes
**Permission:** Campaign Owner.

---

# 11. Campaign-Specific Force and Unit Endpoints

## 11.1 List Campaign Forces

```txt
GET /api/v1/campaigns/{campaignId}/forces
```

**Use Cases:** UC-017
**Auth Required:** Participant or public if allowed.

---

## 11.2 Get Campaign Force Details

```txt
GET /api/v1/campaigns/{campaignId}/forces/{campaignForceId}
```

**Use Cases:** UC-017

---

## 11.3 Update Campaign Force

```txt
PATCH /api/v1/campaigns/{campaignId}/forces/{campaignForceId}
```

**Use Cases:** UC-011, UC-017
**Auth Required:** Yes
**Permission:** Force owner or Campaign Owner depending on field.

---

## 11.4 Get Campaign Unit Details

```txt
GET /api/v1/campaigns/{campaignId}/units/{campaignUnitId}
```

**Use Cases:** UC-017

---

## 11.5 Update Campaign Unit Status

```txt
PATCH /api/v1/campaigns/{campaignId}/units/{campaignUnitId}
```

**Use Cases:** UC-018, UC-033
**Auth Required:** Yes
**Permission:** Unit owner, Campaign Owner, or authorized user.

### Request

```json
{
  "status": "damaged",
  "damageSummary": "moderate",
  "notes": "Missing right arm and medium laser."
}
```

---

# 12. Objective Endpoints

## 12.1 List Campaign Objectives

```txt
GET /api/v1/campaigns/{campaignId}/objectives
```

**Use Cases:** UC-016, UC-026

---

## 12.2 Create Objective

```txt
POST /api/v1/campaigns/{campaignId}/objectives
```

**Use Cases:** UC-025
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Rule:** Usually setup only.

### Request

```json
{
  "name": "Hesperus Repair Complex",
  "objectiveType": "repair_facility",
  "description": "Major repair facility.",
  "controlType": "percentage",
  "bonus": {
    "repairRollModifier": 1
  }
}
```

---

## 12.3 Update Objective

```txt
PATCH /api/v1/campaigns/{campaignId}/objectives/{objectiveId}
```

**Use Cases:** UC-025
**Auth Required:** Yes
**Permission:** Campaign Owner.

---

## 12.4 Delete Objective

```txt
DELETE /api/v1/campaigns/{campaignId}/objectives/{objectiveId}
```

**Use Cases:** UC-025
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Rule:** Setup only unless admin override.

---

## 12.5 Get Objective Control

```txt
GET /api/v1/campaigns/{campaignId}/objectives/{objectiveId}/control
```

**Use Cases:** UC-026

---

## 12.6 Get Objective Control History

```txt
GET /api/v1/campaigns/{campaignId}/objectives/{objectiveId}/history
```

**Use Cases:** UC-026, UC-027

---

## 12.7 Adjust Objective Control

```txt
POST /api/v1/campaigns/{campaignId}/objectives/{objectiveId}/adjust-control
```

**Use Cases:** UC-026, UC-027 support
**Auth Required:** Yes
**Permission:** Campaign Owner or admin.
**Purpose:** Manual correction or setup adjustment.

### Request

```json
{
  "participantControls": [
    { "participantId": 1, "controlPercent": 60 },
    { "participantId": 2, "controlPercent": 40 }
  ],
  "reason": "admin_adjustment"
}
```

---

# 13. Battle Endpoints

## 13.1 List Campaign Battles

```txt
GET /api/v1/campaigns/{campaignId}/battles
```

**Use Cases:** UC-021, UC-023

Query parameters:

```txt
?status=confirmed
?participantId=1
?objectiveId=5
```

---

## 13.2 Create Battle

```txt
POST /api/v1/campaigns/{campaignId}/battles
```

**Use Cases:** UC-019
**Auth Required:** Yes
**Permission:** Campaign participant or Campaign Owner.
**State Change:** Creates battle as draft or pending_confirmation.

### Request

```json
{
  "battleDate": "2026-05-19",
  "relatedObjectiveId": 5,
  "scenarioType": "Meeting Engagement",
  "mapName": "Rolling Hills",
  "participantIds": [1, 2],
  "unitIds": [101, 102, 201, 202],
  "summary": "Fight over the repair facility."
}
```

---

## 13.3 Get Battle Details

```txt
GET /api/v1/campaigns/{campaignId}/battles/{battleId}
```

**Use Cases:** UC-019, UC-020, UC-021

---

## 13.4 Update Draft Battle

```txt
PATCH /api/v1/campaigns/{campaignId}/battles/{battleId}
```

**Use Cases:** UC-019
**Auth Required:** Yes
**State Rule:** Draft only unless correction workflow.

---

## 13.5 Submit Battle Result

```txt
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/submit
```

**Use Cases:** UC-019
**Auth Required:** Yes
**State Transition:** draft → pending_confirmation, or adds battle submission.

### Request

```json
{
  "winnerParticipantId": 1,
  "loserParticipantId": 2,
  "outcomeType": "win_loss",
  "unitResults": [
    {
      "campaignUnitId": 101,
      "resultType": "damage",
      "damageCategory": "moderate",
      "detail": {
        "notes": "Lost right arm."
      }
    },
    {
      "campaignUnitId": 201,
      "resultType": "destroyed",
      "causedByCampaignUnitId": 101
    }
  ],
  "summary": "Player 1 wins and holds the field."
}
```

---

## 13.6 Confirm Battle

```txt
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/confirm
```

**Use Cases:** UC-020, UC-027
**Auth Required:** Yes
**State Transition:** pending_confirmation → confirmed.
**Side Effects:** Applies battle effects.

Side effects may include:

* Unit status updates.
* Kill updates.
* Resource updates.
* Objective control updates.
* Hex control updates.
* Statistic event creation.
* Notifications.

---

## 13.7 Dispute Battle

```txt
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/dispute
```

**Use Cases:** UC-020
**Auth Required:** Yes
**State Transition:** pending_confirmation → disputed.

### Request

```json
{
  "reason": "Damage results do not match our record."
}
```

---

## 13.8 Resolve Battle Dispute

```txt
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/resolve-dispute
```

**Use Cases:** UC-020
**Auth Required:** Yes
**Permission:** Campaign Owner or authorized reviewer.

### Request

```json
{
  "resolution": "correct_and_confirm",
  "resolutionNotes": "Corrected destroyed unit entry.",
  "correctedResult": {}
}
```

---

## 13.9 Void Battle

```txt
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/void
```

**Use Cases:** UC-020 support
**Auth Required:** Yes
**Permission:** Campaign Owner or admin.

---

# 14. Resource, Repair, and Requisition Endpoints

## 14.1 Get Resource Accounts

```txt
GET /api/v1/campaigns/{campaignId}/resources
```

**Use Cases:** UC-018, UC-028, UC-029, UC-033

---

## 14.2 Create Resource Transaction

```txt
POST /api/v1/campaigns/{campaignId}/resources/transactions
```

**Use Cases:** UC-018, UC-033
**Auth Required:** Yes

### Request

```json
{
  "participantId": 1,
  "resourceType": "warchest",
  "amount": -20,
  "transactionType": "repair_cost",
  "description": "Full repair for damaged Wolverine."
}
```

---

## 14.3 Create Repair Order

```txt
POST /api/v1/campaigns/{campaignId}/repair-orders
```

**Use Cases:** UC-018, UC-029, UC-033

### Request

```json
{
  "campaignForceId": 101,
  "repairType": "general_priority",
  "timeAvailableMinutes": 1440
}
```

---

## 14.4 Get Repair Order Details

```txt
GET /api/v1/campaigns/{campaignId}/repair-orders/{repairOrderId}
```

**Use Cases:** UC-033

---

## 14.5 Resolve Repair Order

```txt
POST /api/v1/campaigns/{campaignId}/repair-orders/{repairOrderId}/resolve
```

**Use Cases:** UC-018, UC-029, UC-033
**State Change:** planned/in_progress → completed/failed/delayed.

---

## 14.6 Create Requisition Request

```txt
POST /api/v1/campaigns/{campaignId}/requisitions
```

**Use Cases:** UC-029, UC-033

### Request

```json
{
  "requestType": "weapon",
  "description": "Medium Laser replacement",
  "relatedCampaignUnitId": 101
}
```

---

## 14.7 Resolve Requisition Request

```txt
POST /api/v1/campaigns/{campaignId}/requisitions/{requisitionId}/resolve
```

**Use Cases:** UC-033
**Permission:** Campaign Owner, authorized user, or automatic system process.

---

# 15. Conquest Endpoints

## 15.1 Get Conquest Map

```txt
GET /api/v1/campaigns/{campaignId}/conquest/map
```

**Use Cases:** UC-030, UC-031, UC-032

---

## 15.2 Create or Configure Conquest Map

```txt
POST /api/v1/campaigns/{campaignId}/conquest/map
```

**Use Cases:** UC-030
**Auth Required:** Yes
**Permission:** Campaign Owner.
**State Rule:** Setup only.

---

## 15.3 Update Hex

```txt
PATCH /api/v1/campaigns/{campaignId}/conquest/hexes/{hexId}
```

**Use Cases:** UC-030, UC-032 support
**Permission:** Campaign Owner or system/admin.

---

## 15.4 List Combat Teams

```txt
GET /api/v1/campaigns/{campaignId}/combat-teams
```

**Use Cases:** UC-017, UC-030, UC-031

---

## 15.5 Create Combat Team

```txt
POST /api/v1/campaigns/{campaignId}/combat-teams
```

**Use Cases:** UC-030
**Auth Required:** Yes

### Request

```json
{
  "campaignForceId": 101,
  "name": "First Lance",
  "teamType": "lance",
  "campaignUnitIds": [1001, 1002, 1003, 1004]
}
```

---

## 15.6 Update Combat Team

```txt
PATCH /api/v1/campaigns/{campaignId}/combat-teams/{combatTeamId}
```

**Use Cases:** UC-030, UC-031

---

## 15.7 Get Current Conquest Turn

```txt
GET /api/v1/campaigns/{campaignId}/conquest/turns/current
```

**Use Cases:** UC-031, UC-032

---

## 15.8 Assign Conquest Order

```txt
POST /api/v1/campaigns/{campaignId}/conquest/turns/{turnId}/orders
```

**Use Cases:** UC-031
**Auth Required:** Yes
**State Change:** Creates or updates order draft/submission.

### Request

```json
{
  "combatTeamId": 301,
  "orderType": "patrol",
  "targetHexId": 5001,
  "orderData": {}
}
```

---

## 15.9 Submit Conquest Orders

```txt
POST /api/v1/campaigns/{campaignId}/conquest/turns/{turnId}/submit-orders
```

**Use Cases:** UC-031
**State Change:** Orders become submitted/locked for the current player.

---

## 15.10 Resolve Conquest Turn

```txt
POST /api/v1/campaigns/{campaignId}/conquest/turns/{turnId}/resolve
```

**Use Cases:** UC-032
**Permission:** System automatic process, Campaign Owner, or authorized trigger.
**State Change:** orders_submitted → resolving → completed or battles_pending.

Side effects:

* Resolves order effects.
* Updates hex control.
* Updates objective control.
* Creates pending battles if triggered.
* Records order results.
* Sends notifications.

---

## 15.11 Get Conquest Turn Summary

```txt
GET /api/v1/campaigns/{campaignId}/conquest/turns/{turnId}/summary
```

**Use Cases:** UC-032

---

## 15.12 Add Auxiliary Forces to Battle

```txt
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/auxiliary-forces
```

**Use Cases:** UC-034

### Request

```json
{
  "selectedBaseUnitIds": [1001]
}
```

---

# 16. Leaderboard and Statistics Endpoints

## 16.1 Get Public Leaderboards

```txt
GET /api/v1/leaderboards
```

**Use Cases:** UC-002

Query parameters:

```txt
?category=best_unit
?campaignType=advanced
?era=Late%20Succession%20Wars
```

---

## 16.2 Get Statistics Dashboard

```txt
GET /api/v1/statistics/dashboard
```

**Use Cases:** UC-002

---

## 16.3 Get Campaign Statistics

```txt
GET /api/v1/campaigns/{campaignId}/statistics
```

**Use Cases:** UC-016, UC-021

**Auth Required:** Participant or public if campaign allows.

---

# 17. Admin Rule Constant Endpoints

## 17.1 List Rule Constants

```txt
GET /api/v1/admin/rule-constants
```

**Use Cases:** UC-035
**Auth Required:** Yes
**Permission:** Admin.

---

## 17.2 Update Rule Constant

```txt
PATCH /api/v1/admin/rule-constants/{constantId}
```

**Use Cases:** UC-035
**Auth Required:** Yes
**Permission:** Admin.

### Request

```json
{
  "value": 10,
  "notes": "Default base swing for percentage objective control."
}
```

---

## 17.3 List Campaign Rule Overrides

```txt
GET /api/v1/campaigns/{campaignId}/rule-overrides
```

**Use Cases:** UC-024, UC-035
**Auth Required:** Yes
**Permission:** Campaign Owner or admin.

---

## 17.4 Update Campaign Rule Override

```txt
PATCH /api/v1/campaigns/{campaignId}/rule-overrides/{ruleKey}
```

**Use Cases:** UC-024, UC-035
**Auth Required:** Yes
**Permission:** Campaign Owner if allowed, otherwise admin.

---

# 18. Endpoint-to-State Transition Summary

| Endpoint                                | State Transition / Major Side Effect                       |
| --------------------------------------- | ---------------------------------------------------------- |
| POST /campaigns                         | creates campaign in setup                                  |
| POST /campaigns/{id}/start              | setup → active                                             |
| POST /campaigns/{id}/finalize           | active/paused → finalized                                  |
| POST /campaign-invitations/{id}/respond | pending → accepted/declined                                |
| POST /battles                           | creates draft/pending battle                               |
| POST /battles/{id}/submit               | draft → pending_confirmation                               |
| POST /battles/{id}/confirm              | pending_confirmation → confirmed; applies campaign effects |
| POST /battles/{id}/dispute              | pending_confirmation → disputed                            |
| POST /repair-orders                     | creates planned repair order                               |
| POST /repair-orders/{id}/resolve        | planned/in_progress → completed/failed/delayed             |
| POST /conquest/turns/{id}/submit-orders | order drafts → submitted/locked                            |
| POST /conquest/turns/{id}/resolve       | orders_submitted → completed or battles_pending            |

---

# 19. MVP Endpoint Set

For the first implementation, build this smaller endpoint set first.

## 19.1 Accounts and Friends

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/me
PATCH /api/v1/me
GET  /api/v1/friends
POST /api/v1/friend-requests
POST /api/v1/friend-requests/{requestId}/respond
GET  /api/v1/notifications
PATCH /api/v1/notifications/{notificationId}/read
```

## 19.2 Units and Forces

```txt
GET    /api/v1/units
GET    /api/v1/units/{unitId}
GET    /api/v1/forces
POST   /api/v1/forces
GET    /api/v1/forces/{forceId}
PATCH  /api/v1/forces/{forceId}
DELETE /api/v1/forces/{forceId}
POST   /api/v1/forces/{forceId}/units
DELETE /api/v1/forces/{forceId}/units/{forceUnitId}
```

## 19.3 Campaigns

```txt
GET  /api/v1/campaigns
POST /api/v1/campaigns
GET  /api/v1/campaigns/{campaignId}
PATCH /api/v1/campaigns/{campaignId}
POST /api/v1/campaigns/{campaignId}/start
POST /api/v1/campaigns/{campaignId}/finalize
POST /api/v1/campaigns/{campaignId}/invitations
POST /api/v1/campaign-invitations/{invitationId}/respond
GET  /api/v1/campaigns/{campaignId}/forces
```

## 19.4 Objectives and Battles

```txt
GET  /api/v1/campaigns/{campaignId}/objectives
POST /api/v1/campaigns/{campaignId}/objectives
GET  /api/v1/campaigns/{campaignId}/battles
POST /api/v1/campaigns/{campaignId}/battles
GET  /api/v1/campaigns/{campaignId}/battles/{battleId}
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/submit
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/confirm
POST /api/v1/campaigns/{campaignId}/battles/{battleId}/dispute
```

## 19.5 Basic Resources and Leaderboards

```txt
GET  /api/v1/campaigns/{campaignId}/resources
POST /api/v1/campaigns/{campaignId}/resources/transactions
GET  /api/v1/leaderboards
GET  /api/v1/statistics/dashboard
```

Conquest, advanced repair resolution, requisition, admin constants, and auxiliary forces can be added after the MVP endpoints are stable.

---

# 20. Open API Questions

## 20.1 Authentication Style

Options:

* Session cookies.
* JWT bearer tokens.
* Hybrid session plus CSRF protection.

Recommendation depends on final backend framework.

## 20.2 Battle Submission Model

Should the MVP use:

1. Single-submit confirmation only.
2. Dual-submit reconciliation from the start.
3. Single-submit first, dual-submit later.

Recommendation: single-submit first, dual-submit later.

## 20.3 Conquest Resolution Trigger

Should Conquest turn resolution occur:

1. Automatically when both players submit orders.
2. Manually when Campaign Owner clicks resolve.
3. Both, based on campaign setting.

Recommendation: both eventually, manual trigger first for easier debugging.

## 20.4 Objective Control Calculation Location

The objective control formula should run on the backend, not the frontend.

Frontend may show projections, but backend must be authoritative.

## 20.5 Rule Constants

Rule constants should eventually be stored in the database or backend config. The MVP can hard-code them if necessary, but the long-term design should keep them configurable.

---

# 21. Next Step

The next design step should be a **GitHub Project / Roadmap Plan** that converts:

* SRS sections
* Use cases
* Database phases
* API endpoint groups

into:

* Epics
* Child issues
* Milestones
* MVP phases
* Stretch goals

---

# Current API Architecture Notes (v71)

## Hydrated force-unit responses

Force endpoints may return a force unit hydrated with:

- static unit definition (`snapshot`/resolved catalog detail);
- assigned pilot resolved from `pilots`;
- current damage resolved from damage collections;
- repair orders resolved by `forceUnitId`.

These nested response fields are transport conveniences and are not embedded persisted columns.

## Mutation response requirements

Mutations that change resources, units, or campaign progress should return enough updated state for the frontend to refresh immediately. The frontend should reload affected campaign/force/resource aggregates after:

- official battle confirmation;
- repair/rearm;
- salvage/sale;
- reset;
- objective/control updates.

## Required backend validation

Backend services must enforce:

- campaign/force ownership;
- resource sufficiency;
- turns-ahead limit;
- CT-destroyed salvage-only restriction;
- Chaos destroyed-unit repair restriction;
- campaign-specific sale restrictions;
- pilot transfer/unassignment rules.

## Future repository boundary

Route handlers should depend on services/repositories rather than direct file reads. JSON repositories will be replaced by MySQL implementations without changing endpoint semantics.
