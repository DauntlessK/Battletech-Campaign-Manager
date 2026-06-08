# BattleTech Campaign Manager: Campaign Gameplay Manual

**Document Version:** 0.1
**Document Type:** Gameplay / Campaign Rules Manual
**Project:** BattleTech Campaign Manager

---

# 1. Introduction

## 1.1 Purpose of This Manual

This manual explains how campaigns are played using the BattleTech Campaign Manager. It describes the campaign types, campaign setup options, objective control rules, battle flow, repair and resource systems, Conquest map play, and victory conditions.

The manual is written from the player and Campaign Owner perspective. It explains how the campaign game works. The separate Software Requirements Specification explains what the software must do to support these rules.

## 1.2 What the Campaign Manager Does

The Campaign Manager helps players run persistent Classic BattleTech campaigns by tracking:

* Campaign setup and settings.
* Players and their forces.
* Campaign-specific copies of forces.
* Battles and battle results.
* Unit status, damage, kills, repairs, and availability.
* Campaign resources.
* Objective control.
* Campaign scoring and victory progress.
* Conquest map state and combat team orders.

The system does **not** play the actual tabletop battle. Players still play Classic BattleTech normally outside the application, then enter the results into the campaign system.

## 1.3 Supported Game Type

The application supports **Classic BattleTech** campaigns. It does not currently support Alpha Strike campaigns.

## 1.4 Player Roles

### Campaign Owner

The Campaign Owner creates the campaign, chooses its type and settings, invites players, manages campaign configuration, and finalizes the campaign.

### Campaign Participant

A Campaign Participant joins a campaign, assigns a force, fights battles, logs results, confirms battle outcomes, manages repairs and resources, and tracks campaign progress.

### System Administrator

A System Administrator may manage global campaign rule constants and backend balancing values. This role is mainly relevant for application maintenance and balancing.

---

# 2. Core Campaign Concepts

## 2.1 Campaign

A campaign is a linked series of battles fought with persistent forces. Damage, kills, repairs, resources, objective control, and player standings carry forward from one battle to the next.

## 2.2 Force

A force is a collection of BattleTech units and pilots created by a player. A force may have restrictions such as era, Battle Value limit, faction, rules level, unit type, or technology level.

## 2.3 Campaign-Specific Force Copy

When a player assigns a force to a campaign, the system creates a campaign-specific copy of that force. The campaign copy becomes separate from the original force.

This allows a player to delete or edit the original force without damaging campaign history. The campaign copy tracks campaign-specific unit status, damage, kills, repairs, pilot changes, and other persistent effects.

## 2.4 Unit

A unit is an individual BattleTech combat unit, such as a BattleMech. Units may track damage, destroyed components, missing limbs, ammunition status, pilot status, kills, repairs, and availability depending on campaign type.

## 2.5 Combat Team

A combat team is a subdivision of a campaign force. Combat teams are especially important in Conquest campaigns, where each combat team receives orders during each turn.

Typical combat teams include:

* Lance: usually 4 meks.
* Star: usually 5 meks.
* Company-style force: often 3 lances of 4 meks each.

## 2.6 Resources

Resources represent the player's ability to repair, reinforce, upgrade, or maintain their force.

Different campaign types use different resource systems:

* Chaos campaigns use Warchest Points or support points.
* Advanced campaigns use c-bills, time (repairs, requisition) and XP (pilot progression).
* Conquest campaigns use Advanced-style resources plus map position, combat team orders, territory, and objectives.

## 2.7 Objectives

Objectives are strategic locations or assets that players fight over. Objectives may grant bonuses to the player who controls them.

Examples include factories, depots, comms arrays, cities, forts, repair facilities, space ports, and medical facilities.

## 2.8 Battles

Battles are played outside the application using normal Classic BattleTech rules. After the battle, players log results in the campaign system.

Battle results may affect:

* Campaign score.
* Objective control.
* Unit damage.
* Unit kills.
* Resource totals.
* Repair needs.
* Salvage or capture status.
* Player standings.

## 2.9 Turns

Turns represent campaign time.

* Chaos campaigns do not use formal turns.
* Advanced campaigns may use turns to represent downtime between battles.
* Conquest campaigns use turns for map orders, combat team actions, scouting, repairs, and battle generation.

---

# 3. Campaign Setup

## 3.1 Campaign Type

The Campaign Owner chooses one of three campaign types:

1. Chaos Campaign
2. Advanced Campaign
3. Conquest Campaign

The campaign type determines the amount of campaign detail, resource tracking, repair tracking, map play, and turn structure.

## 3.2 Campaign Settings

Campaign settings may include:

* Campaign type.
* Campaign scoring method.
* Campaign era.
* Rules level.
* Starting resources.
* Force BV limit.
* Optional force affiliation or faction restrictions.
* Max turns ahead.
* Combat team rules for Conquest campaigns.
* Combat team BV limit for Conquest campaigns.
* Combat team size / max unit count for Conquest campaigns.
* Objective control type.
* Salaries enabled or disabled.
* Victory condition or conditions.

Some settings may be automatically determined by the selected campaign type.

## 3.3 Campaign Era

Campaign era restricts which forces and units are eligible. Possible eras include, but are not limited to:

* Star League
* Early Succession Wars
* Late Succession Wars
* Clan Invasion

Additional eras may be added later.

## 3.4 Rules Level

Rules level restricts which units and technologies are allowed.

Suggested rules levels:

1. Introductory
2. Standard
3. Advanced
4. Experimental (Not supported at launch)
5. Unofficial (Not supported at launch)

## 3.5 Force BV Limit

