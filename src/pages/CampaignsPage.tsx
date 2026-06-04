import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  Info,
  Plus,
  Settings,
  Swords,
  Wrench,
  DollarSign,
  X,
  XCircle,
} from "lucide-react";
import type {
  Campaign,
  CampaignObjective,
  CampaignSettings,
  Force,
  FriendSummary,
  PendingInvite,
  User,
} from "../types/app";
import PageTitle from "../components/PageTitle";
import { ERA_OPTIONS as APP_ERA_OPTIONS } from "../constants/appOptions";

const CAMPAIGN_TYPES = ["Chaos", "Advanced", "Conquest"];
const ERA_OPTIONS = APP_ERA_OPTIONS.filter((era) => era !== "All");
const RULES_LEVEL_OPTIONS = ["Introductory", "Standard", "Advanced"];
const OBJECTIVE_CONTROL_OPTIONS = ["Binary", "Percentage"];
const OBJECTIVE_TYPES = ["Factory", "Depot", "Comms Array", "Small City", "Large City", "Fort Holding", "Repair Facility", "Space Port", "Medical Facility"];
const REPAIR_PRIORITY_OPTIONS = [
  "General Repair Priority",
  "Armor and Structure Priority",
  "Limbs and Components Priority",
  "Weapons Priority",
  "Repair, Scrounge, and Salvage Priority",
];
const REPAIR_PRIORITY_DETAILS = [
  {
    title: "General Repair Priority",
    description: "The tech force chooses repairs using the general repair flow: rearm all units; repair or replace missing legs; repair gyros and engines; repair or replace missing arms; repair or replace weapons; repair broken equipment or components; repair armor; then repair structure.",
  },
  {
    title: "Armor and Structure Priority",
    description: "Prioritizes restoring armor and internal structure across the force.",
  },
  {
    title: "Limbs and Components Priority",
    description: "Prioritizes major repair jobs such as limb replacement and component replacement.",
  },
  {
    title: "Weapons Priority",
    description: "Prioritizes replacing or repairing weapons first, then armor.",
  },
  {
    title: "Repair, Scrounge, and Salvage Priority",
    description: "Uses general repairs while increasing emphasis on acquiring parts or salvage. Less total time may be devoted to direct repair work.",
  },
];
const ACTIVE_STATUSES = new Set(["Setup", "Active", "Paused"]);
const ERA_YEAR_RANGES: Record<string, { min: number; max: number }> = {
  "Star League": { min: 2571, max: 2780 },
  "Succession Wars": { min: 2781, max: 3049 },
  "Clan Invasion": { min: 3050, max: 3061 },
  "Civil War": { min: 3062, max: 3067 },
  Jihad: { min: 3068, max: 3085 },
  Republic: { min: 3086, max: 3130 },
  "Dark Age": { min: 3131, max: 3150 },
  IlClan: { min: 3151, max: 3999 },
};
const PLAYER_CONTROL_COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Green", hex: "#22c55e" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Cyan", hex: "#06b6d4" },
];
type PlayerMode = "2" | "3-10";
type CampaignParticipantView = NonNullable<Campaign["participants"]>[number];

function isInactiveCampaign(campaign: Campaign): boolean {
  return !ACTIVE_STATUSES.has(campaign.status ?? "Setup");
}

function formatNumber(value: unknown, fallback = "—"): string {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toLocaleString() : fallback;
}

function getCampaignForce(
  campaign: Campaign,
  forces: Force[],
): Force | undefined {
  const assignedForceId = campaign.assignedForceId;
  if (assignedForceId)
    return forces.find((force) => force.id === assignedForceId);
  return forces.find(
    (force) => force.campaignId === campaign.id && force.status !== "Deleted",
  );
}

function defaultResourcesForType(type: string) {
  if (type === "Chaos") return { Warchest: 1000 };
  return { CBills: 5000000 };
}

function playerModeFromSettings(settings?: CampaignSettings): PlayerMode {
  return Number(settings?.maxPlayers ?? 2) > 2 ? "3-10" : "2";
}

function maxPlayersForMode(mode: PlayerMode): number {
  return mode === "3-10" ? 10 : 2;
}

function normalizeObjectiveControl(
  playerMode: PlayerMode,
  requested: string,
): string {
  return playerMode === "3-10" ? "Percentage" : requested;
}

function resourceLabel(settings?: CampaignSettings): string {
  const resources = settings?.startingResources ?? {};
  if (settings?.type === "Chaos")
    return `${formatNumber(resources.Warchest ?? 0)} WP`;
  return `${formatNumber(resources.CBills ?? 0)} C-bills`;
}

function campaignFluffSummary(settings?: CampaignSettings): string {
  const fluff = settings?.fluff;
  if (!fluff?.year && !fluff?.planet && !fluff?.conflictDescription) return "No campaign fluff added yet.";
  return [fluff.year ? String(fluff.year) : null, fluff.planet, fluff.conflictDescription].filter(Boolean).join(" • ");
}

function campaignYearIsValid(year: number | undefined, era: string | undefined) {
  if (!year || !era) return true;
  const range = ERA_YEAR_RANGES[era];
  if (!range) return true;
  return year >= range.min && year <= range.max;
}

function campaignDateLabel(campaign: Campaign): string {
  const year = campaign.settings?.fluff?.year;
  if (year) return String(year);
  if (campaign.startDate) return new Date(campaign.startDate).toLocaleDateString();
  return "Not dated";
}

function defaultVictoryConditions(type: string, objectiveControlType?: string) {
  const isBinaryControl = objectiveControlType === "Binary";
  return {
    capitulationBVEnabled: true,
    capitulationBVPercent: 10,
    capitulationResourcesEnabled: true,
    capitulationResourcesPercent: 10,
    dominationEnabled: !isBinaryControl,
    dominationControlPercent: 70,
    keyObjectivesEnabled: false,
    turnsElapsedEnabled: false,
    turnsElapsed: type === "Conquest" ? 25 : 10,
    mapControlEnabled: false,
    mapControlPercent: type === "Conquest" ? 75 : undefined,
  };
}

function normalizePercent(value: unknown, fallback: number) {
  const parsed = Math.floor(Number(value));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(100, parsed));
}

function clampObjectiveCount(value: unknown) {
  const parsed = Math.floor(Number(value));
  if (!Number.isFinite(parsed)) return 2;
  return Math.max(2, Math.min(20, parsed));
}

function objectivesAreReady(campaign: Campaign): boolean {
  const settings = campaign.settings;
  const victory = settings?.victoryConditions;
  const objectives = settings?.objectives ?? [];
  if (!victory || !settings?.victoryConditionsReviewed) return false;
  if (objectives.length < 2) return false;
  if (victory.keyObjectivesEnabled && !objectives.some((objective) => objective.isKey)) return false;
  return true;
}

function objectiveSummary(settings?: CampaignSettings): string {
  const objectives = settings?.objectives ?? [];
  if (!objectives.length) return "No objectives configured.";
  const keyCount = objectives.filter((objective) => objective.isKey).length;
  return `${objectives.length} objective${objectives.length === 1 ? "" : "s"}${keyCount ? ` • ${keyCount} key` : ""}`;
}

function victorySummary(settings?: CampaignSettings): string {
  const victory = settings?.victoryConditions;
  if (!victory) return "Victory conditions not configured.";
  const enabled = [
    victory.capitulationBVEnabled ? `BV capitulation at ${victory.capitulationBVPercent ?? 10}%` : null,
    victory.capitulationResourcesEnabled ? `Resource capitulation at ${victory.capitulationResourcesPercent ?? 10}%` : null,
    victory.dominationEnabled ? `${victory.dominationControlPercent ?? 70}% planet control` : null,
    victory.keyObjectivesEnabled ? "Key objective control" : null,
    victory.turnsElapsedEnabled ? `${victory.turnsElapsed ?? 25} turns elapsed` : null,
    victory.mapControlEnabled ? `${victory.mapControlPercent ?? 75}% map control` : null,
  ].filter(Boolean);
  return enabled.length ? enabled.join(" • ") : "No active victory conditions.";
}

function getRulesRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown")
    return null;
  const normalized = value.toLowerCase();
  const order = [
    "introductory",
    "standard",
    "advanced",
    "experimental",
    "unofficial",
  ];
  const index = order.findIndex((entry) => normalized.includes(entry));
  return index >= 0 ? index : null;
}

function getEraRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown")
    return null;
  const normalized = value.toLowerCase();
  if (normalized.includes("succession war")) return 2;
  if (normalized.includes("republic")) return 6;
  const eraOrder = [
    "age of war",
    "star league",
    "clan invasion",
    "civil war",
    "jihad",
    "dark age",
    "ilclan",
  ];
  const index = eraOrder.findIndex((era) => normalized.includes(era));
  if (index < 0) return null;
  return index >= 2 ? index + 1 : index;
}

function totalForceBV(force: Force): number {
  const forceUnitsBV = force.forceUnits?.reduce(
    (total, forceUnit) =>
      total + Number(forceUnit.currentBV ?? forceUnit.snapshot?.totalBV ?? 0),
    0,
  );
  if (forceUnitsBV && forceUnitsBV > 0) return forceUnitsBV;
  return Number(force.totalBV ?? 0);
}

function getForceEligibility(
  force: Force,
  campaign: Campaign,
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const settings = campaign.settings;
  if (!settings)
    return { eligible: false, reasons: ["Campaign settings are missing."] };

  const forceBV = totalForceBV(force);
  const limit = Number(settings.forceBVLimit ?? 0);
  if (limit > 0 && forceBV > limit) {
    reasons.push(
      `Force BV exceeds campaign limit by ${(forceBV - limit).toLocaleString()} BV.`,
    );
  }

  const campaignRulesRank = getRulesRank(settings.rulesLevel);
  const forceRulesRank = getRulesRank(force.rulesLevel);
  if (
    campaignRulesRank !== null &&
    forceRulesRank !== null &&
    forceRulesRank > campaignRulesRank
  ) {
    reasons.push(
      `${force.rulesLevel} force rules are above the campaign's ${settings.rulesLevel} limit.`,
    );
  }

  const campaignEraRank = getEraRank(settings.era);
  const forceEraRank = getEraRank(force.era);
  if (
    campaignEraRank !== null &&
    forceEraRank !== null &&
    forceEraRank > campaignEraRank
  ) {
    reasons.push(
      `${force.era} force era is later than the campaign's ${settings.era} era.`,
    );
  }

  if (settings.type === "Conquest") {
    if (!force.forConquest)
      reasons.push("Conquest campaigns require a conquest-enabled force.");
    const campaignTeamCount = Number(settings.combatTeamCount ?? 0);
    const forceTeamCount = Number(force.combatTeamCount ?? 0);
    if (campaignTeamCount > 0 && forceTeamCount > campaignTeamCount) {
      reasons.push(
        `Force uses ${forceTeamCount} combat teams; campaign allows ${campaignTeamCount}.`,
      );
    }
    const campaignTeamBV = Number(settings.combatTeamBVLimit ?? 0);
    const forceTeamBV = Number(force.combatTeamBV ?? 0);
    if (campaignTeamBV > 0 && forceTeamBV > campaignTeamBV) {
      reasons.push(
        `Force combat team BV limit exceeds the campaign's ${campaignTeamBV.toLocaleString()} BV limit.`,
      );
    }
  }

  return { eligible: reasons.length === 0, reasons };
}

