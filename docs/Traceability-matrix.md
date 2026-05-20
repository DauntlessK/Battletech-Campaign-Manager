# BattleTech Campaign Manager: Traceability Matrix

**Document Version:** 0.1
**Document Type:** Requirements Traceability Matrix
**Related Documents:** Clean SRS v0.2, Campaign Gameplay Manual v0.1, Revised Use Cases v0.2, Database Design and Data Dictionary v0.1, API Endpoint Plan v0.1, GitHub Issues Import

---

# 1. Purpose

This traceability matrix connects the major project artifacts:

* Functional Requirements from the SRS.
* Use Cases from the revised use-case document.
* Gameplay Manual sections where applicable.
* GitHub epic issues created during roadmap import.
* Implementation areas such as frontend, backend/API, database, and documentation.

The matrix helps confirm that every major requirement is covered by at least one user/system workflow and has a corresponding implementation path.

---

# 2. Traceability Format

Each row uses the following format:

| FR ID / Range | Requirement Summary | Related Use Case(s) | Manual Section(s) | GitHub Epic / Issue Area | Implementation Area |
| ------------- | ------------------- | ------------------- | ----------------- | ------------------------ | ------------------- |

Notes:

* FR ranges are used where several requirements belong to the same workflow.
* Detailed one-to-one tracing can be added later if needed.
* Some requirements, especially data persistence and access control, support many workflows and are traced to multiple epics or areas.

---

# 3. Public Site, Help, and Documentation

| FR ID / Range | Requirement Summary                                               | Related Use Case(s)                    | Manual Section(s)    | GitHub Epic / Issue Area                                                                   | Implementation Area |
| ------------- | ----------------------------------------------------------------- | -------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------ | ------------------- |
| FR-001        | Display landing page overview.                                    | UC-001                                 | Manual 1, Manual 2   | [UC-001] View Public Site Information                                                      | UI, Docs            |
| FR-002        | Provide FAQ page.                                                 | UC-001                                 | Manual 1-17          | [UC-001] View Public Site Information                                                      | UI, Docs            |
| FR-003        | Provide campaign guide.                                           | UC-001                                 | Full Gameplay Manual | [UC-001] View Public Site Information; Maintain Project Documentation                      | UI, Docs            |
| FR-004        | Provide force creation and management guidance.                   | UC-001, UC-009, UC-010, UC-012         | Manual 5             | [UC-001] View Public Site Information; [UC-009] Create Force                               | UI, Docs            |
| FR-005        | Provide battle, repair, resource, and campaign progress guidance. | UC-001, UC-018, UC-019, UC-020, UC-033 | Manual 7-10          | [UC-001] View Public Site Information; [UC-033] Manage Repair, Rearmament, and Requisition | UI, Docs            |

---

# 4. Leaderboards and Statistics

| FR ID / Range | Requirement Summary                                                      | Related Use Case(s) | Manual Section(s) | GitHub Epic / Issue Area                                                             | Implementation Area     |
| ------------- | ------------------------------------------------------------------------ | ------------------- | ----------------- | ------------------------------------------------------------------------------------ | ----------------------- |
| FR-006        | Allow public leaderboard viewing.                                        | UC-002              | Manual 15         | [UC-002] View Leaderboards and Statistics                                            | UI, API                 |
| FR-007        | Display leaderboard statistics.                                          | UC-002              | Manual 15         | [UC-002] View Leaderboards and Statistics                                            | UI, API, Database       |
| FR-008        | Sort/filter leaderboards.                                                | UC-002, UC-023      | Manual 15         | [UC-002] View Leaderboards and Statistics; [UC-023] Search, Filter, and Sort Data    | UI, API                 |
| FR-174        | Maintain global leaderboards.                                            | UC-002              | Manual 15         | [UC-002] View Leaderboards and Statistics                                            | API, Database           |
| FR-175        | Maintain public statistics dashboard.                                    | UC-002              | Manual 15         | [UC-002] View Leaderboards and Statistics                                            | UI, API, Database       |
| FR-176        | Include only eligible confirmed/completed data unless otherwise allowed. | UC-002, UC-022      | Manual 15.1       | [UC-002] View Leaderboards and Statistics; [UC-022] Finalize Campaign                | API, Database           |
| FR-177        | Exclude pending, disputed, incomplete, or unconfirmed data.              | UC-002, UC-020      | Manual 15.1       | [UC-002] View Leaderboards and Statistics; [UC-020] Confirm or Dispute Battle Result | API, Database           |
| FR-178        | Link leaderboard data to public-safe summaries.                          | UC-002, UC-016      | Manual 15.3       | [UC-002] View Leaderboards and Statistics                                            | UI, API, Access Control |

---

# 5. User Accounts and Authentication

| FR ID / Range | Requirement Summary                                        | Related Use Case(s)                   | Manual Section(s) | GitHub Epic / Issue Area                  | Implementation Area       |
| ------------- | ---------------------------------------------------------- | ------------------------------------- | ----------------- | ----------------------------------------- | ------------------------- |
| FR-009        | Allow visitor to create account.                           | UC-003                                | N/A               | [UC-003] Create User Account              | UI, API, Database         |
| FR-010        | Allow registered user to log in.                           | UC-004                                | N/A               | [UC-004] Log In                           | UI, API, Auth             |
| FR-011        | Allow logged-in user to log out.                           | UC-005                                | N/A               | [UC-004] Log In / Account Auth Tasks      | UI, API, Auth             |
| FR-012        | Allow logged-in user to view/manage account.               | UC-006                                | N/A               | [UC-006] Manage User Account              | UI, API, Database         |
| FR-013        | Allow editable profile updates.                            | UC-006                                | N/A               | [UC-006] Manage User Account              | UI, API, Database         |
| FR-022        | Restrict management actions to authenticated users.        | UC-004, UC-006, UC-009 through UC-035 | N/A               | Cross-cutting auth tasks                  | Auth, API, Access Control |
| FR-159        | Store user account data.                                   | UC-003, UC-006                        | N/A               | [UC-003] Create User Account              | Database                  |
| FR-170        | Ensure users can only modify authorized data.              | UC-004, UC-006, UC-009 through UC-035 | N/A               | Cross-cutting access control              | API, Auth, Database       |
| FR-171        | Ensure campaign participants view data by role/permission. | UC-016, UC-017, UC-021                | N/A               | [UC-016] View Campaign Dashboard          | API, Access Control       |
| FR-172        | Prevent non-participants from viewing private campaigns.   | UC-016, UC-017, UC-021                | N/A               | [UC-016] View Campaign Dashboard          | API, Access Control       |
| FR-173        | Allow public-safe data without exposing private details.   | UC-002, UC-016                        | Manual 15.3       | [UC-002] View Leaderboards and Statistics | API, Access Control       |

