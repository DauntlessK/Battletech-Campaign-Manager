# SRS Use Cases: BattleTech Campaign Manager

**Document Version:** 0.2
**Project:** BattleTech Campaign Manager
**Related Documents:** Clean SRS v0.2, Campaign Gameplay Manual v0.1

---

# Use Case Index

## Public Site and Account Use Cases

UC-001: View Public Site Information
UC-002: View Leaderboards and Statistics
UC-003: Create User Account
UC-004: Log In
UC-005: Log Out
UC-006: Manage User Account
UC-007: Add and Manage Friends
UC-008: View and Manage Notifications

## Force Management Use Cases

UC-009: Create Force
UC-010: Add Units to Force
UC-011: Customize Force or Unit
UC-012: Manage Existing Force

## Campaign Setup and Management Use Cases

UC-013: Create Campaign
UC-014: Invite Friends to Campaign
UC-015: Join Campaign
UC-016: View Campaign Dashboard
UC-017: View Campaign Forces and Units
UC-018: Manage Campaign Resources and Repairs
UC-019: Log Battle
UC-020: Confirm or Dispute Battle Result
UC-021: View Battle History
UC-022: Finalize Campaign
UC-023: Search, Filter, and Sort Data

## Campaign Rules and Gameplay Use Cases

UC-024: Configure Campaign Rules
UC-025: Configure Campaign Objectives
UC-026: View and Manage Objective Control
UC-027: Resolve Objective Control After Battle
UC-028: Run Chaos Campaign Cycle
UC-029: Run Advanced Campaign Turn
UC-030: Set Up Conquest Campaign Map
UC-031: Assign Conquest Combat Team Orders
UC-032: Resolve Conquest Turn
UC-033: Manage Repair, Rearmament, and Requisition
UC-034: Manage Auxiliary Forces
UC-035: Manage Admin Rule Constants

---

# UC-001: View Public Site Information

**Primary Actor:**
Visitor or User

**Secondary Actors:**
System

**Goal:**
Allow visitors and users to learn what the application does and how to use it.

**Brief Description:**
A visitor or user views the landing page, FAQ, campaign guide, force guide, or battle guide to understand the system and its features.

**Preconditions:**

* The site is available.

**Trigger:**
The actor opens the landing page, FAQ, guide, or help section.

**Main Success Scenario:**

1. Actor opens the application website.
2. System displays the landing page overview.
3. Actor selects FAQ, campaign guide, force guide, or battle guide.
4. System displays the selected help content.
5. Actor reads the information.

**Alternative Flows:**
A1. Actor selects a missing or unavailable help page.

1. System displays an error or unavailable-content message.
2. Actor may return to the landing page or select another section.

**Postconditions:**
Success:

* Actor has viewed public information or help documentation.

Failure:

* Requested content is not displayed.

**Related Functional Requirements:**

* FR-001 through FR-005

**Priority:**
Medium

---

# UC-002: View Leaderboards and Statistics

**Primary Actor:**
Visitor or User

**Secondary Actors:**
System

**Goal:**
Allow actors to view public rankings and global campaign statistics.

**Brief Description:**
A visitor or user opens the leaderboard or statistics dashboard to view public performance rankings and system-wide statistics based on eligible campaign data.

**Preconditions:**

* Public leaderboard page is available.

**Trigger:**
Actor selects the Leaderboards or Statistics option.

**Main Success Scenario:**

1. Actor opens the leaderboards page.
2. System displays global leaderboard categories.
3. Actor selects or views a category such as best player, best unit, most kills, best faction, or most popular units.
4. System displays ranked leaderboard data.
5. Actor sorts or filters leaderboard data.
6. System updates the displayed results.

**Alternative Flows:**
A1. No eligible leaderboard data exists.

1. System displays an empty leaderboard message.
2. System explains that leaderboards are based on eligible confirmed/completed campaign data.

A2. Actor applies filters that return no results.

1. System displays a no-results message.
2. Actor may adjust or clear filters.

**Postconditions:**
Success:

* Actor views leaderboard or statistics data.

Failure:

* No leaderboard results are displayed.

**Related Functional Requirements:**

* FR-006 through FR-008
* FR-174 through FR-178

**Priority:**
Medium

---

# UC-003: Create User Account

**Primary Actor:**
Visitor

**Secondary Actors:**
System

**Goal:**
Allow a visitor to create an account.

**Brief Description:**
A visitor enters required account information and submits the registration form. The system validates the information, creates the account, assigns a unique friend code, and stores the account data.

**Preconditions:**

* Visitor is not logged in.
* Registration page is available.

**Trigger:**
Visitor selects the option to create an account.

**Main Success Scenario:**

1. Visitor opens the registration page.
2. System displays the registration form.
3. Visitor enters required account information.
4. Visitor submits the form.
5. System validates the submitted information.
6. System creates the user account.
7. System assigns the user a unique friend code.
8. System stores the account data.
9. System displays a success message or redirects the user to log in.

**Alternative Flows:**
A1. Required information is missing.

1. System identifies missing fields.
2. System displays validation errors.
3. Visitor completes the missing information and resubmits.

A2. Account information is already in use.

1. System detects duplicate account information.
2. System displays an error message.
3. Visitor may enter different information.

**Exception Flows:**
E1. Account cannot be saved.

1. System displays an error message.
2. Account is not created.

**Postconditions:**
Success:

* A new user account exists.
* A unique friend code is assigned.

Failure:

* No new account is created.

**Related Functional Requirements:**

* FR-009
* FR-014
* FR-159

**Priority:**
High

---

# UC-004: Log In

**Primary Actor:**
Registered User

**Secondary Actors:**
System

**Goal:**
Allow a registered user to access authenticated features.

**Brief Description:**
A registered user submits login credentials. The system validates the credentials and grants access to account, force, campaign, battle, and notification features.

**Preconditions:**

* User has an existing account.
* User is not currently logged in.

**Trigger:**
User selects the login option.

**Main Success Scenario:**

1. User opens the login page.
2. User enters login credentials.
3. User submits the login form.
4. System validates credentials.
5. System authenticates the user.
6. System displays authenticated navigation and available user features.

**Alternative Flows:**
A1. Invalid credentials are entered.

1. System rejects the login attempt.
2. System displays an error message.
3. User may try again.

**Postconditions:**
Success:

* User is logged in.
* User can access authenticated features.

Failure:

* User remains logged out.

