import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import { createNotification } from "./notificationService";
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

  const controlSwing = calculateControlSwing(campaign, submittedByUserId, opponentId, payload);

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
    );
    reciprocalBattle.controlChangePercent = reciprocalSwing.actualSwing;
    reciprocalBattle.controlSwingBreakdown = reciprocalSwing.breakdown;
    if (agreed) {
      applyControlSwing(campaign, reciprocalSwing);
      applyBattleResultsToForces(store, reciprocalBattle);
      advanceCampaignTurn(campaign);
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
): { actualSwing: number; winnerId?: string; loserId?: string; objectiveId?: string; breakdown: Record<string, number | string | boolean> } {
  const outcome = payload.outcome ?? "Victory";
  const acceptedPlayers = (campaign.participants ?? []).filter((participant: any) =>
    ["accepted", "joined", "active"].includes(String(participant.status ?? "").toLowerCase()),
  );
  const playerIds = Array.from(
    new Set(
      [
        ...acceptedPlayers.map((participant: any) => participant.userId),
        submittedByUserId,
        opponentId,
      ].filter(Boolean),
    ),
  );
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
      if (userId) control[userId] = Number(entry.percentage ?? entry.control ?? entry.value ?? entry.share ?? 0);
    });
  } else if (source && typeof source === "object") {
    Object.entries(source).forEach(([userId, value]) => {
      if (playerIds.includes(userId)) control[userId] = Number(value ?? 0);
    });
  }
  return control;
}

function applyControlSwing(campaign: any, swing: ReturnType<typeof calculateControlSwing>) {
  if (!swing.objectiveId || !swing.winnerId || !swing.loserId || !swing.actualSwing) return;
  const objective = (campaign.settings?.objectives ?? []).find(
    (candidate: any) => candidate.id === swing.objectiveId,
  );
  if (!objective) return;
  const playerIds = (campaign.participants ?? [])
    .filter((participant: any) => ["accepted", "joined", "active"].includes(String(participant.status ?? "").toLowerCase()))
    .map((participant: any) => participant.userId);
  const control = normalizeObjectiveControl(objective, playerIds);
  control[swing.winnerId] = Math.min(100, (control[swing.winnerId] ?? 0) + swing.actualSwing);
  control[swing.loserId] = Math.max(0, (control[swing.loserId] ?? 0) - swing.actualSwing);
  objective.currentControl = Object.entries(control).map(([userId, percentage]) => ({
    userId,
    percentage: roundPercent(percentage),
  }));
  campaign.settings = {
    ...(campaign.settings ?? {}),
    planetaryControl: calculatePlanetaryControl(campaign),
  };
  campaign.updatedAt = new Date().toISOString();
}

function calculatePlanetaryControl(campaign: any): Array<{ userId: string; percentage: number }> {
  const objectives = campaign.settings?.objectives ?? [];
  const playerIds = (campaign.participants ?? [])
    .filter((participant: any) => ["accepted", "joined", "active"].includes(String(participant.status ?? "").toLowerCase()))
    .map((participant: any) => participant.userId);
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


function applyBattleResultsToForces(store: any, battle: Battle) {
  (battle.battleLogs ?? []).forEach((log: BattleLogEntry) => {
    (log.unitDamage ?? []).forEach((overlay: any) => {
      const forceUnit = store.forceUnits?.find(
        (candidate: any) => candidate.id === overlay.campaignForceUnitId,
      );
      if (!forceUnit) return;

      const newStatus = overlay.status ?? deriveStatusFromOverlay(overlay);
      const newBV = estimateCurrentBV(forceUnit, overlay);
      overlay.status = newStatus;
      overlay.currentBV = newBV;
      overlay.recalculatedBV = newBV;

      forceUnit.damageOverlay = overlay;
      forceUnit.currentDamage = overlay;
      forceUnit.status = newStatus;
      forceUnit.currentBV = newBV;
      forceUnit.isDestroyed = newStatus === "Destroyed";
      forceUnit.kills = Number(forceUnit.kills ?? 0) + Number(overlay.killsMade ?? 0);

      if (forceUnit.pilot) {
        if (overlay.pilotDamage === "KIA") {
          forceUnit.pilot.dead = true;
          forceUnit.pilot.wounds = 6;
        } else if (overlay.pilotDamage !== undefined) {
          forceUnit.pilot.wounds = Number(overlay.pilotDamage ?? 0);
          forceUnit.pilot.dead = false;
        }
      }

      forceUnit.updatedAt = new Date().toISOString();
    });
  });

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
      forceUnit.forceId = fieldHolderForceId;
      forceUnit.pilot = undefined;
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

function advanceCampaignTurn(campaign: any) {
  if (campaign.settings?.type === "Conquest") return;
  const currentTurn = Number(campaign.turnNumber ?? campaign.settings?.currentTurn ?? 1);
  campaign.turnNumber = currentTurn + 1;
  campaign.settings = {
    ...(campaign.settings ?? {}),
    currentTurn: currentTurn + 1,
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
          )
        : { actualSwing: 0, breakdown: { reason: "Campaign not found." } };
      b.controlChangePercent = swing.actualSwing;
      b.controlSwingBreakdown = swing.breakdown;
      if (validation.agreed && previousStatus !== "Complete" && previousStatus !== "Confirmed" && previousStatus !== "Finalized") {
        if (campaign) {
          applyControlSwing(campaign, swing);
          applyBattleResultsToForces(store, b);
          advanceCampaignTurn(campaign);
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