---

# 6. Friends and Social Features

| FR ID / Range | Requirement Summary                           | Related Use Case(s) | Manual Section(s) | GitHub Epic / Issue Area                                      | Implementation Area |
| ------------- | --------------------------------------------- | ------------------- | ----------------- | ------------------------------------------------------------- | ------------------- |
| FR-014        | Assign each user a unique friend code.        | UC-003, UC-007      | N/A               | [UC-003] Create User Account; [UC-007] Add and Manage Friends | API, Database       |
| FR-015        | Send friend requests by friend code.          | UC-007              | N/A               | [UC-007] Add and Manage Friends                               | UI, API, Database   |
| FR-016        | Accept, reject, or remove friend connections. | UC-007              | N/A               | [UC-007] Add and Manage Friends                               | UI, API, Database   |
| FR-017        | View friends list.                            | UC-007              | N/A               | [UC-007] Add and Manage Friends                               | UI, API             |
| FR-160        | Store friend connection data.                 | UC-007              | N/A               | [UC-007] Add and Manage Friends                               | Database            |

---

# 7. Notifications and Communication

| FR ID / Range | Requirement Summary                                                             | Related Use Case(s)    | Manual Section(s)    | GitHub Epic / Issue Area                                                    | Implementation Area   |
| ------------- | ------------------------------------------------------------------------------- | ---------------------- | -------------------- | --------------------------------------------------------------------------- | --------------------- |
| FR-018        | Send email notifications where enabled.                                         | UC-008, UC-014         | N/A                  | [UC-008] View and Manage Notifications                                      | API, External Service |
| FR-019        | Receive in-app notifications for supported events.                              | UC-008                 | Manual 7, 10, 11, 14 | [UC-008] View and Manage Notifications                                      | API, Database         |
| FR-020        | Display notification type, message, timestamp, related object, and read status. | UC-008                 | N/A                  | [UC-008] View and Manage Notifications                                      | UI, API               |
| FR-021        | Mark notifications as read.                                                     | UC-008                 | N/A                  | [UC-008] View and Manage Notifications                                      | UI, API               |
| FR-142        | Notify campaign invite.                                                         | UC-008, UC-014         | Manual 3             | [UC-014] Invite Friends to Campaign                                         | API, Database         |
| FR-143        | Notify invitation accepted/declined.                                            | UC-008, UC-015         | Manual 3             | [UC-015] Join Campaign                                                      | API, Database         |
| FR-144        | Notify when battle is logged.                                                   | UC-008, UC-019         | Manual 7             | [UC-019] Log Battle                                                         | API, Database         |
| FR-145        | Notify when battle requires confirmation.                                       | UC-008, UC-019, UC-020 | Manual 7.5           | [UC-020] Confirm or Dispute Battle Result                                   | API, Database         |
| FR-146        | Notify when battle confirmed/disputed.                                          | UC-008, UC-020         | Manual 7.5-7.6       | [UC-020] Confirm or Dispute Battle Result                                   | API, Database         |
| FR-147        | Notify when campaign status changes.                                            | UC-008, UC-016, UC-022 | Manual 14            | [UC-016] View Campaign Dashboard; [UC-022] Finalize Campaign                | API, Database         |
| FR-148        | Notify when Conquest orders needed/submitted/resolved/blocked.                  | UC-008, UC-031, UC-032 | Manual 11-12         | [UC-031] Assign Conquest Combat Team Orders; [UC-032] Resolve Conquest Turn | API, Database         |
| FR-149        | Notify objective control or bonus ownership changes.                            | UC-008, UC-026, UC-027 | Manual 6             | [UC-027] Resolve Objective Control After Battle                             | API, Database         |
| FR-150        | View all account notifications.                                                 | UC-008                 | N/A                  | [UC-008] View and Manage Notifications                                      | UI, API               |
| FR-151        | Distinguish unread notifications.                                               | UC-008                 | N/A                  | [UC-008] View and Manage Notifications                                      | UI                    |
| FR-152        | Clear/archive/dismiss notifications.                                            | UC-008                 | N/A                  | [UC-008] View and Manage Notifications                                      | UI, API               |
| FR-166        | Store notification data.                                                        | UC-008                 | N/A                  | [UC-008] View and Manage Notifications                                      | Database              |

---

# 8. Force Management