**Related Functional Requirements:**

* FR-010
* FR-022
* FR-170 through FR-173

**Priority:**
High

---

# UC-005: Log Out

**Primary Actor:**
Logged-in User

**Secondary Actors:**
System

**Goal:**
Allow a logged-in user to end their authenticated session.

**Brief Description:**
A logged-in user selects the logout option. The system ends the user session and returns the user to a public or unauthenticated state.

**Preconditions:**

* User is logged in.

**Trigger:**
User selects the logout option.

**Main Success Scenario:**

1. User selects Log Out.
2. System ends the authenticated session.
3. System redirects the user or updates navigation to show logged-out options.

**Postconditions:**
Success:

* User is logged out.

Failure:

* User remains logged in if logout fails.

**Related Functional Requirements:**

* FR-011

**Priority:**
Medium

---

# UC-006: Manage User Account

**Primary Actor:**
Logged-in User

**Secondary Actors:**
System

**Goal:**
Allow a user to view and update account information.

**Brief Description:**
A logged-in user opens their account page, views current account details, and updates editable profile information.

**Preconditions:**

* User is logged in.

**Trigger:**
User selects account or profile settings.

**Main Success Scenario:**

1. User opens account settings.
2. System displays current account information.
3. User edits supported profile information.
4. User submits changes.
5. System validates the changes.
6. System saves the updated account information.
7. System displays a success message.

**Alternative Flows:**
A1. User enters invalid profile information.

1. System displays validation errors.
2. User corrects the information and resubmits.

A2. User cancels changes.

1. System discards unsaved changes.
2. System returns user to the previous account view.

**Postconditions:**
Success:

* User account information is updated.

Failure:

* Account information remains unchanged.

**Related Functional Requirements:**

* FR-012
* FR-013
* FR-159
* FR-170

**Priority:**
Medium

---

# UC-007: Add and Manage Friends

**Primary Actor:**
Logged-in User

**Secondary Actors:**
System, Other User

**Goal:**
Allow users to connect with friends for campaign invitations and social interaction.

**Brief Description:**
A user sends a friend request using another user's unique friend code. The recipient may accept, reject, or remove the friend connection later.

**Preconditions:**

* User is logged in.
* Target user has a unique friend code.

**Trigger:**
User selects the option to add a friend.

**Main Success Scenario:**

1. User opens the friends page.
2. System displays current friends and friend request options.
3. User enters another user's friend code.
4. System validates the friend code.
5. System sends a friend request to the target user.
6. Target user receives a notification.
7. Target user accepts the request.
8. System creates a friend connection.
9. System displays the updated friends list.

**Alternative Flows:**
A1. Friend code is invalid.

1. System displays an invalid-code message.
2. User may re-enter the code.

A2. Target user rejects the request.

1. System records the rejection.
2. No friend connection is created.

A3. User removes an existing friend.

1. User selects a friend to remove.
2. System removes the friend connection.

**Postconditions:**
Success:

* Friend request is sent, accepted, rejected, or removed.

Failure:

* Friend list remains unchanged.

**Related Functional Requirements:**

* FR-014 through FR-017
* FR-019
* FR-160

**Priority:**
High

---

# UC-008: View and Manage Notifications

**Primary Actor:**
Logged-in User

**Secondary Actors:**
System

**Goal:**
Allow users to see and manage notifications related to campaigns, battles, friends, objectives, Conquest turns, and account events.

**Brief Description:**
A logged-in user opens the notifications page to view campaign invitations, battle updates, confirmation requests, campaign status updates, objective changes, Conquest order alerts, and other relevant notifications.

**Preconditions:**

* User is logged in.

**Trigger:**
User opens the notifications page or notification menu.

**Main Success Scenario:**

1. User opens notifications.
2. System displays all notifications relevant to the user.
3. System visually distinguishes unread notifications from read notifications.
4. User selects a notification.
5. System displays details or navigates to the related item.
6. User marks the notification as read, clears it, archives it, or dismisses it where supported.
7. System updates notification status.

**Alternative Flows:**
A1. No notifications exist.

1. System displays an empty notification message.

A2. Notification target no longer exists or is unavailable.

1. System displays an unavailable-content message.

**Postconditions:**
Success:

* User has viewed or managed notifications.

Failure:

* Notification status remains unchanged.

**Related Functional Requirements:**

* FR-018 through FR-021
* FR-142 through FR-152
* FR-166

**Priority:**
High

---

# UC-009: Create Force

**Primary Actor:**
Logged-in User

**Secondary Actors:**
System

**Goal:**
Allow a user to create a new BattleTech force.

**Brief Description:**
A user creates a force by entering basic force information and defining optional force-building constraints such as era, BV limit, faction restrictions, unit type restrictions, technology level, and rules level.

**Preconditions:**

* User is logged in.

**Trigger:**
User selects Create Force.

**Main Success Scenario:**

1. User opens the force creation page.
2. System displays the force creation form.
3. User enters force name, faction, logo, background, BV, era, and other supported details.
4. User configures force-building constraints or selects a campaign to use as a source of constraints.
5. User submits the form.
6. System validates the force information.
7. System creates the force.
8. System stores the force data.
9. System displays the new force.

**Alternative Flows:**
A1. Required force information is missing.

1. System displays validation errors.
2. User corrects the information and resubmits.

A2. User cancels force creation.

1. System discards unsaved data.
2. System returns user to the force list.

**Postconditions:**
Success:

* New force exists and belongs to the user.

Failure:

* No force is created.

**Related Functional Requirements:**

* FR-023 through FR-026
* FR-161
* FR-170

**Priority:**
High

---

# UC-010: Add Units to Force

**Primary Actor:**
Logged-in User

**Secondary Actors:**
System

**Goal:**
Allow a user to add valid units to a force.

**Brief Description:**
A user searches or filters available units, selects units to add, and the system validates each unit against the force's constraints before adding it.

**Preconditions:**

* User is logged in.
* User has created a force.
* Force is editable.

**Trigger:**
User selects Add Unit from a force page.

**Main Success Scenario:**

1. User opens an editable force.
2. User selects Add Unit.
3. System displays searchable and filterable unit list.
4. User searches or filters available units.
5. User selects a unit.
6. System validates the unit against the force's constraints.
7. System adds the unit to the force.
8. System updates the force's unit list and relevant totals.

**Alternative Flows:**
A1. Selected unit violates force constraints.

