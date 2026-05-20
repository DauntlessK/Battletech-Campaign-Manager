# Software Requirements Specification: BattleTech Campaign Manager

**Document Version:** 0.2
**Document Type:** Clean SRS Draft
**Project:** BattleTech Campaign Manager

---

# 1. Introduction

## 1.1 Purpose

The purpose of the BattleTech Campaign Manager web application is to help players create, manage, and participate in Classic BattleTech campaigns. The system supports user accounts, friend connections, force creation, campaign creation, battle logging, campaign progression, repairs, resources, objective control, and campaign statistics.

The application is intended to provide a middle ground between very simple campaign tracking and highly detailed campaign management tools. It should support campaigns that are easier to manage than a full MekHQ-style campaign while still providing meaningful force persistence, attrition, repairs, resources, objectives, and campaign consequences.

## 1.2 Scope

The BattleTech Campaign Manager shall allow registered users to:

* Create and manage user accounts.
* Add and manage friends.
* Create, customize, and manage BattleTech forces.
* Create and participate in campaigns.
* Assign force copies to campaigns.
* Log and confirm battles.
* Track unit status, damage, repairs, kills, and campaign-specific changes.
* Manage campaign resources according to campaign rules.
* Track campaign objectives, control, scoring, and victory progress.
* View campaign dashboards, battle history, leaderboards, and statistics.

The system shall support three campaign types:

* **Chaos Campaign:** A simpler campaign mode using Warchest-style resources and simplified repair.
* **Advanced Campaign:** A more detailed mode using c-bills, time, repairs, requisition, unit attrition, and persistent consequences.
* **Conquest Campaign:** A two-player campaign mode that adds a strategic map, combat teams, hex control, orders, and turn resolution.

Detailed gameplay rules for these campaign types are maintained in the separate **Campaign Gameplay Manual**. This SRS describes the software behavior needed to support those rules.

## 1.3 Intended Audience

This document is intended for:

* Developers implementing the application.
* Project stakeholders reviewing scope and functionality.
* Testers creating validation and acceptance tests.
* Instructors or reviewers evaluating the software design.
* Future maintainers extending the campaign system.

## 1.4 Definitions and Abbreviations

**BattleTech:** A tabletop game played with combat units, most commonly BattleMechs, on hex-based maps.

**Classic BattleTech:** The supported game format for this application. It uses Battle Value to balance forces and is played on hex maps.

**BattleMech / Mek / Mech:** A large armored combat unit, usually humanoid in shape, used in BattleTech.

**BV:** Battle Value. A numerical value used to estimate and balance the combat strength of units.

**Player:** A registered user participating in a battle or campaign.

**Campaign:** A collection of linked battles fought with persistent forces, resources, units, and consequences.

**Campaign Owner:** The user who creates and manages a campaign.

**Force:** A collection of units and pilots created by a user.

**Campaign-Specific Force:** A copy of a user's original force that is assigned to a campaign. Once copied, it is tracked separately from the original force.

**Combat Team:** A subdivision of a campaign force, usually a lance or star, used mainly in Conquest campaigns.

**Warchest Points / WP:** Abstract campaign resource used in Chaos campaigns.

**C-bills:** Currency used in Advanced and Conquest campaigns.

**Objective:** A campaign location or asset that players fight over and that may provide bonuses.

**Objective Control:** The amount of control a player has over an objective, either binary or percentage-based depending on campaign settings.

**Turn:** A unit of campaign time used in Advanced and Conquest campaigns.

**Hex:** A map space used in Conquest campaigns.

**Requisition:** The process of acquiring replacement parts, units, or other resources.

**Repair Priority:** A general instruction that determines how the system should prioritize unit repairs.

## 1.5 References

* Campaign Gameplay Manual
* React documentation
* Tailwind CSS documentation
* MySQL documentation
* Flask documentation, if Flask is selected for the backend
* Classic BattleTech rules and campaign-related reference material used by the project team

---

# 2. Overall Description

## 2.1 Product Perspective

The BattleTech Campaign Manager is a web-based campaign management system. It is not intended to replace the tabletop BattleTech rules engine or play battles automatically. Instead, it manages campaign state before and after battles that are played outside the application.