| FR ID / Range | Requirement Summary                                              | Related Use Case(s)    | Manual Section(s) | GitHub Epic / Issue Area                                         | Implementation Area |
| ------------- | ---------------------------------------------------------------- | ---------------------- | ----------------- | ---------------------------------------------------------------- | ------------------- |
| FR-023        | View list of created forces.                                     | UC-009, UC-012         | Manual 5          | [UC-012] Manage Existing Force                                   | UI, API             |
| FR-024        | Create new force.                                                | UC-009                 | Manual 5.1        | [UC-009] Create Force                                            | UI, API, Database   |
| FR-025        | Assign basic force information.                                  | UC-009, UC-011         | Manual 5          | [UC-009] Create Force                                            | UI, API, Database   |
| FR-026        | Configure force-building constraints.                            | UC-009, UC-010         | Manual 5.2        | [UC-009] Create Force; [UC-010] Add Units to Force               | UI, API             |
| FR-027        | Add units to force.                                              | UC-010                 | Manual 5          | [UC-010] Add Units to Force                                      | UI, API, Database   |
| FR-028        | Validate units against constraints.                              | UC-010                 | Manual 5.2        | [UC-010] Add Units to Force                                      | API                 |
| FR-029        | Prevent units that violate constraints.                          | UC-010                 | Manual 5.2        | [UC-010] Add Units to Force                                      | API, UI Validation  |
| FR-030        | Remove units from force.                                         | UC-012                 | Manual 5          | [UC-012] Manage Existing Force                                   | UI, API             |
| FR-031        | View details of each unit in force.                              | UC-010, UC-012         | Manual 5          | [UC-010] Add Units to Force; [UC-012] Manage Existing Force      | UI, API             |
| FR-032        | Customize supported unit details.                                | UC-011                 | Manual 5          | [UC-011] Customize Force or Unit                                 | UI, API, Database   |
| FR-033        | Edit supported force information.                                | UC-011, UC-012         | Manual 5          | [UC-011] Customize Force or Unit; [UC-012] Manage Existing Force | UI, API             |
| FR-034        | Delete/archive original forces while preserving campaign copies. | UC-012                 | Manual 2.3, 5.6   | [UC-012] Manage Existing Force                                   | API, Database       |
| FR-161        | Store force data.                                                | UC-009, UC-010, UC-012 | Manual 5          | [UC-009] Create Force                                            | Database            |

---

# 9. Campaign-Specific Forces and Units

| FR ID / Range | Requirement Summary                                                 | Related Use Case(s)    | Manual Section(s) | GitHub Epic / Issue Area                                                                     | Implementation Area     |
| ------------- | ------------------------------------------------------------------- | ---------------------- | ----------------- | -------------------------------------------------------------------------------------------- | ----------------------- |
| FR-035        | Preserve campaign-specific copy of assigned force.                  | UC-013, UC-015         | Manual 2.3, 5.6   | [UC-013] Create Campaign; [UC-015] Join Campaign                                             | API, Database           |
| FR-036        | Track campaign-specific unit status separately.                     | UC-011, UC-017, UC-018 | Manual 2.3, 8, 9  | [UC-017] View Campaign Forces and Units                                                      | Database, API           |
| FR-046        | Create unique campaign-specific force instance.                     | UC-013, UC-015         | Manual 2.3        | [UC-013] Create Campaign; [UC-015] Join Campaign                                             | API, Database           |
| FR-053        | View forces and units of other campaign players.                    | UC-017                 | Manual 5          | [UC-017] View Campaign Forces and Units                                                      | UI, API, Access Control |
| FR-054        | Display detailed campaign unit information.                         | UC-017                 | Manual 8          | [UC-017] View Campaign Forces and Units                                                      | UI, API                 |
| FR-132        | Track combat team full BV and actual BV.                            | UC-017, UC-031         | Manual 11.5       | [UC-031] Assign Conquest Combat Team Orders                                                  | Database, API           |
| FR-164        | Store campaign-specific unit status separately from base unit data. | UC-017, UC-018, UC-033 | Manual 2.3, 8, 9  | [UC-017] View Campaign Forces and Units; [UC-033] Manage Repair, Rearmament, and Requisition | Database                |
| FR-165        | Store campaign-specific force instances separately from originals.  | UC-013, UC-015, UC-017 | Manual 2.3, 5.6   | [UC-013] Create Campaign; [UC-015] Join Campaign                                             | Database                |

---

# 10. Campaign Management and Setup

| FR ID / Range | Requirement Summary                              | Related Use Case(s)           | Manual Section(s)   | GitHub Epic / Issue Area                                    | Implementation Area |
| ------------- | ------------------------------------------------ | ----------------------------- | ------------------- | ----------------------------------------------------------- | ------------------- |
| FR-037        | View campaigns owned or participated in.         | UC-016, UC-023                | Manual 2            | [UC-016] View Campaign Dashboard                            | UI, API             |
| FR-038        | Create new campaign as Campaign Owner.           | UC-013                        | Manual 3            | [UC-013] Create Campaign                                    | UI, API, Database   |
| FR-039        | Select campaign type.                            | UC-013, UC-024                | Manual 3.1, 4       | [UC-013] Create Campaign; [UC-024] Configure Campaign Rules | UI, API             |
| FR-040        | Configure campaign settings.                     | UC-013, UC-024                | Manual 3.2          | [UC-024] Configure Campaign Rules                           | UI, API, Database   |
| FR-041        | Select one force and duplicate it into campaign. | UC-013                        | Manual 2.3, 3.7     | [UC-013] Create Campaign                                    | API, Database       |
| FR-042        | Invite friends to campaign.                      | UC-014                        | Manual 3.7          | [UC-014] Invite Friends to Campaign                         | UI, API             |
| FR-043        | Send invitation notification.                    | UC-014, UC-008                | Manual 3.7          | [UC-014] Invite Friends to Campaign                         | API, Database       |
| FR-044        | Accept/decline campaign invitation.              | UC-015                        | Manual 3.7          | [UC-015] Join Campaign                                      | UI, API             |
| FR-045        | Assign force when joining.                       | UC-015                        | Manual 3.7          | [UC-015] Join Campaign                                      | UI, API, Database   |
| FR-047        | View campaign dashboard.                         | UC-016                        | Manual 2, 3, 4      | [UC-016] View Campaign Dashboard                            | UI, API             |
| FR-048        | Display campaign progress.                       | UC-016                        | Manual 5, 6, 10, 13 | [UC-016] View Campaign Dashboard                            | UI, API             |
| FR-049        | Display score or standing.                       | UC-016                        | Manual 5, 13        | [UC-016] View Campaign Dashboard                            | UI, API             |
| FR-050        | View resources, status, standings, and events.   | UC-016                        | Manual 9, 10, 13    | [UC-016] View Campaign Dashboard                            | UI, API             |
| FR-162        | Store campaign data.                             | UC-013 through UC-016, UC-022 | Manual 3-4          | [UC-013] Create Campaign                                    | Database            |

---

# 11. Campaign Type Configuration