1. System rejects the unit.
2. System explains which constraint was violated.
3. User may select another unit or adjust constraints if authorized.

A2. User attempts to edit a campaign-specific force from outside the campaign.

1. System directs the user to the campaign force view or denies the action.

**Postconditions:**
Success:

* Unit is added to the force.

Failure:

* Force remains unchanged.

**Related Functional Requirements:**

* FR-027 through FR-031
* FR-153 through FR-155
* FR-161

**Priority:**
High

---

# UC-011: Customize Force or Unit

**Primary Actor:**
Logged-in User

**Secondary Actors:**
System

**Goal:**
Allow a user to personalize a force or its units.

**Brief Description:**
A user edits supported force details or unit details such as logo, background, unit nickname, pilot name, pilot notes, status notes, and visual identifiers.

**Preconditions:**

* User is logged in.
* User owns the force or has permission to edit it.
* Force or unit is editable.

**Trigger:**
User selects Edit, Customize, or Manage Details.

**Main Success Scenario:**

1. User opens a force or unit details page.
2. System displays editable fields.
3. User modifies supported fields.
4. User submits changes.
5. System validates the changes.
6. System saves updated force or unit details.
7. System displays the updated information.

**Alternative Flows:**
A1. User attempts to edit a campaign-specific copy.

1. System limits editing to supported campaign-specific fields.
2. User may edit only allowed fields.

A2. User cancels changes.

1. System discards unsaved edits.

**Postconditions:**
Success:

* Force or unit customization is updated.

Failure:

* Force or unit remains unchanged.

**Related Functional Requirements:**

* FR-025
* FR-032
* FR-033
* FR-036
* FR-164 through FR-165
* FR-170

**Priority:**
Medium

---

# UC-012: Manage Existing Force

**Primary Actor:**
Logged-in User

**Secondary Actors:**
System

**Goal:**
Allow a user to view, update, remove units from, delete, or archive an existing original force.

**Brief Description:**
A user opens their force list, selects a force, views details, removes units, edits information, or deletes/archives the original force. Campaign-specific force copies remain preserved even if the original force is deleted.

**Preconditions:**

* User is logged in.
* User has at least one force.

**Trigger:**
User opens the force management page.

**Main Success Scenario:**

1. User opens their force list.
2. System displays forces created by the user.
3. User selects a force.
4. System displays force and unit details.
5. User chooses an available management action.
6. System validates that the action is allowed.
7. System applies the requested change.
8. System displays updated force information.

**Alternative Flows:**
A1. User removes a unit from the force.

1. User selects a unit to remove.
2. System removes the unit and updates force totals.

A2. User deletes or archives a force used as a campaign template.

1. System deletes or archives the original force.
2. System preserves any existing campaign-specific force copies.

**Postconditions:**
Success:

* Force is viewed, updated, archived, deleted, or otherwise managed.

Failure:

* Force remains unchanged.

**Related Functional Requirements:**

* FR-023
* FR-030 through FR-034
* FR-153
* FR-161
* FR-165

**Priority:**
High

---

# UC-013: Create Campaign

**Primary Actor:**
Logged-in User / Campaign Owner

**Secondary Actors:**
System

**Goal:**
Allow a user to create a campaign and become the Campaign Owner.

**Brief Description:**
A logged-in user creates a campaign, selects campaign type and settings, chooses a force to participate, and the system creates a campaign-specific copy of the force.

**Preconditions:**

* User is logged in.
* User has at least one eligible force.

**Trigger:**
User selects Create Campaign.

**Main Success Scenario:**

1. User opens campaign creation.
2. System displays campaign creation form.
3. User enters campaign name.
4. User selects campaign type.
5. User configures required campaign settings.
6. User selects one of their forces to participate.
7. System validates campaign settings and force eligibility.
8. System creates the campaign in Setup or Beginning state.
9. System creates a campaign-specific copy of the selected force.
10. System stores campaign data and campaign-specific force data.
11. System displays the campaign dashboard or setup page.

**Alternative Flows:**
A1. User has no eligible force.

1. System prevents campaign start or asks the user to create/select an eligible force.
2. User may return to force management.

A2. Campaign settings are invalid.

1. System displays validation errors.
2. User corrects the settings and resubmits.

A3. Selected campaign type has special requirements.

1. System displays additional required settings for that campaign type.
2. User completes the required settings before the campaign can begin.

**Postconditions:**
Success:

* Campaign exists.
* User is Campaign Owner.
* Campaign-specific force instance exists.
* Campaign remains in setup until required participants and forces are finalized.

Failure:

* Campaign is not created.

**Related Functional Requirements:**

* FR-037 through FR-041
* FR-046
* FR-069 through FR-078
* FR-162
* FR-165

**Priority:**
High

---

# UC-014: Invite Friends to Campaign

**Primary Actor:**
Campaign Owner

**Secondary Actors:**
System, Invited Friend

**Goal:**
Allow the Campaign Owner to invite friends to participate in a campaign.

**Brief Description:**
The Campaign Owner selects friends to invite. The system sends campaign invitation notifications to the selected users.

**Preconditions:**

* Campaign Owner is logged in.
* Campaign exists.
* Campaign is accepting invitations.
* Campaign Owner has at least one friend or searchable friend connection.

**Trigger:**
Campaign Owner selects Invite Friends.

**Main Success Scenario:**

1. Campaign Owner opens campaign invitation options.
2. System displays eligible friends.
3. Campaign Owner selects one or more friends.
4. Campaign Owner submits invitations.
5. System creates campaign invitations.
6. System sends invited users in-app notifications.
7. System may send email notifications if supported.

**Alternative Flows:**
A1. Selected user is already invited or already participating.

1. System prevents duplicate invitation.
2. System displays a message.

A2. Campaign is not accepting invitations.

1. System prevents invitation.
2. System explains the campaign status.

A3. Invited user does not have a force matching the campaign restrictions.

1. System may still allow the invitation.
2. System notifies the user that an eligible force must be created or assigned before joining is complete.

**Postconditions:**
Success:

* Invited users receive campaign invitations.

Failure:

* No new invitation is created.

**Related Functional Requirements:**

* FR-042
* FR-043
* FR-142
* FR-018 through FR-019

**Priority:**
High

---

# UC-015: Join Campaign

**Primary Actor:**
Invited User

**Secondary Actors:**
System, Campaign Owner

**Goal:**
Allow an invited user to accept or decline a campaign invitation.