The system should provide persistent tracking for users, forces, campaigns, battles, objectives, unit damage, repairs, resources, and statistics.

## 2.2 Product Functions

The major product functions are:

* Public site information and help pages.
* User registration and login.
* Friend management.
* Force creation and customization.
* Unit selection and force validation.
* Campaign creation and configuration.
* Campaign invitations and participation.
* Campaign-specific force copying.
* Campaign dashboards.
* Objective and control tracking.
* Battle logging and confirmation.
* Campaign resource management.
* Repair, rearmament, and requisition support.
* Conquest map and order support.
* Notifications.
* Search, filtering, and sorting.
* Leaderboards and global statistics.
* Access control and data persistence.

## 2.3 User Classes and Characteristics

### Visitor

A visitor is not logged in. A visitor may view public site information, guides, FAQs, public leaderboards, and public campaign summaries where available.

### Registered User

A registered user may create forces, add friends, receive notifications, create campaigns, join campaigns, and participate in campaign workflows.

### Campaign Owner

A Campaign Owner is a registered user who creates a campaign. The Campaign Owner can configure campaign settings, invite players, manage campaign rules where allowed, and finalize the campaign.

### Campaign Participant

A Campaign Participant is a registered user who has joined a campaign. Participants may view campaign data, assign forces, log battles, manage their own campaign force, confirm battle results, and perform other actions allowed by their campaign role.

### System Administrator

A System Administrator may manage global rule constants, backend-tunable values, and application-level configuration. This role may not be required for the first implementation but should be supported conceptually.

## 2.4 Operating Environment

The application is expected to run as a web application with:

* React frontend.
* Tailwind CSS styling.
* Backend REST API.
* MySQL database.
* Browser-based client interface.

The final backend framework may be Flask or another selected server technology.

## 2.5 Design and Implementation Constraints

* The application shall support Classic BattleTech campaign management only.
* The application shall not attempt to automate the tabletop battle itself.
* Campaign-specific force instances shall be stored separately from original user-created forces.
* Campaign rules shall be configurable enough to support different levels of campaign complexity.
* Detailed campaign rules shall be documented in the Campaign Gameplay Manual.

## 2.6 Assumptions and Dependencies

* Users play battles outside the application and enter results afterward.
* The application depends on accurate user-submitted battle results.
* Some campaign balancing values may change over time and should be backend-configurable.
* Campaigns may support different rule complexity depending on campaign type.
* Not all advanced rules need to be implemented in the initial release.

---

# 3. Functional Requirements

## 3.1 Site, Help, and Public Information

**FR-001:** The system shall display a landing page that provides an overview of the application, its purpose, and its major features.

**FR-002:** The system shall provide an FAQ page that answers common questions about campaigns, forces, battles, user accounts, leaderboards, and supported campaign types.

**FR-003:** The system shall provide a comprehensive campaign guide explaining how to create, configure, run, and conclude a campaign.

**FR-004:** The system shall provide guidance for creating and managing forces, including explanations of force constraints such as era, Battle Value, faction, and unit type.

**FR-005:** The system shall provide guidance for logging battles, confirming battle results, repairing units, spending resources, and tracking campaign progress.

**FR-006:** The system shall allow users and visitors to view public leaderboards.

**FR-007:** The system shall display leaderboard statistics, including most frequent players, most successful players, units destroyed, best-performing factions, famous units, and other campaign performance metrics.

**FR-008:** The system shall allow leaderboards to be sorted and/or filtered by supported categories such as player, faction, campaign, force, unit, or time period.

## 3.2 User Accounts and Social Features

**FR-009:** The system shall allow a visitor to create a user account.

**FR-010:** The system shall allow a registered user to log in.

**FR-011:** The system shall allow a logged-in user to log out.

**FR-012:** The system shall allow a logged-in user to view and manage their account information.

**FR-013:** The system shall allow a logged-in user to update editable profile information, such as display name, profile image, preferred faction, or other supported profile settings.

**FR-014:** The system shall assign each user a unique friend code.

**FR-015:** The system shall allow users to send friend requests using another user's unique friend code.

**FR-016:** The system shall allow users to accept, reject, or remove friend connections.