| FR ID / Range | Requirement Summary                                                                                                                          | Related Use Case(s)                    | Manual Section(s) | GitHub Epic / Issue Area                                             | Implementation Area |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------- | -------------------------------------------------------------------- | ------------------- |
| FR-069        | Support Chaos, Advanced, and Conquest campaign types.                                                                                        | UC-013, UC-024, UC-028, UC-029, UC-030 | Manual 4          | [UC-024] Configure Campaign Rules                                    | API, Database, UI   |
| FR-070        | Enable/disable/require settings by campaign type.                                                                                            | UC-024                                 | Manual 3, 4       | [UC-024] Configure Campaign Rules                                    | UI, API             |
| FR-071        | Support campaign settings for scoring, era, rules level, resources, BV, factions, objective control, salaries, turns, combat teams, victory. | UC-024                                 | Manual 3          | [UC-024] Configure Campaign Rules                                    | UI, API, Database   |
| FR-072        | Restrict Conquest to two players.                                                                                                            | UC-024, UC-030                         | Manual 4.3        | [UC-030] Set Up Conquest Campaign Map                                | API Validation      |
| FR-073        | Allow Chaos/Advanced to support two to ten players.                                                                                          | UC-024, UC-028, UC-029                 | Manual 4.1, 4.2   | [UC-024] Configure Campaign Rules                                    | API Validation      |
| FR-074        | Define resource model by campaign setting.                                                                                                   | UC-024, UC-028, UC-029                 | Manual 3.6, 9     | [UC-024] Configure Campaign Rules; [UC-028] Run Chaos Campaign Cycle | API, Database       |
| FR-075        | Validate campaign settings before campaign begins.                                                                                           | UC-013, UC-024                         | Manual 3.7        | [UC-024] Configure Campaign Rules                                    | API Validation      |
| FR-076        | Place new campaigns into Setup state until required setup is done.                                                                           | UC-013, UC-024                         | Manual 3.7        | [UC-013] Create Campaign                                             | API, Database       |
| FR-077        | Allow Campaign Owner to start campaign once setup is satisfied.                                                                              | UC-013, UC-024, UC-016                 | Manual 3.7        | [UC-016] View Campaign Dashboard                                     | UI, API             |
| FR-078        | Prevent active actions before campaign start except setup actions.                                                                           | UC-013, UC-024, UC-019, UC-031         | Manual 3.7        | [UC-024] Configure Campaign Rules                                    | API, Access Control |

---

# 12. Campaign Objectives and Control

| FR ID / Range | Requirement Summary                                                  | Related Use Case(s)    | Manual Section(s) | GitHub Epic / Issue Area                                                                        | Implementation Area |
| ------------- | -------------------------------------------------------------------- | ---------------------- | ----------------- | ----------------------------------------------------------------------------------------------- | ------------------- |
| FR-079        | Create/select objectives for campaigns using objectives.             | UC-025                 | Manual 6          | [UC-025] Configure Campaign Objectives                                                          | UI, API, Database   |
| FR-080        | Support two to ten objectives for Chaos/Advanced.                    | UC-025                 | Manual 6.1        | [UC-025] Configure Campaign Objectives                                                          | API Validation      |
| FR-081        | Objective has type, name, description, control values, bonuses.      | UC-025, UC-026         | Manual 6.2        | [UC-025] Configure Campaign Objectives                                                          | UI, API, Database   |
| FR-082        | Support binary control for eligible two-player campaigns.            | UC-025, UC-027         | Manual 6.4        | [UC-027] Resolve Objective Control After Battle                                                 | API, Database       |
| FR-083        | Support percentage-based objective control.                          | UC-025, UC-027         | Manual 6.5-6.7    | [UC-027] Resolve Objective Control After Battle                                                 | API, Database       |
| FR-084        | Require percentage control for campaigns with more than two players. | UC-024, UC-025         | Manual 6.5        | [UC-025] Configure Campaign Objectives                                                          | API Validation      |
| FR-085        | Initialize percentage control equally among players.                 | UC-025                 | Manual 6.5        | [UC-025] Configure Campaign Objectives                                                          | API, Database       |
| FR-086        | Calculate control changes after confirmed battles.                   | UC-027                 | Manual 6.6-6.7    | [UC-027] Resolve Objective Control After Battle                                                 | API, Rules Engine   |
| FR-087        | Prevent control below 0% or above 100%.                              | UC-027                 | Manual 6.6-6.7    | [UC-027] Resolve Objective Control After Battle                                                 | API Validation      |
| FR-088        | Apply objective bonuses when thresholds are met.                     | UC-026, UC-027, UC-033 | Manual 6.2-6.3    | [UC-026] View and Manage Objective Control; [UC-033] Manage Repair, Rearmament, and Requisition | API, Rules Engine   |
| FR-089        | Display current objective control and bonus ownership.               | UC-016, UC-026         | Manual 6          | [UC-026] View and Manage Objective Control                                                      | UI, API             |
| FR-090        | Store objective control history.                                     | UC-026, UC-027         | Manual 6.6        | [UC-027] Resolve Objective Control After Battle                                                 | Database            |
| FR-167        | Store objective and objective control data.                          | UC-025, UC-026, UC-027 | Manual 6          | [UC-025] Configure Campaign Objectives                                                          | Database            |

---

# 13. Campaign Turns and Time

| FR ID / Range | Requirement Summary                                     | Related Use Case(s)    | Manual Section(s) | GitHub Epic / Issue Area                                                                 | Implementation Area |
| ------------- | ------------------------------------------------------- | ---------------------- | ----------------- | ---------------------------------------------------------------------------------------- | ------------------- |
| FR-091        | Support turn-based tracking for Advanced/Conquest.      | UC-029, UC-031, UC-032 | Manual 10         | [UC-029] Run Advanced Campaign Turn; [UC-032] Resolve Conquest Turn                      | API, Database       |
| FR-092        | Configure turn length.                                  | UC-024, UC-029         | Manual 10.2-10.3  | [UC-024] Configure Campaign Rules                                                        | UI, API             |
| FR-093        | Track each participant's current turn where applicable. | UC-029                 | Manual 10         | [UC-029] Run Advanced Campaign Turn                                                      | API, Database       |
| FR-094        | Support max-turns-ahead rule.                           | UC-024, UC-029         | Manual 10.4       | [UC-029] Run Advanced Campaign Turn                                                      | API, Rules Engine   |
| FR-095        | Prevent/warn when max-turns-ahead exceeded.             | UC-029                 | Manual 10.4       | [UC-029] Run Advanced Campaign Turn                                                      | UI, API             |
| FR-096        | Do not require formal turns for Chaos campaigns.        | UC-024, UC-028         | Manual 10.1       | [UC-028] Run Chaos Campaign Cycle                                                        | API, Rules Engine   |
| FR-097        | Allow supported actions to consume campaign time.       | UC-029, UC-033         | Manual 9, 10      | [UC-029] Run Advanced Campaign Turn; [UC-033] Manage Repair, Rearmament, and Requisition | API, Database       |
| FR-098        | Display turn/time info on dashboard when applicable.    | UC-016, UC-029, UC-032 | Manual 10         | [UC-016] View Campaign Dashboard                                                         | UI, API             |