**Brief Description:**
An invited user receives a campaign invitation, accepts or declines it, and if accepted selects one of their forces to join the campaign. The system creates a campaign-specific copy of the assigned force.

**Preconditions:**

* User is logged in.
* User has received a campaign invitation.

**Trigger:**
User opens a campaign invitation.

**Main Success Scenario:**

1. User opens campaign invitation notification.
2. System displays campaign invitation details.
3. User accepts the invitation.
4. System asks user to select an eligible force.
5. User selects a force.
6. System validates force eligibility.
7. System creates a campaign-specific instance of the selected force.
8. System adds user to campaign participants.
9. System notifies Campaign Owner of acceptance.

**Alternative Flows:**
A1. User declines invitation.

1. User selects Decline.
2. System records the declined invitation.
3. System notifies Campaign Owner if supported.

A2. User has no eligible force.

1. System explains that an eligible force is required.
2. User may create or modify a force before completing campaign entry.

A3. Invitation is expired or invalid.

1. System displays an invalid-invitation message.

**Postconditions:**
Success:

* User joins campaign and has a campaign-specific force instance.

Failure:

* User does not join campaign.

**Related Functional Requirements:**

* FR-044 through FR-046
* FR-143
* FR-162
* FR-165

**Priority:**
High

---

# UC-016: View Campaign Dashboard

**Primary Actor:**
Campaign Participant

**Secondary Actors:**
System

**Goal:**
Allow campaign participants to view campaign progress, status, resources, standings, objectives, turns, and major events.

**Brief Description:**
A campaign participant opens the campaign dashboard. The system displays current campaign progress, score, standings, resources, status, objectives, turn information, and important events.

**Preconditions:**

* User is logged in.
* User is a participant in the campaign or has permission to view it.

**Trigger:**
User selects a campaign from their campaign list.

**Main Success Scenario:**

1. User opens their campaign list.
2. System displays campaigns the user owns or participates in.
3. User selects a campaign.
4. System displays the campaign dashboard.
5. System shows campaign progress, score, resources, standings, current status, objectives, turn information, and major events.
6. User reviews campaign information.

**Alternative Flows:**
A1. User is not authorized to view the campaign.

1. System denies access.
2. System displays an authorization message.

A2. Campaign has been finalized.

1. System displays the finalized campaign dashboard in read-only mode.

**Postconditions:**
Success:

* User views campaign dashboard.

Failure:

* Campaign details are not shown.

**Related Functional Requirements:**

* FR-037
* FR-047 through FR-050
* FR-068
* FR-089
* FR-098
* FR-171 through FR-173

**Priority:**
High

---

# UC-017: View Campaign Forces and Units

**Primary Actor:**
Campaign Participant

**Secondary Actors:**
System

**Goal:**
Allow campaign participants to view forces and units in the campaign.

**Brief Description:**
A campaign participant views their own and other players' campaign forces, including detailed unit information, damage, kills, pilot information, repair status, actual BV, full BV, and other campaign-specific statistics.

**Preconditions:**

* User is logged in.
* User is a campaign participant or has permission to view campaign data.

**Trigger:**
User selects Forces, Units, or a player force from the campaign dashboard.

**Main Success Scenario:**

1. User opens campaign forces view.
2. System displays participating players and their campaign-specific forces.
3. User selects a force.
4. System displays units in the selected force.
5. User selects a unit.
6. System displays detailed campaign-specific unit information.

**Alternative Flows:**
A1. User attempts to view private campaign data without permission.

1. System denies access.
2. System displays an authorization message.

A2. Unit has been destroyed, captured, damaged, or unavailable.

1. System displays the unit's current status and history.

**Postconditions:**
Success:

* User views campaign force or unit information.

Failure:

* Campaign force or unit information is not displayed.

**Related Functional Requirements:**

* FR-053 through FR-054
* FR-036
* FR-132
* FR-164 through FR-165
* FR-171

**Priority:**
High

---

# UC-018: Manage Campaign Resources and Repairs

**Primary Actor:**
Campaign Owner or Authorized Campaign Participant

**Secondary Actors:**
System

**Goal:**
Allow authorized users to spend resources, repair units, and update unit statuses according to campaign rules.

**Brief Description:**
An authorized user manages campaign resources by repairing damaged units, spending resources, and updating unit statuses such as active, damaged, destroyed, captured, repaired, unavailable, or other supported statuses.

**Preconditions:**

* User is logged in.
* User is participating in the campaign.
* User has permission to manage resources or units.
* Campaign is active and not finalized.

**Trigger:**
User selects resource management, repair, or unit status management.

**Main Success Scenario:**

1. User opens campaign management options.
2. System displays current resources and eligible unit actions.
3. User selects a resource action, repair action, or unit status update.
4. System checks campaign rules and user permissions.
5. System applies the action.
6. System updates resources, unit status, and campaign records.
7. System displays updated campaign information.

**Alternative Flows:**
A1. User lacks permission.

1. System denies the action.
2. System displays an authorization message.

A2. Insufficient resources are available.

1. System prevents the action.
2. System displays an insufficient-resources message.

A3. Repair or status update violates campaign rules.

1. System prevents the action.
2. System explains the rule conflict.

**Postconditions:**
Success:

* Campaign resources, unit repair status, or unit status are updated.

Failure:

* No campaign resource or unit changes are made.

**Related Functional Requirements:**

* FR-055 through FR-058
* FR-119 through FR-128
* FR-168
* FR-170 through FR-171

**Priority:**
High

---

# UC-019: Log Battle

**Primary Actor:**
Authorized Campaign Participant

**Secondary Actors:**
System, Campaign Participants

**Goal:**
Allow an authorized user to record a battle within an active campaign.

**Brief Description:**
An authorized user creates a battle record, enters battle details, selects participating players and units, records outcome, damage, kills, destroyed or salvaged units, and submits the battle for confirmation.

**Preconditions:**

* User is logged in.
* User is authorized to log battles for the campaign.
* Campaign is active.

**Trigger:**
User selects Log Battle or Create Battle Record.

**Main Success Scenario:**

1. User opens the campaign battle section.
2. User selects Log New Battle.
3. System displays battle entry form.
4. User enters battle date and optional information such as scenario type, map, and notes.
5. User selects participating players.
6. User selects participating units.
7. User records outcome.
8. User records kills, damage, destroyed units, disabled units, captured units, or salvaged units.
9. User submits the battle record.
10. System saves the battle as pending.
11. System notifies relevant participants that the battle requires confirmation.
12. System displays how the pending battle would affect campaign standings if confirmed.