**FR-017:** The system shall allow users to view a list of their friends.

**FR-018:** The system shall send email notifications to users for supported events where email notification support is enabled.

**FR-019:** The system shall allow users to receive in-app notifications for campaign invitations, battle updates, battle confirmations, campaign status changes, friend requests, and other relevant events.

**FR-020:** The system shall display notifications with notification type, message, timestamp, related object, and read/unread status.

**FR-021:** The system shall allow users to mark notifications as read.

**FR-022:** The system shall restrict account, force, campaign, and battle management actions to authenticated users.

## 3.3 Force Management

**FR-023:** The system shall allow a logged-in user to view a list of forces they have created.

**FR-024:** The system shall allow a logged-in user to create a new force.

**FR-025:** The system shall allow users to assign basic force information, including force name, faction, logo, background description, BV, era, and other supported fields.

**FR-026:** The system shall allow users to configure force-building constraints, such as era, maximum Battle Value, faction restrictions, unit type restrictions, technology level, rules level, or other supported limits.

**FR-027:** The system shall allow users to add units to a force.

**FR-028:** The system shall validate that units added to a force follow the assigned force constraints.

**FR-029:** The system shall prevent users from adding units that violate the force's constraints unless campaign or force settings explicitly allow exceptions.

**FR-030:** The system shall allow users to remove units from a force.

**FR-031:** The system shall allow users to view the details of each unit in a force.

**FR-032:** The system shall allow users to customize supported unit details, such as unit nickname, pilot name, pilot notes, status notes, and visual identifiers.

**FR-033:** The system shall allow users to edit supported force information after creation.

**FR-034:** The system shall allow users to delete or archive original forces, including forces that have previously been copied into campaigns, because campaign-specific force instances are stored separately.

**FR-035:** The system shall preserve a campaign-specific copy of a force when that force is assigned to a campaign.

**FR-036:** The system shall track campaign-specific unit status separately from the user's original force, including damage, kills, repairs, pilot changes, and other campaign-related changes.

## 3.4 Campaign Management

**FR-037:** The system shall allow a logged-in user to view a list of campaigns they own or participate in.

**FR-038:** The system shall allow a logged-in user to create a new campaign as the Campaign Owner.

**FR-039:** The system shall allow the Campaign Owner to select a campaign type.

**FR-040:** The system shall allow the Campaign Owner to configure campaign settings.

**FR-041:** The system shall allow the Campaign Owner to select one of their forces to participate in the campaign, which duplicates it and assigns the duplicate to the campaign.

**FR-042:** The system shall allow the Campaign Owner to invite friends to participate in a campaign.

**FR-043:** The system shall send invited users a campaign invitation notification.

**FR-044:** The system shall allow an invited user to accept or decline a campaign invitation.

**FR-045:** The system shall allow a user who joins a campaign to assign one of their forces to that campaign.

**FR-046:** The system shall create a unique campaign-specific instance of each assigned force when it joins a campaign.

**FR-047:** The system shall allow campaign participants to view the campaign home page or dashboard.

**FR-048:** The system shall display campaign progress on the campaign dashboard.

**FR-049:** The system shall display an overall campaign score or standing based on the campaign's selected scoring rules.

**FR-050:** The system shall allow campaign participants to view current campaign resources, status, standings, and major campaign events.

**FR-051:** The system shall allow campaign participants to view a history of past battles in the current campaign.

**FR-052:** The system shall allow campaign participants to view details of past battles, including participating forces, units destroyed, damage results, victory result, and confirmed status.

**FR-053:** The system shall allow campaign participants to view the forces and units of other players in the campaign.

**FR-054:** The system shall display detailed unit information for campaign forces, including unit status, damage, kills, pilot information, repair status, and other campaign-specific statistics.

**FR-055:** The system shall allow the Campaign Owner or authorized users to manage campaign resources.

**FR-056:** The system shall allow users to spend campaign resources according to the rules of the campaign.

**FR-057:** The system shall allow users to repair damaged units according to the campaign's repair rules.

**FR-058:** The system shall allow users to update unit status, including active, damaged, destroyed, captured, repaired, unavailable, or other supported statuses.

**FR-059:** The system shall allow an authorized user to log a new battle for a campaign.

