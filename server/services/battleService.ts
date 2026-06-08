import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import { createNotification } from "./notificationService";
import { getUnitDefinitionById } from "./unitLibraryService";
import { WEAPONS } from "../../src/data/weapons";
import { COMPONENTS } from "../../src/data/components";
import type {
  Battle,
  BattleLogEntry,
  CampaignUnitDamageOverlay,
} from "../types/models";

type BattlePayload = Partial<Battle> & {
  opponentUserId?: string;
  objectiveId?: string;
  objectiveName?: string;
  outcome?: string;
  controlsField?: boolean;
  campaignForceId?: string;
  unitDamage?: CampaignUnitDamageOverlay[];
};


const CONTROL_SWING_CONFIG = {
  baseSwing: Number(process.env.BTCM_CONTROL_BASE_SWING ?? 10),
  holderConcentrationWeight: Number(
    process.env.BTCM_CONTROL_HOLDER_CONCENTRATION_WEIGHT ?? 0.65,
  ),
};

export async function createBattle(
  campaignId: string,
  submittedByUserId: string,
  payload: BattlePayload,
): Promise<Battle> {
  const store = await loadStore();
  const now = new Date().toISOString();
  const campaign = store.campaigns.find(
    (candidate) => candidate.id === campaignId,
  );
  if (!campaign) throw new Error("Campaign not found");
  const participant = store.campaignParticipants.find(
    (entry) =>
      entry.campaignId === campaignId &&
      entry.userId === submittedByUserId &&
      entry.status === "Accepted",
  );
  if (!participant)
    throw new Error("Only accepted campaign participants can log battles.");

  const opponentId = payload.opponentUserId ?? payload.defendingUserId;
  if (!opponentId)
    throw new Error("Choose an opponent before logging the battle.");
  const opponent = store.campaignParticipants.find(
    (entry) =>
      entry.campaignId === campaignId &&
      entry.userId === opponentId &&
      entry.status === "Accepted",
  );
  if (!opponent)
    throw new Error(
      "Selected opponent is not an accepted campaign participant.",
    );

  const forceId = payload.campaignForceId ?? participant.forceId;
  if (!forceId)
    throw new Error("Assign a campaign force before logging battles.");

  const reciprocalBattle = store.battles.find((candidate) => {
    if (
      candidate.campaignId !== campaignId ||
      candidate.status !== "AwaitingOpponent"
    )
      return false;
    const logs = candidate.battleLogs ?? [];
    const hasMyLog = logs.some((log) => log.userId === submittedByUserId);
    const opponentLoggedAgainstMe = logs.some(
      (log) =>
        log.userId === opponentId && log.opponentUserId === submittedByUserId,
    );
    return !hasMyLog && opponentLoggedAgainstMe;
  });

  if (!reciprocalBattle) {
    const turnState = calculateCampaignTurnState(store, campaignId);
    const maxTurnsAhead = Number(campaign.settings?.maxTurnsAhead ?? campaign.settings?.maxTurns ?? 0);
    const playerTurn = turnState.playerTurns.get(submittedByUserId) ?? 1;
    const turnsAhead = Math.max(0, playerTurn - turnState.campaignTurn);
    if (maxTurnsAhead > 0 && turnsAhead >= maxTurnsAhead) {
      throw new Error(
        `You are already ${turnsAhead} turn${turnsAhead === 1 ? "" : "s"} ahead of the campaign. Wait for the other players to catch up before logging another battle.`,
      );
    }
  }

  const logEntry: BattleLogEntry = {
    id: crypto.randomUUID(),
    userId: submittedByUserId,
    date: payload.date ?? now,
    campaignForceId: forceId,
    opponentUserId: opponentId,
    objectiveId: payload.objectiveId,
    objectiveName: payload.objectiveName,
    outcome: payload.outcome ?? "Victory",
    controlsField: Boolean(payload.controlsField),
    unitDamage: payload.unitDamage ?? [],
    summary: payload.summary,
    submittedAt: now,
  };

  const controlSwing = calculateControlSwing(campaign, submittedByUserId, opponentId, payload, store);

  if (reciprocalBattle) {
    reciprocalBattle.battleLogs = [
      ...(reciprocalBattle.battleLogs ?? []),
      logEntry,
    ];
    const validation = validateBattleLogAgreement(reciprocalBattle);
    const agreed = validation.agreed;
    reciprocalBattle.status = agreed ? "Complete" : "Disputed";
    reciprocalBattle.validationIssues = validation.issues;
    applyBattleOutcomeFields(reciprocalBattle);
    reciprocalBattle.confirmedAt = agreed ? now : reciprocalBattle.confirmedAt;
    reciprocalBattle.updatedAt = now;
    reciprocalBattle.summary = payload.summary ?? reciprocalBattle.summary;
    const reciprocalSwing = calculateControlSwing(
      campaign,
      submittedByUserId,
      opponentId,
      payload,
      store,
    );
    reciprocalBattle.controlChangePercent = reciprocalSwing.actualSwing;
    reciprocalBattle.controlSwingBreakdown = reciprocalSwing.breakdown;
    if (agreed) {
      applyControlSwing(campaign, reciprocalSwing, store);
      await applyBattleResultsToForces(store, reciprocalBattle);
      advanceCampaignTurn(campaign, store);
    }
    await saveStore(store);

    await createNotification(
      opponentId,
      agreed ? "battle.log.complete" : "battle.log.disputed",
      {
        battleId: reciprocalBattle.id,
        campaignId,
        campaignName: campaign.name,
        opponentUserId: submittedByUserId,
        objectiveName: reciprocalBattle.objectiveName,
        date: reciprocalBattle.date,
      },
    );

    return reciprocalBattle;
  }

  const battle: Battle = {
    id: crypto.randomUUID(),
    campaignId,
    turnNumber:
      payload.turnNumber ??
      Number(
        (campaign as any).turnNumber ??
          (campaign.settings as any)?.currentTurn ??
          1,
      ),
    date: payload.date ?? now,
    location: payload.location ?? payload.objectiveName,
    objectiveId: payload.objectiveId,
    objectiveName: payload.objectiveName,
    status: "AwaitingOpponent",
    submittedByUserId,
    defendingUserId: opponentId,
    opponentUserId: opponentId,
    winnerUserId:
      payload.outcome === "Victory"
        ? submittedByUserId
        : payload.outcome === "Defeat"
          ? opponentId
          : undefined,
    loserUserId:
      payload.outcome === "Victory"
        ? opponentId
        : payload.outcome === "Defeat"
          ? submittedByUserId
          : undefined,
    fieldHolderUserId: Boolean(payload.controlsField) ? submittedByUserId : opponentId,
    attackerForceId: forceId,
    defenderForceId: opponent.forceId,
    outcome: payload.outcome ?? "Victory",
    controlsField: Boolean(payload.controlsField),
    controlChangePercent: controlSwing.actualSwing,
    controlSwingBreakdown: controlSwing.breakdown,
    summary: payload.summary,
    battleLogs: [logEntry],
    validationIssues: [],
    confirmedAt: undefined,
    createdAt: now,
    updatedAt: now,
  };

  store.battles.push(battle);
  await saveStore(store);

  await createNotification(opponentId, "battle.log.awaiting", {
    battleId: battle.id,
    campaignId,
    campaignName: campaign.name,
    opponentUserId: submittedByUserId,
    objectiveName: battle.objectiveName,
    date: battle.date,
  });

  return battle;
}