**Alternative Flows:**
A1. Required battle information is missing.

1. System displays validation errors.
2. User completes missing information and resubmits.

A2. User selects invalid participating units.

1. System displays a validation error.
2. User corrects the participating unit list.

A3. User cancels battle logging.

1. System discards unsaved battle information.

**Postconditions:**
Success:

* Pending battle record exists.
* Relevant users are notified.

Failure:

* No battle record is created.

**Related Functional Requirements:**

* FR-059 through FR-062
* FR-099 through FR-110
* FR-144 through FR-145
* FR-163

**Priority:**
High

---

# UC-020: Confirm or Dispute Battle Result

**Primary Actor:**
Authorized Campaign Participant

**Secondary Actors:**
System, Campaign Owner

**Goal:**
Allow authorized users to confirm or dispute a submitted battle result.

**Brief Description:**
After a battle is logged, relevant participants review the pending battle record. They may confirm or dispute it. Confirmed battles update campaign progress, standings, force status, unit status, kills, losses, resources, objective control, and scores.

**Preconditions:**

* User is logged in.
* User is authorized to confirm or dispute the battle.
* Battle record exists and is pending.

**Trigger:**
User opens a battle confirmation notification or pending battle record.

**Main Success Scenario:**

1. User opens the pending battle record.
2. System displays battle details and projected campaign effects.
3. User reviews the record.
4. User confirms the battle result.
5. System marks the battle as confirmed.
6. System updates campaign progress, force status, unit status, kills, losses, resources, objective control, and scores.
7. System notifies campaign participants that the battle was confirmed.

**Alternative Flows:**
A1. User disputes the battle result.

1. User selects Dispute.
2. User enters dispute reason or notes if required.
3. System marks the battle as disputed.
4. System notifies the Campaign Owner or authorized reviewers.

A2. User lacks permission to confirm or dispute.

1. System denies the action.
2. System displays an authorization message.

A3. Battle was already confirmed or disputed.

1. System displays current battle status.
2. System prevents duplicate confirmation or dispute.

**Postconditions:**
Success:

* Battle is confirmed or disputed.
* Confirmed battles update campaign data.

Failure:

* Battle remains pending.

**Related Functional Requirements:**

* FR-061 through FR-064
* FR-108 through FR-118
* FR-146
* FR-163

**Priority:**
High

---

# UC-021: View Battle History

**Primary Actor:**
Campaign Participant

**Secondary Actors:**
System

**Goal:**
Allow campaign participants to review previous battles in a campaign.

**Brief Description:**
A campaign participant opens the battle history for a campaign, views past battles, searches or filters them, and opens battle details.

**Preconditions:**

* User is logged in.
* User is a campaign participant or has permission to view campaign data.

**Trigger:**
User selects Battle History from the campaign.

**Main Success Scenario:**

1. User opens campaign battle history.
2. System displays past battles in the campaign.
3. User searches, filters, or sorts battle records.
4. User selects a battle.
5. System displays battle details, including participating forces, units destroyed, damage results, victory result, objective effects, and confirmed status.

**Alternative Flows:**
A1. No battles exist.

1. System displays an empty battle history message.

A2. User attempts to view battle history without permission.

1. System denies access.

**Postconditions:**
Success:

* User views battle history or battle details.

Failure:

* Battle history is not displayed.

**Related Functional Requirements:**

* FR-051 through FR-052
* FR-157 through FR-158
* FR-163
* FR-171

**Priority:**
Medium

---

# UC-022: Finalize Campaign

**Primary Actor:**
Campaign Owner

**Secondary Actors:**
System, Campaign Participants

**Goal:**
Allow the Campaign Owner to conclude a campaign and preserve its final results.

**Brief Description:**
The Campaign Owner finalizes an active campaign. The system prevents most further modifications, preserves final results, and allows completed campaigns to be viewed later.

**Preconditions:**

* Campaign Owner is logged in.
* Campaign exists.
* Campaign is not already finalized.

**Trigger:**
Campaign Owner selects Finalize or Conclude Campaign.

**Main Success Scenario:**

1. Campaign Owner opens campaign management.
2. Campaign Owner selects Finalize Campaign.
3. System displays confirmation and final campaign summary.
4. Campaign Owner confirms finalization.
5. System marks the campaign as finalized.
6. System prevents further modification except allowed actions such as viewing history, exporting results, or adding notes.
7. System preserves final campaign results.
8. System notifies campaign participants of campaign completion.

**Alternative Flows:**
A1. Campaign has pending or disputed battles.

1. System warns the Campaign Owner.
2. System may prevent finalization or require resolution depending on campaign rules.

A2. Campaign Owner cancels finalization.

1. System leaves campaign active.

A3. Unauthorized user attempts to finalize campaign.

1. System denies the action.

**Postconditions:**
Success:

* Campaign is finalized and preserved.

Failure:

* Campaign remains active or unchanged.

**Related Functional Requirements:**

* FR-065 through FR-068
* FR-147
* FR-176 through FR-178

**Priority:**
High

---

# UC-023: Search, Filter, and Sort Data

**Primary Actor:**
Logged-in User or Visitor, depending on data type

**Secondary Actors:**
System

**Goal:**
Allow actors to find relevant forces, units, campaigns, battles, objectives, combat teams, and leaderboard entries efficiently.

**Brief Description:**
A user searches, filters, or sorts data lists such as forces, available units, campaigns, battle history, objectives, combat teams, and leaderboards.

**Preconditions:**

* Requested data list is available.
* User has permission to view the requested data.

**Trigger:**
Actor enters a search term, selects a filter, or changes a sort option.

**Main Success Scenario:**

1. Actor opens a searchable or sortable list.
2. System displays available search, filter, or sort controls.
3. Actor enters search criteria, selects filters, or chooses sort order.
4. System applies the criteria.
5. System displays matching results.
6. Actor clears or changes criteria as needed.

**Alternative Flows:**
A1. No results match the criteria.

1. System displays a no-results message.
2. Actor may adjust search, filters, or sort options.

A2. Actor attempts to search private data without permission.

1. System denies access or hides restricted results.

**Postconditions:**
Success:

* Actor views filtered, searched, or sorted results.

Failure:

* Original list remains unchanged or no results are displayed.