**FR-060:** The system shall allow the battle logger to enter battle details, including date, participating players, participating forces, participating units, scenario type, map, result, kills, losses, damage, and notes.

**FR-061:** The system shall allow battle results to be submitted for confirmation.

**FR-062:** The system shall notify relevant campaign participants when a battle requires confirmation.

**FR-063:** The system shall allow authorized campaign participants to confirm or dispute a submitted battle result.

**FR-064:** The system shall update campaign progress, force status, unit status, kills, losses, resources, objective control, and scores after a battle is confirmed.

**FR-065:** The system shall allow the Campaign Owner to finalize or conclude a campaign.

**FR-066:** The system shall prevent finalized campaigns from being modified except where explicitly allowed, such as viewing history, exporting results, or adding notes.

**FR-067:** The system shall preserve finalized campaign results for later viewing.

**FR-068:** The system shall allow users to view completed campaigns they previously participated in.

## 3.5 Campaign Type Configuration

**FR-069:** The system shall support Chaos, Advanced, and Conquest campaign types.

**FR-070:** The system shall enable, disable, or require campaign settings based on the selected campaign type.

**FR-071:** The system shall support campaign settings for campaign scoring, era, rules level, starting resources, force BV limit, faction restrictions, objective control type, salaries, turn length, max turns ahead, combat team size, and victory conditions.

**FR-072:** The system shall restrict Conquest campaigns to two players.

**FR-073:** The system shall allow Chaos and Advanced campaigns to support two to ten players.

**FR-074:** The system shall allow campaign settings to define whether a campaign uses Warchest Points, c-bills, time, turns, or other supported resources.

**FR-075:** The system shall validate campaign settings before a campaign can begin.

**FR-076:** The system shall place newly created campaigns into a Beginning or Setup state until required players and forces are finalized.

**FR-077:** The system shall allow the Campaign Owner to start the campaign once all required setup conditions are satisfied.

**FR-078:** The system shall prevent campaign participants from performing active campaign actions before the campaign has started unless those actions are part of setup.

## 3.6 Campaign Objectives and Control

**FR-079:** The system shall allow the Campaign Owner to create or select campaign objectives for campaign types that use objectives.

**FR-080:** The system shall support two to ten objectives for Chaos and Advanced campaigns.

**FR-081:** The system shall allow each objective to have an objective type, name, description, control values, and bonus effects.

**FR-082:** The system shall support binary objective control for eligible two-player campaigns.

**FR-083:** The system shall support varied objective control for campaigns that use percentage-based objective control.

**FR-084:** The system shall require varied objective control for campaigns with more than two players.

**FR-085:** The system shall initialize varied objective control equally among all campaign participants.

**FR-086:** The system shall calculate objective control changes after confirmed battles according to the selected control rule.

**FR-087:** The system shall prevent objective control from dropping below 0% or exceeding 100% for any player.

**FR-088:** The system shall apply objective bonuses when control thresholds are met.

**FR-089:** The system shall display current objective control and objective bonus ownership to campaign participants.

**FR-090:** The system shall store objective control history when objective ownership or percentage control changes.

## 3.7 Campaign Turns and Time

**FR-091:** The system shall support turn-based time tracking for Advanced and Conquest campaigns.

**FR-092:** The system shall allow the Campaign Owner to configure turn length for supported campaign types.

**FR-093:** The system shall track each participant's current campaign turn where applicable.

**FR-094:** The system shall support a configurable max-turns-ahead rule for multiplayer campaigns.

**FR-095:** The system shall prevent or warn players from advancing beyond the max-turns-ahead limit when the rule is enabled.

**FR-096:** The system shall not require formal turns for Chaos campaigns.

**FR-097:** The system shall allow supported campaign actions to consume campaign time where applicable.

**FR-098:** The system shall display turn or time information on the campaign dashboard when the selected campaign type uses turns or time.

## 3.8 Battle Management

**FR-099:** The system shall allow authorized users to create a battle record within an active campaign.

**FR-100:** The system shall allow the initial logger to input optional additional battle information such as scenario type, map, battle notes, and battle report summary.

**FR-101:** The system shall allow users to select which players participated in a battle.