function validateBattleLogAgreement(battle: Battle): { agreed: boolean; issues: string[] } {
  const logs = battle.battleLogs ?? [];
  if (logs.length < 2) return { agreed: false, issues: ["The opponent has not submitted a matching battle log yet."] };
  const [firstLog, secondLog] = logs;
  const issues: string[] = [];

  if (normalizeDate(firstLog.date ?? battle.date) !== normalizeDate(secondLog.date ?? battle.date)) {
    issues.push(`Dates do not match (${normalizeDate(firstLog.date ?? battle.date)} vs ${normalizeDate(secondLog.date ?? battle.date)}).`);
  }
  if ((firstLog.objectiveId ?? battle.objectiveId ?? "") !== (secondLog.objectiveId ?? battle.objectiveId ?? "")) {
    issues.push("Objectives do not match.");
  }
  if (!(firstLog.userId === secondLog.opponentUserId && firstLog.opponentUserId === secondLog.userId)) {
    issues.push("Opponent selections are not reciprocal.");
  }
  const expectedSecondOutcome = flipOutcome(firstLog.outcome ?? battle.outcome);
  if (expectedSecondOutcome !== secondLog.outcome) {
    issues.push(`Results do not agree (${firstLog.outcome ?? "—"} should match ${expectedSecondOutcome ?? "—"}, but opponent logged ${secondLog.outcome ?? "—"}).`);
  }
  if (Boolean(firstLog.controlsField) === Boolean(secondLog.controlsField)) {
    issues.push("Field control claims do not oppose each other.");
  }

  const firstKills = totalKillsMade(firstLog.unitDamage ?? []);
  const secondKills = totalKillsMade(secondLog.unitDamage ?? []);
  const firstDestroyed = countDestroyedUnits(firstLog.unitDamage ?? []);
  const secondDestroyed = countDestroyedUnits(secondLog.unitDamage ?? []);
  if (firstKills !== secondDestroyed) {
    issues.push(`First log reports ${firstKills} kill(s), but second side has ${secondDestroyed} destroyed unit(s).`);
  }
  if (secondKills !== firstDestroyed) {
    issues.push(`Second log reports ${secondKills} kill(s), but first side has ${firstDestroyed} destroyed unit(s).`);
  }

  return { agreed: issues.length === 0, issues };
}

function battleLogsAgree(battle: Battle, newestLog?: BattleLogEntry): boolean {
  return validateBattleLogAgreement(battle).agreed;
}

function flipOutcome(outcome?: string) {
  if (outcome === "Victory") return "Defeat";
  if (outcome === "Defeat") return "Victory";
  return outcome;
}

function applyBattleOutcomeFields(battle: any) {
  const logs = (battle.battleLogs ?? []) as BattleLogEntry[];
  const winningLog = logs.find((log) => log.outcome === "Victory");
  const losingLog = logs.find((log) => log.outcome === "Defeat");
  const fieldLog = logs.find((log) => Boolean(log.controlsField));

  battle.winnerUserId = winningLog?.userId ?? battle.winnerUserId;
  battle.loserUserId = losingLog?.userId ?? battle.loserUserId;
  battle.fieldHolderUserId = fieldLog?.userId ?? battle.fieldHolderUserId;

  if (winningLog) {
    battle.outcome = "Victory";
    battle.submittedByUserId = winningLog.userId;
    battle.opponentUserId = winningLog.opponentUserId ?? battle.opponentUserId;
    battle.defendingUserId = battle.loserUserId ?? battle.defendingUserId;
  }
  if (fieldLog) {
    battle.controlsField = true;
  }
}

function totalKillsMade(unitDamage: CampaignUnitDamageOverlay[]): number {
  return unitDamage.reduce((sum, entry) => sum + Number(entry.killsMade ?? 0), 0);
}

function countDestroyedUnits(unitDamage: CampaignUnitDamageOverlay[]): number {
  return unitDamage.filter((entry: any) => isUnitDestroyedFromOverlay(entry)).length;
}

function isUnitDestroyedFromOverlay(entry: any): boolean {
  if (entry?.status === "Destroyed") return true;
  if (entry?.chaos?.condition === "destroyed") return true;
  const locations = entry?.detailed?.locations ?? {};
  const values = Object.values(locations) as any[];
  const destroyedByName = (needle: string) =>
    values.some((loc: any) => {
      const name = String(loc.name ?? loc.locationName ?? "").toLowerCase();
      return name.includes(needle) && (loc.destroyed || loc.missing);
    });
  if (destroyedByName("center torso") || destroyedByName("head")) return true;
  const destroyedLegs = values.filter((loc: any) => {
    const name = String(loc.name ?? loc.locationName ?? "").toLowerCase();
    return name.includes("leg") && (loc.destroyed || loc.missing);
  }).length;
  return destroyedLegs >= 2;
}