**Related Functional Requirements:**

* FR-008
* FR-153 through FR-158

**Priority:**
Medium

---

# UC-024: Configure Campaign Rules

**Primary Actor:**
Campaign Owner

**Secondary Actors:**
System

**Goal:**
Allow the Campaign Owner to configure the rules and settings that define how the campaign operates.

**Brief Description:**
During campaign creation or setup, the Campaign Owner selects campaign type, scoring, era, rules level, starting resources, force BV limit, objective control type, turn settings, combat team settings, and victory conditions.

**Preconditions:**

* Campaign Owner is logged in.
* Campaign is being created or is still in setup.

**Trigger:**
Campaign Owner opens campaign rule configuration.

**Main Success Scenario:**

1. Campaign Owner selects a campaign type.
2. System displays settings relevant to that campaign type.
3. Campaign Owner configures scoring, era, rules level, resources, BV limit, faction restrictions, objective control, turn settings, and victory conditions as applicable.
4. System validates the selected rules and settings.
5. System saves the campaign settings.
6. System shows remaining setup requirements before the campaign can begin.

**Alternative Flows:**
A1. Selected settings conflict with campaign type.

1. System identifies the conflict.
2. System displays an explanation and prevents saving until corrected.

A2. Required settings are missing.

1. System displays missing settings.
2. Campaign Owner completes the settings.

A3. Campaign has already started.

1. System prevents changes to locked settings.
2. System may allow only settings explicitly marked as editable after start.

**Postconditions:**
Success:

* Campaign rules are configured and saved.

Failure:

* Campaign settings remain unchanged or incomplete.

**Related Functional Requirements:**

* FR-039 through FR-040
* FR-069 through FR-078
* FR-181 through FR-182

**Priority:**
High

---

# UC-025: Configure Campaign Objectives

**Primary Actor:**
Campaign Owner

**Secondary Actors:**
System

**Goal:**
Allow the Campaign Owner to create or select objectives for campaigns that use objectives.

**Brief Description:**
The Campaign Owner defines campaign objectives, including objective name, type, description, bonus effects, control type, and initial control rules.

**Preconditions:**

* Campaign Owner is logged in.
* Campaign is in setup or allows objective editing.
* Selected campaign type supports objectives.

**Trigger:**
Campaign Owner opens objective configuration.

**Main Success Scenario:**

1. Campaign Owner opens objective setup.
2. System displays objective configuration options.
3. Campaign Owner creates or selects objectives.
4. Campaign Owner assigns objective types and bonus effects.
5. Campaign Owner selects binary or varied control where applicable.
6. System validates objective count, objective type, and control settings.
7. System saves objectives and initial control values.
8. System displays objective summary.

**Alternative Flows:**
A1. Objective count is invalid.

1. System displays the allowed objective range.
2. Campaign Owner adjusts the number of objectives.

A2. Binary control is selected for an ineligible campaign.

1. System rejects the setting.
2. System explains that varied control is required.

A3. Objective bonus values are incomplete.

1. System highlights missing or invalid bonus data.

**Postconditions:**
Success:

* Campaign objectives are configured and stored.

Failure:

* Objective configuration remains incomplete.

**Related Functional Requirements:**

* FR-079 through FR-090
* FR-167

**Priority:**
High

---

# UC-026: View and Manage Objective Control

**Primary Actor:**
Campaign Participant

**Secondary Actors:**
System

**Goal:**
Allow campaign participants to view objective control and objective bonus ownership.

**Brief Description:**
A campaign participant views the objective control page or dashboard section to see current control percentages, binary ownership, bonus effects, and objective history.

**Preconditions:**

* User is logged in.
* User is a campaign participant or has permission to view the campaign.
* Campaign uses objectives.

**Trigger:**
User selects Objectives, Campaign Map, or Objective Control.

**Main Success Scenario:**

1. User opens objective control view.
2. System displays campaign objectives.
3. System displays each objective's type, bonus, and current control state.
4. User selects an objective.
5. System displays detailed control history and bonus ownership.

**Alternative Flows:**
A1. Campaign does not use objectives.

1. System hides objective controls or displays a not-applicable message.

A2. User lacks permission to view campaign objectives.

1. System denies access.

**Postconditions:**
Success:

* User views objective control information.

Failure:

* Objective information is not displayed.

**Related Functional Requirements:**

* FR-081 through FR-090
* FR-149
* FR-167

**Priority:**
High

---

# UC-027: Resolve Objective Control After Battle

**Primary Actor:**
System

**Secondary Actors:**
Campaign Participants

**Goal:**
Update objective control after a battle is confirmed.

**Brief Description:**
After a battle involving an objective is confirmed, the system applies the campaign's objective control rules to determine whether objective ownership or control percentages change.

**Preconditions:**

* Battle is confirmed.
* Campaign uses objectives.
* Battle result identifies the objective or objective effect.

**Trigger:**
Battle result is confirmed.

**Main Success Scenario:**

1. System identifies the objective affected by the battle.
2. System identifies winner, loser, current control state, and campaign control type.
3. System applies binary or varied control rules.
4. System prevents control values from dropping below 0% or exceeding 100%.
5. System updates objective control.
6. System updates objective bonus ownership if thresholds are met.
7. System records objective control history.
8. System notifies relevant campaign participants of the change.

**Alternative Flows:**
A1. Battle does not affect an objective.

1. System skips objective control updates.

A2. Control formula produces a zero swing.

1. System records no control change if required.
2. System leaves objective control unchanged.

A3. Battle result is later disputed or corrected.

1. System recalculates objective control if authorized correction workflow allows it.

**Postconditions:**
Success:

* Objective control and bonus ownership are updated where applicable.

Failure:

* Objective control remains unchanged.

**Related Functional Requirements:**

* FR-086 through FR-090
* FR-064
* FR-149
* FR-167

**Priority:**
High

---

# UC-028: Run Chaos Campaign Cycle

**Primary Actor:**
Campaign Participant

**Secondary Actors:**
System, Other Campaign Participants

**Goal:**
Support the basic battle-and-repair cycle of a Chaos campaign.

**Brief Description:**
Players fight battles, log results, confirm outcomes, update objective control and standings, then spend Warchest Points to repair or manage units.

**Preconditions:**

* User is logged in.
* User is participating in an active Chaos campaign.
* Campaign has started.

**Trigger:**
Players complete a battle or begin post-battle management.