**FR-102:** The system shall allow users to select which units participated in a battle.

**FR-103:** The system shall allow users to record battle outcomes, including winner, loser, draw, objective results, or custom result types supported by the campaign.

**FR-104:** The system shall allow users to record unit kills.

**FR-105:** The system shall allow users to record unit damage.

**FR-106:** The system shall allow users to record destroyed, disabled, captured, or salvaged units.

**FR-107:** The system shall allow users to add notes or a battle report summary to a battle record.

**FR-108:** The system shall allow battle records to remain pending until confirmed.

**FR-109:** The system shall allow confirmed battle records to affect campaign standings and force status.

**FR-110:** The system shall show how a pending battle would affect the campaign if confirmed.

**FR-111:** The system shall allow disputed battle records to be reviewed by the Campaign Owner or authorized users.

## 3.9 Battle Reconciliation and Confirmation

**FR-112:** The system shall support a single-submit battle confirmation model in which one user submits a battle and authorized participants confirm or dispute it.

**FR-113:** The system shall support a dual-submit battle reconciliation model where enabled by campaign settings.

**FR-114:** The system shall compare dual battle submissions and identify matching or conflicting result fields.

**FR-115:** The system shall automatically mark a dual-submitted battle as ready for confirmation when required fields match within campaign-defined rules.

**FR-116:** The system shall flag discrepancies between battle submissions for review.

**FR-117:** The system shall prevent confirmed battle results from being modified except by authorized users or explicit correction workflows.

**FR-118:** The system shall store battle confirmation status, confirmation history, dispute status, and dispute notes.

## 3.10 Campaign Resources, Repair, Rearmament, and Requisition

**FR-119:** The system shall support Warchest Point resource tracking for Chaos campaigns.

**FR-120:** The system shall support c-bill tracking for Advanced and Conquest campaigns.

**FR-121:** The system shall allow campaign participants to spend resources according to the selected campaign type and campaign settings.

**FR-122:** The system shall allow Chaos campaign players to fully repair units by spending Warchest Points according to campaign rules.

**FR-123:** The system shall support repair priorities for Advanced and Conquest campaigns.

**FR-124:** The system shall support rearming actions for units that require ammunition.

**FR-125:** The system shall support requisition or acquisition of replacement parts and units where enabled by campaign rules.

**FR-126:** The system shall track repair status, unavailable components, destroyed components, missing limbs, pilot injury, and unit readiness where supported by campaign type.

**FR-127:** The system shall apply objective bonuses to repair, requisition, income, delivery time, stock rolls, and healing where applicable.

**FR-128:** The system shall allow campaign participants to view a summary of repair, rearmament, requisition, and resource changes.

## 3.11 Conquest Map and Combat Team Orders

**FR-129:** The system shall support a hex-map layer for Conquest campaigns.

**FR-130:** The system shall track hex ownership, neutral hexes, objective hexes, hidden objectives, and controlled territory for Conquest campaigns.

**FR-131:** The system shall allow Conquest players to organize campaign forces into combat teams.

**FR-132:** The system shall track each combat team's full BV and actual BV.

**FR-133:** The system shall allow each combat team to receive one order per Conquest turn.

**FR-134:** The system shall support Conquest orders including Seize Territory, Attack Objective, Patrol, Recon, Raid, Defend, Field Repair and Rearm, Facility Repairs, and Reserve.

**FR-135:** The system shall validate order eligibility based on campaign rules, combat team status, target hex, objective ownership, and map state.

**FR-136:** The system shall calculate order effects after both Conquest players submit orders for a turn.

**FR-137:** The system shall calculate battle trigger rolls for Conquest orders according to selected rules and modifiers.

**FR-138:** The system shall create battle records automatically when Conquest order resolution triggers a battle.

**FR-139:** The system shall update hex control and objective control after Conquest order resolution and confirmed battles.

**FR-140:** The system shall support auxiliary forces for Conquest battles if enabled by campaign settings.

**FR-141:** The system shall display a Conquest turn resolution summary after orders are resolved.

## 3.12 Notifications and Communication

**FR-142:** The system shall notify users when they are invited to a campaign.

**FR-143:** The system shall notify users when a campaign invitation is accepted or declined.