The force BV limit restricts the maximum total Battle Value allowed for a campaign force.

For Conquest campaigns, combat team BV will also matter because combat teams operate separately and will encounter enemy combat teams independently.

## 3.6 Starting Resources

Starting resources depend on campaign type:

* Chaos campaigns use Warchest Points.
* Advanced campaigns use c-bills and time-based repair capacity.
* Conquest campaigns use Advanced-style resources plus map and order systems.

## 3.7 Campaign State

A newly created campaign begins in a setup or beginning state. During setup:

* The Campaign Owner configures rules.
* Players are invited.
* Players accept or decline invitations.
* Players assign forces.
* Campaign-specific force copies are created.

The campaign should not fully begin until required setup conditions are complete.

---

# 4. Campaign Types

## 4.1 Chaos Campaign

A Chaos campaign is the simplest campaign type. It is intended for fast campaign play with minimal bookkeeping.

### Player Count

Chaos campaigns support 2 to 10 players.

### Core Features

Chaos campaigns use:

* Warchest Points or support points.
* Simplified repairs.
* Battle logging.
* Objective control where enabled.
* Campaign scoring.
* Public or private campaign progress tracking.

### Campaign Flow

A typical Chaos campaign cycle is:

1. Players fight a battle.
2. Players log battle results.
3. Results are confirmed or reconciled.
4. Campaign state updates.
5. Players spend Warchest Points to repair, buy, upgrade, or manage units.
6. Players fight the next battle.

### Repairs

Chaos campaigns do not use detailed repair time, repair odds, tech teams, part availability, or partial repairs. A unit is generally repaired by spending the required Warchest Points.

### Turns

Chaos campaigns do not use formal turns or time tracking.

## 4.2 Advanced Campaign

An Advanced campaign is a middle ground between a simple Chaos campaign and a highly detailed campaign system like MekHQ.

### Player Count

Advanced campaigns support 2 to 10 players.

### Core Features

Advanced campaigns may use:

* C-bills.
* Time or turns.
* Repair priorities.
* Part availability.
* Requisition.
* Unit attrition.
* Pilot injury and pilot progression.
* Objective control.
* Campaign scoring.

### Campaign Feel

Advanced campaigns are intended to make units feel persistent and scarred by previous battles. A unit may enter battle with missing armor, damaged structure, missing limbs, disabled weapons, injured pilots, or other consequences.

### Campaign Flow

A typical Advanced campaign cycle is:

1. Players fight a battle.
2. Players log and confirm battle results.
3. Damage, kills, resources, objective control, and standings update.
4. Players enter a downtime or turn phase.
5. Players choose repair priorities and spend resources.
6. Repairs, rearming, requisition, and recovery are resolved.
7. Players continue to the next battle or next turn.

### Max Turns Ahead

In multiplayer Advanced campaigns, some players may play more battles than others. A max-turns-ahead setting may prevent one player from advancing too far ahead of others.

If enabled, this rule limits or warns players when they are too far ahead in campaign turns.

## 4.3 Conquest Campaign

A Conquest campaign is a two-player campaign that adds a strategic map layer on top of Advanced campaign rules.

### Player Count

Conquest campaigns are restricted to 2 players.

### Core Features

Conquest campaigns use:

* Advanced-style repairs and resources.
* A hex map.
* Hidden or revealed objectives.
* Territory control.
* Combat teams.
* Orders.
* Turn resolution.
* Automatic battle generation based on orders.
* Strategic victory conditions.

### Campaign Feel

A Conquest campaign functions like a strategic board game layered over normal Classic BattleTech battles. Players maneuver combat teams, scout territory, fight over objectives, raid enemy holdings, and attempt to control the map.

### Campaign Flow

A typical Conquest turn is:

1. Each player reviews the map.
2. Each player assigns orders to combat teams.
3. Players submit or lock in orders.
4. The system resolves orders.
5. The system determines whether battles are triggered.
6. Any generated battles are played outside the application.
7. Battle results are logged and confirmed.
8. Map control, objective control, damage, resources, and campaign score update.
9. The campaign advances to the next turn.

## 4.4 Campaign Type Comparison

| Feature                |                 Chaos |      Advanced |      Conquest |
| ---------------------- | --------------------: | ------------: | ------------: |
| Player Count           |                  2-10 |          2-10 |             2 |
| Warchest Points        |                   Yes | No / Optional | No / Optional |
| C-bills                |         No / Optional |           Yes |           Yes |
| Formal Turns           |                    No |           Yes |           Yes |
| Detailed Repairs       |                    No |           Yes |           Yes |
| Requisition            | Simplified / Optional |           Yes |           Yes |
| Objective Control      |                   Yes |           Yes |           Yes |
| Hex Map                |                    No |            No |           Yes |
| Combat Team Orders     |                    No |            No |           Yes |
| Auto-Generated Battles |                    No |            No |           Yes |

---

# 5. Campaign Scoring and Victory Conditions

## 5.1 Campaign Scoring

Campaign scoring determines how players are ranked during the campaign and how a winner is determined.

Campaign type determines how much force management is involved. Campaign scoring determines what success means.

## 5.2 Supported Victory Conditions

Possible victory conditions include:

* Total number of battles.
* Surrender or automatic capitulation based on remaining BV or resources.
* Domination through control of objectives.
* Control of key objectives.
* Finding and eliminating the enemy base or dropship.
* Time or turns elapsed.
* Control of a percentage of the map.

## 5.3 Total Battles

A campaign may end after a configured number of battles.

This condition is usable in Chaos, Advanced, and Conquest campaigns.