---

# 14. Battle Management, Reconciliation, and Disputes

| FR ID / Range | Requirement Summary                                                  | Related Use Case(s)                    | Manual Section(s) | GitHub Epic / Issue Area                                       | Implementation Area         |
| ------------- | -------------------------------------------------------------------- | -------------------------------------- | ----------------- | -------------------------------------------------------------- | --------------------------- |
| FR-051        | View history of past battles.                                        | UC-021                                 | Manual 7-8        | [UC-021] View Battle History                                   | UI, API                     |
| FR-052        | View details of past battles.                                        | UC-021                                 | Manual 7-8        | [UC-021] View Battle History                                   | UI, API                     |
| FR-059        | Log new battle.                                                      | UC-019                                 | Manual 7          | [UC-019] Log Battle                                            | UI, API, Database           |
| FR-060        | Enter battle details.                                                | UC-019                                 | Manual 7.2, 7.4   | [UC-019] Log Battle                                            | UI, API                     |
| FR-061        | Submit battle results for confirmation.                              | UC-019, UC-020                         | Manual 7.5        | [UC-019] Log Battle; [UC-020] Confirm or Dispute Battle Result | API, Database               |
| FR-062        | Notify participants when confirmation required.                      | UC-019, UC-020, UC-008                 | Manual 7.5        | [UC-020] Confirm or Dispute Battle Result                      | API, Notifications          |
| FR-063        | Confirm or dispute submitted battle result.                          | UC-020                                 | Manual 7.5-7.6    | [UC-020] Confirm or Dispute Battle Result                      | UI, API                     |
| FR-064        | Update campaign state after confirmed battle.                        | UC-020, UC-027, UC-028, UC-029, UC-032 | Manual 8          | [UC-020] Confirm or Dispute Battle Result                      | API, Rules Engine, Database |
| FR-099        | Create battle record.                                                | UC-019                                 | Manual 7          | [UC-019] Log Battle                                            | API, Database               |
| FR-100        | Input optional battle information.                                   | UC-019                                 | Manual 7.2        | [UC-019] Log Battle                                            | UI, API                     |
| FR-101        | Select participating players.                                        | UC-019                                 | Manual 7.2        | [UC-019] Log Battle                                            | UI, API                     |
| FR-102        | Select participating units.                                          | UC-019                                 | Manual 7.2        | [UC-019] Log Battle                                            | UI, API                     |
| FR-103        | Record battle outcome.                                               | UC-019                                 | Manual 7.4, 8     | [UC-019] Log Battle                                            | UI, API                     |
| FR-104        | Record unit kills.                                                   | UC-019                                 | Manual 8.2        | [UC-019] Log Battle                                            | UI, API, Database           |
| FR-105        | Record unit damage.                                                  | UC-019                                 | Manual 8.3        | [UC-019] Log Battle                                            | UI, API, Database           |
| FR-106        | Record destroyed, disabled, captured, or salvaged units.             | UC-019                                 | Manual 8.4-8.7    | [UC-019] Log Battle                                            | UI, API, Database           |
| FR-107        | Add notes or battle report.                                          | UC-019, UC-021                         | Manual 8.8        | [UC-019] Log Battle                                            | UI, API                     |
| FR-108        | Allow battle records to remain pending until confirmed.              | UC-019, UC-020                         | Manual 7.5, 7.7   | [UC-020] Confirm or Dispute Battle Result                      | API, Database               |
| FR-109        | Confirmed battles affect standings and force status.                 | UC-020, UC-027                         | Manual 8          | [UC-020] Confirm or Dispute Battle Result                      | API, Rules Engine           |
| FR-110        | Show how pending battle would affect campaign if confirmed.          | UC-019, UC-020                         | Manual 7.7        | [UC-019] Log Battle                                            | UI, API                     |
| FR-111        | Allow disputed battle records to be reviewed.                        | UC-020                                 | Manual 7.5-7.6    | [UC-020] Confirm or Dispute Battle Result                      | UI, API                     |
| FR-112        | Support single-submit confirmation model.                            | UC-019, UC-020                         | Manual 7.5        | [UC-020] Confirm or Dispute Battle Result                      | API                         |
| FR-113        | Support dual-submit reconciliation where enabled.                    | UC-019, UC-020                         | Manual 7.6        | [UC-020] Confirm or Dispute Battle Result                      | API, Stretch                |
| FR-114        | Compare dual submissions.                                            | UC-020                                 | Manual 7.6        | [UC-020] Confirm or Dispute Battle Result                      | API, Stretch                |
| FR-115        | Mark dual-submitted battle ready for confirmation when fields match. | UC-020                                 | Manual 7.6        | [UC-020] Confirm or Dispute Battle Result                      | API, Stretch                |
| FR-116        | Flag discrepancies.                                                  | UC-020                                 | Manual 7.6        | [UC-020] Confirm or Dispute Battle Result                      | API, UI, Stretch            |
| FR-117        | Prevent confirmed battle modification except authorized correction.  | UC-020                                 | Manual 7.5        | [UC-020] Confirm or Dispute Battle Result                      | API, Access Control         |
| FR-118        | Store confirmation/dispute history and notes.                        | UC-020                                 | Manual 7.5-7.6    | [UC-020] Confirm or Dispute Battle Result                      | Database                    |
| FR-163        | Store battle records.                                                | UC-019, UC-020, UC-021                 | Manual 7-8        | [UC-019] Log Battle                                            | Database                    |