**FR-144:** The system shall notify campaign participants when a battle is logged.

**FR-145:** The system shall notify campaign participants when a battle result requires confirmation.

**FR-146:** The system shall notify campaign participants when a battle result is confirmed or disputed.

**FR-147:** The system shall notify users when campaign status changes, such as campaign start, pause, completion, or cancellation.

**FR-148:** The system shall notify users when Conquest turn orders are needed, submitted, resolved, or blocked.

**FR-149:** The system shall notify users when objective control changes or objective bonuses change ownership.

**FR-150:** The system shall allow users to view all notifications relevant to their account.

**FR-151:** The system shall visually distinguish unread notifications from read notifications.

**FR-152:** The system shall allow users to clear, archive, or dismiss notifications where supported.

## 3.13 Search, Filtering, and Viewing Data

**FR-153:** The system shall allow users to search or filter their forces.

**FR-154:** The system shall allow users to search or filter available units when building a force.

**FR-155:** The system shall allow users to filter units by supported attributes such as era, faction, Battle Value, tonnage, type, technology base, rules level, and role.

**FR-156:** The system shall allow users to search or filter campaigns they own or participate in.

**FR-157:** The system shall allow users to search or filter battle history within a campaign.

**FR-158:** The system shall allow users to sort lists such as forces, campaigns, battles, units, objectives, combat teams, and leaderboards by supported fields.

## 3.14 Data Persistence and Access Control

**FR-159:** The system shall store user account data.

**FR-160:** The system shall store friend connection data.

**FR-161:** The system shall store force data.

**FR-162:** The system shall store campaign data.

**FR-163:** The system shall store battle records.

**FR-164:** The system shall store campaign-specific unit status separately from base unit data.

**FR-165:** The system shall store campaign-specific force instances separately from the original user-created forces they were copied from.

**FR-166:** The system shall store notification data.

**FR-167:** The system shall store campaign objective and objective control data.

**FR-168:** The system shall store campaign resource, repair, rearmament, and requisition data where supported by campaign type.

**FR-169:** The system shall store Conquest map, hex, combat team, and order data where supported by campaign type.

**FR-170:** The system shall ensure that users can only modify forces, campaigns, battles, and account data they are authorized to modify.

**FR-171:** The system shall ensure that campaign participants can view campaign data according to their campaign role and permissions.

**FR-172:** The system shall prevent non-participants from viewing private campaign details unless the campaign is marked public.

**FR-173:** The system shall allow public data, such as public leaderboards or public campaign summaries, to be viewed without requiring unauthorized access to private campaign details.

## 3.15 Leaderboards and Statistics

**FR-174:** The system shall maintain leaderboards of global statistics, such as best player, best unit, most kills, most successful faction, and other supported statistics.

**FR-175:** The system shall maintain a public statistics dashboard showing aggregate counts such as total games played, destroyed meks, completed campaigns, and popular units.

**FR-176:** The system shall only include confirmed battle data from completed campaigns in public leaderboard statistics unless a leaderboard category explicitly supports another data source.

**FR-177:** The system shall exclude pending, disputed, incomplete, or unconfirmed battle data from public leaderboards.

**FR-178:** The system shall allow leaderboard records to link to public-safe summaries without exposing private campaign details.

## 3.16 Admin-Configurable Rule Constants

**FR-179:** The system shall store backend-configurable constants for objective control, Conquest order modifiers, battle trigger thresholds, objective bonuses, resource income, repair values, and other campaign balancing values.

**FR-180:** The system shall restrict modification of global rule constants to system administrators.

**FR-181:** The system shall allow campaign-specific rule settings to override default values where supported.

**FR-182:** The system shall preserve the rule settings used by each campaign so future global changes do not retroactively alter completed or active campaign history unless explicitly migrated.

---

# 4. External Interface Requirements

## 4.1 User Interfaces

The system shall provide browser-based user interfaces for:

* Landing page and public information.
* Registration and login.
* Account management.
* Friend management.
* Force creation and editing.
* Unit search and selection.
* Campaign creation and configuration.
* Campaign dashboard.
* Objective control display.
* Battle logging and confirmation.
* Repair, rearmament, and resource management.
* Conquest map and order assignment.
* Notifications.
* Leaderboards and statistics.