**Main Success Scenario:**

1. Players fight a battle outside the system.
2. A participant logs the battle result or submits a battle record.
3. System marks the battle pending.
4. Relevant participants confirm or dispute the battle.
5. Once confirmed, system updates campaign score, objective control, unit status, and statistics.
6. User opens Chaos campaign resource management.
7. System displays Warchest Point balance and eligible actions.
8. User spends Warchest Points to repair or manage units.
9. System updates campaign resources and force status.
10. Campaign continues to the next battle.

**Alternative Flows:**
A1. Battle is disputed.

1. System prevents final campaign updates until dispute is resolved.

A2. User lacks enough Warchest Points.

1. System prevents the selected action.
2. System displays insufficient-resource message.

A3. Campaign victory condition is met.

1. System alerts participants or Campaign Owner that campaign can be finalized.

**Postconditions:**
Success:

* Chaos campaign state is updated after battle and resource spending.

Failure:

* Pending or invalid actions remain unresolved.

**Related Functional Requirements:**

* FR-069 through FR-074
* FR-096
* FR-099 through FR-118
* FR-119
* FR-122
* FR-174 through FR-178

**Priority:**
High

---

# UC-029: Run Advanced Campaign Turn

**Primary Actor:**
Campaign Participant

**Secondary Actors:**
System, Other Campaign Participants

**Goal:**
Support the battle, downtime, repair, and resource cycle of an Advanced campaign.

**Brief Description:**
An Advanced campaign participant completes a battle, confirms results, manages c-bills, selects repair priorities, resolves rearming, repair, requisition, and turn advancement.

**Preconditions:**

* User is logged in.
* User is participating in an active Advanced campaign.
* Campaign has started.

**Trigger:**
A battle is completed or the user begins downtime/turn management.

**Main Success Scenario:**

1. Players complete a battle outside the system.
2. Battle result is logged and confirmed.
3. System updates unit damage, kills, objective control, resources, and standings.
4. User opens Advanced campaign turn management.
5. System displays c-bills, turn length, repair needs, and available actions.
6. User selects repair priority and any allowed resource actions.
7. System applies campaign rules for repair, rearmament, requisition, and time usage.
8. System updates unit readiness, resources, and turn state.
9. System checks max-turns-ahead rule if enabled.
10. User advances or completes the turn.

**Alternative Flows:**
A1. User attempts to advance too far ahead.

1. System warns or prevents advancement based on campaign settings.

A2. Insufficient c-bills or time.

1. System prevents unavailable actions.
2. User chooses a different action or priority.

A3. Requisition or repair action fails or is delayed.

1. System records result according to campaign rules.
2. Unit remains partially repaired or unavailable.

**Postconditions:**
Success:

* Advanced campaign turn state, resources, and unit readiness are updated.

Failure:

* Turn remains incomplete or selected actions are not applied.

**Related Functional Requirements:**

* FR-091 through FR-098
* FR-119 through FR-128
* FR-168

**Priority:**
High

---

# UC-030: Set Up Conquest Campaign Map

**Primary Actor:**
Campaign Owner

**Secondary Actors:**
System

**Goal:**
Allow the Campaign Owner to configure the strategic map layer for a Conquest campaign.

**Brief Description:**
The Campaign Owner configures or generates the Conquest hex map, sets objective locations, hidden objective behavior, base or dropship rules, starting territory, combat team settings, and map-related victory conditions.

**Preconditions:**

* Campaign Owner is logged in.
* Campaign is a Conquest campaign.
* Campaign is in setup.

**Trigger:**
Campaign Owner opens Conquest map setup.

**Main Success Scenario:**

1. Campaign Owner opens Conquest setup.
2. System displays map configuration options.
3. Campaign Owner creates or selects a hex map.
4. Campaign Owner places or configures objectives.
5. Campaign Owner configures hidden objective behavior where applicable.
6. Campaign Owner configures starting territory and base/dropship rules.
7. Campaign Owner configures combat team rules.
8. System validates Conquest setup.
9. System saves map, objective, territory, and combat team settings.

**Alternative Flows:**
A1. Campaign has more than two players.

1. System prevents Conquest setup.
2. System explains that Conquest campaigns are restricted to two players.

A2. Map setup is incomplete.

1. System displays missing map setup requirements.

A3. Combat team settings are invalid.

1. System identifies the invalid setting.
2. Campaign Owner corrects it.

**Postconditions:**
Success:

* Conquest map and related settings are ready for campaign start.

Failure:

* Conquest map setup remains incomplete.

**Related Functional Requirements:**

* FR-072
* FR-129 through FR-132
* FR-167
* FR-169

**Priority:**
High

---

# UC-031: Assign Conquest Combat Team Orders

**Primary Actor:**
Conquest Campaign Participant

**Secondary Actors:**
System

**Goal:**
Allow each Conquest player to assign orders to their combat teams during a turn.

**Brief Description:**
During a Conquest turn, a player reviews the map and assigns one valid order to each combat team.

**Preconditions:**

* User is logged in.
* User is participating in an active Conquest campaign.
* Campaign is waiting for orders.
* User has at least one combat team.

**Trigger:**
User opens the Conquest order assignment screen.

**Main Success Scenario:**

1. User opens the Conquest map.
2. System displays combat teams, current map control, objectives, and eligible orders.
3. User selects a combat team.
4. User selects an order.
5. User selects a target hex or target context where required.
6. System validates the order.
7. User repeats order assignment for each combat team.
8. User submits or locks in orders.
9. System records submitted orders.
10. System waits for the opposing player if their orders are not yet submitted.

**Alternative Flows:**
A1. Selected order is invalid for target hex.

1. System explains the invalid condition.
2. User selects a different order or target.

A2. Combat team is unavailable.

1. System prevents active map orders for that combat team.
2. User may choose a repair, reserve, or no-action order if allowed.

A3. User attempts to change locked orders.

1. System prevents changes unless the campaign rules allow unlocking.

**Postconditions:**
Success:

* User's combat team orders are submitted for the turn.

Failure:

* Orders remain incomplete or unsubmitted.

**Related Functional Requirements:**

* FR-131 through FR-135
* FR-148
* FR-169

**Priority:**
High

---

# UC-032: Resolve Conquest Turn

**Primary Actor:**
System

**Secondary Actors:**
Conquest Campaign Participants

**Goal:**
Resolve submitted Conquest orders and update the strategic campaign state.