---

# 15. Campaign Resources, Repairs, Rearmament, and Requisition

| FR ID / Range | Requirement Summary                                                                  | Related Use Case(s)            | Manual Section(s)   | GitHub Epic / Issue Area                                                                            | Implementation Area   |
| ------------- | ------------------------------------------------------------------------------------ | ------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------- | --------------------- |
| FR-055        | Allow Campaign Owner/authorized users to manage resources.                           | UC-018, UC-028, UC-029, UC-033 | Manual 9            | [UC-018] Manage Campaign Resources and Repairs; [UC-033] Manage Repair, Rearmament, and Requisition | UI, API               |
| FR-056        | Spend resources according to campaign rules.                                         | UC-018, UC-028, UC-029, UC-033 | Manual 9            | [UC-028] Run Chaos Campaign Cycle; [UC-033] Manage Repair, Rearmament, and Requisition              | UI, API, Database     |
| FR-057        | Repair damaged units according to campaign rules.                                    | UC-018, UC-028, UC-029, UC-033 | Manual 9            | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | UI, API, Rules Engine |
| FR-058        | Update unit status.                                                                  | UC-018, UC-020, UC-033         | Manual 8-9          | [UC-018] Manage Campaign Resources and Repairs                                                      | UI, API, Database     |
| FR-119        | Track Warchest resources for Chaos.                                                  | UC-028, UC-033                 | Manual 9.2          | [UC-028] Run Chaos Campaign Cycle                                                                   | Database, API         |
| FR-120        | Track c-bills for Advanced/Conquest.                                                 | UC-029, UC-033                 | Manual 9.3-9.4      | [UC-029] Run Advanced Campaign Turn                                                                 | Database, API         |
| FR-121        | Spend resources by campaign type/settings.                                           | UC-018, UC-028, UC-029, UC-033 | Manual 9            | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | API, Rules Engine     |
| FR-122        | Full Chaos repair by spending Warchest.                                              | UC-028, UC-033                 | Manual 9.7          | [UC-028] Run Chaos Campaign Cycle                                                                   | UI, API               |
| FR-123        | Support repair priorities for Advanced/Conquest.                                     | UC-029, UC-033                 | Manual 9.6, 9.8-9.9 | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | UI, API, Rules Engine |
| FR-124        | Support rearming actions for ammo units.                                             | UC-033                         | Manual 9.5          | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | API, Database         |
| FR-125        | Support requisition/acquisition where enabled.                                       | UC-029, UC-033                 | Manual 9.10         | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | UI, API, Database     |
| FR-126        | Track repair status, unavailable components, missing limbs, pilot injury, readiness. | UC-017, UC-018, UC-033         | Manual 8-9          | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | Database, API         |
| FR-127        | Apply objective bonuses to repair, requisition, income, delivery, stock, healing.    | UC-026, UC-027, UC-033         | Manual 6.2, 9.10    | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | Rules Engine, API     |
| FR-128        | View repair/rearm/requisition/resource summary.                                      | UC-018, UC-029, UC-033         | Manual 9            | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | UI, API               |
| FR-168        | Store resource, repair, rearm, and requisition data.                                 | UC-018, UC-028, UC-029, UC-033 | Manual 9            | [UC-033] Manage Repair, Rearmament, and Requisition                                                 | Database              |

---

# 16. Conquest Campaign Map and Orders

| FR ID / Range | Requirement Summary                                                                | Related Use Case(s)    | Manual Section(s) | GitHub Epic / Issue Area                                                    | Implementation Area         |
| ------------- | ---------------------------------------------------------------------------------- | ---------------------- | ----------------- | --------------------------------------------------------------------------- | --------------------------- |
| FR-129        | Support hex-map layer for Conquest.                                                | UC-030, UC-031, UC-032 | Manual 11         | [UC-030] Set Up Conquest Campaign Map                                       | UI, API, Database           |
| FR-130        | Track hex ownership, neutral hexes, objective hexes, hidden objectives, territory. | UC-030, UC-032         | Manual 11.1-11.3  | [UC-030] Set Up Conquest Campaign Map                                       | Database, API               |
| FR-131        | Organize campaign forces into combat teams.                                        | UC-030, UC-031         | Manual 11.4       | [UC-031] Assign Conquest Combat Team Orders                                 | UI, API, Database           |
| FR-133        | Assign one order per combat team per turn.                                         | UC-031                 | Manual 11.6, 12   | [UC-031] Assign Conquest Combat Team Orders                                 | UI, API                     |
| FR-134        | Support Conquest orders.                                                           | UC-031, UC-032         | Manual 12         | [UC-031] Assign Conquest Combat Team Orders; [UC-032] Resolve Conquest Turn | UI, API, Rules Engine       |
| FR-135        | Validate order eligibility.                                                        | UC-031, UC-032         | Manual 12         | [UC-031] Assign Conquest Combat Team Orders                                 | API Validation              |
| FR-136        | Calculate order effects after both players submit.                                 | UC-032                 | Manual 11.6, 12   | [UC-032] Resolve Conquest Turn                                              | Rules Engine, API           |
| FR-137        | Calculate battle trigger rolls.                                                    | UC-032                 | Manual 12         | [UC-032] Resolve Conquest Turn                                              | Rules Engine, API           |
| FR-138        | Create battle records when Conquest triggers battle.                               | UC-032, UC-019         | Manual 11.7, 12   | [UC-032] Resolve Conquest Turn; [UC-019] Log Battle                         | API, Database               |
| FR-139        | Update hex and objective control after order resolution and confirmed battles.     | UC-032, UC-027         | Manual 11-12      | [UC-032] Resolve Conquest Turn                                              | API, Rules Engine, Database |
| FR-140        | Support auxiliary forces where enabled.                                            | UC-034                 | Manual 13         | [UC-034] Manage Auxiliary Forces                                            | UI, API, Rules Engine       |
| FR-141        | Display Conquest turn resolution summary.                                          | UC-032                 | Manual 11.7, 16.3 | [UC-032] Resolve Conquest Turn                                              | UI, API                     |
| FR-169        | Store Conquest map, hex, combat team, and order data.                              | UC-030, UC-031, UC-032 | Manual 11-12      | [UC-030] Set Up Conquest Campaign Map; [UC-032] Resolve Conquest Turn       | Database                    |