## 5.4 Surrender or Automatic Capitulation

A player may lose if their remaining force, resources, or campaign position falls below a configured threshold.

Examples:

* Remaining usable BV is too low.
* Warchest Points are exhausted.
* C-bills are exhausted.
* A force cannot field a viable combat group.

## 5.5 Domination

In Chaos and Advanced campaigns, domination may occur when one player controls a configured percentage of the campaign objectives or campaign area.

A common placeholder value is 75%, but this should remain configurable.

## 5.6 Conquest Objective Victory

In Conquest campaigns, victory may depend on controlling key objectives across the map.

## 5.7 Base or Dropship Elimination

In Conquest campaigns, victory may occur if a player finds and eliminates the enemy force's base, headquarters, or dropship.

## 5.8 Time or Turn Limit

Advanced and Conquest campaigns may end after a configured number of turns or days.

## 5.9 Hex Control Victory

Conquest campaigns may allow victory when a player controls a configured percentage of the map, such as 75% of map hexes.

---

# 6. Objectives and Control

## 6.1 Objective Overview

Objectives represent key locations of strategic value. Players fight over objectives to gain points, bonuses, resources, or strategic advantages.

In Chaos and Advanced campaigns, the Campaign Owner usually creates between 2 and 10 objectives. In Conquest campaigns, objectives exist on the hex map and may begin hidden.

## 6.2 Objective Types

Supported objective types may include:

| Objective Type   | Effect                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Factory          | +1 bonus for requisition rolls.                                                                    |
| Depot            | +1 bonus for stock rolls.                                                                          |
| Comms Array      | Improves hex gain rolls in Conquest; may grant bonus objective control gains in Chaos or Advanced. |
| City             | Provides c-bill income per turn, or Warchest income in Chaos.                                      |
| Fort Holding     | Provides defensive bonuses and c-bill income.                                                      |
| Repair Facility  | +1 bonus to repair rolls when repairs are performed at a facility.                                 |
| Space Port       | +1 bonus for delivery time rolls.                                                                  |
| Medical Facility | +1 bonus for healing rolls.                                                                        |

City and fort income values should be treated as balancing values and may need adjustment based on campaign resource scale.

## 6.3 Objective Bonus Ownership

In Chaos and Advanced campaigns, the player with the most control over an objective receives that objective's bonus.

In Conquest campaigns, objective bonuses may depend on map ownership, raids, order resolution, or other Conquest-specific rules.

## 6.4 Binary Control

Binary control means an objective is controlled completely by one player or by no player.

Possible binary states:

* Player A controls the objective.
* Player B controls the objective.
* The objective is neutral or uncontrolled.

Binary control is only suitable for eligible two-player campaigns.

When an attacker wins a battle over a binary objective, the attacker may gain control. When a defender wins, the defender usually retains control.

## 6.5 Varied Control

Varied control means each player may hold a percentage of control over an objective.

At the start of a varied-control campaign, control is divided equally among players.

Example:

* 4-player campaign.
* Each objective begins with each player at 25% control.

When two players battle over an objective, the winner may gain some of the loser's control percentage.

## 6.6 Control Gain and Loss

In varied control, control changes are zero-sum between the winner and loser.

The winner gains the same amount of control that the loser loses.

Control cannot go below 0% or above 100%.

## 6.7 Varied Control Swing Formula

The suggested formula is:

```txt
actualSwing = min(rawSwing, loserCurrentControl, 100 - winnerCurrentControl)
```

Where:

```txt
rawSwing = baseSwing
  * playerCountFactor
  * objectiveCountFactor
  * holderConcentrationFactor
  * stakeContestFactor
```

### baseSwing

The default base swing begins at 10 percentage points.

### playerCountFactor

```txt
playerCountFactor = Math.pow(4 / playerCount, 0.5)
```

More players means each player begins with a smaller share, so swings should generally be smaller.

### objectiveCountFactor

```txt
objectiveCountFactor = Math.pow(objectiveCount / 5, 0.5)
```

More objectives means players may need larger swings for the campaign to progress at a satisfying pace.

### holderConcentrationFactor

```txt
holderConcentrationFactor = 1 + holderConcentrationWeight * ((playerCount - holdersOnObjective) / (playerCount - 1))
```

This accounts for how concentrated control is. If many players hold part of the objective, swings should be smaller. If only a few players hold control, battles over the objective matter more.

Default holder concentration weight begins at 0.65.

### stakeContestFactor

```txt
if attackerHasControl && defenderHasControl:
    stakeContestFactor = 1.10
else if exactly one player has control:
    stakeContestFactor = 0.85
else:
    stakeContestFactor = 0
```

If neither player has control, no control changes hands.

## 6.8 Open Naming Question

The term "varied control" is temporary. Possible alternatives:

* Percentage Control
* Shared Control
* Influence Control
* Proportional Control
* Contested Control

## 6.9 Hidden Caches

These hexes grant a one-time bonus injection of c-bills / warchest points as a sort of "cache" that was found on the map when one player gains control of a neutral hex. There would need to be settings to enable and disable this, and a setting to allow the player creating the campaign to configure how many to randomly spawn onto the map. Also include messaging notifying everyone when one was found.

---

# 7. Battle Flow

## 7.1 Battle Selection

A battle may be selected manually by players or generated by campaign rules.

Examples:

* Players agree to fight over a specific objective.
* A Campaign Owner creates a battle.
* Conquest order resolution generates a battle automatically.

## 7.2 Battle Setup

Battle setup may include:

* Participating players.
* Participating forces.
* Participating units.
* Objective or map location.
* Scenario type.
* Map notes.
* Special campaign conditions.

