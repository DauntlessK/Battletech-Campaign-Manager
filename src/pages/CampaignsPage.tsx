import React, { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Plus, Settings, Swords, X } from "lucide-react";
import type { Campaign, CampaignSettings, Force, User } from "../types/app";
import PageTitle from "../components/PageTitle";

const CAMPAIGN_TYPES = ["Chaos", "Advanced", "Conquest"];
const ERA_OPTIONS = ["Star League", "Early Succession Wars", "Late Succession Wars", "Clan Invasion"];
const RULES_LEVEL_OPTIONS = ["Introductory", "Standard", "Advanced"];
const OBJECTIVE_CONTROL_OPTIONS = ["Binary", "Percentage"];
const ACTIVE_STATUSES = new Set(["Setup", "Active", "Paused"]);

function isInactiveCampaign(campaign: Campaign): boolean {
  return !ACTIVE_STATUSES.has(campaign.status ?? "Setup");
}

function formatNumber(value: unknown, fallback = "—"): string {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toLocaleString() : fallback;
}

function getCampaignForce(campaign: Campaign, forces: Force[]): Force | undefined {
  return forces.find((force) => force.campaignId === campaign.id && force.status !== "Deleted");
}

function defaultResourcesForType(type: string) {
  if (type === "Chaos") return { Warchest: 1000 };
  if (type === "Advanced") return { CBills: 5000000, RepairPoints: 100, Time: 0 };
  return { CBills: 5000000, RepairPoints: 100, Time: 0, Salvage: 0 };
}

function defaultScoringForType(type: string) {
  if (type === "Chaos") return "Warchest Points";
  if (type === "Conquest") return "Objective Control";
  return "Victory Points";
}