---

# 17. Search, Filtering, and Sorting

| FR ID / Range | Requirement Summary                                                             | Related Use Case(s)                                            | Manual Section(s) | GitHub Epic / Issue Area                                               | Implementation Area |
| ------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------- | ------------------- |
| FR-153        | Search/filter forces.                                                           | UC-012, UC-023                                                 | N/A               | [UC-012] Manage Existing Force; [UC-023] Search, Filter, and Sort Data | UI, API             |
| FR-154        | Search/filter available units.                                                  | UC-010, UC-023                                                 | N/A               | [UC-010] Add Units to Force                                            | UI, API             |
| FR-155        | Filter units by attributes.                                                     | UC-010, UC-023                                                 | Manual 3.3-3.5    | [UC-010] Add Units to Force                                            | UI, API             |
| FR-156        | Search/filter campaigns.                                                        | UC-016, UC-023                                                 | N/A               | [UC-016] View Campaign Dashboard                                       | UI, API             |
| FR-157        | Search/filter battle history.                                                   | UC-021, UC-023                                                 | N/A               | [UC-021] View Battle History                                           | UI, API             |
| FR-158        | Sort forces, campaigns, battles, units, objectives, combat teams, leaderboards. | UC-002, UC-010, UC-012, UC-016, UC-021, UC-023, UC-026, UC-031 | N/A               | Multiple UI list tasks                                                 | UI, API             |

---

# 18. Data Persistence and Database Support

| FR ID / Range | Requirement Summary                                                | Related Use Case(s)           | Manual Section(s) | GitHub Epic / Issue Area                            | Implementation Area |
| ------------- | ------------------------------------------------------------------ | ----------------------------- | ----------------- | --------------------------------------------------- | ------------------- |
| FR-159        | Store user account data.                                           | UC-003, UC-006                | N/A               | [UC-003] Create User Account                        | Database            |
| FR-160        | Store friend connection data.                                      | UC-007                        | N/A               | [UC-007] Add and Manage Friends                     | Database            |
| FR-161        | Store force data.                                                  | UC-009, UC-010, UC-012        | Manual 5          | [UC-009] Create Force                               | Database            |
| FR-162        | Store campaign data.                                               | UC-013 through UC-016, UC-024 | Manual 3-4        | [UC-013] Create Campaign                            | Database            |
| FR-163        | Store battle records.                                              | UC-019, UC-020, UC-021        | Manual 7-8        | [UC-019] Log Battle                                 | Database            |
| FR-164        | Store campaign-specific unit status separately.                    | UC-017, UC-018, UC-033        | Manual 2.3, 8-9   | [UC-017] View Campaign Forces and Units             | Database            |
| FR-165        | Store campaign-specific force instances separately from originals. | UC-013, UC-015, UC-017        | Manual 2.3, 5.6   | [UC-013] Create Campaign                            | Database            |
| FR-166        | Store notification data.                                           | UC-008                        | N/A               | [UC-008] View and Manage Notifications              | Database            |
| FR-167        | Store objective and control data.                                  | UC-025, UC-026, UC-027        | Manual 6          | [UC-025] Configure Campaign Objectives              | Database            |
| FR-168        | Store resource/repair/rearm/requisition data.                      | UC-018, UC-029, UC-033        | Manual 9          | [UC-033] Manage Repair, Rearmament, and Requisition | Database            |
| FR-169        | Store Conquest map/hex/combat team/order data.                     | UC-030, UC-031, UC-032        | Manual 11-12      | [UC-030] Set Up Conquest Campaign Map               | Database            |

---

# 19. Admin Rule Constants

| FR ID / Range | Requirement Summary                                                                              | Related Use Case(s)                    | Manual Section(s)  | GitHub Epic / Issue Area                                                | Implementation Area |
| ------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------------ | ----------------------------------------------------------------------- | ------------------- |
| FR-179        | Store configurable constants for control, order modifiers, thresholds, bonuses, income, repairs. | UC-024, UC-027, UC-032, UC-033, UC-035 | Manual 6.7, 12, 17 | [UC-035] Manage Admin Rule Constants                                    | Database, API       |
| FR-180        | Restrict global rule constant editing to admins.                                                 | UC-035                                 | Manual 17          | [UC-035] Manage Admin Rule Constants                                    | Auth, API           |
| FR-181        | Allow campaign-specific overrides where supported.                                               | UC-024, UC-035                         | Manual 17          | [UC-024] Configure Campaign Rules; [UC-035] Manage Admin Rule Constants | API, Database       |
| FR-182        | Preserve campaign rule settings so global changes do not retroactively alter history.            | UC-024, UC-035                         | Manual 17          | [UC-035] Manage Admin Rule Constants                                    | Database, API       |

---

# 20. Coverage Summary by Use Case