## 7.3 Playing the Battle

Players play the battle outside the application using normal Classic BattleTech rules.

## 7.4 Logging Results

After the battle, players enter results into the campaign system.

Battle logs may include:

* Winner, loser, or draw.
* Objective result.
* Participating units.
* Unit kills.
* Unit damage.
* Destroyed units.
* Disabled units.
* Captured units.
* Salvaged units.
* Battle notes or battle report.

## 7.5 Battle Confirmation

Battle results remain pending until confirmed.

A confirmed battle updates campaign state.

A disputed battle requires review by the Campaign Owner or authorized users.

## 7.6 Dual Submission and Reconciliation

Some campaign modes may require both players to submit battle results.

In this model:

1. Player A submits battle results.
2. Player B submits battle results.
3. The system compares the submissions.
4. Matching fields are accepted.
5. Conflicting fields are flagged.
6. The battle is confirmed, corrected, or disputed.

This model is useful for reducing inaccurate or bogus battle results.

## 7.7 Pending Battle Effects

The system may show how a pending battle would affect the campaign if confirmed.

These projected effects should not become final until the battle is confirmed.

---

# 8. Battle Results and Campaign Effects

## 8.1 Confirmed Battle Effects

A confirmed battle may update:

* Campaign score.
* Player standings.
* Objective control.
* Hex control.
* Unit damage.
* Unit kills.
* Unit destruction.
* Salvage and capture status.
* Repair needs.
* Resource income or loss.
* Victory progress.

## 8.2 Unit Kills

Unit kills track which units destroyed enemy units. Kills may contribute to player, unit, force, faction, or leaderboard statistics.

## 8.3 Unit Damage

Damage tracking depends on campaign type.

* Chaos campaigns may track simple damaged/repaired states.
* Advanced campaigns may track detailed missing armor, structure, weapons, limbs, and components.
* Conquest campaigns may use Advanced-style damage tracking.

## 8.4 Destroyed Units

Destroyed units may be removed, marked destroyed, salvaged, captured, or replaced depending on campaign rules.

A campaign setting may be required be required that reduces the quality of any unit that is considered destroyed. By default this should probably be off, and quality reductions should only affect units changing hands.

## 8.5 Disabled Units

Disabled units are no longer combat-effective during or after a battle but may be repairable.

## 8.6 Captured Units

Captured units may become available for salvage, ransom, repair, or other campaign-specific handling. Note that any unit that is captured (changes hands) receive a quality rating loss, going down one level, making it more difficult for the new owner to bring back up to fully repaired.

## 8.7 Salvaged Units

Salvage rules determine whether a player can recover destroyed, disabled, or abandoned units after battle.

## 8.8 Battle Notes

Players may add notes or a battle report summary to preserve narrative details.

---

# 9. Resources, Repairs, Rearmament, and Requisition

## 9.1 Overview

Repair and resource rules determine how difficult it is for players to keep a force operational over time.

The level of detail depends on campaign type.

Reference: 

* Cam-Ops (pgs 188+) on repair rolls, unit/faction quality, tech roll targets, and the important maintenance, repair and salvage check modifiers table.
* Strat-ops for availability and requisition

## 9.2 Chaos Resources

Chaos campaigns use Warchest Points or support points.

Players spend these points to:

* Repair units.
* Rearm units.
* Buy or replace units.
* Promote or upgrade units.
* Manage campaign effects.

Chaos campaigns do not use detailed repair rolls, repair time, requisition delays, individual tech teams, or partial repairs unless a campaign-specific variant adds them.

## 9.3 Advanced Resources

Advanced campaigns use c-bills and time.

Players must manage:

* Money.
* Repair time.
* Part availability.
* Requisition.
* Unit readiness.
* Pilot status.

## 9.4 Conquest Resources

Conquest campaigns use Advanced-style resource rules plus:

* Map location.
* Combat team orders.
* Facility access.
* Field repair versus facility repair.
* Territorial bonuses.

## 9.5 Rearming

Rearming is required for units that use ammunition.

Ammunition is assumed to be available in sufficient quantity unless the campaign uses a stricter optional rule.

The campaign system treats rearming as the process of actually reloading the unit.

The rearm time table in strategic ops details time required.

## 9.6 Repair Priorities

In Advanced and Conquest campaigns, players choose a broad repair priority rather than manually ordering every repair attempt. These priorities give a sense of where to spend the tech's precious time first. All repair priorities will favor reloading first, then any sort of repairs second.

The general repair priority is the de facto ordering. If another priority is chosen, that particular repair type is moved from its normal ordering to the top, retaining the rest of the order.

Possible repair priorities:

### General Repair Priority

The tech force chooses repairs using a general flow:

1. Rearm all units.
2. Repair or replace missing legs.
3. Repair gyros & engines.
4. Repair or replace missing arms.
5. Repair or replace weapons.
6. Repair broken equipment / components.
7. Repair armor.
8. Repair structure.

### Armor and Structure Priority

Prioritizes restoring armor and internal structure across the force.

### Limbs and Components Priority

Prioritizes major repair jobs such as limb replacement and component replacement.

### Weapons Priority

Prioritizes replacing or repairing weapons first, then armor.

### Repair, Scrounge, and Salvage Priority

Uses general repairs while increasing emphasis on acquiring parts or salvage. Less total time may be devoted to direct repair work.

## 9.7 Chaos Repair

Chaos repair is simplified.

A player spends the required Warchest Points, and the unit is fully repaired. There are no partial repairs, repair priorities, repair rolls, or tech assignment details by default.