function campaignInviteStatus(campaign: Campaign) {
  const participants = campaign.participants ?? [];
  const owner = participants.find(
    (participant) => participant.role === "Owner",
  );
  const pending = participants.filter(
    (participant) =>
      participant.status === "Pending" && participant.role !== "Owner",
  );
  const accepted = participants.filter(
    (participant) => participant.status === "Accepted",
  );
  const invitedOrJoined = participants.filter(
    (participant) =>
      participant.role !== "Owner" &&
      (participant.status === "Pending" || participant.status === "Accepted"),
  );
  return {
    owner,
    pending,
    accepted,
    invitedOrJoined,
    invitedCount: pending.length,
    joinedCount: accepted.length,
    totalPlayersAccountedFor: accepted.length + pending.length,
  };
}

function playerScopeSummary(settings?: CampaignSettings): {
  label: string;
  ready: (joined: number) => boolean;
  detail: string;
} {
  if (playerModeFromSettings(settings) === "3-10") {
    return {
      label: "3-10 players",
      ready: (joined) => joined >= 3 && joined <= 10,
      detail: "Needs at least 3 joined players and allows up to 10.",
    };
  }
  return {
    label: "2 players",
    ready: (joined) => joined === 2,
    detail: "Needs exactly 2 joined players, including the campaign owner.",
  };
}

function playerReadiness(campaign: Campaign) {
  const accepted = (campaign.participants ?? []).filter(
    (participant) => participant.status === "Accepted",
  );
  const scope = playerScopeSummary(campaign.settings);
  const countReady = scope.ready(accepted.length);
  const allForcesAssigned =
    accepted.length > 0 &&
    accepted.every((participant) => Boolean(participant.forceId));
  return {
    accepted,
    countReady,
    allForcesAssigned,
    ready: countReady && allForcesAssigned,
  };
}