## 4.2 Software Interfaces

The system is expected to use:

* React frontend.
* REST API backend.
* MySQL database.
* Authentication/session management.
* Optional email delivery service for email notifications.

## 4.3 Communication Interfaces

The frontend shall communicate with the backend using HTTP requests to API endpoints. Data exchanged between frontend and backend should use JSON unless otherwise required.

---

# 5. Nonfunctional Requirements

## 5.1 Usability

**NFR-001:** The system shall provide a clear and consistent user interface for campaign setup, force management, battle logging, and campaign dashboards.

**NFR-002:** The system shall provide helpful validation messages when users enter invalid or incomplete information.

**NFR-003:** The system shall provide enough guidance for users unfamiliar with the campaign system to understand major workflows.

## 5.2 Reliability

**NFR-004:** The system shall preserve campaign data after battles, repairs, turn resolutions, and campaign finalization.

**NFR-005:** The system shall prevent accidental loss of campaign-specific force data when original user-created forces are deleted or archived.

**NFR-006:** The system shall prevent duplicate or conflicting battle confirmation updates where possible.

## 5.3 Performance

**NFR-007:** The system shall load common pages such as dashboards, force lists, and campaign lists within an acceptable response time for typical users.

**NFR-008:** The system shall support filtering and searching unit lists without requiring users to manually browse excessive amounts of data.

## 5.4 Security

**NFR-009:** The system shall protect user account access through authentication.

**NFR-010:** The system shall restrict private campaign data to authorized users.

**NFR-011:** The system shall prevent unauthorized modification of campaign, force, battle, notification, and account data.

**NFR-012:** The system shall protect administrative rule-constant editing from non-admin users.

## 5.5 Maintainability

**NFR-013:** The system shall organize campaign rule constants in a way that allows future balancing changes without rewriting core application logic.

**NFR-014:** The system shall separate campaign type rules where practical so Chaos, Advanced, and Conquest behavior can be maintained independently.

**NFR-015:** The system shall preserve traceability between functional requirements, use cases, and implemented features.

## 5.6 Portability

**NFR-016:** The system shall be accessible through modern web browsers.

**NFR-017:** The frontend shall be designed responsively enough to support desktop and smaller-screen layouts where practical.

---

# 6. Use Case Summary

Detailed use cases are maintained in the separate Use Case document. The SRS shall trace major functional requirements to use cases.

## Existing Use Cases

* UC-001: View Public Site Information
* UC-002: View Leaderboards and Statistics
* UC-003: Create User Account
* UC-004: Log In
* UC-005: Log Out
* UC-006: Manage User Account
* UC-007: Add and Manage Friends
* UC-008: View and Manage Notifications
* UC-009: Create Force
* UC-010: Add Units to Force
* UC-011: Customize Force or Unit
* UC-012: Manage Existing Force
* UC-013: Create Campaign
* UC-014: Invite Friends to Campaign
* UC-015: Join Campaign
* UC-016: View Campaign Dashboard
* UC-017: View Campaign Forces and Units
* UC-018: Manage Campaign Resources and Repairs
* UC-019: Log Battle
* UC-020: Confirm or Dispute Battle Result
* UC-021: View Battle History
* UC-022: Finalize Campaign
* UC-023: Search, Filter, and Sort Data

## Additional Use Cases Needed

* UC-024: Configure Campaign Rules
* UC-025: Configure Campaign Objectives
* UC-026: View and Manage Objective Control
* UC-027: Resolve Objective Control After Battle
* UC-028: Run Chaos Campaign Cycle
* UC-029: Run Advanced Campaign Turn
* UC-030: Set Up Conquest Campaign Map
* UC-031: Assign Conquest Combat Team Orders
* UC-032: Resolve Conquest Turn
* UC-033: Manage Repair, Rearmament, and Requisition
* UC-034: Manage Auxiliary Forces
* UC-035: Manage Admin Rule Constants

---

# 7. Data Requirements

The system shall store data for the following major entities:

## 7.1 Users

* User ID
* Email
* Password/authentication data
* Display name
* Friend code
* Profile settings
* Created date

## 7.2 Friend Connections