| Use Case                                           | Primary FR Coverage                                   | GitHub Epic Imported?                           | Priority Phase |
| -------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------- | -------------- |
| UC-001: View Public Site Information               | FR-001 through FR-005                                 | Yes                                             | MVP            |
| UC-002: View Leaderboards and Statistics           | FR-006 through FR-008, FR-174 through FR-178          | Yes                                             | V1             |
| UC-003: Create User Account                        | FR-009, FR-014, FR-159                                | Yes                                             | MVP            |
| UC-004: Log In                                     | FR-010, FR-022, FR-170 through FR-173                 | Yes                                             | MVP            |
| UC-005: Log Out                                    | FR-011                                                | Covered under account/auth tasks                | MVP            |
| UC-006: Manage User Account                        | FR-012, FR-013, FR-159, FR-170                        | Yes                                             | MVP            |
| UC-007: Add and Manage Friends                     | FR-014 through FR-017, FR-160                         | Yes                                             | MVP            |
| UC-008: View and Manage Notifications              | FR-018 through FR-021, FR-142 through FR-152, FR-166  | Yes                                             | MVP            |
| UC-009: Create Force                               | FR-023 through FR-026, FR-161                         | Yes                                             | MVP            |
| UC-010: Add Units to Force                         | FR-027 through FR-031, FR-153 through FR-155          | Yes                                             | MVP            |
| UC-011: Customize Force or Unit                    | FR-025, FR-032, FR-033, FR-036                        | Covered under force/campaign force tasks        | MVP            |
| UC-012: Manage Existing Force                      | FR-023, FR-030 through FR-034, FR-153                 | Yes                                             | MVP            |
| UC-013: Create Campaign                            | FR-037 through FR-041, FR-046, FR-069 through FR-078  | Yes                                             | MVP            |
| UC-014: Invite Friends to Campaign                 | FR-042, FR-043, FR-142                                | Yes                                             | MVP            |
| UC-015: Join Campaign                              | FR-044 through FR-046, FR-143                         | Yes                                             | MVP            |
| UC-016: View Campaign Dashboard                    | FR-037, FR-047 through FR-050, FR-068, FR-089, FR-098 | Yes                                             | MVP            |
| UC-017: View Campaign Forces and Units             | FR-053, FR-054, FR-036, FR-164, FR-165                | Yes                                             | MVP            |
| UC-018: Manage Campaign Resources and Repairs      | FR-055 through FR-058, FR-119 through FR-128          | Partially covered by UC-028 and UC-033          | MVP/V1         |
| UC-019: Log Battle                                 | FR-059 through FR-062, FR-099 through FR-110          | Yes                                             | MVP            |
| UC-020: Confirm or Dispute Battle Result           | FR-061 through FR-064, FR-108 through FR-118          | Yes                                             | MVP            |
| UC-021: View Battle History                        | FR-051, FR-052, FR-157, FR-158                        | Yes                                             | MVP            |
| UC-022: Finalize Campaign                          | FR-065 through FR-068, FR-176 through FR-178          | Covered under campaign dashboard/finalize tasks | MVP            |
| UC-023: Search, Filter, and Sort Data              | FR-008, FR-153 through FR-158                         | Cross-cutting                                   | MVP/V1         |
| UC-024: Configure Campaign Rules                   | FR-039, FR-040, FR-069 through FR-078, FR-181, FR-182 | Yes                                             | MVP            |
| UC-025: Configure Campaign Objectives              | FR-079 through FR-090, FR-167                         | Yes                                             | MVP            |
| UC-026: View and Manage Objective Control          | FR-081 through FR-090, FR-149, FR-167                 | Yes                                             | MVP            |
| UC-027: Resolve Objective Control After Battle     | FR-086 through FR-090, FR-064, FR-149, FR-167         | Yes                                             | MVP            |
| UC-028: Run Chaos Campaign Cycle                   | FR-069 through FR-074, FR-096, FR-099 through FR-122  | Yes                                             | MVP            |
| UC-029: Run Advanced Campaign Turn                 | FR-091 through FR-098, FR-119 through FR-128, FR-168  | Yes                                             | V1             |
| UC-030: Set Up Conquest Campaign Map               | FR-072, FR-129 through FR-132, FR-167, FR-169         | Yes                                             | Stretch        |
| UC-031: Assign Conquest Combat Team Orders         | FR-131 through FR-135, FR-148, FR-169                 | Yes                                             | Stretch        |
| UC-032: Resolve Conquest Turn                      | FR-136 through FR-141, FR-148, FR-149, FR-169         | Yes                                             | Stretch        |
| UC-033: Manage Repair, Rearmament, and Requisition | FR-119 through FR-128, FR-168, FR-179 through FR-182  | Yes                                             | V1             |
| UC-034: Manage Auxiliary Forces                    | FR-140, FR-179 through FR-182                         | Yes                                             | Stretch        |
| UC-035: Manage Admin Rule Constants                | FR-179 through FR-182                                 | Yes                                             | Stretch        |

---

# 21. Coverage Gaps and Notes

## 21.1 Use Cases Covered by Larger Epics

Some use cases are intentionally covered inside larger epics rather than imported as separate epics:

* UC-005: Log Out is covered by account/authentication work.
* UC-011: Customize Force or Unit is covered by force and campaign-force management work.
* UC-018: Manage Campaign Resources and Repairs is split between Chaos resource work and advanced repair/requisition work.
* UC-022: Finalize Campaign is covered by campaign dashboard/campaign lifecycle work.
* UC-023: Search, Filter, and Sort Data is cross-cutting across unit, force, campaign, battle, objective, and leaderboard screens.

## 21.2 Requirements That Are Cross-Cutting

The following requirements support many workflows and should be treated as cross-cutting implementation concerns:

* FR-022: Authentication requirements.
* FR-170 through FR-173: Access control.
* FR-153 through FR-158: Search/filter/sort.
* FR-159 through FR-169: Data persistence.
* FR-179 through FR-182: Rule constants and overrides.

## 21.3 MVP vs. Later Work

The roadmap intentionally phases the work:

### MVP

* Accounts and authentication.
* Friends and notifications.
* Unit catalog and force management.
* Campaign setup.
* Campaign-specific force copies.
* Battle logging and confirmation.
* Basic objectives and objective control.
* Chaos campaign resource loop.

### V1

* Leaderboards and statistics.
* Advanced campaign turns.
* C-bill resource tracking.
* Repair, rearmament, and requisition.

### Stretch

* Conquest maps.
* Combat teams.
* Conquest orders.
* Conquest turn resolution.
* Auxiliary forces.
* Admin rule constants UI.

---

# 22. Next Recommended Step

After this matrix is reviewed, the next step is to add this document to the repository under:

```txt
docs/traceability-matrix.md
```

Then update the project documentation index or README to link all major planning documents:

* SRS
* Campaign Gameplay Manual
* Use Cases
* Database Design and Data Dictionary
* Lifecycle and State Diagrams
* API Endpoint Plan
* Traceability Matrix
* GitHub Roadmap / Project Board