## 9.8 Advanced Repair

Advanced repair uses time, c-bills, repair priorities, and part availability.

Players do not need to micromanage every individual repair attempt. Instead, they choose broad repair policies and the system resolves repairs according to campaign rules.

## 9.9 Conquest Repair

Conquest repair depends on the combat team's order and location.

Repair-related orders include:

* Field Repair and Rearm.
* Facility Repairs.
* Reserve.

Field repair may be faster to access but less effective or riskier. Facility repairs are safer and more comprehensive but may remove the combat team from map-related action.

## 9.10 Repair Rolls

As described within campaign ops rulebook, the roll required to make a successful repair is first determined by the repair team's experience [Support Personnel Experience Table]. A regular (default) experience team of techs needs a 6+ to perform a given repair. Two modifiers are applied to that (and more may be applied based on bonuses in campaign etc):

* Tech Rating Modifier: Modifies the result based on the complexity of the part being repaired. Simple parts will be easier while fusion engines, etc are complicated.
* Unit Quality Modifier: Modifies the result based on how well-kept the unit is (typically would be the equipment in question but not going that granular). So based on the faction, each unit is given a quality, which will affect the ease of repair. A mercenary will have a harder time repairing their unit compared to a Comstar line unit. Note these overlap a bit with the era modifiers (optional) table.

## 9.10 Repair & Req Order of Operations

Order of operations:
1) Check if repair in question is against a repair that is currently awaiting a part. If it is, check to see if part arrived. If it has not arrived, skip this repair. If it has arrived or the repair is not matched with a repair waiting a part, move to step 2.
2) Attempt to repair - if item cannot be repaired (due to unsuccessful attempts, or too complex, etc), proceed to next step.
3) Stock roll - First check if there are any waiting deliveries against that specific item. If there are deliveries awaiting, then immediately move to next step. Otherwise, roll to see if the item in question is in stock. (2d6 against rarity roll with modifier based on force faction, or by default a -1 roll mod). If not in stock proceed to next step. If it is in stock, go back to step 1.
4) Requisition roll - Esentially another roll for req. (2d6 against rarity roll)- if req is successful, move to next step. Otherwise fails and must wait to req item next turn.
5) Delivery time roll - System rolls for delivery time. (2D6 delivery time roll, optional mods based on location of campaign). Add item to delivery queue.

## 9.10 Stockpiles

The unit is assumed to have brought enough ammo for the campaign so no stocks for ammunition of any type is required. But for parts (weapons, limbs and components (mek leg, jump jet, etc)), there is first an intial roll to see if the unit happens to have it in stock. This will vary depending on the unit and the part.

Every part will have a rarity which represents the ease at which it can be made or found. This is between A and F. If not known, it is default C. This is also how likely the unit is to stock a given item.

2D6 rolls against rarity:
A items requires a 2+, B items requires 3+ C requires 4+, D requires 8+, E requires 10+, and F requires 11+
Should be able to configure and tweak these as needed.

A small modifier is applied to stock rolls based on the faction of the force, or by default, a -1 roll mod.

## 9.11 Requisition & Delivery Time

Requisition is the process of acquiring parts, components, replacement units, or other needed resources.

Requisition may be affected by:

* Faction.
* Era.
* Availability rating.
* Objective bonuses.
* Campaign settings.

Each turn, a force as a whole may make 2 requisition rolls. Additional rolls may be added from orders. This should be a configurable option on the back end only.

2D6 rolls against rarity:
A items requires a 4+, B items requires 5+ C requires 7+, D requires 9+, E requires 10+, and F requires 11+
Should be able to configure and tweak these as needed.

2D6 rolls for delivery time depends on rarity:
A items: (6+) This turn (available for immediate repairs), (4-5) Next turn, (2-3) 2 Turns
B items: (7+) This turn, (4-5) next turn, (2-3) 2 Turns
C items: (7+) This turn, (5-6) next turn, (3-4) 2 Turns, (2) 3 turns
D items: (8+) This turn,  (6-7) next turn, (4-5) 2 turns, (2-3) 3 turns
E items: (10+) this turn, (7-9) next turn, (5-6) 2 turns, (3-4) 3 turns, (2) 4 turns
F items: (11+) this turn, (9-10) next turn, (7-8) 2 turns, (5-6) 3 turns, (2-4) 4 turns

For delivery time, an optional rule can be included to add a mod to the delivery roll. Certain planets may be easier to acquire items from locally, while others might be complete backwater peripherey planets making it more difficult.

A delivery queue must be maintained for each force that specifies a unit and repair job so that a delivery is matched with its req'd repair. This is to prevent one unit losing a large laser, having one shipped in 2 turns, then the following turn, another unit also needing to req a large laser and not suddenly finding that large laser in stock but also when the first one is delivered, it is assigned to the correct repair. 

## 9.12 Tech, Quality and Availability Ratings

Tech Rating represents complexity and repair difficulty. Each part of a unit will have a complexity A-F and the cam-ops table for tech rating modifiers determines how much harder or easier a repair job is.

Availability Rating represents how easy or difficult equipment is to acquire in a given era.