function calculateControlSwing(
  campaign: any,
  submittedByUserId: string,
  opponentId: string,
  payload: BattlePayload,
  store?: any,
): { actualSwing: number; winnerId?: string; loserId?: string; objectiveId?: string; breakdown: Record<string, number | string | boolean> } {
  const outcome = payload.outcome ?? "Victory";
  const playerIds = getAcceptedCampaignPlayerIds(campaign, store, [submittedByUserId, opponentId]);
  const playerCount = Math.max(2, playerIds.length || 2);
  const objectives = campaign.settings?.objectives ?? [];
  const objective =
    objectives.find((candidate: any) => candidate.id === payload.objectiveId) ??
    objectives.find((candidate: any) => candidate.name === payload.objectiveName) ??
    (objectives.length === 1 ? objectives[0] : undefined);
  const objectiveId = objective?.id ?? payload.objectiveId;
  if (outcome === "Draw") {
    return {
      actualSwing: 0,
      objectiveId,
      breakdown: { reason: "No objective swing for draw." },
    };
  }
  if (!objectiveId) {
    return {
      actualSwing: 0,
      objectiveId,
      breakdown: { reason: "No objective selected for this battle log." },
    };
  }

  const winnerId = outcome === "Victory" ? submittedByUserId : opponentId;
  const loserId = outcome === "Victory" ? opponentId : submittedByUserId;
  const objectiveCount = Math.max(1, objectives.length || 1);
  const control = normalizeObjectiveControl(objective, playerIds);
  const winnerCurrentControl = control[winnerId] ?? 0;
  const loserCurrentControl = control[loserId] ?? 0;
  const holdersOnObjective = Object.values(control).filter((value) => Number(value) > 0).length;
  const attackerHasControl = winnerCurrentControl > 0;
  const defenderHasControl = loserCurrentControl > 0;
  const playerCountFactor = Math.pow(4 / playerCount, 0.5);
  const objectiveCountFactor = Math.pow(objectiveCount / 5, 0.5);
  const holderConcentrationFactor =
    playerCount <= 1
      ? 1
      : 1 +
        CONTROL_SWING_CONFIG.holderConcentrationWeight *
          ((playerCount - holdersOnObjective) / (playerCount - 1));
  const stakeContestFactor =
    attackerHasControl && defenderHasControl
      ? 1.1
      : attackerHasControl !== defenderHasControl
        ? 0.85
        : 0;
  const rawSwing =
    CONTROL_SWING_CONFIG.baseSwing *
    playerCountFactor *
    objectiveCountFactor *
    holderConcentrationFactor *
    stakeContestFactor;
  const actualSwing = Math.max(
    0,
    Math.min(rawSwing, loserCurrentControl, 100 - winnerCurrentControl),
  );

  return {
    actualSwing: roundPercent(actualSwing),
    winnerId,
    loserId,
    objectiveId,
    breakdown: {
      baseSwing: CONTROL_SWING_CONFIG.baseSwing,
      playerCount,
      objectiveCount,
      holdersOnObjective,
      winnerCurrentControl: roundPercent(winnerCurrentControl),
      loserCurrentControl: roundPercent(loserCurrentControl),
      playerCountFactor: roundPercent(playerCountFactor),
      objectiveCountFactor: roundPercent(objectiveCountFactor),
      holderConcentrationFactor: roundPercent(holderConcentrationFactor),
      stakeContestFactor,
      rawSwing: roundPercent(rawSwing),
      actualSwing: roundPercent(actualSwing),
    },
  };
}


function getAcceptedCampaignPlayerIds(
  campaign: any,
  store?: any,
  fallbackIds: Array<string | undefined> = [],
): string[] {
  const embedded = (campaign.participants ?? [])
    .filter((participant: any) =>
      ["accepted", "joined", "active"].includes(String(participant.status ?? "").toLowerCase()),
    )
    .map((participant: any) => participant.userId);
  const stored = (store?.campaignParticipants ?? [])
    .filter(
      (participant: any) =>
        participant.campaignId === campaign.id &&
        ["accepted", "joined", "active"].includes(String(participant.status ?? "").toLowerCase()),
    )
    .map((participant: any) => participant.userId);
  return Array.from(new Set([...embedded, ...stored, ...fallbackIds].filter(Boolean)));
}

function normalizeObjectiveControl(
  objective: any,
  playerIds: string[],
): Record<string, number> {
  const control: Record<string, number> = {};
  const equalShare = playerIds.length ? 100 / playerIds.length : 0;
  playerIds.forEach((playerId) => {
    control[playerId] = equalShare;
  });
  const source = objective?.currentControl ?? objective?.control ?? objective?.playerControl ?? [];
  if (Array.isArray(source)) {
    source.forEach((entry: any) => {
      const userId = entry?.userId ?? entry?.playerId ?? entry?.participantUserId ?? entry?.participantId;
      if (!userId || !playerIds.includes(userId)) return;
      const value = Number(entry.percentage ?? entry.control ?? entry.value ?? entry.share ?? 0);
      control[userId] = Number.isFinite(value) ? value : 0;
    });
  } else if (source && typeof source === "object") {
    Object.entries(source).forEach(([userId, value]) => {
      if (!playerIds.includes(userId)) return;
      const numeric = Number(value ?? 0);
      control[userId] = Number.isFinite(numeric) ? numeric : 0;
    });
  }
  return control;
}

function applyControlSwing(campaign: any, swing: ReturnType<typeof calculateControlSwing>, store?: any) {
  if (!swing.objectiveId || !swing.winnerId || !swing.loserId || !swing.actualSwing) return;
  const objective = (campaign.settings?.objectives ?? []).find(
    (candidate: any) => candidate.id === swing.objectiveId,
  );
  if (!objective) return;
  const playerIds = getAcceptedCampaignPlayerIds(campaign, store, [swing.winnerId, swing.loserId]);
  const control = normalizeObjectiveControl(objective, playerIds);
  const winnerCurrent = Math.max(0, Number(control[swing.winnerId] ?? 0));
  const loserCurrent = Math.max(0, Number(control[swing.loserId] ?? 0));
  const transfer = roundPercent(
    Math.max(0, Math.min(Number(swing.actualSwing ?? 0), loserCurrent, 100 - winnerCurrent)),
  );
  if (transfer <= 0) return;

  // Strict two-player transfer: the winner gains exactly what the loser loses.
  // No uninvolved player is ever redistributed or normalized by this update.
  control[swing.winnerId] = roundPercent(winnerCurrent + transfer);
  control[swing.loserId] = roundPercent(loserCurrent - transfer);

  objective.currentControl = playerIds.map((userId) => ({
    userId,
    percentage: roundPercent(Math.max(0, Number(control[userId] ?? 0))),
  }));
  campaign.settings = {
    ...(campaign.settings ?? {}),
    planetaryControl: calculatePlanetaryControl(campaign, store),
  };
  campaign.updatedAt = new Date().toISOString();
}