function forceSummaryForParticipant(
  participant: NonNullable<Campaign["participants"]>[number],
  forces: Force[],
): { name?: string; totalBV?: number; faction?: string } | undefined {
  if (participant.force) return participant.force;
  if (!participant.forceId) return undefined;
  const force = forces.find(
    (candidate) => candidate.id === participant.forceId,
  );
  return force
    ? {
        name: force.name,
        totalBV: totalForceBV(force),
        faction: force.faction,
      }
    : undefined;
}
export default function CampaignsPage({
  authUser,
  campaigns,
  forces,
  friends,
  invites,
  openInvitesSignal,
  focusCampaignId,
  onCampaignFocusConsumed,
  loading,
  error,
  createLoading,
  createError,
  onCreateCampaign,
  updateLoading = false,
  updateError,
  assignForceLoading = false,
  assignForceError,
  onUpdateCampaign,
  onAssignForceToCampaign,
  onBeginCampaign,
  onInviteFriendToCampaign,
  onUninviteCampaignPlayer,
  onRespondToCampaignInvitation,
}: {
  authUser: User | null;
  campaigns: Campaign[];
  forces: Force[];
  friends: FriendSummary[];
  invites: PendingInvite[];
  openInvitesSignal?: number;
  focusCampaignId?: string | null;
  onCampaignFocusConsumed?: () => void;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  onCreateCampaign: (payload: {
    name: string;
    description?: string;
    settings: CampaignSettings;
  }) => Promise<Campaign | null>;
  updateLoading?: boolean;
  updateError?: string | null;
  assignForceLoading?: boolean;
  assignForceError?: string | null;
  onUpdateCampaign: (
    campaignId: string,
    payload: {
      name?: string;
      description?: string;
      settings?: Partial<CampaignSettings>;
    },
  ) => Promise<Campaign | null>;
  onAssignForceToCampaign: (
    campaignId: string,
    forceId: string | null,
  ) => Promise<Campaign | null>;
  onBeginCampaign: (campaignId: string) => Promise<Campaign | null>;
  onInviteFriendToCampaign: (
    campaignId: string,
    friendUserId: string,
  ) => Promise<Campaign | null>;
  onUninviteCampaignPlayer: (
    campaignId: string,
    participantUserId: string,
  ) => Promise<Campaign | null>;
  onRespondToCampaignInvitation: (
    campaignId: string,
    accept: boolean,
  ) => Promise<Campaign | null>;
}) {
  const [showInactive, setShowInactive] = useState(false);
  const [showPendingInvites, setShowPendingInvites] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<PendingInvite | null>(
    null,
  );
  const [inviteResponseBusyId, setInviteResponseBusyId] = useState<
    string | null
  >(null);
  const [creating, setCreating] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [assigningForce, setAssigningForce] = useState(false);
  const [invitingPlayers, setInvitingPlayers] = useState(false);
  const [campaignInviteBusyId, setCampaignInviteBusyId] = useState<
    string | null
  >(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [editingVictoryConditions, setEditingVictoryConditions] = useState(false);
  const [editingObjectives, setEditingObjectives] = useState(false);
  const [editingFluff, setEditingFluff] = useState(false);
  const [activeDashboardView, setActiveDashboardView] = useState<"objectives" | "planet" | "victory">("objectives");
  const [candidateForceId, setCandidateForceId] = useState<string | null>(null);

  useEffect(() => {
    if (openInvitesSignal) {
      setSelectedCampaignId(null);
      setShowPendingInvites(true);
    }
  }, [openInvitesSignal]);

  useEffect(() => {
    if (focusCampaignId) {
      setSelectedCampaignId(focusCampaignId);
      setShowPendingInvites(false);
      onCampaignFocusConsumed?.();
    }
  }, [focusCampaignId, onCampaignFocusConsumed]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [campaignType, setCampaignType] = useState("Advanced");
  const [playerMode, setPlayerMode] = useState<PlayerMode>("2");
  const [era, setEra] = useState("");
  const [rulesLevel, setRulesLevel] = useState("Standard");
  const [forceBVLimit, setForceBVLimit] = useState(15000);
  const [maxTurnsAhead, setMaxTurnsAhead] = useState(4);
  const [combatTeamCount, setCombatTeamCount] = useState(3);
  const [combatTeamBVLimit, setCombatTeamBVLimit] = useState(5000);
  const [combatTeamSize, setCombatTeamSize] = useState(4);
  const [objectiveControlType, setObjectiveControlType] = useState("Percentage");
  const [salariesEnabled, setSalariesEnabled] = useState(false);
  const [warchest, setWarchest] = useState(1000);
  const [cBills, setCBills] = useState(5000000);
  const [victoryConditions, setVictoryConditions] = useState(defaultVictoryConditions("Advanced", "Percentage"));
  const [objectiveCount, setObjectiveCount] = useState(4);
  const [objectiveMode, setObjectiveMode] = useState<"random" | "select">("random");
  const [selectedObjectiveTypes, setSelectedObjectiveTypes] = useState<string[]>(OBJECTIVE_TYPES);
  const [objectiveDrafts, setObjectiveDrafts] = useState<CampaignObjective[]>([]);
  const [fluffYear, setFluffYear] = useState<number | undefined>(undefined);
  const [fluffPlanet, setFluffPlanet] = useState("");
  const [fluffDescription, setFluffDescription] = useState("");

  const selectedCampaign =
    campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? null;
  const visibleCampaigns = useMemo(
    () =>
      campaigns.filter((campaign) =>
        showInactive ? isInactiveCampaign(campaign) : !isInactiveCampaign(campaign),
      ),
    [campaigns, showInactive],
  );
  const activeCount = campaigns.filter((campaign) => !isInactiveCampaign(campaign)).length;
  const inactiveCount = campaigns.filter(isInactiveCampaign).length;
  const isMultiPlayerMode = playerMode === "3-10";
  const effectiveObjectiveControlType = normalizeObjectiveControl(
    playerMode,
    objectiveControlType,
  );

  const resetCreateForm = () => {
    setName("");
    setDescription("");
    setCampaignType("Advanced");
    setPlayerMode("2");
    setEra("");
    setRulesLevel("Standard");
    setForceBVLimit(15000);
    setMaxTurnsAhead(4);
    setCombatTeamCount(3);
    setCombatTeamBVLimit(5000);
    setCombatTeamSize(4);
    setObjectiveControlType("Percentage");
    setSalariesEnabled(true);
    setWarchest(1000);
    setCBills(5000000);
    setVictoryConditions(defaultVictoryConditions("Advanced", "Percentage"));
    setObjectiveCount(4);
    setObjectiveMode("random");
    setSelectedObjectiveTypes(OBJECTIVE_TYPES);
    setObjectiveDrafts([]);
    setFluffYear(undefined);
    setFluffPlanet("");
    setFluffDescription("");
  };

  const setTypeAndDefaults = (nextType: string) => {
    setCampaignType(nextType);
    if (nextType === "Conquest") {
      setPlayerMode("2");
    }
    setObjectiveControlType("Percentage");
    setSalariesEnabled(nextType !== "Chaos");
    setVictoryConditions(defaultVictoryConditions(nextType, "Percentage"));
    const resources = defaultResourcesForType(nextType);
    setWarchest(resources.Warchest ?? 1000);
    setCBills(resources.CBills ?? 5000000);
  };

  const buildSettingsFromForm = (): CampaignSettings => {
    const isConquest = campaignType === "Conquest";
    const finalPlayerMode = isConquest ? "2" : playerMode;
    const maxPlayers = maxPlayersForMode(finalPlayerMode);
    return {
      type: campaignType,
      era,
      rulesLevel,
      forceBVLimit,
      maxPlayers,
      maxTurnsAhead: finalPlayerMode === "3-10" ? maxTurnsAhead : undefined,
      maxTurns: finalPlayerMode === "3-10" ? maxTurnsAhead : undefined,
      combatTeamRules: isConquest,
      combatTeamCount: isConquest ? combatTeamCount : undefined,
      combatTeamBVLimit: isConquest ? combatTeamBVLimit : undefined,
      combatTeamSize: isConquest ? combatTeamSize : undefined,
      objectiveControlType: normalizeObjectiveControl(
        finalPlayerMode,
        objectiveControlType,
      ),
      salariesEnabled,
      startingResources:
        campaignType === "Chaos" ? { Warchest: warchest } : { CBills: cBills },
      victoryConditions: defaultVictoryConditions(campaignType, normalizeObjectiveControl(finalPlayerMode, objectiveControlType)),
      victoryConditionsReviewed: false,
      fluff: {
        year: fluffYear,
        planet: fluffPlanet.trim() || undefined,
        conflictDescription: fluffDescription.trim() || undefined,
      },
    };
  };

  const loadFormFromCampaign = (campaign: Campaign) => {
    const settings = campaign.settings;
    setName(campaign.name);
    setDescription(campaign.description ?? "");
    setCampaignType(settings?.type ?? "Advanced");
    setPlayerMode(
      settings?.type === "Conquest" ? "2" : playerModeFromSettings(settings),
    );
    setEra(settings?.era ?? "");
    setRulesLevel(settings?.rulesLevel ?? "Standard");
    setForceBVLimit(Number(settings?.forceBVLimit ?? 15000));
    setMaxTurnsAhead(
      Number(settings?.maxTurnsAhead ?? settings?.maxTurns ?? 4),
    );
    setCombatTeamCount(Number(settings?.combatTeamCount ?? 3));
    setCombatTeamBVLimit(Number(settings?.combatTeamBVLimit ?? 5000));
    setCombatTeamSize(Number(settings?.combatTeamSize ?? 4));
    setObjectiveControlType(settings?.objectiveControlType ?? "Percentage");
    setSalariesEnabled(Boolean(settings?.salariesEnabled));
    setWarchest(Number(settings?.startingResources?.Warchest ?? 1000));
    setCBills(Number(settings?.startingResources?.CBills ?? 5000000));
    setVictoryConditions({
      ...defaultVictoryConditions(settings?.type ?? "Advanced", settings?.objectiveControlType),
      ...(settings?.victoryConditions ?? {}),
    });
    const currentObjectives = settings?.objectives ?? [];
    setObjectiveCount(currentObjectives.length ? currentObjectives.length : 4);
    setObjectiveMode(currentObjectives.length ? "select" : "random");
    setSelectedObjectiveTypes(OBJECTIVE_TYPES);
    setObjectiveDrafts(currentObjectives);
    setFluffYear(settings?.fluff?.year);
    setFluffPlanet(settings?.fluff?.planet ?? "");
    setFluffDescription(settings?.fluff?.conflictDescription ?? "");
  };

  const submitCreateCampaign = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!era) return;
    if (fluffYear && !campaignYearIsValid(fluffYear, era)) return;
    const created = await onCreateCampaign({
      name,
      description: description.trim() || undefined,
      settings: buildSettingsFromForm(),
    });
    if (created) {
      resetCreateForm();
      setCreating(false);
      setSelectedCampaignId(created.id);
    }
  };

  const submitCampaignSettingsUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCampaign) return;
    if (!era) return;
    if (fluffYear && !campaignYearIsValid(fluffYear, era)) return;
    const updated = await onUpdateCampaign(selectedCampaign.id, {
      name,
      description: description.trim() || undefined,
      settings: buildSettingsFromForm(),
    });
    if (updated) {
      setEditingSettings(false);
      setSelectedCampaignId(updated.id);
    }
  };

  const submitVictoryConditions = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCampaign) return;
    const settings = selectedCampaign.settings;
    const cleanedVictory = {
      ...victoryConditions,
      capitulationBVEnabled: true,
      capitulationResourcesEnabled: true,
      capitulationBVPercent: normalizePercent(victoryConditions.capitulationBVPercent, 10),
      capitulationResourcesPercent: normalizePercent(victoryConditions.capitulationResourcesPercent, 10),
      dominationEnabled: settings?.objectiveControlType === "Binary" ? false : Boolean(victoryConditions.dominationEnabled),
      dominationControlPercent: normalizePercent(victoryConditions.dominationControlPercent, 70),
      keyObjectivesEnabled: settings?.objectiveControlType === "Binary" ? false : Boolean(victoryConditions.keyObjectivesEnabled),
      turnsElapsedEnabled: Boolean(victoryConditions.turnsElapsedEnabled),
      turnsElapsed: Math.max(1, Math.floor(Number(victoryConditions.turnsElapsed ?? (settings?.type === "Conquest" ? 25 : 10)))),
      mapControlEnabled: settings?.type === "Conquest" ? Boolean(victoryConditions.mapControlEnabled) : false,
      mapControlPercent: settings?.type === "Conquest" ? normalizePercent(victoryConditions.mapControlPercent, 75) : undefined,
    };
    const updated = await onUpdateCampaign(selectedCampaign.id, {
      settings: { victoryConditions: cleanedVictory, victoryConditionsReviewed: true },
    });
    if (updated) {
      setEditingVictoryConditions(false);
      setSelectedCampaignId(updated.id);
    }
  };

  const submitObjectives = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCampaign) return;
    const count = clampObjectiveCount(objectiveCount);
    const allowedTypes = selectedObjectiveTypes.length ? selectedObjectiveTypes : OBJECTIVE_TYPES;
    const keyRequired = Boolean(selectedCampaign.settings?.victoryConditions?.keyObjectivesEnabled);
    let objectives: CampaignObjective[];

    if (objectiveMode === "random") {
      objectives = Array.from({ length: count }, (_, index) => {
        const type = allowedTypes[index % allowedTypes.length];
        return {
          id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`,
          name: `${type} ${index + 1}`,
          type,
          isKey: keyRequired && index === 0,
        };
      });
    } else {
      objectives = Array.from({ length: count }, (_, index) => {
        const current = objectiveDrafts[index];
        const type = current?.type && OBJECTIVE_TYPES.includes(current.type) ? current.type : allowedTypes[0] ?? OBJECTIVE_TYPES[0];
        return {
          id: current?.id ?? (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`),
          name: current?.name?.trim() || `${type} ${index + 1}`,
          type,
          isKey: Boolean(current?.isKey),
        };
      });
      if (keyRequired && !objectives.some((objective) => objective.isKey)) {
        objectives[0] = { ...objectives[0], isKey: true };
      }
    }

    const updated = await onUpdateCampaign(selectedCampaign.id, {
      settings: { objectives },
    });
    if (updated) {
      setEditingObjectives(false);
      setSelectedCampaignId(updated.id);
    }
  };


  const submitFluff = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCampaign) return;
    const range = ERA_YEAR_RANGES[selectedCampaign.settings?.era ?? ""];
    const cleanYear = fluffYear ? Math.floor(Number(fluffYear)) : undefined;
    if (cleanYear && range && (cleanYear < range.min || cleanYear > range.max)) {
      return;
    }
    const updated = await onUpdateCampaign(selectedCampaign.id, {
      settings: {
        fluff: {
          year: cleanYear,
          planet: fluffPlanet.trim() || undefined,
          conflictDescription: fluffDescription.trim() || undefined,
        },
      },
    });
    if (updated) {
      setEditingFluff(false);
      setSelectedCampaignId(updated.id);
    }
  };

  const beginSelectedCampaign = async () => {
    if (!selectedCampaign) return;
    const updated = await onBeginCampaign(selectedCampaign.id);
    if (updated) setSelectedCampaignId(updated.id);
  };

  if (!authUser) {
    return (
      <section className="space-y-5">
        <PageTitle
          eyebrow="Campaigns"
          title="Sign in required"
          description="Please sign in to view your active campaigns and invitations."
        />
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400">
          Sign in on the Account page to continue.
        </div>
      </section>
    );
  }

  if (selectedCampaign) {
    const force = getCampaignForce(selectedCampaign, forces);
    const settings = selectedCampaign.settings;
    const isCampaignOwner = selectedCampaign.ownerId === authUser.id;
    const anyForceCommitted = (selectedCampaign.participants ?? []).some(
      (participant) =>
        participant.status === "Accepted" && Boolean(participant.forceId),
    );
    const canEditSetup =
      isCampaignOwner &&
      selectedCampaign.status === "Setup" &&
      !anyForceCommitted;
    const forceAssigned = Boolean(force);
    const ownerReady = forceAssigned;
    const objectivesReady = objectivesAreReady(selectedCampaign);
    const inviteStatus = campaignInviteStatus(selectedCampaign);
    const playerScope = playerScopeSummary(settings);
    const playerStatus = playerReadiness(selectedCampaign);
    const invitedPlayersReady = playerStatus.ready;
    const canBeginCampaign =
      ownerReady && objectivesReady && invitedPlayersReady;
    const fluffReady = Boolean(settings?.fluff?.year && settings?.fluff?.planet?.trim());
    const matchingForces = forces.filter(
      (candidate) =>
        candidate.status !== "Deleted" && candidate.origin !== "CampaignCopy",
    );
    const selectedCandidate =
      matchingForces.find((candidate) => candidate.id === candidateForceId) ??
      null;
    const selectedEligibility = selectedCandidate
      ? getForceEligibility(selectedCandidate, selectedCampaign)
      : null;

    if (selectedCampaign.status === "Active") {
      return (
        <>
          <ActiveCampaignDashboard
            campaign={selectedCampaign}
            force={force}
            isCampaignOwner={isCampaignOwner}
            authUserId={authUser.id}
            activeView={activeDashboardView}
            setActiveView={setActiveDashboardView}
            onBack={() => setSelectedCampaignId(null)}
            onOpenFluff={() => {
              loadFormFromCampaign(selectedCampaign);
              setEditingFluff(true);
            }}
          />
          {editingFluff && (
            <CampaignFluffModal
              campaign={selectedCampaign}
              year={fluffYear}
              setYear={setFluffYear}
              planet={fluffPlanet}
              setPlanet={setFluffPlanet}
              conflictDescription={fluffDescription}
              setConflictDescription={setFluffDescription}
              updateLoading={updateLoading}
              updateError={updateError}
              onClose={() => setEditingFluff(false)}
              onSubmit={submitFluff}
            />
          )}
        </>
      );
    }

    return (
      <section className="space-y-5">
        <PageTitle
          eyebrow="Campaign Dashboard"
          title={selectedCampaign.name}
          description="Complete setup steps before beginning the campaign. Force copies, objectives, player invitations, and the full turn dashboard can expand from here."
          actions={
            <button
              type="button"
              onClick={() => setSelectedCampaignId(null)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
            >
              <ArrowLeft size={16} /> Back to Campaigns
            </button>
          }
        />

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                  {settings?.type ?? "Campaign"}
                </div>
                <h2 className="mt-2 text-2xl font-black text-zinc-50">
                  Setup Dashboard
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                  {selectedCampaign.description ||
                    "No campaign description provided yet."}
                </p>
              </div>
              <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-200">
                {selectedCampaign.status ?? "Setup"}
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <DashboardStep
                complete={forceAssigned}
                title="Assign your force"
                description={
                  force
                    ? `${force.name} is committed to this campaign setup.`
                    : "Choose a force that satisfies the campaign restrictions. This does not create the campaign-specific duplicate yet."
                }
              >
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCandidateForceId(force?.id ?? null);
                      setAssigningForce(true);
                    }}
                    className="rounded-xl bg-lime-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-lime-300"
                  >
                    {force ? "Change Force" : "Assign Force"}
                  </button>
                  {force && (
                    <button
                      type="button"
                      disabled={assignForceLoading}
                      onClick={() =>
                        onAssignForceToCampaign(selectedCampaign.id, null)
                      }
                      className="rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Uncommit Force
                    </button>
                  )}
                </div>
              </DashboardStep>

              <DashboardStep
                complete={invitedPlayersReady}
                title={isCampaignOwner ? "Invite players" : "Players"}
                description={
                  isCampaignOwner
                    ? `Invite friends to join this ${playerScope.label} campaign. ${playerScope.detail}`
                    : `View joined players and force assignments for this ${playerScope.label} campaign. ${playerScope.detail}`
                }
              >
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <MiniFact
                    label="Invited"
                    value={String(inviteStatus.invitedCount)}
                  />
                  <MiniFact
                    label="Joined"
                    value={String(playerStatus.accepted.length)}
                  />
                  <MiniFact label="Target" value={playerScope.label} />
                </div>
                <div className="mt-3 space-y-2">
                  {playerStatus.accepted.map((participant) => {
                    const assignedForce = forceSummaryForParticipant(
                      participant,
                      forces,
                    );
                    return (
                      <div
                        key={participant.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3 text-sm"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="font-black text-zinc-100">
                              {participant.user?.displayName ?? "Commander"}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {participant.role}
                            </div>
                          </div>
                          {assignedForce ? (
                            <div className="text-left sm:text-right">
                              <div className="font-semibold text-lime-100">
                                {assignedForce.name}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {formatNumber(assignedForce.totalBV)} BV •{" "}
                                {assignedForce.faction || "No faction"}
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-full border border-red-500/40 bg-red-950/30 px-3 py-1 text-xs font-semibold text-red-200">
                              Force not assigned
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {isCampaignOwner && (
                    <button
                      type="button"
                      onClick={() => setInvitingPlayers(true)}
                      className="rounded-xl bg-lime-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-lime-300"
                    >
                      Manage Invites
                    </button>
                  )}
                  <span
                    className={`text-xs ${invitedPlayersReady ? "text-lime-200" : "text-red-200"}`}
                  >
                    {invitedPlayersReady
                      ? "Player count is valid and all accepted players have assigned forces."
                      : playerStatus.countReady
                        ? "Player count is valid, but every accepted player still needs a force assigned."
                        : "Joined player count does not match the selected campaign scope yet."}
                  </span>
                </div>
              </DashboardStep>
              <DashboardStep
                complete={objectivesReady}
                title="Objectives & Victory Conditions"
                description={
                  objectivesReady
                    ? "Objectives and victory conditions have been reviewed and configured."
                    : isCampaignOwner
                      ? "Configure victory conditions and the campaign objective list before beginning."
                      : "Campaign objectives and victory conditions will be visible here once the owner configures them."
                }
              >
                <div className="mt-3 space-y-2 text-xs text-zinc-400">
                  <div><span className="font-semibold text-zinc-200">Victory:</span> {victorySummary(settings)}</div>
                  <div><span className="font-semibold text-zinc-200">Objectives:</span> {objectiveSummary(settings)}</div>
                </div>
                {isCampaignOwner && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVictoryConditions({
                          ...defaultVictoryConditions(settings?.type ?? "Advanced", settings?.objectiveControlType),
                          ...(settings?.victoryConditions ?? {}),
                        });
                        setEditingVictoryConditions(true);
                      }}
                      className="rounded-xl bg-lime-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-lime-300"
                    >
                      Configure Victory Conditions
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const existing = settings?.objectives ?? [];
                        setObjectiveCount(existing.length ? existing.length : 4);
                        setObjectiveDrafts(existing.length ? existing : []);
                        setObjectiveMode(existing.length ? "select" : "random");
                        setSelectedObjectiveTypes(OBJECTIVE_TYPES);
                        setEditingObjectives(true);
                      }}
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
                    >
                      Configure Objectives
                    </button>
                  </div>
                )}
              </DashboardStep>
              <DashboardStep
                complete={fluffReady}
                optional={!fluffReady}
                title="Optional campaign fluff"
                description={
                  fluffReady
                    ? campaignFluffSummary(settings)
                    : "Optional. Add a year and planet to show campaign flavor in the active dashboard."
                }
              >
                <div className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                    <span className="font-semibold text-zinc-200">Year:</span>{" "}
                    {settings?.fluff?.year ?? "Not set"}
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                    <span className="font-semibold text-zinc-200">Planet:</span>{" "}
                    {settings?.fluff?.planet || "Not set"}
                  </div>
                </div>
                {settings?.fluff?.conflictDescription && (
                  <p className="mt-3 text-xs leading-5 text-zinc-500">
                    {settings.fluff.conflictDescription}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {isCampaignOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        loadFormFromCampaign(selectedCampaign);
                        setEditingFluff(true);
                      }}
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
                    >
                      {settings?.fluff ? "Edit Fluff" : "Add Fluff"}
                    </button>
                  )}
                </div>
              </DashboardStep>
              <DashboardStep
                complete
                className="md:col-span-2"
                title="Review / edit setup"
                description={
                  canEditSetup
                    ? "Review or change campaign setup values before any force is committed."
                    : isCampaignOwner
                      ? "A force has been committed, so setup values are locked for now."
                      : "Review the campaign setup values chosen by the campaign owner."
                }
              >
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loadFormFromCampaign(selectedCampaign);
                      setEditingSettings(true);
                    }}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
                  >
                    {canEditSetup ? "Review / Edit" : "Review Details"}
                  </button>
                </div>
              </DashboardStep>
            </div>

            {(assignForceError || updateError) && (
              <div className="mt-5 rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
                {assignForceError || updateError}
              </div>
            )}

            {isCampaignOwner && (
              <div className="mt-7 border-t border-zinc-800 pt-5">
                <button
                  type="button"
                  onClick={beginSelectedCampaign}
                  disabled={!canBeginCampaign || updateLoading}
                  className={`w-full rounded-3xl px-5 py-4 text-base font-black transition ${
                    canBeginCampaign
                      ? "bg-lime-400 text-zinc-950 hover:bg-lime-300"
                      : "cursor-not-allowed border border-red-500/40 bg-red-950/30 text-red-200"
                  }`}
                >
                  {updateLoading
                    ? "Beginning Campaign..."
                    : canBeginCampaign
                      ? "Begin Campaign"
                      : "Begin Campaign — Setup Incomplete"}
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <CampaignFactCard label="Era" value={settings?.era ?? "—"} />
            <CampaignFactCard
              label="Rules Level"
              value={settings?.rulesLevel ?? "—"}
            />
            <CampaignFactCard
              label="Player Scope"
              value={
                playerModeFromSettings(settings) === "3-10"
                  ? "3-10 players"
                  : "2 players"
              }
            />
            <CampaignFactCard
              label="Force BV Limit"
              value={formatNumber(settings?.forceBVLimit)}
            />
            <CampaignFactCard
              label="Starting Resources"
              value={resourceLabel(settings)}
            />
            <CampaignFactCard
              label="Associated Force"
              value={force?.name ?? "Not assigned yet"}
            />
          </aside>
        </div>

        {assigningForce && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                    Assign Force
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-zinc-50">
                    Choose a force for {selectedCampaign.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    This commits the selected force to campaign setup. It does
                    not create the campaign-specific duplicate yet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAssigningForce(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200"
                  aria-label="Close assign force modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-3">
                {matchingForces.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-5 text-center text-zinc-400">
                    No user-created forces are available to assign.
                  </div>
                ) : (
                  matchingForces.map((candidate) => {
                    const eligibility = getForceEligibility(
                      candidate,
                      selectedCampaign,
                    );
                    const selected = candidateForceId === candidate.id;
                    return (
                      <button
                        type="button"
                        key={candidate.id}
                        onClick={() => setCandidateForceId(candidate.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-lime-400/70 bg-lime-400/10"
                            : "border-zinc-800 bg-zinc-900/70 hover:border-lime-400/30"
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="text-lg font-black text-zinc-50">
                              {candidate.name}
                            </div>
                            <div className="mt-1 text-sm text-zinc-400">
                              {candidate.era ?? "Unknown era"} •{" "}
                              {candidate.rulesLevel ?? "Unknown rules"} •{" "}
                              {formatNumber(totalForceBV(candidate))} BV
                            </div>
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              eligibility.eligible
                                ? "border-lime-400/30 bg-lime-400/10 text-lime-200"
                                : "border-red-500/40 bg-red-950/30 text-red-200"
                            }`}
                          >
                            {eligibility.eligible
                              ? "Matches"
                              : "Does not match"}
                          </span>
                        </div>
                        {!eligibility.eligible && (
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-red-200/90">
                            {eligibility.reasons.map((reason) => (
                              <li key={reason}>{reason}</li>
                            ))}
                          </ul>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {assignForceError && (
                <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
                  {assignForceError}
                </div>
              )}

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setAssigningForce(false)}
                  className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    !candidateForceId ||
                    !selectedEligibility?.eligible ||
                    assignForceLoading
                  }
                  onClick={async () => {
                    if (!candidateForceId) return;
                    const updated = await onAssignForceToCampaign(
                      selectedCampaign.id,
                      candidateForceId,
                    );
                    if (updated) setAssigningForce(false);
                  }}
                  className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {assignForceLoading ? "Committing..." : "Commit Force"}
                </button>
              </div>
            </div>
          </div>
        )}

        {invitingPlayers && isCampaignOwner && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                    Campaign Invites
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-zinc-50">
                    Invite friends to {selectedCampaign.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Only active friends can be invited. Pending friends must
                    accept the friend request first.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInvitingPlayers(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200"
                  aria-label="Close invite players modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-4">
                <MiniFact
                  label="Invited"
                  value={String(inviteStatus.invitedCount)}
                />
                <MiniFact
                  label="Joined"
                  value={String(inviteStatus.joinedCount)}
                />
                <MiniFact
                  label="Total Pending + Joined"
                  value={String(inviteStatus.totalPlayersAccountedFor)}
                />
                <MiniFact label="Target" value={playerScope.label} />
              </div>

              {friends.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-5 text-center text-zinc-400">
                  You do not have active friends yet. Add friends from the
                  Account page before inviting campaign players.
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend) => {
                    const participant = (
                      selectedCampaign.participants ?? []
                    ).find(
                      (entry) =>
                        entry.userId === friend.friendUserId &&
                        entry.status !== "Removed",
                    );
                    const isOwner = participant?.role === "Owner";
                    const alreadyJoined = participant?.status === "Accepted";
                    const alreadyPending = participant?.status === "Pending";
                    const busy = campaignInviteBusyId === friend.friendUserId;
                    return (
                      <div
                        key={friend.friendUserId}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="font-black text-zinc-100">
                              {friend.displayName}
                            </div>
                            <div className="mt-1 text-xs text-zinc-500">
                              Friend code {friend.friendCode}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                alreadyJoined
                                  ? "border-lime-400/30 bg-lime-400/10 text-lime-200"
                                  : alreadyPending
                                    ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                                    : "border-zinc-700 bg-zinc-950 text-zinc-400"
                              }`}
                            >
                              {alreadyJoined
                                ? "Joined"
                                : alreadyPending
                                  ? "Invited"
                                  : "Not invited"}
                            </span>
                            {!participant && (
                              <button
                                type="button"
                                disabled={busy || updateLoading}
                                onClick={async () => {
                                  setCampaignInviteBusyId(friend.friendUserId);
                                  try {
                                    await onInviteFriendToCampaign(
                                      selectedCampaign.id,
                                      friend.friendUserId,
                                    );
                                  } finally {
                                    setCampaignInviteBusyId(null);
                                  }
                                }}
                                className="rounded-xl bg-lime-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {busy ? "Inviting..." : "Invite"}
                              </button>
                            )}
                            {participant && !isOwner && (
                              <button
                                type="button"
                                disabled={busy || updateLoading}
                                onClick={async () => {
                                  setCampaignInviteBusyId(friend.friendUserId);
                                  try {
                                    await onUninviteCampaignPlayer(
                                      selectedCampaign.id,
                                      friend.friendUserId,
                                    );
                                  } finally {
                                    setCampaignInviteBusyId(null);
                                  }
                                }}
                                className="rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {busy
                                  ? "Updating..."
                                  : alreadyJoined
                                    ? "Remove"
                                    : "Uninvite"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {editingVictoryConditions && selectedCampaign && (
          <VictoryConditionsModal
            campaign={selectedCampaign}
            values={victoryConditions}
            setValues={setVictoryConditions}
            updateLoading={updateLoading}
            updateError={updateError ?? null}
            onClose={() => setEditingVictoryConditions(false)}
            onSubmit={submitVictoryConditions}
          />
        )}

        {editingObjectives && selectedCampaign && (
          <ObjectivesModal
            campaign={selectedCampaign}
            objectiveCount={objectiveCount}
            setObjectiveCount={setObjectiveCount}
            objectiveMode={objectiveMode}
            setObjectiveMode={setObjectiveMode}
            selectedObjectiveTypes={selectedObjectiveTypes}
            setSelectedObjectiveTypes={setSelectedObjectiveTypes}
            objectiveDrafts={objectiveDrafts}
            setObjectiveDrafts={setObjectiveDrafts}
            updateLoading={updateLoading}
            updateError={updateError ?? null}
            onClose={() => setEditingObjectives(false)}
            onSubmit={submitObjectives}
          />
        )}

        {editingFluff && (
          <CampaignFluffModal
            campaign={selectedCampaign}
            year={fluffYear}
            setYear={setFluffYear}
            planet={fluffPlanet}
            setPlanet={setFluffPlanet}
            conflictDescription={fluffDescription}
            setConflictDescription={setFluffDescription}
            updateLoading={updateLoading}
            updateError={updateError}
            onClose={() => setEditingFluff(false)}
            onSubmit={submitFluff}
          />
        )}

        {editingSettings && (
          <CampaignSettingsModal
            mode="edit"
            canEdit={canEditSetup}
            createLoading={updateLoading}
            createError={updateError ?? null}
            onClose={() => setEditingSettings(false)}
            onSubmit={submitCampaignSettingsUpdate}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            campaignType={campaignType}
            setTypeAndDefaults={setTypeAndDefaults}
            playerMode={playerMode}
            setPlayerMode={setPlayerMode}
            era={era}
            setEra={setEra}
            rulesLevel={rulesLevel}
            setRulesLevel={setRulesLevel}
            forceBVLimit={forceBVLimit}
            setForceBVLimit={setForceBVLimit}
            maxTurnsAhead={maxTurnsAhead}
            setMaxTurnsAhead={setMaxTurnsAhead}
            combatTeamCount={combatTeamCount}
            setCombatTeamCount={setCombatTeamCount}
            combatTeamBVLimit={combatTeamBVLimit}
            setCombatTeamBVLimit={setCombatTeamBVLimit}
            combatTeamSize={combatTeamSize}
            setCombatTeamSize={setCombatTeamSize}
            objectiveControlType={objectiveControlType}
            setObjectiveControlType={setObjectiveControlType}
            salariesEnabled={salariesEnabled}
            setSalariesEnabled={setSalariesEnabled}
            warchest={warchest}
            setWarchest={setWarchest}
            cBills={cBills}
            setCBills={setCBills}
            fluffYear={fluffYear}
            setFluffYear={setFluffYear}
            fluffPlanet={fluffPlanet}
            setFluffPlanet={setFluffPlanet}
            fluffDescription={fluffDescription}
            setFluffDescription={setFluffDescription}
          />
        )}
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Campaigns"
        title="My Campaigns"
        description="Create and manage campaign shells. Force assignment, invitations, objectives, and campaign-start steps happen inside each campaign dashboard."
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                resetCreateForm();
                setCreating(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300"
            >
              <Plus size={16} /> New Campaign
            </button>
            <button
              type="button"
              onClick={() => setShowInactive((value) => !value)}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
            >
              {showInactive ? <EyeOff size={16} /> : <Eye size={16} />}
              {showInactive
                ? `Viewing inactive (${inactiveCount})`
                : `Viewing active (${activeCount})`}
            </button>
            <button
              type="button"
              onClick={() => setShowPendingInvites((value) => !value)}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
            >
              Pending invitations ({invites.length})
            </button>
          </>
        }
      />

      {loading && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">
          Loading campaigns...
        </div>
      )}
      {error && (
        <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-6 text-red-200">
          {error}
        </div>
      )}

      {showPendingInvites && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                Pending Invitations
              </div>
              <h2 className="mt-1 text-xl font-black text-zinc-50">
                Campaign invites awaiting your response
              </h2>
            </div>
            <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1 text-xs font-semibold text-zinc-300">
              {invites.length}
            </span>
          </div>

          {invites.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/50 p-5 text-sm text-zinc-400">
              No pending campaign invitations.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {invites.map((invite) => (
                <button
                  type="button"
                  key={invite.participant.id}
                  onClick={() => setSelectedInvite(invite)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-left transition hover:border-lime-400/40 hover:bg-zinc-950"
                >
                  <div className="font-black text-zinc-100">
                    {invite.campaign.name ?? "Campaign invite"}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Invited by{" "}
                    {invite.inviter?.displayName ??
                      invite.participant.invitedById}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <MiniFact
                      label="Era"
                      value={invite.campaign.settings?.era ?? "—"}
                    />
                    <MiniFact
                      label="BV Limit"
                      value={formatNumber(
                        invite.campaign.settings?.forceBVLimit,
                      )}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4">
          {visibleCampaigns.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
              {campaigns.length === 0
                ? "You have no campaigns yet. Create one to begin setup."
                : "No campaigns match the current view."}
            </div>
          ) : (
            visibleCampaigns.map((campaign) => {
              const settings = campaign.settings;
              const force = getCampaignForce(campaign, forces);
              const inactive = isInactiveCampaign(campaign);

              return (
                <button
                  type="button"
                  key={campaign.id}
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className="group rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-left transition hover:border-lime-400/40 hover:bg-zinc-900"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-200">
                          {settings?.type ?? "Campaign"}
                        </span>
                        <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1 text-xs font-semibold text-zinc-300">
                          {campaign.status ?? "Setup"}
                        </span>
                        {inactive && (
                          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="mt-3 text-xl font-black text-zinc-50 transition group-hover:text-lime-100">
                        {campaign.name}
                      </div>
                      <div className="mt-1 max-w-3xl text-sm leading-6 text-zinc-400">
                        {campaign.description ?? "No description provided."}
                      </div>
                    </div>
                    <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-2 lg:min-w-[420px]">
                      <MiniFact label="Era" value={settings?.era ?? "—"} />
                      <MiniFact
                        label="Rules"
                        value={settings?.rulesLevel ?? "—"}
                      />
                      <MiniFact
                        label="Players"
                        value={
                          playerModeFromSettings(settings) === "3-10"
                            ? "3-10"
                            : "2"
                        }
                      />
                      <MiniFact
                        label="Force"
                        value={force?.name ?? "Not assigned"}
                      />
                      <MiniFact
                        label="BV Limit"
                        value={formatNumber(settings?.forceBVLimit)}
                      />
                      <MiniFact
                        label="Resources"
                        value={resourceLabel(settings)}
                      />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {selectedInvite && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                  Campaign Invitation
                </div>
                <h2 className="mt-2 text-2xl font-black text-zinc-50">
                  {selectedInvite.campaign.name ?? "Campaign invite"}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Review the campaign restrictions before accepting. You will
                  assign your force from inside the campaign after accepting.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvite(null)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200"
                aria-label="Close campaign invitation details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {selectedInvite.campaign.description && (
                <p className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm leading-6 text-zinc-300">
                  {selectedInvite.campaign.description}
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniFact
                  label="Campaign Type"
                  value={selectedInvite.campaign.settings?.type ?? "—"}
                />
                <MiniFact
                  label="Player Scope"
                  value={
                    playerModeFromSettings(selectedInvite.campaign.settings) ===
                    "3-10"
                      ? "3-10 players"
                      : "2 players"
                  }
                />
                <MiniFact
                  label="Era"
                  value={selectedInvite.campaign.settings?.era ?? "—"}
                />
                <MiniFact
                  label="Rules"
                  value={selectedInvite.campaign.settings?.rulesLevel ?? "—"}
                />
                <MiniFact
                  label="Force BV Limit"
                  value={formatNumber(
                    selectedInvite.campaign.settings?.forceBVLimit,
                  )}
                />
                <MiniFact
                  label="Resources"
                  value={resourceLabel(selectedInvite.campaign.settings)}
                />
              </div>
            </div>

            {updateError && (
              <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
                {updateError}
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={inviteResponseBusyId === selectedInvite.campaign.id}
                onClick={async () => {
                  setInviteResponseBusyId(selectedInvite.campaign.id);
                  try {
                    await onRespondToCampaignInvitation(
                      selectedInvite.campaign.id,
                      false,
                    );
                    setSelectedInvite(null);
                  } finally {
                    setInviteResponseBusyId(null);
                  }
                }}
                className="rounded-2xl border border-red-500/40 bg-red-950/30 px-5 py-3 text-sm font-semibold text-red-200 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject Invite
              </button>
              <button
                type="button"
                disabled={inviteResponseBusyId === selectedInvite.campaign.id}
                onClick={async () => {
                  setInviteResponseBusyId(selectedInvite.campaign.id);
                  try {
                    const updated = await onRespondToCampaignInvitation(
                      selectedInvite.campaign.id,
                      true,
                    );
                    if (updated) {
                      setSelectedCampaignId(updated.id);
                      setSelectedInvite(null);
                    }
                  } finally {
                    setInviteResponseBusyId(null);
                  }
                }}
                className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Accept Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {editingFluff && selectedCampaign && (
        <CampaignFluffModal
          campaign={selectedCampaign}
          year={fluffYear}
          setYear={setFluffYear}
          planet={fluffPlanet}
          setPlanet={setFluffPlanet}
          conflictDescription={fluffDescription}
          setConflictDescription={setFluffDescription}
          updateLoading={updateLoading}
          updateError={updateError}
          onClose={() => setEditingFluff(false)}
          onSubmit={submitFluff}
        />
      )}

      {creating && (
        <CampaignSettingsModal
          mode="create"
          canEdit
          createLoading={createLoading}
          createError={createError}
          onClose={() => setCreating(false)}
          onSubmit={submitCreateCampaign}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          campaignType={campaignType}
          setTypeAndDefaults={setTypeAndDefaults}
          playerMode={playerMode}
          setPlayerMode={setPlayerMode}
          era={era}
          setEra={setEra}
          rulesLevel={rulesLevel}
          setRulesLevel={setRulesLevel}
          forceBVLimit={forceBVLimit}
          setForceBVLimit={setForceBVLimit}
          maxTurnsAhead={maxTurnsAhead}
          setMaxTurnsAhead={setMaxTurnsAhead}
          combatTeamCount={combatTeamCount}
          setCombatTeamCount={setCombatTeamCount}
          combatTeamBVLimit={combatTeamBVLimit}
          setCombatTeamBVLimit={setCombatTeamBVLimit}
          combatTeamSize={combatTeamSize}
          setCombatTeamSize={setCombatTeamSize}
          objectiveControlType={objectiveControlType}
          setObjectiveControlType={setObjectiveControlType}
          salariesEnabled={salariesEnabled}
          setSalariesEnabled={setSalariesEnabled}
          warchest={warchest}
          setWarchest={setWarchest}
          cBills={cBills}
          setCBills={setCBills}
          fluffYear={fluffYear}
          setFluffYear={setFluffYear}
          fluffPlanet={fluffPlanet}
          setFluffPlanet={setFluffPlanet}
          fluffDescription={fluffDescription}
          setFluffDescription={setFluffDescription}
        />
      )}
    </section>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-lime-400"
      />
      <span>
        <span className="block font-black text-zinc-100">{label}</span>
        {description && <span className="mt-1 block text-xs leading-5 text-zinc-400">{description}</span>}
      </span>
    </label>
  );
}

function VictoryConditionsModal({
  campaign,
  values,
  setValues,
  updateLoading,
  updateError,
  onClose,
  onSubmit,
}: {
  campaign: Campaign;
  values: ReturnType<typeof defaultVictoryConditions>;
  setValues: React.Dispatch<React.SetStateAction<ReturnType<typeof defaultVictoryConditions>>>;
  updateLoading: boolean;
  updateError: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const isConquest = campaign.settings?.type === "Conquest";
  const keyObjectivesDisabled = campaign.settings?.objectiveControlType === "Binary";
  const update = (patch: Partial<ReturnType<typeof defaultVictoryConditions>>) =>
    setValues((current) => ({ ...current, ...patch }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Victory Conditions</div>
            <h2 className="mt-2 text-2xl font-black text-zinc-50">Configure victory conditions</h2>
            <p className="mt-1 text-sm text-zinc-400">These rules determine when the campaign can end. Conquest-only map and turn conditions appear only for Conquest campaigns.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200" aria-label="Close victory conditions modal"><X size={18} /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <ToggleField label="Turn limit" description="End or check the campaign after a fixed number of turns. For non-Conquest campaigns, this replaces total battle count." checked={Boolean(values.turnsElapsedEnabled)} onChange={(checked) => update({ turnsElapsedEnabled: checked })} />
              {values.turnsElapsedEnabled && <div className="mt-3"><NumberField label="Turn Count" value={Number(values.turnsElapsed ?? (isConquest ? 25 : 10))} onChange={(value) => update({ turnsElapsed: value })} min={1} /></div>}
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <ToggleField label="Planet control domination" description={keyObjectivesDisabled ? "Planet-control domination is unavailable with binary objective control." : "Victory by controlling a percentage of the planet across all objectives combined."} checked={Boolean(values.dominationEnabled) && !keyObjectivesDisabled} disabled={keyObjectivesDisabled} onChange={(checked) => update({ dominationEnabled: checked })} />
              {values.dominationEnabled && !keyObjectivesDisabled && <div className="mt-3"><NumberField label="Planet Control %" value={Number(values.dominationControlPercent ?? 70)} onChange={(value) => update({ dominationControlPercent: value })} min={1} max={100} /></div>}
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="text-sm font-black text-zinc-100">BV capitulation</div>
              <p className="mt-1 text-xs text-zinc-500">Always enabled. A player capitulates when remaining BV drops to this percentage.</p>
              <div className="mt-3"><NumberField label="Remaining BV %" value={Number(values.capitulationBVPercent ?? 10)} onChange={(value) => update({ capitulationBVEnabled: true, capitulationBVPercent: value })} min={1} max={100} /></div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="text-sm font-black text-zinc-100">Resource capitulation</div>
              <p className="mt-1 text-xs text-zinc-500">Always enabled. A player capitulates when remaining resources drop to this percentage.</p>
              <div className="mt-3"><NumberField label="Remaining Resources %" value={Number(values.capitulationResourcesPercent ?? 10)} onChange={(value) => update({ capitulationResourcesEnabled: true, capitulationResourcesPercent: value })} min={1} max={100} /></div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <ToggleField label="Control of key objectives" description={keyObjectivesDisabled ? "Key-objective victory is incompatible with binary objective control." : "At least one objective must be marked as a key objective."} checked={Boolean(values.keyObjectivesEnabled) && !keyObjectivesDisabled} disabled={keyObjectivesDisabled} onChange={(checked) => update({ keyObjectivesEnabled: checked })} />
            </div>
            {isConquest && (
              <>
                <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-4">
                  <ToggleField label="Control of map percentage" description="Conquest-only victory condition based on map control." checked={Boolean(values.mapControlEnabled)} onChange={(checked) => update({ mapControlEnabled: checked })} />
                  {values.mapControlEnabled && <div className="mt-3"><NumberField label="Map Control %" value={Number(values.mapControlPercent ?? 75)} onChange={(value) => update({ mapControlPercent: value })} min={1} max={100} /></div>}
                </div>
              </>
            )}
          </div>

          {updateError && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{updateError}</div>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500">Cancel</button>
            <button type="submit" disabled={updateLoading} className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60">{updateLoading ? "Saving..." : "Save Victory Conditions"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ObjectivesModal({
  campaign,
  objectiveCount,
  setObjectiveCount,
  objectiveMode,
  setObjectiveMode,
  selectedObjectiveTypes,
  setSelectedObjectiveTypes,
  objectiveDrafts,
  setObjectiveDrafts,
  updateLoading,
  updateError,
  onClose,
  onSubmit,
}: {
  campaign: Campaign;
  objectiveCount: number;
  setObjectiveCount: (value: number) => void;
  objectiveMode: "random" | "select";
  setObjectiveMode: (value: "random" | "select") => void;
  selectedObjectiveTypes: string[];
  setSelectedObjectiveTypes: React.Dispatch<React.SetStateAction<string[]>>;
  objectiveDrafts: CampaignObjective[];
  setObjectiveDrafts: React.Dispatch<React.SetStateAction<CampaignObjective[]>>;
  updateLoading: boolean;
  updateError: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const count = clampObjectiveCount(objectiveCount);
  const keyRequired = Boolean(campaign.settings?.victoryConditions?.keyObjectivesEnabled);
  const updateObjectiveDraft = (index: number, patch: Partial<CampaignObjective>) => {
    setObjectiveDrafts((current) => {
      const next = [...current];
      const currentObjective = next[index] ?? { id: `${Date.now()}-${index}`, name: `${OBJECTIVE_TYPES[0]} ${index + 1}`, type: OBJECTIVE_TYPES[0], isKey: false };
      next[index] = { ...currentObjective, ...patch };
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Objectives</div>
            <h2 className="mt-2 text-2xl font-black text-zinc-50">Configure objectives</h2>
            <p className="mt-1 text-sm text-zinc-400">Choose 2-20 objectives. You can randomize them from selected types or select every objective manually.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200" aria-label="Close objectives modal"><X size={18} /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <NumberField label="# of Objectives" value={count} onChange={(value) => setObjectiveCount(clampObjectiveCount(value))} min={2} max={20} />
            <div className="space-y-2 text-sm font-semibold text-zinc-200 md:col-span-2">
              Objective Selection
              <div className="grid gap-2 sm:grid-cols-2">
                <RadioCard name="objectiveMode" label="Randomize" description="Generate the objective list from selected objective types." checked={objectiveMode === "random"} onChange={() => setObjectiveMode("random")} />
                <RadioCard name="objectiveMode" label="Select each objective" description="Choose the exact type and key status for every objective." checked={objectiveMode === "select"} onChange={() => setObjectiveMode("select")} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-zinc-300">Allowed Objective Types</div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {OBJECTIVE_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-200">
                  <input
                    type="checkbox"
                    checked={selectedObjectiveTypes.includes(type)}
                    onChange={(event) => {
                      setSelectedObjectiveTypes((current) =>
                        event.target.checked
                          ? Array.from(new Set([...current, type]))
                          : current.filter((entry) => entry !== type),
                      );
                    }}
                    className="h-4 w-4 accent-lime-400"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {objectiveMode === "select" && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-zinc-300">Selected Objectives</div>
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: count }, (_, index) => {
                  const objective = objectiveDrafts[index] ?? { id: `${Date.now()}-${index}`, name: `Objective ${index + 1}`, type: selectedObjectiveTypes[0] ?? OBJECTIVE_TYPES[0], isKey: false };
                  return (
                    <div key={index} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
                      <label className="space-y-1 text-xs font-semibold text-zinc-300">
                        Name
                        <input value={objective.name} onChange={(event) => updateObjectiveDraft(index, { name: event.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-lime-400/60" />
                      </label>
                      <label className="mt-3 block space-y-1 text-xs font-semibold text-zinc-300">
                        Type
                        <select value={objective.type} onChange={(event) => updateObjectiveDraft(index, { type: event.target.value, name: objective.name?.startsWith("Objective ") ? `${event.target.value} ${index + 1}` : objective.name })} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-lime-400/60">
                          {OBJECTIVE_TYPES.map((type) => <option key={type}>{type}</option>)}
                        </select>
                      </label>
                      {keyRequired && (
                        <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-lime-200">
                          <input type="checkbox" checked={Boolean(objective.isKey)} onChange={(event) => updateObjectiveDraft(index, { isKey: event.target.checked })} className="h-4 w-4 accent-lime-400" />
                          Key objective
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {keyRequired && <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">Key objective victory is enabled, so at least one generated or selected objective will be marked as key.</div>}
          {updateError && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{updateError}</div>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500">Cancel</button>
            <button type="submit" disabled={updateLoading || selectedObjectiveTypes.length === 0} className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60">{updateLoading ? "Saving..." : "Save Objectives"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getPlayerColor(player: CampaignParticipantView, index: number) {
  return player?.color && PLAYER_CONTROL_COLORS.some((color) => color.hex === player.color)
    ? player.color
    : PLAYER_CONTROL_COLORS[index % PLAYER_CONTROL_COLORS.length].hex;
}

function playerDisplayName(player: CampaignParticipantView) {
  return player?.user?.displayName ?? "Player";
}

function sortPlayersForControl(players: NonNullable<Campaign["participants"]>, authUserId: string) {
  return [...players].sort((a, b) => {
    if (a.userId === authUserId) return -1;
    if (b.userId === authUserId) return 1;
    return (a.joinedAt ?? a.invitedAt ?? "").localeCompare(b.joinedAt ?? b.invitedAt ?? "");
  });
}

function PlayerColorLegend({ players }: { players: NonNullable<Campaign["participants"]> }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-zinc-300">
      {players.map((player, index) => (
        <span key={player.id} className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getPlayerColor(player, index) }} />
          {playerDisplayName(player)}
        </span>
      ))}
    </div>
  );
}

function currentPlayerForce(campaign: Campaign, authUserId: string, force?: Force) {
  const participant = (campaign.participants ?? []).find((entry) => entry.userId === authUserId && entry.status === "Accepted");
  if (!participant) return undefined;
  if (force && participant.forceId === force.id) return force;
  return participant.force;
}

function participantForceBV(participant: NonNullable<Campaign["participants"]>[number] | undefined, fallbackForce?: Force) {
  if (fallbackForce?.forceUnits?.length) {
    return fallbackForce.forceUnits.reduce((total, unit) => total + Number(unit.currentBV ?? unit.snapshot?.totalBV ?? 0), 0);
  }
  if (fallbackForce?.totalBV) return Number(fallbackForce.totalBV);
  return Number(participant?.force?.totalBV ?? 0);
}

function VictoryConditionDetails({ campaign, authUserId, force, playerShare }: { campaign: Campaign; authUserId: string; force?: Force; playerShare: number }) {
  const settings = campaign.settings;
  const victory = settings?.victoryConditions;
  const participant = (campaign.participants ?? []).find((entry) => entry.userId === authUserId && entry.status === "Accepted");
  const ownForce = currentPlayerForce(campaign, authUserId, force);
  const forceBV = participantForceBV(participant, ownForce as Force | undefined);
  const bvBaseline = Number((ownForce as Force | undefined)?.startingBV ?? ownForce?.totalBV ?? participant?.force?.startingBV ?? participant?.force?.totalBV ?? forceBV ?? 0);
  const bvPercent = bvBaseline > 0 ? Math.min(100, Math.max(0, (forceBV / bvBaseline) * 100)) : 0;
  const resources = settings?.startingResources ?? {};
  const resourceValue = settings?.type === "Chaos" ? Number(resources.Warchest ?? 0) : Number(resources.CBills ?? 0);
  const keyObjectives = settings?.objectives?.filter((objective) => objective.isKey) ?? [];
  if (!victory) {
    return <p className="text-sm text-zinc-400">Victory conditions are not configured.</p>;
  }
  return (
    <div className="space-y-3 text-sm text-zinc-300">
      <VictoryDetail
        title="BV capitulation"
        status={`Currently: ${bvPercent.toFixed(1)}% of your starting BV · capitulation at ${victory.capitulationBVPercent ?? 10}%`}
        detail={`Current assigned force BV: ${formatNumber(forceBV)} / starting ${formatNumber(bvBaseline)} BV.`}
      />
      <VictoryDetail
        title="Resource capitulation"
        status={`Currently: 100% of starting resources · capitulation at ${victory.capitulationResourcesPercent ?? 10}%`}
        detail={`Current tracked resources: ${settings?.type === "Chaos" ? `${formatNumber(resourceValue)} Warchest Points` : `${formatNumber(resourceValue)} C-bills`}. Resource spend tracking can reduce this later.`}
      />
      {victory.dominationEnabled && (
        <VictoryDetail
          title="Planet control domination"
          status={`Your current planet control: ${playerShare.toFixed(1)}% · victory at ${victory.dominationControlPercent ?? 70}%`}
          detail="Planet control is calculated from all objectives combined, not from a single objective."
        />
      )}
      {victory.keyObjectivesEnabled && (
        <VictoryDetail
          title="Control of key objectives"
          status={`${keyObjectives.length} key objective${keyObjectives.length === 1 ? "" : "s"} configured`}
          detail={keyObjectives.length ? keyObjectives.map((objective) => objective.name).join(" • ") : "No key objectives are configured yet."}
        />
      )}
      {victory.turnsElapsedEnabled && (
        <VictoryDetail title="Turns elapsed" status={`Current turn: 1 · limit ${victory.turnsElapsed ?? 25}`} detail="Timing condition based on campaign turns." />
      )}
      {victory.mapControlEnabled && (
        <VictoryDetail title="Map control" status={`Your current map control: ${playerShare.toFixed(1)}% · victory at ${victory.mapControlPercent ?? 75}%`} detail="Conquest-only map-control condition." />
      )}
    </div>
  );
}

function VictoryDetail({ title, status, detail }: { title: string; status: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/55 p-4">
      <div className="text-sm font-black text-zinc-100">{title}</div>
      <div className="mt-2 text-sm font-semibold text-lime-200">{status}</div>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500">{detail}</p>
    </div>
  );
}

function ActiveCampaignDashboard({
  campaign,
  force,
  isCampaignOwner,
  authUserId,
  activeView,
  setActiveView,
  onBack,
  onOpenFluff,
}: {
  campaign: Campaign;
  force?: Force;
  isCampaignOwner: boolean;
  authUserId: string;
  activeView: "objectives" | "planet" | "victory";
  setActiveView: (view: "objectives" | "planet" | "victory") => void;
  onBack: () => void;
  onOpenFluff: () => void;
}) {
  const settings = campaign.settings;
  const acceptedPlayers = sortPlayersForControl((campaign.participants ?? []).filter((participant) => participant.status === "Accepted"), authUserId);
  const objectives = settings?.objectives ?? [];
  const playerShare = acceptedPlayers.length ? 100 / acceptedPlayers.length : 100;
  const forceUnits = force?.forceUnits ?? [];
  const campaignType = settings?.type ?? "Campaign";
  const isChaos = campaignType === "Chaos";
  const [repairPriority, setRepairPriority] = useState(REPAIR_PRIORITY_OPTIONS[0]);
  const [repairHelpOpen, setRepairHelpOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Campaign Dashboard"
        title={campaign.name}
        description={campaign.description || settings?.fluff?.conflictDescription || "Active campaign operations dashboard."}
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300"
            >
              <Swords size={16} /> Log Battle
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
            >
              Battle History
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
            >
              <ArrowLeft size={16} /> Back to Campaigns
            </button>
          </>
        }
      />

      <div className="rounded-3xl border border-lime-400/20 bg-lime-400/5 p-4 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:flex xl:items-center">
            <CampaignFactCard label="Turn" value={campaignTurnLabel(campaign)} />
            <CampaignFactCard label="Resources" value={resourceLabel(settings)} />
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            {isChaos ? (
              <button
                type="button"
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-black text-zinc-200 transition hover:border-lime-400/50 hover:text-lime-200"
              >
                Repair
              </button>
            ) : (
              <select
                value={repairPriority}
                onChange={(event) => setRepairPriority(event.target.value)}
                className="min-w-[12rem] rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-200 outline-none transition focus:border-lime-400/60"
                aria-label="Repair priority"
              >
                {REPAIR_PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option.replace(" Priority", "")}</option>
                ))}
              </select>
            )}
            {!isChaos && (
              <ActionSquareButton label="Repair priority help" onClick={() => setRepairHelpOpen(true)}>
                <HelpCircle size={17} />
              </ActionSquareButton>
            )}
            <ActionSquareButton label="Open MechBay">
              <Wrench size={17} />
            </ActionSquareButton>
            <ActionSquareButton label="Open spending and purchasing">
              <DollarSign size={17} />
            </ActionSquareButton>
            <ActionSquareButton label="Spend pilot XP">
              <span className="text-xs font-black">XP</span>
            </ActionSquareButton>
            <ActionSquareButton label="Campaign details" onClick={() => setDetailsOpen(true)}>
              <Info size={17} />
            </ActionSquareButton>
          </div>
        </div>

        {isCampaignOwner && !settings?.fluff && (
          <div className="mt-4 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-4 text-sm text-zinc-300">
            Optional campaign fluff has not been set. You can add or edit it from here.
            <button type="button" onClick={onOpenFluff} className="mt-3 rounded-xl border border-lime-400/30 bg-lime-400/10 px-3 py-2 text-xs font-black text-lime-200 transition hover:bg-lime-400/20 sm:ml-3 sm:mt-0">
              Add Fluff
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_3fr]">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="flex flex-wrap gap-2">
            {([
              ["objectives", "Objectives"],
              ["planet", "Planet Control"],
              ["victory", "Victory Conditions"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveView(value)}
                className={`rounded-xl px-3 py-2 text-xs font-black transition ${activeView === value ? "bg-lime-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-lime-400/40"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {(activeView === "objectives" || activeView === "planet") && <PlayerColorLegend players={acceptedPlayers} />}

          <div className="mt-5 space-y-3">
            {activeView === "objectives" && (
              objectives.length ? objectives.map((objective) => (
                <div key={objective.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <div className="font-black text-zinc-100">{objective.name}</div>
                      <div className="text-xs text-zinc-500">{objective.type}{objective.isKey ? " • Key Objective" : ""}</div>
                    </div>
                    <span className="text-xs text-zinc-400">Control</span>
                  </div>
                  <ControlStack players={acceptedPlayers} share={playerShare} />
                </div>
              )) : <p className="text-sm text-zinc-400">No objectives configured.</p>
            )}
            {activeView === "planet" && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="text-sm font-black text-zinc-100">Total Planet Control</div>
                <div className="mt-3 h-7 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
                  <div className="flex h-full w-full">
                    {acceptedPlayers.map((player, index) => (
                      <div key={player.id} className="h-full" style={{ width: `${playerShare}%`, backgroundColor: getPlayerColor(player, index) }} title={playerDisplayName(player)} />
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid gap-2">
                  {acceptedPlayers.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 text-zinc-200"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getPlayerColor(player, index) }} />{playerDisplayName(player)}</span>
                      <span className="font-semibold text-zinc-400">{playerShare.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeView === "victory" && (
              <VictoryConditionDetails campaign={campaign} authUserId={authUserId} force={force} playerShare={playerShare} />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Force Status</div>
              <h2 className="mt-1 text-xl font-black text-zinc-50">{force?.name ?? "No force assigned"}</h2>
              <p className="mt-1 text-sm text-zinc-500">Campaign-specific force copy status.</p>
            </div>
            {force && <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-300">BV {formatNumber(force.forceUnits?.reduce((total, unit) => total + Number(unit.currentBV ?? unit.snapshot?.totalBV ?? 0), 0) || force.totalBV)}</span>}
          </div>

          <div className="mt-5 space-y-3">
            {forceUnits.length ? forceUnits.map((forceUnit) => (
              <div key={forceUnit.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-black text-zinc-100">{forceUnit.snapshot?.chassis} {forceUnit.snapshot?.model}</div>
                    <div className="text-xs text-zinc-500">Pilot: {forceUnit.pilot?.name || "Unnamed Pilot"} • {forceUnit.pilot?.gunnery ?? 4}/{forceUnit.pilot?.piloting ?? 5}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-300">{forceUnit.status ?? "Available"}</span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-300">BV {formatNumber(forceUnit.currentBV ?? forceUnit.snapshot?.totalBV)}</span>
                    {forceUnit.teamNumber && <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-300">Team {forceUnit.teamNumber}</span>}
                  </div>
                </div>
              </div>
            )) : <p className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-6 text-sm text-zinc-400">No unit status records found for this campaign force yet.</p>}
          </div>
        </div>
      </div>

      {repairHelpOpen && <RepairPriorityHelpModal onClose={() => setRepairHelpOpen(false)} />}
      {detailsOpen && <CampaignDetailsModal campaign={campaign} onClose={() => setDetailsOpen(false)} />}
    </section>
  );
}

function ActionSquareButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-200 transition hover:border-lime-400/50 hover:text-lime-200"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function campaignTurnLabel(campaign: Campaign) {
  const settings = campaign.settings;
  const currentTurn = Number((campaign as any).turnNumber ?? (settings as any)?.currentTurn ?? 1);
  const victoryTurnLimit = settings?.victoryConditions?.turnsElapsedEnabled ? settings.victoryConditions.turnsElapsed : undefined;
  const setupTurnLimit = Number((settings as any)?.maxTurnsAhead ?? 0) > 0 ? Number((settings as any).maxTurnsAhead) : undefined;
  const limit = victoryTurnLimit ?? setupTurnLimit;
  return limit ? `${currentTurn}/${limit}` : String(currentTurn);
}

function CampaignDetailsModal({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const settings = campaign.settings;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Campaign Details</div>
            <h2 className="mt-2 text-2xl font-black text-zinc-50">{campaign.name}</h2>
            <p className="mt-1 text-sm text-zinc-400">High-level campaign information and setup context.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200" aria-label="Close campaign details"><X size={18} /></button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MiniFact label="Campaign Type" value={settings?.type ?? "—"} />
          <MiniFact label="Status" value={campaign.status ?? "—"} />
          <MiniFact label="Year / Date" value={campaignDateLabel(campaign)} />
          <MiniFact label="Planet" value={settings?.fluff?.planet || "Not set"} />
          <MiniFact label="Era" value={settings?.era ?? "—"} />
          <MiniFact label="Rules Level" value={settings?.rulesLevel ?? "—"} />
          <MiniFact label="Players" value={`${(campaign.participants ?? []).filter((participant) => participant.status === "Accepted").length}/${settings?.maxPlayers ?? 2}`} />
          <MiniFact label="Force BV Limit" value={formatNumber(settings?.forceBVLimit)} />
          <MiniFact label="Starting Resources" value={resourceLabel(settings)} />
          <MiniFact label="Objective Control" value={settings?.objectiveControlType ?? "—"} />
          {settings?.type === "Conquest" && (
            <>
              <MiniFact label="Combat Teams" value={String(settings?.combatTeamCount ?? "—")} />
              <MiniFact label="Team BV Limit" value={formatNumber(settings?.combatTeamBVLimit)} />
            </>
          )}
        </div>
        {settings?.fluff?.conflictDescription && (
          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm leading-6 text-zinc-300">
            {settings.fluff.conflictDescription}
          </div>
        )}
      </div>
    </div>
  );
}

function RepairPriorityHelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Repair Orders</div>
            <h2 className="mt-2 text-2xl font-black text-zinc-50">Repair priority breakdown</h2>
            <p className="mt-1 text-sm text-zinc-400">Choose how the tech force prioritizes limited repair time between battles.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200" aria-label="Close repair priority help"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          {REPAIR_PRIORITY_DETAILS.map((detail) => (
            <div key={detail.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <h3 className="text-sm font-black text-zinc-100">{detail.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{detail.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlStack({ players, share }: { players: NonNullable<Campaign["participants"]>; share: number }) {
  return (
    <div className="mt-3 h-5 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
      <div className="flex h-full w-full">
        {players.map((player, index) => (
          <div key={player.id} className="h-full" style={{ width: `${share}%`, backgroundColor: getPlayerColor(player, index) }} title={playerDisplayName(player)} />
        ))}
      </div>
    </div>
  );
}

function CampaignFluffModal({
  campaign,
  year,
  setYear,
  planet,
  setPlanet,
  conflictDescription,
  setConflictDescription,
  updateLoading,
  updateError,
  onClose,
  onSubmit,
}: {
  campaign: Campaign;
  year: number | undefined;
  setYear: (value: number | undefined) => void;
  planet: string;
  setPlanet: (value: string) => void;
  conflictDescription: string;
  setConflictDescription: (value: string) => void;
  updateLoading: boolean;
  updateError: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const range = ERA_YEAR_RANGES[campaign.settings?.era ?? ""];
  const yearInvalid = Boolean(year && !campaignYearIsValid(year, campaign.settings?.era));
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Campaign Fluff</div>
            <h2 className="mt-2 text-2xl font-black text-zinc-50">Add optional campaign flavor</h2>
            <p className="mt-1 text-sm text-zinc-400">Add optional flavor details for the campaign. These can be edited later by the campaign owner.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200" aria-label="Close campaign fluff modal"><X size={18} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="space-y-2 text-sm font-semibold text-zinc-200">
            Campaign Year {range ? <span className="text-xs font-normal text-zinc-500">({range.min}-{range.max} for {campaign.settings?.era})</span> : null}
            <input type="number" value={year ?? ""} onChange={(event) => setYear(event.target.value ? Number(event.target.value) : undefined)} min={range?.min} max={range?.max} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
          </label>
          {yearInvalid && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">Year must be inside the selected era range.</div>}
          <label className="space-y-2 text-sm font-semibold text-zinc-200">
            Planet
            <input value={planet} onChange={(event) => setPlanet(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-zinc-200">
            Conflict Description
            <textarea value={conflictDescription} onChange={(event) => setConflictDescription(event.target.value)} rows={4} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
          </label>
          {updateError && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{updateError}</div>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500">Cancel</button>
            <button type="submit" disabled={updateLoading || yearInvalid} className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60">{updateLoading ? "Saving..." : "Save Fluff"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CampaignSettingsModal(props: {
  mode: "create" | "edit";
  canEdit: boolean;
  createLoading: boolean;
  createError: string | null | undefined;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  campaignType: string;
  setTypeAndDefaults: (value: string) => void;
  playerMode: PlayerMode;
  setPlayerMode: (value: PlayerMode) => void;
  era: string;
  setEra: (value: string) => void;
  rulesLevel: string;
  setRulesLevel: (value: string) => void;
  forceBVLimit: number;
  setForceBVLimit: (value: number) => void;
  maxTurnsAhead: number;
  setMaxTurnsAhead: (value: number) => void;
  combatTeamCount: number;
  setCombatTeamCount: (value: number) => void;
  combatTeamBVLimit: number;
  setCombatTeamBVLimit: (value: number) => void;
  combatTeamSize: number;
  setCombatTeamSize: (value: number) => void;
  objectiveControlType: string;
  setObjectiveControlType: (value: string) => void;
  salariesEnabled: boolean;
  setSalariesEnabled: (value: boolean) => void;
  warchest: number;
  setWarchest: (value: number) => void;
  cBills: number;
  setCBills: (value: number) => void;
  fluffYear: number | undefined;
  setFluffYear: (value: number | undefined) => void;
  fluffPlanet: string;
  setFluffPlanet: (value: string) => void;
  fluffDescription: string;
  setFluffDescription: (value: string) => void;
}) {
  const isConquest = props.campaignType === "Conquest";
  const effectivePlayerMode = isConquest ? "2" : props.playerMode;
  const isMultiPlayerMode = effectivePlayerMode === "3-10";
  const effectiveObjectiveControlType = normalizeObjectiveControl(
    effectivePlayerMode,
    props.objectiveControlType,
  );
  const readOnly = !props.canEdit;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
              {props.mode === "create"
                ? "Campaign Setup"
                : readOnly
                  ? "Review Campaign Setup"
                  : "Edit Campaign Setup"}
            </div>
            <h2 className="mt-2 text-2xl font-black text-zinc-50">
              {props.mode === "create"
                ? "Create New Campaign"
                : readOnly
                  ? "Review Campaign Details"
                  : "Review / Edit Campaign Details"}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {props.mode === "create"
                ? "Force selection and player invitations are intentionally deferred until after the campaign exists."
                : readOnly
                  ? "A force has already been committed, so these setup details are locked for now."
                  : "These values can be changed until a force is committed to the campaign."}
            </p>
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200"
            aria-label="Close campaign modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={props.onSubmit} className="space-y-5">
          <fieldset
            disabled={readOnly}
            className={readOnly ? "space-y-5 opacity-80" : "space-y-5"}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-zinc-200">
                Campaign Name
                <input
                  value={props.name}
                  onChange={(event) => props.setName(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-200">
                Campaign Type
                <select
                  value={props.campaignType}
                  onChange={(event) =>
                    props.setTypeAndDefaults(event.target.value)
                  }
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70"
                >
                  {CAMPAIGN_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-200 md:col-span-2">
                Description
                <textarea
                  value={props.description}
                  onChange={(event) => props.setDescription(event.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <SelectField
                label="Era"
                value={props.era}
                onChange={props.setEra}
                options={ERA_OPTIONS}
                placeholder="Select an era"
                required
              />
              <SelectField
                label="Rules Level"
                value={props.rulesLevel}
                onChange={props.setRulesLevel}
                options={RULES_LEVEL_OPTIONS}
              />
              <NumberField
                label="Force BV Limit"
                value={props.forceBVLimit}
                onChange={props.setForceBVLimit}
                min={1}
              />

              <div className="space-y-2 text-sm font-semibold text-zinc-200 md:col-span-2">
                Player Scope
                <div className="grid gap-2 sm:grid-cols-2">
                  <RadioCard
                    name="playerMode"
                    label="2 Player"
                    description="Classic head-to-head campaign setup."
                    checked={effectivePlayerMode === "2"}
                    onChange={() => props.setPlayerMode("2")}
                  />
                  <RadioCard
                    name="playerMode"
                    label="3-10 Players"
                    description={
                      isConquest
                        ? "Disabled for Conquest campaigns for now."
                        : "Invite any number in this range later."
                    }
                    checked={effectivePlayerMode === "3-10"}
                    disabled={isConquest}
                    onChange={() => {
                      props.setPlayerMode("3-10");
                      props.setObjectiveControlType("Percentage");
                    }}
                  />
                </div>
              </div>

              {isMultiPlayerMode && (
                <NumberField
                  label="Max Turns Ahead"
                  value={props.maxTurnsAhead}
                  onChange={props.setMaxTurnsAhead}
                  min={1}
                />
              )}

              {isMultiPlayerMode ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300">
                  <div className="font-semibold text-zinc-200">
                    Objective Control
                  </div>
                  <div className="mt-1 text-lime-200">Percentage</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Required for 3-10 player campaigns.
                  </div>
                </div>
              ) : (
                <SelectField
                  label="Objective Control"
                  value={effectiveObjectiveControlType}
                  onChange={props.setObjectiveControlType}
                  options={OBJECTIVE_CONTROL_OPTIONS}
                />
              )}

              <label className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm font-semibold text-zinc-200">
                <input
                  type="checkbox"
                  checked={props.salariesEnabled}
                  onChange={(event) =>
                    props.setSalariesEnabled(event.target.checked)
                  }
                  className="h-4 w-4 accent-lime-400"
                />
                Salaries Enabled
              </label>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-zinc-300">Optional Fluff</div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-zinc-200">
                  Campaign Year
                  <input type="number" value={props.fluffYear ?? ""} onChange={(event) => props.setFluffYear(event.target.value ? Number(event.target.value) : undefined)} min={ERA_YEAR_RANGES[props.era]?.min} max={ERA_YEAR_RANGES[props.era]?.max} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70" />
                  {ERA_YEAR_RANGES[props.era] && <span className="text-xs font-normal text-zinc-500">Allowed: {ERA_YEAR_RANGES[props.era].min}-{ERA_YEAR_RANGES[props.era].max}</span>}
                </label>
                <label className="space-y-2 text-sm font-semibold text-zinc-200">
                  Planet
                  <input value={props.fluffPlanet} onChange={(event) => props.setFluffPlanet(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-zinc-200 md:col-span-2">
                  Conflict Description
                  <textarea value={props.fluffDescription} onChange={(event) => props.setFluffDescription(event.target.value)} rows={3} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70" />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-zinc-300">
                <Settings size={16} /> Starting Resources
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {props.campaignType === "Chaos" ? (
                  <NumberField
                    label="Warchest Points"
                    value={props.warchest}
                    onChange={props.setWarchest}
                    min={0}
                  />
                ) : (
                  <NumberField
                    label="C-bills"
                    value={props.cBills}
                    onChange={props.setCBills}
                    min={0}
                  />
                )}
              </div>
            </div>

            {isConquest && (
              <div className="rounded-3xl border border-lime-400/20 bg-lime-400/5 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-lime-200">
                  <Swords size={16} /> Conquest Combat Teams
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <NumberField
                    label="# of Combat Teams"
                    value={props.combatTeamCount}
                    onChange={props.setCombatTeamCount}
                    min={1}
                  />
                  <NumberField
                    label="Combat Team BV Limit"
                    value={props.combatTeamBVLimit}
                    onChange={props.setCombatTeamBVLimit}
                    min={1}
                  />
                  <NumberField
                    label="Combat Team Max Unit Count"
                    value={props.combatTeamSize}
                    onChange={props.setCombatTeamSize}
                    min={1}
                  />
                </div>
              </div>
            )}
          </fieldset>

          {props.createError && (
            <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
              {props.createError}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
            >
              {readOnly ? "Close" : "Cancel"}
            </button>
            {!readOnly && (
              <button
                type="submit"
                disabled={props.createLoading}
                className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {props.createLoading
                  ? props.mode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : props.mode === "create"
                    ? "Create Campaign"
                    : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-zinc-200">
      {label}
      <select
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-zinc-200">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70"
      />
    </label>
  );
}

function RadioCard({
  name,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  name: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`rounded-2xl border p-4 transition ${
        checked
          ? "border-lime-400/60 bg-lime-400/10"
          : "border-zinc-800 bg-zinc-900/60"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-lime-400/30"}`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      <div className="font-black text-zinc-100">{label}</div>
      <div className="mt-1 text-xs leading-5 text-zinc-400">{description}</div>
    </label>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 truncate font-semibold text-zinc-200">{value}</div>
    </div>
  );
}

function CampaignFactCard({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-black text-zinc-100">{value}</div>
    </div>
  );
}

function DashboardStep({
  title,
  description,
  complete,
  optional,
  className = "",
  children,
}: {
  title: string;
  description: string;
  complete: boolean;
  optional?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const stateClasses = complete
    ? "border-lime-400/20 bg-lime-400/5"
    : optional
      ? "border-zinc-700 bg-zinc-900/50"
      : "border-red-500/30 bg-red-950/10";

  return (
    <div className={`rounded-3xl border p-4 ${stateClasses} ${className}`}>
      <div className="flex items-center gap-2 text-sm font-black text-zinc-100">
        {complete ? (
          <CheckCircle2 size={17} className="text-lime-300" />
        ) : optional ? (
          <span className="h-[17px] w-[17px] rounded-full border border-zinc-500 bg-zinc-800" />
        ) : (
          <XCircle size={17} className="text-red-300" />
        )}
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
      {children}
    </div>
  );
}