Quality represents the state of a unit or part in its current condition, which reflects things like ease of maintenance (which isn't in the app) and ease of repair. Individual component quality is not planned to be modelled within the app (though could potentially be a post-launch goal), so all units are assigned a quality based on the faction of their originating force. Note that captured units have a reduction in quality.

Quality of a force's unit is determined by the Faction Quality table found in cam-ops.

*** The project may reverse or re-label ratings for clarity if needed, but should remain internally consistent. "A" should always represent the best / well-maintained / highest tech / advanced.

## 9.13 Repair Settings

Once a turn is complete and repairs are to be performed, the system runs through all necessary repairs and queues them. While queuing these repairs, it must rank them and queue them properly, based on priority (As set by the player)- So if mid-way through repairs, the system finds a limb that must be replaced, it moves to the front of the queue.

Once the system has a list of repairs, it must calculate repair time for all repairs (based on master repair chart found in strategic ops).

On the backend, there will be a few settings that can be tweaked: 

1) Time Repair Threshold - a time limit that, exceeding this even with other factors considered, means the part is effectively broken and must be replaced.
2) Max Roll Threshold - a threshold that if the likelihood for sucesss on a repair is greater than, it automatically triggers a requisition rather than wasting time repairing. Example: if the MR Threshold is 12, it doesn't bother attempting to repair anything that requires a roll of 12 or higher.
3) Extra Time Threshold - A threshold that if the roll for success is greater than it, it will automatically trigger extra time for repairing that component- giving a bit more odds to success. Example: if the ET Threshold is set to 8, any repair requiring 8 or higher will trigger extra time automatically, giving a +1 mod while using double the time to repair.
4) Max Repair Attempts - # of attempts at repairing the same part before the part is considered broken and must be replaced. Default will be 2. So if you fail the repair roll twice, the part needs to be replaced.
5) Extra Time After Fail Toggle - This may also end up being an option that players can choose between, either way, this boolean, if true, will set the tech team to use double time to repair the second attempt, with a +1 roll modifier. A 2 always results in failure (As detailed)

## 9.14 Repair Process / Queue

The process of the system after all settings and player selection have been made is detailed here.

The system first must enqueue all repairs based on priority. As each priority above dictates, a long list of repairs is established. It then calculates the time necessary for each repair in minutes. Then it runs through each of the repairs and applies the above settings to each, first determining if the time required for the repair is too high or the max thresholds mean that it's too difficult to make this repair. If for one reason or another that is the case, OR the

## 9.15 Performing the Repair

Repair rolls and modifiers are detailed in in cam-ops

## 9.16 XP

XP is earned by pilots in advanced and conquest campaigns. This system will require tweaking even post-launch with settings like:

1 XP for surviving a battle
1 XP for each kill

## 9.17 XP Expenditures

XP for pilots can be spent on improving the pilot's gunnery or piloting skill as well as a specific list of abilities that will be selected specifically for the campaign manager app from the Cam Ops rulebook (pg 71-72). Backend values for tweaking XP costs will allow tweaking post-launch.

Overall the cost for improving pilots gunnery / piloting skill should be higher than expected, especially in Conquest, as improvements affect the unit's BV, which in turn will probably throw off combat team balance.

---

# 10. Turns and Time

## 10.1 Chaos Campaigns

Chaos campaigns do not use formal turns.

Players fight battles and spend Warchest Points between battles.

## 10.2 Advanced Campaigns

Advanced campaigns may use turns to represent the time between battles.

A turn may represent a configured number of days, usually between 1 and 5 days.

During a turn, players may:

* Repair units.
* Rearm units.
* Requisition parts.
* Spend resources.
* Recover pilots.
* Prepare for future battles.

## 10.3 Conquest Campaigns

Conquest campaigns use turns for strategic map play.

A turn may represent a configured number of days, usually between 1 and 5 days.

Each turn:

1. Players assign orders to combat teams.
2. Orders are resolved.
3. Battles may be generated.
4. Repairs or other support actions may occur.
5. The map and campaign state update.

## 10.4 Max Turns Ahead

In multiplayer campaigns, the Campaign Owner may enable a max-turns-ahead rule.

This prevents one player from advancing too far ahead of another player who has played fewer battles or turns.

## 10.5 Repair Time

Based on the preset turn length for a campaign, the repair time is calculated based on tech team size. Tech team size is a backend setting that can be adjusted / tweaked as necessary.

There should be two options that may or may not be selectable at campaign setup that dictate how tech team's time is split. For launch it should be a backend property only.

Repair Time Setting:

1) Total Tech Time only - This is the simpler option - all techs time is pooled into one pool and then repairs are made against the entire pool. The total repair time is calculated from all techs (tech team size) * 480 min (8 hours) * days in a turn.
2) Tech teams - Each unit, to a maximum of the original force strength, has its own tech team, and therefor has its own pool of repair time. The system runs through repairs once, then totals the remaining time as a total of the unused time across all teams. This number is halved. Then any remaining repairs can be carried out using leftover time. Note that if the player has extra units above his/her starting strength, units that aren't in a combat force must use leftover time.

---

# 11. Conquest Campaign Map Rules

## 11.1 Map Overview

A Conquest campaign uses a hex map. The map may represent a planet, region, continent, or theater of war.

Hexes may be:

* Neutral.
* Controlled by Player A.
* Controlled by Player B.
* Objective hexes.
* Hidden objective hexes.
* Base or dropship hexes.

## 11.2 Hex Control

Players gain or lose control of hexes through orders, battles, and objective control rules.

## 11.3 Hidden Objectives

Conquest campaigns may begin with objectives hidden across the map.

Players may need to scout, patrol, or seize territory to discover them.

## 11.4 Combat Teams

Each player organizes their campaign force into combat teams. Each combat team acts as a separate strategic unit on the Conquest map.

Combat teams should ideally have comparable BV limits because any combat team may encounter an enemy combat team.

## 11.5 Full BV and Actual BV

Combat teams may track two BV values:

* **Full BV:** The combat team's value if all units are fully repaired and operational.
* **Actual BV:** The combat team's current value after damage, missing components, disabled weapons, or other readiness issues.