* Requesting user
* Receiving user
* Status
* Created date
* Accepted/rejected date

## 7.3 Notifications

* Notification ID
* Recipient
* Type
* Message
* Related object
* Timestamp
* Read/unread status
* Archived/dismissed status

## 7.4 Forces

* Force ID
* Owner
* Force name
* Faction
* Logo or visual identifier
* Background description
* Era
* BV
* Force constraints
* Unit list

## 7.5 Campaign-Specific Forces

* Campaign force ID
* Source force reference, if retained for history
* Campaign ID
* Player ID
* Campaign-specific units
* Campaign-specific pilots
* Current campaign status
* Current full BV
* Current actual BV

## 7.6 Campaigns

* Campaign ID
* Campaign Owner
* Campaign name
* Campaign type
* Campaign status
* Campaign settings
* Participants
* Created date
* Started date
* Completed date

## 7.7 Campaign Settings

* Campaign type
* Campaign scoring
* Era
* Rules level
* Starting resources
* Force BV limit
* Faction restrictions
* Objective control type
* Salaries enabled/disabled
* Turn length
* Max turns ahead
* Combat team settings
* Victory conditions

## 7.8 Objectives

* Objective ID
* Campaign ID
* Objective name
* Objective type
* Description
* Bonus effects
* Control type
* Current ownership/control values

## 7.9 Battles

* Battle ID
* Campaign ID
* Participants
* Participating forces
* Participating units
* Date
* Scenario type
* Map
* Outcome
* Objective result
* Damage results
* Kill results
* Salvage/capture results
* Notes
* Confirmation status

## 7.10 Battle Submissions

* Submission ID
* Battle ID
* Submitting user
* Submitted result fields
* Submission timestamp
* Match/conflict status

## 7.11 Unit Status and Damage

* Unit ID
* Campaign-specific unit ID
* Damage state
* Repair state
* Missing components
* Destroyed components
* Ammunition/rearm status
* Pilot status
* Kills
* Availability/readiness

## 7.12 Resources, Repairs, and Requisition

* Resource balances
* Resource transactions
* Repair priorities
* Repair actions
* Rearm actions
* Requisition requests
* Requisition results
* Objective bonus modifiers applied

## 7.13 Conquest Maps, Hexes, and Orders

* Map ID
* Campaign ID
* Hex coordinates
* Hex owner
* Objective presence
* Hidden objective status
* Combat team position
* Combat team orders
* Order resolution results
* Battle trigger results

## 7.14 Leaderboard Statistics

* Statistic ID
* Statistic type
* Player/unit/faction/campaign reference
* Value
* Source campaign or battle records
* Public/private display status

---

# 8. Traceability Matrix Placeholder

The final SRS should include a traceability matrix with the following columns:

| Functional Requirement | Requirement Summary                 | Related Use Case(s) | Related Manual Section(s) |
| ---------------------- | ----------------------------------- | ------------------- | ------------------------- |
| FR-001                 | Display landing page overview       | UC-001              | Manual 1                  |
| FR-069                 | Support campaign types              | UC-024              | Manual 4                  |
| FR-086                 | Calculate objective control changes | UC-027              | Manual 6                  |
| FR-136                 | Resolve Conquest order effects      | UC-032              | Manual 11-12              |

The matrix should be completed after the use cases are revised.

---

# 9. Open Issues and Future Refinement

## 9.1 Open Rule Questions

* Final name for varied objective control.
* Final default values for objective control swing formula.
* Final objective bonus values and scaling.
* Whether dual-submit battle reconciliation is required for all campaign types or only selected modes.
* Exact order of operations for Conquest turn resolution.
* Whether auxiliary forces should carry penalties if destroyed.
* How detailed repair and requisition should be in the first implementation.

## 9.2 Open Technical Questions

* Final backend framework selection.
* Final authentication method.
* Email notification provider.
* Unit data source and import strategy.
* Admin interface scope for rule constants.

## 9.3 Future Enhancements

* Public campaign pages.
* Exportable campaign reports.
* More detailed pilot progression.
* Rich campaign map visualization.
* More advanced leaderboard categories.
* Integration with external BattleTech unit databases if allowed and practical.
