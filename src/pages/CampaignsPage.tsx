import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Swords,
  X,
  XCircle,
} from "lucide-react";
import type {
  Campaign,
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
const ACTIVE_STATUSES = new Set(["Setup", "Active", "Paused"]);
type PlayerMode = "2" | "3-10";

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
  const [candidateForceId, setCandidateForceId] = useState<string | null>(null);

  useEffect(() => {
    if (openInvitesSignal) {
      setSelectedCampaignId(null);
      setShowPendingInvites(true);
    }
  }, [openInvitesSignal]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [campaignType, setCampaignType] = useState("Chaos");
  const [playerMode, setPlayerMode] = useState<PlayerMode>("2");
  const [era, setEra] = useState("Star League");
  const [rulesLevel, setRulesLevel] = useState("Standard");
  const [forceBVLimit, setForceBVLimit] = useState(15000);
  const [maxTurnsAhead, setMaxTurnsAhead] = useState(1);
  const [combatTeamCount, setCombatTeamCount] = useState(3);
  const [combatTeamBVLimit, setCombatTeamBVLimit] = useState(5000);
  const [combatTeamSize, setCombatTeamSize] = useState(4);
  const [objectiveControlType, setObjectiveControlType] = useState("Binary");
  const [salariesEnabled, setSalariesEnabled] = useState(false);
  const [warchest, setWarchest] = useState(1000);
  const [cBills, setCBills] = useState(5000000);

  const selectedCampaign =
    campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? null;
  const visibleCampaigns = useMemo(
    () =>
      campaigns.filter(
        (campaign) => showInactive || !isInactiveCampaign(campaign),
      ),
    [campaigns, showInactive],
  );
  const inactiveCount = campaigns.filter(isInactiveCampaign).length;
  const isMultiPlayerMode = playerMode === "3-10";
  const effectiveObjectiveControlType = normalizeObjectiveControl(
    playerMode,
    objectiveControlType,
  );

  const resetCreateForm = () => {
    setName("");
    setDescription("");
    setCampaignType("Chaos");
    setPlayerMode("2");
    setEra("Star League");
    setRulesLevel("Standard");
    setForceBVLimit(15000);
    setMaxTurnsAhead(1);
    setCombatTeamCount(3);
    setCombatTeamBVLimit(5000);
    setCombatTeamSize(4);
    setObjectiveControlType("Binary");
    setSalariesEnabled(false);
    setWarchest(1000);
    setCBills(5000000);
  };

  const setTypeAndDefaults = (nextType: string) => {
    setCampaignType(nextType);
    if (nextType === "Conquest") {
      setPlayerMode("2");
      setObjectiveControlType("Binary");
    } else {
      setObjectiveControlType(playerMode === "3-10" ? "Percentage" : "Binary");
    }
    setSalariesEnabled(nextType !== "Chaos");
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
    };
  };

  const loadFormFromCampaign = (campaign: Campaign) => {
    const settings = campaign.settings;
    setName(campaign.name);
    setDescription(campaign.description ?? "");
    setCampaignType(settings?.type ?? "Chaos");
    setPlayerMode(
      settings?.type === "Conquest" ? "2" : playerModeFromSettings(settings),
    );
    setEra(settings?.era ?? "Star League");
    setRulesLevel(settings?.rulesLevel ?? "Standard");
    setForceBVLimit(Number(settings?.forceBVLimit ?? 15000));
    setMaxTurnsAhead(
      Number(settings?.maxTurnsAhead ?? settings?.maxTurns ?? 1),
    );
    setCombatTeamCount(Number(settings?.combatTeamCount ?? 3));
    setCombatTeamBVLimit(Number(settings?.combatTeamBVLimit ?? 5000));
    setCombatTeamSize(Number(settings?.combatTeamSize ?? 4));
    setObjectiveControlType(settings?.objectiveControlType ?? "Binary");
    setSalariesEnabled(Boolean(settings?.salariesEnabled));
    setWarchest(Number(settings?.startingResources?.Warchest ?? 1000));
    setCBills(Number(settings?.startingResources?.CBills ?? 5000000));
  };

  const submitCreateCampaign = async (event: React.FormEvent) => {
    event.preventDefault();
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
    const objectivesReady = false;
    const inviteStatus = campaignInviteStatus(selectedCampaign);
    const playerScope = playerScopeSummary(settings);
    const playerStatus = playerReadiness(selectedCampaign);
    const invitedPlayersReady = playerStatus.ready;
    const canBeginCampaign =
      ownerReady && objectivesReady && invitedPlayersReady;
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

    return (
      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <PageTitle
            eyebrow="Campaign Dashboard"
            title={selectedCampaign.name}
            description="Complete setup steps before beginning the campaign. Force copies, objectives, player invitations, and the full turn dashboard can expand from here."
          />
          <button
            type="button"
            onClick={() => setSelectedCampaignId(null)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
          >
            <ArrowLeft size={16} /> Back to Campaigns
          </button>
        </div>

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
                title={isCampaignOwner ? "Set objectives" : "Objectives"}
                description={
                  isCampaignOwner
                    ? "Objectives and victory conditions will be configured here by the campaign owner."
                    : "Campaign objectives and victory conditions will be visible here once the owner configures them."
                }
              />
              <DashboardStep
                complete
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
                  disabled={!canBeginCampaign}
                  className={`w-full rounded-3xl px-5 py-4 text-base font-black transition ${
                    canBeginCampaign
                      ? "bg-lime-400 text-zinc-950 hover:bg-lime-300"
                      : "cursor-not-allowed border border-red-500/40 bg-red-950/30 text-red-200"
                  }`}
                >
                  {canBeginCampaign
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
          />
        )}
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle
          eyebrow="Campaigns"
          title="My Campaigns"
          description="Create and manage campaign shells. Force assignment, invitations, objectives, and campaign-start steps happen inside each campaign dashboard."
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowInactive((value) => !value)}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
          >
            {showInactive ? <EyeOff size={16} /> : <Eye size={16} />}
            {showInactive
              ? "Hide inactive"
              : `Show inactive${inactiveCount ? ` (${inactiveCount})` : ""}`}
          </button>
          <button
            type="button"
            onClick={() => setShowPendingInvites((value) => !value)}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
          >
            Pending invitations ({invites.length})
          </button>
          <button
            type="button"
            onClick={() => {
              resetCreateForm();
              setCreating(true);
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300"
          >
            <Plus size={16} /> Create Campaign
          </button>
        </div>
      </div>

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
                : "No campaigns match the current active/inactive filter."}
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
        />
      )}
    </section>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-zinc-200">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60 disabled:opacity-70"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
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

function CampaignFactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
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
  children,
}: {
  title: string;
  description: string;
  complete: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 ${complete ? "border-lime-400/20 bg-lime-400/5" : "border-red-500/30 bg-red-950/10"}`}
    >
      <div className="flex items-center gap-2 text-sm font-black text-zinc-100">
        {complete ? (
          <CheckCircle2 size={17} className="text-lime-300" />
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