## 11.6 Order Submission

Each combat team receives one order per turn.

Players submit or lock in orders. Once both players have submitted orders, the system resolves the turn.

## 11.7 Order Modifiers

Some orders support friendly actions, while others interfere with enemy actions.

Order bonuses of the same type do not stack unless a specific campaign rule says otherwise.

---

# 12. Conquest Orders

## 12.1 Seize Territory

### Target

A non-owned hex that is not an objective hex and is not neighboring an objective hex.

### Purpose

Seize Territory is used to grab new territory, open new fronts, and potentially gain nearby hexes.

### Basic Rule

If the target hex is uncontrolled, success occurs on a 2D6 roll of 8+.

If the target hex is enemy-controlled, apply a -1 modifier.

### Additional Hexes

After success, roll for additional hex gains:

* 10+ gains 2 extra hexes.
* 8+ gains 1 extra hex.

Gained hexes prioritize neutral hexes first, then enemy hexes.

### Interactions

Enemy Recon orders within range may reduce the chance of success. Enemy Patrol orders within range may increase the chance of a battle.

### Battle Trigger

Seize Territory has a higher-than-normal chance to trigger battle. A battle may trigger by default on 8+. If the seizing player loses the triggered battle, no territory is gained.

## 12.2 Attack Objective

### Target

An objective hex not controlled by the attacking player.

### Purpose

Attack Objective is the main method of gaining control of objective hexes.

### Basic Rule

The attacker must control at least one adjacent hex. Hexes gained earlier in the same turn do not count toward this requirement.

### Resolution

If the objective is contested and uncontrolled, a battle is triggered and the winner gains control.

If the objective is controlled, a roll of 9+ is required to trigger a battle for control. Each additional adjacent hex controlled by the attacker may improve the roll.

If the objective is uncontrolled and uncontested, a roll of 4+ may give the attacker control.

### Interactions

Enemy Defend orders may apply negative modifiers. Defender control of multiple adjacent hexes may also make the attack more difficult.

## 12.3 Patrol

### Target

An owned hex bordering enemy or neutral territory.

### Purpose

Patrol is used to expand from controlled territory and search for enemy activity.

### Basic Rule

For each eligible neighboring hex, a 2D6 roll of 7+ gains control of that hex.

Each newly gained hex may generate a bonus hex on a roll of 10+.

### Interactions

Enemy Patrols within range may apply penalties to hex gain rolls and bonus hex rolls.

### Battle Trigger

If an enemy Patrol is within range, a battle may trigger. Closer patrols increase the chance of battle.

## 12.4 Recon

### Target

A hex where a friendly Seize Territory, Attack Objective, or Patrol order is already occurring.

### Purpose

Recon supports offensive actions by improving the odds of success or reducing enemy interference.

### Effects

Recon may provide:

* Bonus to Seize Territory initial hex roll.
* Bonus to Attack Objective roll.
* Bonus to Patrol bonus hex rolls.
* Negation or reduction of enemy patrol penalties.

### Battle Trigger

Recon does not normally trigger battles by itself.

## 12.5 Raid

### Target

An enemy-controlled objective hex.

### Purpose

Raid attempts to deny or steal an enemy objective bonus for a turn.

### Basic Rule

A roll of 9+ denies the objective bonus.

A roll of 11 or 12 may steal the bonus for the raiding player.

### Objective Effects

Factories, depots, comms arrays, and space ports may grant their bonus to the raiding player for the following turn.

Cities and forts may provide a one-time c-bill bonus equal to half their normal income.

Other objective types may only have their bonus denied.

### Interactions

Enemy Defend orders may reduce the chance of raid success or increase the chance of battle.

## 12.6 Defend

### Target

A selected hex and nearby surrounding hexes.

### Purpose

Defend makes it more difficult for enemies to seize territory, attack objectives, raid objectives, or patrol nearby.

### Effects

Defend may apply negative modifiers to:

* Seize Territory.
* Attack Objective.
* Patrol.
* Raid.

Defend may also increase the chance that enemy actions trigger battle.

## 12.7 Field Repair and Rearm

### Target

An owned hex.

### Purpose

The combat team performs improvised repairs and rearming while still providing some defensive presence on the map.

### Effects

Field Repair and Rearm may:

* Allow basic repairs.
* Allow rearming.
* Provide limited defensive effects nearby.
* Carry some risk of ambush.

### Battle Trigger

Enemy actions nearby may trigger a battle against the repairing force.

## 12.8 Facility Repairs

### Target

Off-map or eligible facility location.

### Purpose

The combat team performs more comprehensive repairs and is not considered available for combat or map-related actions.

### Effects

Facility Repairs are safer and more complete than field repairs but remove the combat team from strategic activity for the turn.

## 12.9 Reserve

### Target

Off-map reserve status.

### Purpose

The combat team remains out of map-related action.

Reserve is useful for heavily damaged units, injured pilots, or forces waiting for parts.

### Effects

Reserve combat teams do not help hold or gain hexes.

A reserve combat team may be eligible to swap into a battle once per turn on a successful roll, such as 7+.

---

# 13. Auxiliary Forces

## 13.1 Purpose

Auxiliary forces may be an optional Conquest rule used to balance battles when one combat team has a significant BV disadvantage.

## 13.2 Eligibility

Auxiliary forces may be allowed when the BV difference between opposing combat teams exceeds a configured threshold, such as 400 BV.

## 13.3 Unit Selection

Auxiliary units should be selected from an approved list, usually light or medium meks.

## 13.4 Campaign Status

