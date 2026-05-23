import React, { useMemo, useState } from "react";
import type { Force, Unit, User } from "../types/app";
import PageTitle from "../components/PageTitle";
import { ERA_OPTIONS, RULE_OPTIONS, FACTION_OPTIONS, getTeamLabel } from "../constants/appOptions";

function formatNumber(value?: number) {
  return value !== undefined && value !== null ? value.toLocaleString() : "—";
}

function isCampaignForce(force: Force) {
  return force.origin === "CampaignCopy" || Boolean(force.campaignId);
}

export default function ForcesPage({
  authUser,
  forces,
  units,
  loading,
  error,
  forceName,
  forceDescription,
  forceEra,
  forceRulesLevel,
  forceBVLimit,
  forceFaction,
  forceForConquest,
  forceCombatTeamCount,
  forceCombatTeamBV,
  forceFormLoading,
  forceFormError,
  onForceNameChange,
  onForceDescriptionChange,
  onForceEraChange,
  onForceRulesLevelChange,
  onForceBVLimitChange,
  onForceFactionChange,
  onForceForConquestChange,
  onForceCombatTeamCountChange,
  onForceCombatTeamBVChange,
  onBeginForceUnitAssignment,
  onCreateForce,
}: {
  authUser: User | null;
  forces: Force[];
  units?: Unit[];
  loading: boolean;
  error: string | null;
  forceName: string;
  forceDescription: string;
  forceEra: string;
  forceRulesLevel: string;
  forceBVLimit: number;
  forceFaction: string;
  forceForConquest: boolean;
  forceCombatTeamCount: number;
  forceCombatTeamBV: number;
  forceFormLoading: boolean;
  forceFormError: string | null;
  onForceNameChange: (value: string) => void;
  onForceDescriptionChange: (value: string) => void;
  onForceEraChange: (value: string) => void;
  onForceRulesLevelChange: (value: string) => void;
  onForceBVLimitChange: (value: number) => void;
  onForceFactionChange: (value: string) => void;
  onForceForConquestChange: (value: boolean) => void;
  onForceCombatTeamCountChange: (value: number) => void;
  onForceCombatTeamBVChange: (value: number) => void;
  onBeginForceUnitAssignment: (force: Force) => void;
  onCreateForce: () => Promise<boolean>;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [addUnitSearch, setAddUnitSearch] = useState("");
  const [selectedAddUnitId, setSelectedAddUnitId] = useState<string | null>(null);
  const [selectedAddTeam, setSelectedAddTeam] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"original" | "campaign">("original");
  const [selectedForceId, setSelectedForceId] = useState<string | null>(null);

  if (!authUser) {
    return (
      <section className="space-y-5">
        <PageTitle eyebrow="Forces" title="Sign in required" description="Please sign in to manage your forces and assign them to campaigns." />
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400">Sign in on the Account page to continue.</div>
      </section>
    );
  }

  const selectedForce = selectedForceId ? forces.find((force) => force.id === selectedForceId) ?? null : null;
  const displayForces = forces.filter((force) => (viewMode === "campaign" ? isCampaignForce(force) : !isCampaignForce(force)));

  const selectedUnits = useMemo(() => {
    if (!selectedForce || !selectedForce.unitIds || !units) return [];
    return selectedForce.unitIds
      .map((unitId) => units.find((unit) => unit.id === unitId))
      .filter((unit): unit is Unit => Boolean(unit));
  }, [selectedForce, units]);

  const filteredAddUnitOptions = useMemo(() => {
    if (!units) return [];
    const query = addUnitSearch.trim().toLowerCase();
    return units
      .filter((unit) => {
        const searchable = `${unit.name} ${unit.model} ${unit.chassis}`.toLowerCase();
        return !query || searchable.includes(query);
      })
      .slice(0, 25);
  }, [addUnitSearch, units]);

  const addUnitLabel = selectedForce ? getTeamLabel(selectedForce.faction ?? forceFaction) : "Team";

  const closeModal = () => setShowCreateModal(false);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageTitle eyebrow="Forces" title="My Forces" description="Create forces, filter the library, and view selected force details." />
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="rounded-2xl bg-lime-400 px-6 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300"
        >
          New Force
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Force library</div>
              <h2 className="mt-2 text-2xl font-black text-zinc-50">{displayForces.length} force{displayForces.length === 1 ? "" : "s"}</h2>
            </div>
            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setViewMode("original");
                  setSelectedForceId(null);
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${viewMode === "original" ? "bg-lime-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-zinc-100"}`}
              >
                Originals
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("campaign");
                  setSelectedForceId(null);
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${viewMode === "campaign" ? "bg-lime-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-zinc-100"}`}
              >
                Campaigns
              </button>
            </div>
          </div>

          {loading && <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">Loading forces…</div>}
          {error && <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-6 text-red-200">{error}</div>}
          {!loading && !error && (
            <div className="space-y-3">
              {displayForces.length === 0 ? (
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">No forces available.</div>
              ) : (
                displayForces.map((force) => (
                  <div
                    key={force.id}
                    onClick={() => setSelectedForceId(force.id)}
                    className={`cursor-pointer rounded-3xl border p-5 transition ${
                      selectedForceId === force.id
                        ? "border-lime-400/60 bg-lime-400/10"
                        : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/80"
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">{isCampaignForce(force) ? "Campaign Force" : "Original Force"}</div>
                        <div className="mt-1 text-lg font-black text-zinc-50">{force.name}</div>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                        <span>{force.unitIds?.length ?? 0} units</span>
                        <span>{formatNumber(force.totalBV)} BV</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 min-h-[360px]">
          {!selectedForce ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-zinc-950/70 p-10 text-center text-zinc-400">
              <div className="text-lg font-black text-zinc-100">Select a force to view details</div>
              <div className="mt-3 text-sm">Force-level details and assigned units will appear here.</div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">Force details</div>
                  <h2 className="mt-2 text-2xl font-black text-zinc-50">{selectedForce.name}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{selectedForce.description ?? "No description provided."}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedForceId(null)}
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-lime-400 hover:text-lime-50"
                >
                  Deselect
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Era</div>
                  <div className="mt-2 text-sm text-zinc-100">{selectedForce.era ?? "Any"}</div>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Rules</div>
                  <div className="mt-2 text-sm text-zinc-100">{selectedForce.rulesLevel ?? "Standard"}</div>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">BV cap</div>
                  <div className="mt-2 text-sm text-zinc-100">{formatNumber(selectedForce.totalBV)}</div>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Faction</div>
                  <div className="mt-2 text-sm text-zinc-100">{selectedForce.faction ?? "Unknown"}</div>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Status</div>
                  <div className="mt-2 text-sm text-zinc-100">{selectedForce.forConquest ? `${selectedForce.combatTeamCount ?? 0} ${getTeamLabel(selectedForce.faction ?? forceFaction).toLowerCase()} · ${formatNumber(selectedForce.combatTeamBV)} BV` : "Standard force"}</div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Units</div>
                    <div className="mt-1 text-sm text-zinc-400">{selectedUnits.length} assigned catalog unit{selectedUnits.length === 1 ? "" : "s"}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddUnitModal(true)}
                    className="rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300"
                  >
                    Add units
                  </button>
                </div>

                {selectedForce.forConquest ? (
                  <div className="mt-6 space-y-4">
                    {Array.from({ length: selectedForce.combatTeamCount ?? 0 }, (_, index) => (
                      <div key={index} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                          <div className="w-full sm:w-[60%]">
                            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{getTeamLabel(selectedForce.faction ?? forceFaction)} {index + 1}</div>
                            <input
                              type="text"
                              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                              placeholder={`Name ${getTeamLabel(selectedForce.faction ?? forceFaction)} ${index + 1}`}
                            />
                          </div>
                          <div className="rounded-3xl border border-zinc-700 bg-zinc-900/90 px-4 py-3 text-sm text-zinc-200">
                            No units assigned to this team yet.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {selectedUnits.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/60 p-6 text-sm text-zinc-400">No units are currently assigned to this force.</div>
                    ) : (
                      selectedUnits.map((unit) => (
                        <div key={unit.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
                          <div className="text-sm font-semibold text-zinc-100">{unit.model}</div>
                          <div className="mt-1 text-xs text-zinc-500">{unit.name} · {unit.weightClass} · {unit.totalBV?.toLocaleString() ?? unit.bv?.toLocaleString()} BV</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-700 bg-zinc-950 p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">New force</div>
                <h2 className="mt-2 text-2xl font-black text-zinc-50">Create a force</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-red-400 hover:text-red-400"
              >
                Close
              </button>
            </div>

            <div className="space-y-5">
              <label className="block text-sm font-semibold text-zinc-200">
                Force name <span className="text-red-400">*</span>
                <input
                  value={forceName}
                  onChange={(event) => onForceNameChange(event.target.value)}
                  placeholder="E.g. Black Lancers"
                  className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                />
              </label>

              <label className="block text-sm font-semibold text-zinc-200">
                Description
                <textarea
                  value={forceDescription}
                  onChange={(event) => onForceDescriptionChange(event.target.value)}
                  placeholder="Optional background description"
                  className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                  rows={3}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-zinc-200">
                  Era
                  <select
                    value={forceEra}
                    onChange={(event) => onForceEraChange(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                  >
                    {ERA_OPTIONS.filter((option) => option !== "All").map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-zinc-200">
                  Rules level
                  <select
                    value={forceRulesLevel}
                    onChange={(event) => onForceRulesLevelChange(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                  >
                    {RULE_OPTIONS.filter((option) => option !== "All").map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-zinc-200">
                  Faction
                  <select
                    value={forceFaction}
                    onChange={(event) => onForceFactionChange(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                  >
                    {FACTION_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-zinc-200">
                  BV limit <span className="text-red-400">*</span>
                  <input
                    type="number"
                    min={1}
                    value={forceBVLimit}
                    onChange={(event) => onForceBVLimitChange(Number(event.target.value))}
                    className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                  />
                </label>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4">
                <label className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
                  <input
                    type="checkbox"
                    checked={forceForConquest}
                    onChange={(event) => onForceForConquestChange(event.target.checked)}
                    className="h-5 w-5 rounded border-zinc-700 bg-zinc-950 text-lime-400 focus:ring-lime-400"
                  />
                  Conquest ready
                </label>
                <p className="mt-2 text-xs text-zinc-500">Enable conquest to organize units into {getTeamLabel(forceFaction).toLowerCase()}.</p>
              </div>

              {forceForConquest && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-zinc-200">
                    Number of {getTeamLabel(forceFaction).toLowerCase()}
                    <input
                      type="number"
                      min={1}
                      value={forceCombatTeamCount}
                      onChange={(event) => onForceCombatTeamCountChange(Number(event.target.value))}
                      className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-zinc-200">
                    BV per {getTeamLabel(forceFaction).toLowerCase()}
                    <input
                      type="number"
                      min={0}
                      value={forceCombatTeamBV}
                      onChange={(event) => onForceCombatTeamBVChange(Number(event.target.value))}
                      className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                    />
                  </label>
                </div>
              )}

              {forceFormError && <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">{forceFormError}</div>}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-black text-zinc-200 transition hover:border-zinc-600 hover:text-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const success = await onCreateForce();
                    if (success) closeModal();
                  }}
                  disabled={forceFormLoading}
                  className="flex-1 rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:opacity-50"
                >
                  {forceFormLoading ? "Creating force…" : "Create Force"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddUnitModal && selectedForce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl overflow-y-auto rounded-3xl border border-zinc-700 bg-zinc-950 p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Add unit</div>
                <h2 className="mt-2 text-2xl font-black text-zinc-50">Add a unit to {selectedForce.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUnitModal(false)}
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-red-400 hover:text-red-400"
              >
                Close
              </button>
            </div>

            <div className="space-y-5">
              <label className="block text-sm font-semibold text-zinc-200">
                Search chassis, model, or name
                <input
                  value={addUnitSearch}
                  onChange={(event) => setAddUnitSearch(event.target.value)}
                  placeholder="Search for a unit..."
                  className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                />
              </label>

              <label className="block text-sm font-semibold text-zinc-200">
                Choose unit
                <select
                  value={selectedAddUnitId ?? ""}
                  onChange={(event) => setSelectedAddUnitId(event.target.value || null)}
                  className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                >
                  <option value="">Select a unit</option>
                  {filteredAddUnitOptions.map((unit) => (
                    <option key={unit.id} value={unit.id}>{unit.model} — {unit.name} ({unit.chassis})</option>
                  ))}
                </select>
              </label>

              {selectedForce.forConquest && (
                <label className="block text-sm font-semibold text-zinc-200">
                  Assign to {addUnitLabel.toLowerCase()}
                  <select
                    value={selectedAddTeam}
                    onChange={(event) => setSelectedAddTeam(Number(event.target.value))}
                    className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4"
                  >
                    {Array.from({ length: selectedForce.combatTeamCount ?? 0 }, (_, index) => (
                      <option key={index} value={index + 1}>{`${addUnitLabel} ${index + 1}`}</option>
                    ))}
                  </select>
                </label>
              )}

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
                This is a UI-only modal for choosing a unit and force/team. The actual assignment logic is not wired yet.
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(false)}
                  className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-black text-zinc-200 transition hover:border-zinc-600 hover:text-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAddUnitId(null);
                    setAddUnitSearch("");
                    setSelectedAddTeam(1);
                    setShowAddUnitModal(false);
                  }}
                  disabled={!selectedAddUnitId}
                  className="flex-1 rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:opacity-50"
                >
                  Add unit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