**Brief Description:**
After both Conquest players submit orders, the system resolves order effects, applies modifiers, determines territory changes, checks for battle triggers, creates battle records, and displays a turn resolution summary.

**Preconditions:**

* Campaign is an active Conquest campaign.
* Both players have submitted required combat team orders.

**Trigger:**
All required Conquest orders are submitted or Campaign Owner initiates resolution where allowed.

**Main Success Scenario:**

1. System locks submitted orders.
2. System validates all orders.
3. System applies order interactions and modifiers.
4. System resolves territory and objective effects according to order rules.
5. System calculates battle trigger rolls.
6. System creates pending battle records for triggered battles.
7. System updates hex control and objective control where applicable.
8. System updates repair, reserve, or support effects where applicable.
9. System records turn resolution results.
10. System displays a turn resolution summary.
11. System notifies participants of results and required battles.

**Alternative Flows:**
A1. Order conflict requires battle resolution before final map update.

1. System creates pending battle record.
2. System postpones final affected state changes until battle is confirmed.

A2. Invalid order is discovered during resolution.

1. System blocks resolution.
2. System notifies Campaign Owner or affected player.

A3. No battles are triggered.

1. System applies non-battle order results.
2. System advances to the next turn.

**Postconditions:**
Success:

* Conquest turn is resolved or pending battle records are created.

Failure:

* Turn remains unresolved.

**Related Functional Requirements:**

* FR-136 through FR-141
* FR-148 through FR-149
* FR-169

**Priority:**
High

---

# UC-033: Manage Repair, Rearmament, and Requisition

**Primary Actor:**
Campaign Participant

**Secondary Actors:**
System

**Goal:**
Allow a campaign participant to manage post-battle force recovery according to campaign type.

**Brief Description:**
The user manages repairs, rearming, requisition, resource spending, repair priorities, and unit readiness after battles or during campaign turns.

**Preconditions:**

* User is logged in.
* User is participating in a campaign that supports repair or resource management.
* Campaign is active.

**Trigger:**
User opens repair, rearmament, or requisition management.

**Main Success Scenario:**

1. User opens recovery management.
2. System displays damaged units, ammunition needs, missing components, resources, and available actions.
3. User selects repair priority or specific supported action.
4. User chooses any allowed requisition or resource spending.
5. System validates resource, time, and campaign-rule requirements.
6. System applies repair, rearmament, and requisition rules.
7. System updates resources, unit status, readiness, and repair history.
8. System displays a summary of changes.

**Alternative Flows:**
A1. Campaign type uses simplified repair.

1. System displays simplified repair options.
2. User spends the required resource to repair eligible units.

A2. Required parts are unavailable.

1. System delays or prevents repair.
2. System may create requisition need.

A3. Objective bonus applies.

1. System applies the relevant bonus to repair, stock, income, delivery, or healing.

**Postconditions:**
Success:

* Repair, rearmament, requisition, and resource state are updated.

Failure:

* Recovery state remains unchanged or partially updated according to valid actions.

**Related Functional Requirements:**

* FR-119 through FR-128
* FR-168
* FR-179 through FR-182

**Priority:**
High

---

# UC-034: Manage Auxiliary Forces

**Primary Actor:**
Conquest Campaign Participant

**Secondary Actors:**
System

**Goal:**
Allow eligible Conquest battles to use temporary auxiliary forces when enabled by campaign settings.

**Brief Description:**
When a Conquest battle has a significant BV mismatch and auxiliary forces are enabled, the system allows the disadvantaged player to select temporary auxiliary units from an approved list.

**Preconditions:**

* Campaign is an active Conquest campaign.
* Auxiliary forces are enabled.
* A battle or pending battle has an eligible BV discrepancy.

**Trigger:**
System detects eligible auxiliary force conditions or user opens battle setup.

**Main Success Scenario:**

1. System identifies a qualifying BV discrepancy.
2. System displays eligible auxiliary unit options.
3. User selects an auxiliary unit or units within allowed limits.
4. System adds auxiliary units to the battle only.
5. Battle is played and logged.
6. System removes auxiliary units after battle resolution.
7. System applies any configured penalties or restrictions if auxiliary units are destroyed or misused.

**Alternative Flows:**
A1. Auxiliary forces are disabled.

1. System does not offer auxiliary unit options.

A2. No eligible units are available.

1. System displays no available auxiliary forces.

A3. Auxiliary unit is destroyed.

1. System applies configured penalty if enabled.

**Postconditions:**
Success:

* Auxiliary units are used temporarily and removed after the battle.

Failure:

* No auxiliary force is added.

**Related Functional Requirements:**

* FR-140
* FR-179 through FR-182

**Priority:**
Low to Medium

---

# UC-035: Manage Admin Rule Constants

**Primary Actor:**
System Administrator

**Secondary Actors:**
System

**Goal:**
Allow authorized administrators to manage backend-tunable rule constants.

**Brief Description:**
A System Administrator updates global balancing values such as objective control swing values, Conquest order modifiers, battle trigger thresholds, objective bonuses, resource income, repair values, and other configurable campaign constants.

**Preconditions:**

* System Administrator is authenticated.
* Admin has permission to modify rule constants.

**Trigger:**
Administrator opens rule constant management.

**Main Success Scenario:**

1. Administrator opens rule constant management.
2. System displays configurable constants and current values.
3. Administrator edits one or more values.
4. System validates the values.
5. Administrator saves changes.
6. System stores the updated constants.
7. System preserves existing campaign-specific settings unless explicitly migrated.

**Alternative Flows:**
A1. User lacks admin permission.

1. System denies access.

A2. Edited value is invalid.

1. System displays validation errors.
2. Administrator corrects the value.

A3. Change could affect active campaigns.

1. System warns administrator.
2. Administrator chooses whether changes apply only to future campaigns or to selected campaigns through an explicit migration process.

**Postconditions:**
Success:

* Rule constants are updated and stored.

Failure:

* Rule constants remain unchanged.

**Related Functional Requirements:**

* FR-179 through FR-182

**Priority:**
Low for first implementation; High for long-term maintainability

---

# Notes on Use Case Coverage

This use case document intentionally groups related functional requirements into workflows. Not every functional requirement requires its own use case.

Data persistence, access control, notifications, and validation requirements are usually referenced within the workflows they support rather than written as separate standalone use cases.

The next revision should add a traceability matrix mapping each FR to one or more use cases.