Auxiliary units are temporary. They are not considered part of the player's campaign force and are removed after the battle.

## 13.5 Balancing Concern

Because auxiliary units are temporary, players may be tempted to use them recklessly. Possible balancing options include:

* Forced withdrawal rules.
* C-bill penalty if the auxiliary unit is destroyed.
* Reputation penalty.
* Pilot loss penalty.
* Reduced salvage rights.

---

# 14. Campaign Finalization

## 14.1 Finalizing a Campaign

The Campaign Owner may finalize or conclude a campaign when victory conditions are met or the group agrees to end the campaign.

## 14.2 Final Campaign State

Once finalized, the campaign should become mostly read-only.

Players should still be able to view:

* Final standings.
* Battle history.
* Unit history.
* Objective history.
* Leaderboard-eligible results.

## 14.3 Pending or Disputed Battles

If a campaign has pending or disputed battles, the system should warn the Campaign Owner before finalization.

Depending on settings, finalization may be blocked until unresolved battles are confirmed or dismissed.

---

# 15. Leaderboards and Statistics

## 15.1 Leaderboard Eligibility

Public leaderboard statistics should generally use confirmed battle data from completed campaigns.

This helps prevent bogus or incomplete campaign data from affecting global statistics.

## 15.2 Possible Leaderboard Categories

Possible categories include:

* Best player.
* Best unit.
* Most kills.
* Most battles played.
* Most successful faction.
* Most destroyed meks.
* Famous units.
* Popular units.
* Completed campaigns.

## 15.3 Public-Safe Data

Leaderboards should show public-safe summaries without exposing private campaign details.

---

# 16. Example Campaign Flows

## 16.1 Example Chaos Campaign Cycle

1. Campaign Owner creates a Chaos campaign.
2. Players join and assign forces.
3. Players fight a battle.
4. Players submit results.
5. Battle is confirmed.
6. Objective control and score update.
7. Players spend Warchest Points to repair.
8. Players continue to the next battle.

## 16.2 Example Advanced Campaign Turn

1. Players fight a battle.
2. Battle results are logged and confirmed.
3. Unit damage and resources update.
4. Player selects repair priority.
5. System resolves repair, rearming, and requisition effects.
6. Player advances to the next turn or battle.

## 16.3 Example Conquest Turn

1. Both players review the hex map.
2. Each player assigns one order to each combat team.
3. Both players submit orders.
4. System resolves order interactions.
5. System checks for territory changes and battle triggers.
6. Generated battles are played.
7. Battle results are logged and confirmed.
8. Hex control, objective control, damage, resources, and score update.
9. Next turn begins.

## 16.4 Example Varied Objective Control

A 4-player campaign begins with each player controlling 25% of every objective.

Player A defeats Player B over a factory.

The system calculates a control swing. If the actual swing is 8 percentage points:

* Player A gains 8% control.
* Player B loses 8% control.
* Other players remain unchanged.

The objective now shows:

* Player A: 33%
* Player B: 17%
* Player C: 25%
* Player D: 25%

---

# 17. Open Rule Questions and Balancing Notes

## 17.1 Objective Control Naming

The term "varied control" should be replaced with a clearer final name.

Possible names:

* Percentage Control
* Shared Control
* Influence Control
* Proportional Control
* Contested Control

## 17.2 Objective Income Scaling

City and fort income values need balancing. Income may need to scale based on starting c-bills, Warchest Points, turn length, or campaign size.

## 17.3 Control Swing Values

The default control swing formula should be tested with different player counts and objective counts.

Values likely to tune:

* baseSwing
* holderConcentrationWeight
* objectiveCountFactor
* stakeContestFactor

## 17.4 Conquest Order Resolution

The final order of operations for Conquest turn resolution needs to be finalized.

Important questions:

* Which orders resolve first?
* When are battles generated?
* Do territory changes occur before or after battles?
* How do simultaneous orders interact?
* How are conflicts resolved if multiple orders affect the same hex?

## 17.5 Auxiliary Force Penalties

Auxiliary forces may need penalties if destroyed or abused.

Possible penalty types:

* C-bill cost.
* Reputation loss.
* Reduced future auxiliary access.
* No salvage rights.

## 17.6 First Implementation Scope

Not all rules need to be implemented immediately.

Recommended first implementation priority:

1. Accounts, friends, forces, campaigns.
2. Basic battle logging and confirmation.
3. Chaos campaign flow.
4. Objective control.
5. Advanced repairs/resources.
6. Conquest map and orders.
7. Advanced balancing and admin constants.

## 17.7 Gaining Units, Swapping units and Force Size within Conquest

A major issue to be resolved is if a player gains a new unit (through salvage or purchase) - how do we handle it? Allowing the player to gain enough units to create another combat force is potentially far too great of an advantage and its probably best to hand wave this as "not enough support personnel and not able to hire effective pilots" etc.

It seems like, first is to forbid purchasing units or pilots as "spares" - you can only do that if you are short a unit or pilot (because you lost one, or a pilot was KIA)

Second- swapping units in and out (if you manage to capture an enemy mek for example) causes several issues - mainly in terms of maintaining combat team balance.

We should probably institute a penalty to discourage unit and pilot swapping- to represent that pilots are used to their machines in particular, and combat teams have trained together for a long time and making changes in the middle of a campaign would provide several challenges.

Possible penalties:

1. Swapping a pilot onto a new mek results in a +1 to piloting skill for several turns, while still retaining the original BV
2. Minor initiative penalties to combat teams with new pilots / meks
3. Repair time penalties
4. Increased C-bill salary / maintenance costs