function calculatePlanetaryControl(campaign: any, store?: any): Array<{ userId: string; percentage: number }> {
  const objectives = campaign.settings?.objectives ?? [];
  const playerIds = getAcceptedCampaignPlayerIds(campaign, store);
  if (!objectives.length || !playerIds.length) return [];
  const totals: Record<string, number> = Object.fromEntries(playerIds.map((id: string) => [id, 0]));
  objectives.forEach((objective: any) => {
    const control = normalizeObjectiveControl(objective, playerIds);
    playerIds.forEach((id: string) => {
      totals[id] += Number(control[id] ?? 0);
    });
  });
  return playerIds.map((userId: string) => ({
    userId,
    percentage: roundPercent(totals[userId] / objectives.length),
  }));
}



function damageSlug(value: string): string {
  return String(value || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function clearCurrentDamageForUnit(store: any, forceUnitId: string): void {
  const damageIds = new Set((store.unitDamage ?? []).filter((entry: any) => entry.forceUnitId === forceUnitId).map((entry: any) => entry.id));
  store.unitDamage = (store.unitDamage ?? []).filter((entry: any) => entry.forceUnitId !== forceUnitId);
  store.unitLocationDamage = (store.unitLocationDamage ?? []).filter((entry: any) => entry.forceUnitId !== forceUnitId && !damageIds.has(entry.unitDamageId));
  store.unitEquipmentDamage = (store.unitEquipmentDamage ?? []).filter((entry: any) => entry.forceUnitId !== forceUnitId && !damageIds.has(entry.unitDamageId));
  store.unitAmmoState = (store.unitAmmoState ?? []).filter((entry: any) => entry.forceUnitId !== forceUnitId);
  store.repairOrders = (store.repairOrders ?? []).filter((entry: any) => entry.forceUnitId !== forceUnitId && !damageIds.has(entry.unitDamageId));
}


function normalizePartName(value: string): string {
  return String(value ?? "").toLowerCase().replace(/\(r\)/g, "").replace(/[^a-z0-9]/g, "");
}

function eraAvailability(definition: any, era?: string): string {
  const normalized = String(era ?? "").toLowerCase();
  const key = normalized.includes("succession") ? "successionWars" : normalized.includes("clan") ? "clanInvasion" : normalized.includes("dark") ? "darkAge" : "starLeague";
  return String(definition?.availability?.[key] ?? definition?.techRating ?? "C");
}

function findPartDefinition(itemName: string): any | null {
  const target = normalizePartName(itemName);
  const definitions = [...Object.values(WEAPONS), ...Object.values(COMPONENTS)] as any[];
  return definitions.find((definition: any) => {
    const names = [definition.name, ...(definition.altNames ?? [])].map(normalizePartName);
    return names.includes(target) || names.some((name) => name && (target.includes(name) || name.includes(target)));
  }) ?? null;
}

function evaluatePartCost(cost: any, unit: any, itemName: string): number {
  if (typeof cost === "number") return Math.max(0, Math.round(cost));
  if (!cost || typeof cost !== "object") return 0;
  const tons = Number(unit?.tonnage ?? unit?.snapshot?.tonnage ?? 0);
  const engineRating = Number(unit?.engineRating ?? String(unit?.engine ?? "").match(/\d+/)?.[0] ?? 0);
  const gyroTons = Math.max(1, Math.ceil(engineRating / 100));
  const heatSinks = Number(unit?.heatSinks ?? 0);
  switch (cost.type) {
    case "fixed": return Math.max(0, Math.round(Number(cost.amount ?? 0)));
    case "unitTonnage": return Math.round(tons * Number(cost.multiplier ?? 0));
    case "engineRatingUnitTonnageDiv75": return Math.round((engineRating * tons / 75) * Number(cost.multiplier ?? 0));
    case "gyroTonnage": return Math.round(gyroTons * Number(cost.multiplier ?? 0));
    case "jumpJetsSquaredUnitTonnage": { const jump = Number(unit?.jump ?? 0); return Math.round(jump * jump * tons * Number(cost.multiplier ?? 0)); }
    case "heatSinksOverFreeFusionSinks": return Math.round(Math.max(0, heatSinks - Number(cost.freeFusionSinks ?? 10)) * Number(cost.multiplier ?? 0));
    case "totalHeatSinks": return Math.round(heatSinks * Number(cost.multiplier ?? 0));
    case "armorTonnage": return Math.round((Number(unit?.armor ?? 0) / 16) * Number(cost.multiplier ?? 0));
    case "internalStructure": return Math.round(tons * Number(cost.multiplier ?? 0));
    case "equipmentTonnage": return Math.round(Number(cost.tons ?? 1) * Number(cost.multiplier ?? 0));
    default: return 0;
  }
}


function locationReplacementCost(location: any, unit: any): number {
  const direct = Number(location?.replacementCostCBills ?? location?.costCBills ?? location?.replacementCost ?? 0);
  if (Number.isFinite(direct) && direct > 0) return Math.round(direct);
  const formula = location?.cost ?? location?.costFormula ?? location?.replacementCostFormula;
  if (formula) return evaluatePartCost(formula, unit, location?.name ?? "Location");
  return 0;
}

function isIncludedLocationSystem(itemName: string, locationName: string): boolean {
  const normalized = normalizePartName(itemName);
  if (/arm/i.test(locationName)) {
    return ["shoulder", "upper arm actuator", "lower arm actuator", "hand actuator"].some((name) => normalized.includes(normalizePartName(name)));
  }
  if (/leg/i.test(locationName)) {
    return ["hip", "upper leg actuator", "lower leg actuator", "foot actuator"].some((name) => normalized.includes(normalizePartName(name)));
  }
  return false;
}

function findAmmoSlot(unitDefinition: any, ammoKey: string): any | null {
  const target = normalizePartName(ammoKey.replace(/_/g, " "));
  const locations = Array.isArray(unitDefinition?.locations)
    ? unitDefinition.locations
    : Object.values(unitDefinition?.locations ?? {});
  for (const location of locations as any[]) {
    for (const slot of location?.slots ?? []) {
      const name = String(slot?.displayName ?? slot?.item ?? slot?.raw ?? "");
      const normalized = normalizePartName(name);
      if (normalized.includes("ammo") && (normalized.includes(target) || target.includes(normalized.replace(/ammo/g, "").trim()))) {
        return { ...slot, locationId: location.id ?? location.key, locationName: location.name };
      }
    }
  }
  return null;
}

function roll2d6(): number {
  return 2 + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6);
}

function addRepairOrder(store: any, base: any): void {
  const now = new Date().toISOString();
  store.repairOrders.push({ id: crypto.randomUUID(), status: "Pending", createdAt: now, updatedAt: now, ...base });
}

async function persistCurrentDamageForUnit(store: any, forceUnit: any, battle: Battle, overlay: any): Promise<void> {
  store.unitDamage ??= [];
  store.unitLocationDamage ??= [];
  store.unitEquipmentDamage ??= [];
  store.unitAmmoState ??= [];
  store.repairOrders ??= [];
  clearCurrentDamageForUnit(store, forceUnit.id);

  const summary = overlay?.damageSummary ?? {};
  const locations = overlay?.detailed?.locations ?? {};
  const ammoSpent = overlay?.detailed?.ammoSpent ?? {};
  const hasDamage =
    Object.values(summary).some((value: any) => Number(value ?? 0) > 0) ||
    Object.values(locations).some((entry: any) =>
      Number(entry?.armorDamage ?? 0) > 0 ||
      Number(entry?.rearArmorDamage ?? 0) > 0 ||
      Number(entry?.structureDamage ?? 0) > 0 ||
      Boolean(entry?.missing || entry?.destroyed),
    ) ||
    Object.values(ammoSpent).some((value: any) => Number(value ?? 0) > 0) ||
    !["ready", "available"].includes(String(overlay?.status ?? forceUnit.status ?? "").toLowerCase());
  if (!hasDamage) return;

  const now = new Date().toISOString();
  const damageId = crypto.randomUUID();
  store.unitDamage.push({
    id: damageId,
    campaignId: battle.campaignId,
    forceId: forceUnit.forceId,
    forceUnitId: forceUnit.id,
    status: overlay.status ?? forceUnit.status,
    repairComplexity: overlay.repairComplexity,
    armorDamageTotal: Number(summary.armor ?? 0),
    rearArmorDamageTotal: Object.values(locations).reduce((sum: number, entry: any) => sum + Number(entry?.rearArmorDamage ?? 0), 0),
    structureDamageTotal: Number(summary.internal ?? 0),
    engineHits: Number(summary.engineHits ?? 0),
    gyroHits: Number(summary.gyroHits ?? 0),
    ammoSpentTotal: Number(summary.ammo ?? Object.values(ammoSpent).reduce((sum: number, value: any) => sum + Number(value ?? 0), 0)),
    limbs: Number(summary.limbs ?? 0),
    weapons: Number(summary.weapons ?? 0),
    components: Number(summary.components ?? 0),
    notes: overlay?.detailed?.notes,
    createdAt: now,
    updatedAt: now,
  });

  Object.entries(locations).forEach(([locationKey, entry]: [string, any]) => {
    if (!entry) return;
    store.unitLocationDamage.push({
      id: crypto.randomUUID(),
      unitDamageId: damageId,
      forceUnitId: forceUnit.id,
      locationId: locationKey,
      locationName: locationKey,
      armorDamage: Number(entry.armorDamage ?? 0),
      rearArmorDamage: Number(entry.rearArmorDamage ?? 0),
      structureDamage: Number(entry.structureDamage ?? 0),
      isMissing: Boolean(entry.missing),
      isDestroyed: Boolean(entry.destroyed),
      damagedSlots: [...(entry.damagedSlots ?? [])],
      destroyedSlots: [...(entry.destroyedSlots ?? [])],
    });
  });


  const unitDefinition: any = await getUnitDefinitionById(forceUnit.baseUnitId).catch(() => null);
  const definitionLocations = unitDefinition?.locations ?? forceUnit.snapshot?.locations ?? [];
  const campaign = store.campaigns.find((entry: any) => entry.id === battle.campaignId);
  const era = campaign?.settings?.era ?? unitDefinition?.era ?? forceUnit.snapshot?.era;

  for (const location of definitionLocations) {
    const entry = locations[location.id] ?? locations[location.name] ?? {};
    const armorPoints = Number(entry.armorDamage ?? 0) + Number(entry.rearArmorDamage ?? 0);
    const structurePoints = Number(entry.structureDamage ?? 0);
    const totalArmorPoints = Math.max(1, Number(unitDefinition?.armor ?? forceUnit.snapshot?.locations?.reduce((sum: number, loc: any) => sum + Number(loc.armor ?? 0) + Number(loc.rearArmor ?? 0), 0) ?? 1));
    const totalStructurePoints = Math.max(1, Number(unitDefinition?.structure ?? forceUnit.snapshot?.locations?.reduce((sum: number, loc: any) => sum + Number(loc.structure ?? 0), 0) ?? 1));
    const armorDefinition = findPartDefinition(`${unitDefinition?.armorType ?? "Standard"} Armor`) ?? findPartDefinition("Standard Armor");
    const structureDefinition = findPartDefinition(`${unitDefinition?.structureType ?? "Standard"} Internal Structure`) ?? findPartDefinition("Standard Internal Structure");
    const fullArmorCost = evaluatePartCost(armorDefinition?.cost, unitDefinition ?? forceUnit.snapshot, "Armor");
    const fullStructureCost = evaluatePartCost(structureDefinition?.cost, unitDefinition ?? forceUnit.snapshot, "Internal Structure");
    if (armorPoints > 0) addRepairOrder(store, { campaignId: battle.campaignId, forceId: forceUnit.forceId, forceUnitId: forceUnit.id, unitDamageId: damageId, category: "Armor", locationId: location.id, itemId: armorDefinition?.id, itemName: `${location.name} armor`, quantity: armorPoints, action: "Repair", techRating: armorDefinition?.techRating ?? "C", availabilityRating: eraAvailability(armorDefinition, era), replacementCostCBills: Math.round(fullArmorCost * armorPoints / totalArmorPoints) });
    if (structurePoints > 0) addRepairOrder(store, { campaignId: battle.campaignId, forceId: forceUnit.forceId, forceUnitId: forceUnit.id, unitDamageId: damageId, category: "Internal Structure", locationId: location.id, itemId: structureDefinition?.id, itemName: `${location.name} internal structure`, quantity: structurePoints, action: "Repair", techRating: structureDefinition?.techRating ?? "C", availabilityRating: eraAvailability(structureDefinition, era), replacementCostCBills: Math.round(fullStructureCost * structurePoints / totalStructurePoints) });
    if ((entry.missing || entry.destroyed) && /head|torso|arm|leg/i.test(location.name)) {
      addRepairOrder(store, {
        campaignId: battle.campaignId,
        forceId: forceUnit.forceId,
        forceUnitId: forceUnit.id,
        unitDamageId: damageId,
        category: "Limb",
        locationId: location.id,
        itemName: `${location.name} assembly`,
        quantity: 1,
        action: "Replace",
        replacementCostCBills: locationReplacementCost(location, unitDefinition ?? forceUnit.snapshot),
        requisitionStatus: "Needs Order",
      });
    }

    const damagedSlots = new Set<number>((entry.damagedSlots ?? []).map(Number));
    const destroyedSlots = new Set<number>((entry.destroyedSlots ?? []).map(Number));
    const grouped = new Map<string, { slots: number[]; destroyed: boolean; item: string }>();
    for (const slot of location.slots ?? []) {
      if (!damagedSlots.has(Number(slot.slot)) && !destroyedSlots.has(Number(slot.slot))) continue;
      const slotItem = slot.displayName ?? slot.item ?? slot.raw;
      if (!slotItem || /^empty$/i.test(slotItem)) continue;
      if ((entry.missing || entry.destroyed) && isIncludedLocationSystem(slotItem, location.name)) continue;
      const key = normalizePartName(slotItem);
      const current = grouped.get(key) ?? { slots: [], destroyed: false, item: slotItem };
      current.slots.push(Number(slot.slot));
      current.destroyed ||= destroyedSlots.has(Number(slot.slot));
      grouped.set(key, current);
    }
    for (const component of grouped.values()) {
      const definition = findPartDefinition(component.item);
      const roll = component.destroyed ? undefined : roll2d6();
      const disposition: "Repair" | "Replace" = component.destroyed || Number(roll ?? 0) < 10 ? "Replace" : "Repair";
      const replacementCostCBills = evaluatePartCost(definition?.cost, unitDefinition ?? forceUnit.snapshot, component.item);
      const equipmentRow = {
        id: crypto.randomUUID(), unitDamageId: damageId, forceUnitId: forceUnit.id, locationId: location.id,
        slotNumber: Math.min(...component.slots), equipmentId: definition?.id, equipmentName: definition?.name ?? component.item,
        condition: component.destroyed ? "Destroyed" : "Damaged", techRating: definition?.techRating ?? "C",
        availabilityRating: eraAvailability(definition, era), repairRoll: roll, disposition, replacementCostCBills,
      };
      store.unitEquipmentDamage.push(equipmentRow);
      addRepairOrder(store, { campaignId: battle.campaignId, forceId: forceUnit.forceId, forceUnitId: forceUnit.id, unitDamageId: damageId, category: "Equipment", locationId: location.id, slotNumber: equipmentRow.slotNumber, itemId: equipmentRow.equipmentId, itemName: equipmentRow.equipmentName, quantity: 1, action: disposition, repairRoll: roll, techRating: equipmentRow.techRating, availabilityRating: equipmentRow.availabilityRating, replacementCostCBills, requisitionStatus: disposition === "Replace" ? "Needs Order" : undefined });
    }
  }

  for (const [ammoTypeId, rawSpent] of Object.entries(ammoSpent)) {
    const shotsSpent = Math.max(0, Number(rawSpent ?? 0));
    if (shotsSpent <= 0) continue;
    const ammoSlot = findAmmoSlot(unitDefinition, ammoTypeId);
    const definition = ammoSlot ? findPartDefinition(String(ammoSlot.displayName ?? ammoSlot.item ?? ammoSlot.raw ?? ammoTypeId)) : findPartDefinition(ammoTypeId);
    const fullBinCost = evaluatePartCost(ammoSlot?.cost ?? definition?.cost, unitDefinition ?? forceUnit.snapshot, String(ammoTypeId));
    const binShots = Math.max(1, Number(ammoSlot?.shots ?? ammoSlot?.capacity ?? ammoSlot?.ammoShots ?? shotsSpent));
    const rearmCost = Math.round(fullBinCost * Math.min(1, shotsSpent / binShots));
    addRepairOrder(store, {
      campaignId: battle.campaignId,
      forceId: forceUnit.forceId,
      forceUnitId: forceUnit.id,
      unitDamageId: damageId,
      category: "Ammunition",
      locationId: ammoSlot?.locationId,
      itemId: definition?.id ?? ammoTypeId,
      itemName: String(ammoSlot?.displayName ?? ammoSlot?.item ?? ammoSlot?.raw ?? ammoTypeId).replace(/[_-]+/g, " "),
      quantity: shotsSpent,
      action: "Rearm",
      techRating: ammoSlot?.techRating ?? definition?.techRating ?? "C",
      availabilityRating: eraAvailability(ammoSlot ?? definition, era),
      replacementCostCBills: rearmCost,
    });
  }

  overlay.detailed ??= { locations: {} };
  overlay.detailed.equipmentDamage = store.unitEquipmentDamage.filter((row: any) => row.unitDamageId === damageId);
  overlay.detailed.repairOrders = store.repairOrders.filter((row: any) => row.unitDamageId === damageId);

  Object.entries(ammoSpent).forEach(([ammoTypeId, shots]: [string, any]) => {
    const shotsSpent = Math.max(0, Number(shots ?? 0));
    if (!shotsSpent) return;
    store.unitAmmoState.push({
      id: crypto.randomUUID(),
      forceUnitId: forceUnit.id,
      unitDamageId: damageId,
      ammoTypeId: damageSlug(ammoTypeId),
      shotsSpent,
      updatedAt: now,
    });
  });
}

function updatePilotAfterBattle(store: any, forceUnit: any, overlay: any): void {
  const pilot = (store.pilots ?? []).find((entry: any) => entry.id === forceUnit.assignedPilotId || entry.assignedUnitId === forceUnit.id);
  if (!pilot) return;
  if (overlay.pilotDamage === "KIA") {
    pilot.status = "Killed";
    pilot.isAlive = false;
    pilot.assignedUnitId = undefined;
    pilot.updatedAt = new Date().toISOString();
    forceUnit.assignedPilotId = undefined;
  } else if (overlay.pilotDamage !== undefined) {
    pilot.wounds = Number(overlay.pilotDamage ?? 0);
    pilot.status = Number(pilot.wounds ?? 0) > 0 ? "Wounded" : "Assigned";
    pilot.updatedAt = new Date().toISOString();
  }
}


async function applyBattleResultsToForces(store: any, battle: Battle): Promise<void> {
  for (const log of battle.battleLogs ?? []) {
    for (const overlay of log.unitDamage ?? []) {
      const forceUnit = store.forceUnits?.find(
        (candidate: any) => candidate.id === overlay.campaignForceUnitId,
      );
      if (!forceUnit) continue;

      const newStatus = overlay.status ?? deriveStatusFromOverlay(overlay);
      const newBV = estimateCurrentBV(forceUnit, overlay);
      overlay.status = newStatus;
      overlay.currentBV = newBV;
      overlay.recalculatedBV = newBV;

      delete forceUnit.damageOverlay;
      delete forceUnit.currentDamage;
      forceUnit.status = newStatus;
      forceUnit.currentBV = newBV;
      forceUnit.isDestroyed = newStatus === "Destroyed";
      forceUnit.kills = Number(forceUnit.kills ?? 0) + Number(overlay.killsMade ?? 0);

      await persistCurrentDamageForUnit(store, forceUnit, battle, overlay);
      updatePilotAfterBattle(store, forceUnit, overlay);
      forceUnit.updatedAt = new Date().toISOString();
    }
  }

  captureDestroyedUnitsForFieldHolder(store, battle);
}

function captureDestroyedUnitsForFieldHolder(store: any, battle: Battle) {
  const fieldHolderUserId = (battle as any).fieldHolderUserId ??
    (battle.battleLogs ?? []).find((log: BattleLogEntry) => Boolean(log.controlsField))?.userId;
  if (!fieldHolderUserId) return;

  const fieldHolderParticipant = store.campaignParticipants?.find(
    (participant: any) =>
      participant.campaignId === battle.campaignId &&
      participant.userId === fieldHolderUserId &&
      ["accepted", "joined", "active"].includes(String(participant.status ?? "").toLowerCase()),
  );
  const fieldHolderForceId = fieldHolderParticipant?.forceId;
  if (!fieldHolderForceId) return;

  const touchedForceIds = new Set<string>([fieldHolderForceId]);

  (battle.battleLogs ?? []).forEach((log: BattleLogEntry) => {
    if (log.userId === fieldHolderUserId) return;
    (log.unitDamage ?? []).forEach((overlay: any) => {
      if (!isUnitDestroyedFromOverlay(overlay)) return;
      const forceUnit = store.forceUnits?.find(
        (candidate: any) => candidate.id === overlay.campaignForceUnitId,
      );
      if (!forceUnit || forceUnit.forceId === fieldHolderForceId) return;

      touchedForceIds.add(forceUnit.forceId);
      const originalForceId = forceUnit.forceId;
      const originalParticipant = store.campaignParticipants?.find(
        (participant: any) =>
          participant.campaignId === battle.campaignId &&
          participant.forceId === originalForceId,
      );
      const pilot = (store.pilots ?? []).find((entry: any) => entry.id === forceUnit.assignedPilotId || entry.assignedUnitId === forceUnit.id);
      if (pilot) {
        pilot.forceId = originalForceId;
        pilot.campaignId = battle.campaignId;
        pilot.assignedUnitId = undefined;
        pilot.status = Number(pilot.wounds ?? 0) > 0 ? "Wounded" : "Unassigned";
        pilot.isCaptured = false;
        pilot.updatedAt = new Date().toISOString();
      }
      forceUnit.forceId = fieldHolderForceId;
      delete forceUnit.pilot;
      forceUnit.assignedPilotId = undefined;
      forceUnit.teamNumber = undefined;
      forceUnit.sortOrder = store.forceUnits.filter((unit: any) => unit.forceId === fieldHolderForceId).length;
      forceUnit.status = "Destroyed";
      forceUnit.isDestroyed = true;
      forceUnit.currentBV = 0;
      forceUnit.updatedAt = new Date().toISOString();
    });
  });

  touchedForceIds.forEach((forceId) => refreshStoredForceUnitIds(store, forceId));
}

function refreshStoredForceUnitIds(store: any, forceId: string) {
  const force = store.forces?.find((candidate: any) => candidate.id === forceId);
  if (!force) return;
  force.unitIds = (store.forceUnits ?? [])
    .filter((unit: any) => unit.forceId === forceId)
    .sort((a: any, b: any) => (a.teamNumber ?? 1) - (b.teamNumber ?? 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((unit: any) => unit.baseUnitId);
  force.updatedAt = new Date().toISOString();
}

function deriveStatusFromOverlay(overlay: any): string {
  if (overlay?.status) return overlay.status;
  if (overlay?.chaos?.condition === "destroyed") return "Destroyed";
  if (overlay?.chaos?.condition === "crippled") return "Crippled";
  if (overlay?.chaos?.condition === "damaged") return "Damaged";
  const summary = overlay?.damageSummary;
  if (summary?.limbs || summary?.internal || summary?.weapons || summary?.components) return "Damaged";
  return "Ready";
}

function estimateCurrentBV(forceUnit: any, overlay: any): number {
  if (Number.isFinite(Number(overlay?.currentBV ?? overlay?.recalculatedBV))) return Number(overlay.currentBV ?? overlay.recalculatedBV);
  const baseBV = Number(forceUnit.snapshot?.totalBV ?? forceUnit.startingBV ?? forceUnit.currentBV ?? 0);
  if (!baseBV) return baseBV;
  const status = overlay?.status ?? deriveStatusFromOverlay(overlay);
  if (status === "Destroyed") return 0;
  const summary = overlay?.damageSummary ?? {};
  const penalty =
    Number(summary.internal ?? 0) * 0.01 +
    Number(summary.weapons ?? 0) * 0.05 +
    Number(summary.components ?? 0) * 0.025 +
    Number(summary.engineHits ?? 0) * 0.08 +
    Number(summary.gyroHits ?? 0) * 0.08 +
    Number(summary.limbs ?? 0) * 0.1;
  return Math.max(0, Math.round(baseBV * Math.max(0.25, 1 - penalty)));
}

function calculateCampaignTurnState(store: any, campaignId: string) {
  const acceptedUserIds = (store.campaignParticipants ?? [])
    .filter((entry: any) => entry.campaignId === campaignId && entry.status === "Accepted")
    .map((entry: any) => entry.userId);
  const completedCounts = new Map<string, number>(acceptedUserIds.map((id: string) => [id, 0]));

  for (const battle of store.battles ?? []) {
    if (battle.campaignId !== campaignId || battle.status !== "Complete") continue;
    const involved = new Set<string>();
    for (const log of battle.battleLogs ?? []) {
      if (completedCounts.has(log.userId)) involved.add(log.userId);
    }
    if (!involved.size) {
      if (completedCounts.has(battle.submittedByUserId)) involved.add(battle.submittedByUserId);
      if (completedCounts.has(battle.defendingUserId)) involved.add(battle.defendingUserId);
    }
    for (const participantUserId of involved) {
      completedCounts.set(participantUserId, (completedCounts.get(participantUserId) ?? 0) + 1);
    }
  }

  const playerTurns = new Map<string, number>();
  for (const participantUserId of acceptedUserIds) {
    playerTurns.set(participantUserId, (completedCounts.get(participantUserId) ?? 0) + 1);
  }
  const campaignTurn = playerTurns.size
    ? Math.max(1, Math.floor([...playerTurns.values()].reduce((sum, turn) => sum + turn, 0) / playerTurns.size))
    : 1;
  return { playerTurns, campaignTurn };
}

function advanceCampaignTurn(campaign: any, store?: any) {
  if (!store) return;
  const turnState = calculateCampaignTurnState(store, campaign.id);
  campaign.turnNumber = turnState.campaignTurn;
  campaign.settings = {
    ...(campaign.settings ?? {}),
    currentTurn: turnState.campaignTurn,
  };
  campaign.updatedAt = new Date().toISOString();
}

function roundPercent(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeDate(value?: string): string {
  return (value ?? "").slice(0, 10);
}

export async function getBattleById(id: string): Promise<Battle | null> {
  const store = await loadStore();
  return store.battles.find((b) => b.id === id) ?? null;
}

export async function listBattlesForCampaign(
  campaignId: string,
): Promise<Battle[]> {
  const store = await loadStore();
  return store.battles
    .filter((b) => b.campaignId === campaignId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function updateBattle(
  id: string,
  updates: Partial<Battle> & { sourceLogId?: string; sourceLog?: Partial<BattleLogEntry> },
): Promise<Battle> {
  const store = await loadStore();
  const b = store.battles.find((x) => x.id === id);
  if (!b) throw new Error("Battle not found");
  const now = new Date().toISOString();

  if (updates.sourceLogId && updates.sourceLog) {
    const log = (b.battleLogs ?? []).find((entry) => entry.id === updates.sourceLogId);
    if (!log) throw new Error("Source battle log not found");
    Object.assign(log, updates.sourceLog, { submittedAt: now });

    if ((b.battleLogs ?? []).length >= 2) {
      const validation = validateBattleLogAgreement(b);
      const previousStatus = b.status;
      b.status = validation.agreed ? "Complete" : "Disputed";
      b.validationIssues = validation.issues;
      applyBattleOutcomeFields(b);
      b.confirmedAt = validation.agreed ? now : undefined;
      const campaign = store.campaigns.find((candidate) => candidate.id === b.campaignId);
      const swing = campaign
        ? calculateControlSwing(
            campaign,
            log.userId,
            log.opponentUserId ?? "",
            log as BattlePayload,
            store,
          )
        : { actualSwing: 0, breakdown: { reason: "Campaign not found." } };
      b.controlChangePercent = swing.actualSwing;
      b.controlSwingBreakdown = swing.breakdown;
      if (validation.agreed && previousStatus !== "Complete" && previousStatus !== "Confirmed" && previousStatus !== "Finalized") {
        if (campaign) {
          applyControlSwing(campaign, swing, store);
          await applyBattleResultsToForces(store, b);
          advanceCampaignTurn(campaign, store);
        }
      }
    }
    b.updatedAt = now;
    await saveStore(store);
    return b;
  }

  Object.assign(b, updates, { updatedAt: now });
  if (updates.status === "Disputed" && !(b as any).validationIssues?.length) {
    b.validationIssues = ["A player disputed this battle result."];
  }
  await saveStore(store);
  return b;
}

export async function confirmBattle(id: string): Promise<Battle> {
  const store = await loadStore();
  const b = store.battles.find((x) => x.id === id);
  if (!b) throw new Error("Battle not found");
  b.status = "Finalized";
  b.confirmedAt = new Date().toISOString();
  b.updatedAt = new Date().toISOString();
  await saveStore(store);
  return b;
}

export async function deleteBattle(id: string): Promise<void> {
  const store = await loadStore();
  store.battles = store.battles.filter((x) => x.id !== id);
  await saveStore(store);
}