export default function CampaignsPage({
  authUser,
  campaigns,
  forces,
  loading,
  error,
  createLoading,
  createError,
  onCreateCampaign,
}: {
  authUser: User | null;
  campaigns: Campaign[];
  forces: Force[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  onCreateCampaign: (payload: { name: string; description?: string; settings: CampaignSettings }) => Promise<Campaign | null>;
}) {
  const [showInactive, setShowInactive] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [campaignType, setCampaignType] = useState("Chaos");
  const [scoringMethod, setScoringMethod] = useState(defaultScoringForType("Chaos"));
  const [era, setEra] = useState("Star League");
  const [rulesLevel, setRulesLevel] = useState("Standard");
  const [forceBVLimit, setForceBVLimit] = useState(15000);
  const [factionRestriction, setFactionRestriction] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [maxTurnsAhead, setMaxTurnsAhead] = useState(1);
  const [combatTeamBVLimit, setCombatTeamBVLimit] = useState(5000);
  const [combatTeamSize, setCombatTeamSize] = useState(4);
  const [objectiveControlType, setObjectiveControlType] = useState("Binary");
  const [salariesEnabled, setSalariesEnabled] = useState(false);
  const [warchest, setWarchest] = useState(1000);
  const [cBills, setCBills] = useState(5000000);
  const [repairPoints, setRepairPoints] = useState(100);
  const [salvage, setSalvage] = useState(0);
  const [victoryConditions, setVictoryConditions] = useState("Complete the campaign objective or reach the agreed victory threshold.");

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? null;
  const visibleCampaigns = useMemo(
    () => campaigns.filter((campaign) => showInactive || !isInactiveCampaign(campaign)),
    [campaigns, showInactive]
  );
  const inactiveCount = campaigns.filter(isInactiveCampaign).length;

  const setTypeAndDefaults = (nextType: string) => {
    setCampaignType(nextType);
    setScoringMethod(defaultScoringForType(nextType));
    setObjectiveControlType(nextType === "Conquest" ? "Percentage" : "Binary");
    setSalariesEnabled(nextType !== "Chaos");
    const resources = defaultResourcesForType(nextType);
    setWarchest(resources.Warchest ?? 1000);
    setCBills(resources.CBills ?? 5000000);
    setRepairPoints(resources.RepairPoints ?? 100);
    setSalvage(resources.Salvage ?? 0);
  };

  const resetCreateForm = () => {
    setName("");
    setDescription("");
    setTypeAndDefaults("Chaos");
    setEra("Star League");
    setRulesLevel("Standard");
    setForceBVLimit(15000);
    setFactionRestriction("");
    setMaxPlayers(4);
    setMaxTurnsAhead(1);
    setCombatTeamBVLimit(5000);
    setCombatTeamSize(4);
    setVictoryConditions("Complete the campaign objective or reach the agreed victory threshold.");
  };

  const submitCreateCampaign = async (event: React.FormEvent) => {
    event.preventDefault();

    const isConquest = campaignType === "Conquest";
    const settings: CampaignSettings = {
      type: campaignType,
      scoringMethod,
      era,
      rulesLevel,
      forceBVLimit,
      factionRestriction: factionRestriction.trim() || undefined,
      maxPlayers,
      maxTurnsAhead,
      maxTurns: maxTurnsAhead,
      combatTeamRules: isConquest,
      combatTeamBVLimit: isConquest ? combatTeamBVLimit : undefined,
      combatTeamSize: isConquest ? combatTeamSize : undefined,
      objectiveControlType,
      salariesEnabled,
      startingResources:
        campaignType === "Chaos"
          ? { Warchest: warchest }
          : campaignType === "Advanced"
            ? { CBills: cBills, RepairPoints: repairPoints, Time: 0 }
            : { CBills: cBills, RepairPoints: repairPoints, Time: 0, Salvage: salvage },
      victoryConditions: victoryConditions
        .split("\n")
        .map((condition) => condition.trim())
        .filter(Boolean),
    };

    const created = await onCreateCampaign({ name, description: description.trim() || undefined, settings });
    if (created) {
      resetCreateForm();
      setCreating(false);
      setSelectedCampaignId(created.id);
    }
  };

  if (!authUser) {
    return (
      <section className="space-y-5">
        <PageTitle eyebrow="Campaigns" title="Sign in required" description="Please sign in to view your active campaigns and invitations." />
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400">Sign in on the Account page to continue.</div>
      </section>
    );
  }

  if (selectedCampaign) {
    const force = getCampaignForce(selectedCampaign, forces);
    const settings = selectedCampaign.settings;

    return (
      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <PageTitle
            eyebrow="Campaign Dashboard"
            title={selectedCampaign.name}
            description="This is the campaign-specific dashboard shell. Force assignment, invitations, objectives, orders, and turn systems can be wired in here next."
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
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">{settings?.type ?? "Campaign"}</div>
                <h2 className="mt-2 text-2xl font-black text-zinc-50">Setup Dashboard</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                  {selectedCampaign.description || "No campaign description provided yet."}
                </p>
              </div>
              <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-200">{selectedCampaign.status ?? "Setup"}</span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <DashboardStep title="Assign your force" description="Deferred for this pass. This is where campaign-specific force copies should be created." />
              <DashboardStep title="Invite players" description="Deferred for this pass. Friend invites and accept/decline flow can live here." />
              <DashboardStep title="Create objectives" description="Conquest and advanced campaign objectives can be configured after the campaign exists." />
              <DashboardStep title="Begin campaign" description="The campaign remains in Setup until required setup conditions are complete." />
            </div>
          </div>

          <aside className="space-y-4">
            <CampaignFactCard label="Era" value={settings?.era ?? "—"} />
            <CampaignFactCard label="Rules Level" value={settings?.rulesLevel ?? "—"} />
            <CampaignFactCard label="Force BV Limit" value={formatNumber(settings?.forceBVLimit)} />
            <CampaignFactCard label="Associated Force" value={force?.name ?? "Not assigned yet"} />
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle eyebrow="Campaigns" title="My Campaigns" description="Create campaigns, review active setup details, and open a campaign dashboard." />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowInactive((current) => !current)}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
          >
            {showInactive ? <EyeOff size={16} /> : <Eye size={16} />}
            {showInactive ? "Hide inactive" : `Show inactive${inactiveCount ? ` (${inactiveCount})` : ""}`}
          </button>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300"
          >
            <Plus size={16} /> Create Campaign
          </button>
        </div>
      </div>

      {loading && <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">Loading campaigns...</div>}
      {error && <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-6 text-red-200">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-4">
          {visibleCampaigns.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
              {campaigns.length === 0 ? "You have no campaigns yet. Create one to begin setup." : "No campaigns match the current active/inactive filter."}
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
                        <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-200">{settings?.type ?? "Campaign"}</span>
                        <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1 text-xs font-semibold text-zinc-300">{campaign.status ?? "Setup"}</span>
                        {inactive && <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">Inactive</span>}
                      </div>
                      <div className="mt-3 text-xl font-black text-zinc-50 transition group-hover:text-lime-100">{campaign.name}</div>
                      <div className="mt-1 max-w-3xl text-sm leading-6 text-zinc-400">{campaign.description ?? "No description provided."}</div>
                    </div>
                    <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-2 lg:min-w-[360px]">
                      <MiniFact label="Era" value={settings?.era ?? "—"} />
                      <MiniFact label="Rules" value={settings?.rulesLevel ?? "—"} />
                      <MiniFact label="Force" value={force?.name ?? "Not assigned"} />
                      <MiniFact label="BV Limit" value={formatNumber(settings?.forceBVLimit)} />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Campaign Setup</div>
                <h2 className="mt-2 text-2xl font-black text-zinc-50">Create New Campaign</h2>
                <p className="mt-1 text-sm text-zinc-400">Force selection and player invitations are intentionally deferred until after the campaign exists.</p>
              </div>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200"
                aria-label="Close create campaign modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitCreateCampaign} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-zinc-200">
                  Campaign Name
                  <input value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-zinc-200">
                  Campaign Type
                  <select value={campaignType} onChange={(event) => setTypeAndDefaults(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60">
                    {CAMPAIGN_TYPES.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label className="md:col-span-2 space-y-2 text-sm font-semibold text-zinc-200">
                  Description
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label="Era" value={era} onChange={setEra} options={ERA_OPTIONS} />
                <SelectField label="Rules Level" value={rulesLevel} onChange={setRulesLevel} options={RULES_LEVEL_OPTIONS} />
                <label className="space-y-2 text-sm font-semibold text-zinc-200">
                  Scoring Method
                  <input value={scoringMethod} onChange={(event) => setScoringMethod(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
                </label>
                <NumberField label="Force BV Limit" value={forceBVLimit} onChange={setForceBVLimit} min={1} />
                <NumberField label="Max Players" value={maxPlayers} onChange={setMaxPlayers} min={1} />
                <NumberField label="Max Turns Ahead" value={maxTurnsAhead} onChange={setMaxTurnsAhead} min={1} />
                <label className="space-y-2 text-sm font-semibold text-zinc-200">
                  Optional Faction Restriction
                  <input value={factionRestriction} onChange={(event) => setFactionRestriction(event.target.value)} placeholder="None" className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
                </label>
                <SelectField label="Objective Control" value={objectiveControlType} onChange={setObjectiveControlType} options={OBJECTIVE_CONTROL_OPTIONS} />
                <label className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm font-semibold text-zinc-200">
                  <input type="checkbox" checked={salariesEnabled} onChange={(event) => setSalariesEnabled(event.target.checked)} className="h-4 w-4 accent-lime-400" />
                  Salaries Enabled
                </label>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-zinc-300">
                  <Settings size={16} /> Starting Resources
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  {campaignType === "Chaos" ? (
                    <NumberField label="Warchest Points" value={warchest} onChange={setWarchest} min={0} />
                  ) : (
                    <>
                      <NumberField label="C-bills" value={cBills} onChange={setCBills} min={0} />
                      <NumberField label="Repair Points" value={repairPoints} onChange={setRepairPoints} min={0} />
                      {campaignType === "Conquest" && <NumberField label="Salvage" value={salvage} onChange={setSalvage} min={0} />}
                    </>
                  )}
                </div>
              </div>

              {campaignType === "Conquest" && (
                <div className="rounded-3xl border border-lime-400/20 bg-lime-400/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-lime-200">
                    <Swords size={16} /> Conquest Combat Teams
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <NumberField label="Combat Team BV Limit" value={combatTeamBVLimit} onChange={setCombatTeamBVLimit} min={1} />
                    <NumberField label="Combat Team Max Unit Count" value={combatTeamSize} onChange={setCombatTeamSize} min={1} />
                  </div>
                </div>
              )}

              <label className="space-y-2 text-sm font-semibold text-zinc-200">
                Victory Conditions
                <textarea value={victoryConditions} onChange={(event) => setVictoryConditions(event.target.value)} rows={3} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
                <span className="block text-xs font-normal text-zinc-500">Use one condition per line if you want multiple conditions.</span>
              </label>

              {createError && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{createError}</div>}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setCreating(false)} className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500">Cancel</button>
                <button type="submit" disabled={createLoading} className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60">
                  {createLoading ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-zinc-200">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange, min }: { label: string; value: number; onChange: (value: number) => void; min?: number }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-zinc-200">
      {label}
      <input type="number" min={min} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60" />
    </label>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-1 truncate font-semibold text-zinc-200">{value}</div>
    </div>
  );
}

function CampaignFactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-2 text-lg font-black text-zinc-100">{value}</div>
    </div>
  );
}

function DashboardStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="flex items-center gap-2 text-sm font-black text-zinc-100">
        <CheckCircle2 size={16} className="text-lime-300" /> {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}
