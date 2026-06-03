import React, { useMemo, useState } from "react";
import {
  Search,
  Boxes,
  SlidersHorizontal,
  X,
  Weight,
  Gauge,
  Flame,
  BookOpen,
  Flag,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type {
  CriticalSlot,
  SortMode,
  Unit,
  UnitLocation,
  UnitPanelMode,
  UnitWeapon,
  Force,
  ForceUnit,
} from "../types/app";
import PageTitle from "../components/PageTitle";
import { ERA_OPTIONS, RULE_OPTIONS } from "../constants/appOptions";
import { normalizeEra } from "../utils/unitNormalization";

export default function UnitsPage({
  units,
  selectedUnit,
  forces,
  selectedForceForUnitAdd,
  onSelectUnit,
  onClearSelectedUnit,
  onSelectForceForUnitAdd,
  onAddUnitToForce,
  addUnitLoading,
  addUnitError,
}: {
  units: Unit[];
  selectedUnit: Unit | null;
  forces: Force[];
  selectedForceForUnitAdd: Force | null;
  onSelectUnit: (id: string) => void;
  onClearSelectedUnit: () => void;
  onSelectForceForUnitAdd: (force: Force | null) => void;
  onAddUnitToForce: (unitId: string, forceId?: string, teamNumber?: number) => void;
  addUnitLoading: boolean;
  addUnitError: string | null;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [weightFilter, setWeightFilter] = useState<string>("All");
  const [eraFilter, setEraFilter] = useState("All");
  const [rulesFilter, setRulesFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [techBaseFilter, setTechBaseFilter] = useState<string>("All");
  const [minTonnage, setMinTonnage] = useState(0);
  const [maxTonnage, setMaxTonnage] = useState(100);
  const [minBV, setMinBV] = useState(0);
  const [maxBV, setMaxBV] = useState(10000);
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(100000000);
  const [sortBy, setSortBy] = useState<SortMode>("name");
  const [panelMode, setPanelMode] = useState<UnitPanelMode>("slots");
  const [topMode, setTopMode] = useState<"filters" | "browse">("filters");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addUnitModalOpen, setAddUnitModalOpen] = useState(false);

  const filterOptions = useMemo(
    () => ({
      roles: [
        "All",
        ...Array.from(new Set(units.map((unit) => unit.role).filter(Boolean))),
      ],
      unitTypes: [
        "All",
        ...Array.from(
          new Set(
            units
              .map((unit) => String(unit.type || unit.unitType || "BattleMech"))
              .filter(Boolean),
          ),
        ),
      ],
      techBases: [
        "All",
        ...Array.from(
          new Set(units.map((unit) => unit.techBase).filter(Boolean)),
        ),
      ],
    }),
    [units],
  );

  const filteredUnits = useMemo(() => {
    return units
      .filter((unit) => {
        const unitEra = normalizeEra(unit.era, unit.year);
        const totalBV = Number(unit.totalBV ?? unit.bv ?? 0);
        const cost = Number(unit.costCBills ?? 0);
        const text =
          `${unit.name} ${unit.model} ${unit.chassis} ${unit.role} ${unit.sourceFile ?? ""} ${unit.fileName ?? ""} ${unit.relativePath ?? ""}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());

        return (
          matchesQuery &&
          (typeFilter === "All" ||
            String(unit.type || unit.unitType) === typeFilter) &&
          (weightFilter === "All" || unit.weightClass === weightFilter) &&
          (eraFilter === "All" || unitEra === eraFilter) &&
          (rulesFilter === "All" || unit.rulesLevel === rulesFilter) &&
          (roleFilter === "All" || unit.role === roleFilter) &&
          (techBaseFilter === "All" || unit.techBase === techBaseFilter) &&
          unit.tonnage >= minTonnage &&
          unit.tonnage <= maxTonnage &&
          totalBV >= minBV &&
          totalBV <= maxBV &&
          cost >= minCost &&
          cost <= maxCost
        );
      })
      .sort((a, b) => {
        if (sortBy === "tonnage") return Number(b.tonnage) - Number(a.tonnage);
        if (sortBy === "bv")
          return (
            Number(b.totalBV ?? b.bv ?? 0) - Number(a.totalBV ?? a.bv ?? 0)
          );
        if (sortBy === "cost")
          return Number(b.costCBills ?? 0) - Number(a.costCBills ?? 0);
        return `${a.name} ${a.model}`.localeCompare(`${b.name} ${b.model}`);
      });
  }, [
    query,
    sortBy,
    typeFilter,
    weightFilter,
    eraFilter,
    rulesFilter,
    roleFilter,
    techBaseFilter,
    minTonnage,
    maxTonnage,
    minBV,
    maxBV,
    minCost,
    maxCost,
    units,
  ]);

  const clearFilters = () => {
    setQuery("");
    setTypeFilter("All");
    setWeightFilter("All");
    setEraFilter("All");
    setRulesFilter("All");
    setRoleFilter("All");
    setTechBaseFilter("All");
    setMinTonnage(0);
    setMaxTonnage(100);
    setMinBV(0);
    setMaxBV(10000);
    setMinCost(0);
    setMaxCost(100000000);
  };

  const selectUnit = (id: string) => {
    onSelectUnit(id);
    setPanelMode("slots");
  };

  const selectByModel = (value: string) => {
    const match = filteredUnits.find(
      (unit) =>
        `${unit.model} - ${unit.name}` === value ||
        unit.model.toLowerCase() === value.toLowerCase(),
    );
    if (match) selectUnit(match.id);
  };

  const selectedPanelTitle = selectedUnit
    ? `${selectedUnit.model} selected`
    : "Find / filter a chassis";

  return (
    <section className="space-y-4 overflow-hidden">
      <div
        className={`grid gap-4 ${selectedUnit ? "items-stretch xl:grid-cols-[minmax(0,2.28fr)_minmax(330px,0.72fr)] 2xl:grid-cols-[minmax(0,2.32fr)_minmax(400px,0.68fr)]" : "xl:grid-cols-[minmax(330px,0.72fr)_minmax(0,2.28fr)] 2xl:grid-cols-[minmax(400px,0.68fr)_minmax(0,2.32fr)]"}`}
      >
        {selectedUnit ? (
          <div className="flex h-[26rem] min-w-0 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-3 sm:p-4">
            <MechSummary
              unit={selectedUnit}
              panelMode={panelMode}
              setPanelMode={setPanelMode}
              onClose={onClearSelectedUnit}
              onOpenAddUnitModal={() => setAddUnitModalOpen(true)}
              addUnitLoading={addUnitLoading}
              addUnitError={addUnitError}
              embedded
            />
          </div>
        ) : (
          <PageTitle
            eyebrow="Unit database"
            title="Units"
            description="API-backed unit catalog loaded from generated JSON data. Select a unit to load its JSON-powered MechLab view."
          />
        )}

        {selectedUnit ? (
          <WeaponSummary unit={selectedUnit} />
        ) : (
          <div className="min-w-0 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-3 sm:p-4">
            {selectedForceForUnitAdd && (
              <div className="mb-4 rounded-3xl border border-lime-500/20 bg-lime-500/10 p-4 text-sm text-lime-200">
                Adding units to{" "}
                <strong className="text-lime-100">
                  {selectedForceForUnitAdd.name}
                </strong>
                .
                <button
                  type="button"
                  onClick={() => onSelectForceForUnitAdd(null)}
                  className="ml-3 underline text-lime-100 hover:text-white"
                >
                  Clear target
                </button>
              </div>
            )}
            {addUnitError && (
              <div className="mb-4 rounded-3xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
                {addUnitError}
              </div>
            )}
            <>
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                    {selectedPanelTitle}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {filteredUnits.length.toLocaleString("en-US")} matching unit
                    {filteredUnits.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="shrink-0 rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-lime-400 hover:text-lime-300 sm:px-4 sm:text-sm"
                  >
                    Clear Filters
                  </button>
                  <div className="grid min-w-[190px] grid-cols-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 sm:min-w-[220px]">
                    <button
                      onClick={() => setTopMode("filters")}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${topMode === "filters" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}
                    >
                      Filters
                    </button>
                    <button
                      onClick={() => setTopMode("browse")}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${topMode === "browse" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </div>

              {topMode === "filters" ? (
                <UnitToolbar
                  units={filteredUnits}
                  query={query}
                  setQuery={setQuery}
                  onSelectByModel={selectByModel}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  weightFilter={weightFilter}
                  setWeightFilter={setWeightFilter}
                  eraFilter={eraFilter}
                  setEraFilter={setEraFilter}
                  rulesFilter={rulesFilter}
                  setRulesFilter={setRulesFilter}
                  roleFilter={roleFilter}
                  setRoleFilter={setRoleFilter}
                  techBaseFilter={techBaseFilter}
                  setTechBaseFilter={setTechBaseFilter}
                  filterOptions={filterOptions}
                  minTonnage={minTonnage}
                  setMinTonnage={setMinTonnage}
                  maxTonnage={maxTonnage}
                  setMaxTonnage={setMaxTonnage}
                  minBV={minBV}
                  setMinBV={setMinBV}
                  maxBV={maxBV}
                  setMaxBV={setMaxBV}
                  minCost={minCost}
                  setMinCost={setMinCost}
                  maxCost={maxCost}
                  setMaxCost={setMaxCost}
                  mobileFiltersOpen={mobileFiltersOpen}
                  setMobileFiltersOpen={setMobileFiltersOpen}
                />
              ) : (
                <BrowseUnitList
                  units={filteredUnits}
                  onSelectUnit={selectUnit}
                  compact
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              )}
            </>
          </div>
        )}
      </div>

      {selectedUnit ? (
        <MechLabPanel
          unit={selectedUnit}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          onClose={onClearSelectedUnit}
        />
      ) : (
        <BrowseUnitList
          units={filteredUnits}
          onSelectUnit={selectUnit}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      )}

      {selectedUnit && addUnitModalOpen && (
        <AddUnitToForceModal
          unit={selectedUnit}
          units={units}
          forces={forces}
          onClose={() => setAddUnitModalOpen(false)}
          onAddUnitToForce={onAddUnitToForce}
          addUnitLoading={addUnitLoading}
          addUnitError={addUnitError}
        />
      )}
    </section>
  );
}

function AddUnitToForceModal({
  unit,
  units,
  forces,
  onClose,
  onAddUnitToForce,
  addUnitLoading,
  addUnitError,
}: {
  unit: Unit;
  units: Unit[];
  forces: Force[];
  onClose: () => void;
  onAddUnitToForce: (unitId: string, forceId?: string, teamNumber?: number) => void;
  addUnitLoading: boolean;
  addUnitError: string | null;
}) {
  const [selectedTeams, setSelectedTeams] = useState<Record<string, number>>({});
  const [addConfirmation, setAddConfirmation] = useState<string | null>(null);
  const unitBV = Number(unit.totalBV ?? unit.bv ?? 0);
  const forceRows = forces.map((force) => {
    const currentBV = getForceCurrentBV(force, units);
    const remainingBV = Math.max(0, Number(force.totalBV ?? 0) - currentBV);
    const validation = getForceEligibility(force, unit, units, selectedTeams[force.id]);
    return { force, currentBV, remainingBV, validation };
  });
  const eligibleCount = forceRows.filter(
    (row) => row.validation.eligible,
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 p-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
              Add Unit to Force
            </div>
            <h2 className="mt-1 text-2xl font-black text-zinc-50">
              {unit.model} {unit.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {unit.tonnage}t · {unit.rulesLevel || "Unknown rules"} ·{" "}
              {unit.era || normalizeEra(unit.era, unit.year) || "Unknown era"} ·{" "}
              {unitBV.toLocaleString("en-US")} BV
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-400 transition hover:border-lime-400 hover:text-lime-300"
            aria-label="Close add unit modal"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {addConfirmation && !addUnitError && (
          <div className="mx-5 mt-4 rounded-2xl border border-lime-400/40 bg-lime-400/10 p-3 text-sm text-lime-100">
            {addConfirmation}
          </div>
        )}

        {addUnitError && (
          <div className="mx-5 mt-4 rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
            {addUnitError}
          </div>
        )}

        <div className="btcm-scrollbar min-h-0 flex-1 overflow-y-scroll p-5 [scrollbar-gutter:stable]">
          {forces.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/70 p-6 text-sm text-zinc-400">
              No forces are available yet. Create a force first, then return
              here to add this unit directly from the Units page.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div className="text-sm text-zinc-400">
                  Showing {eligibleCount} eligible force
                  {eligibleCount === 1 ? "" : "s"} of {forces.length}.
                </div>
                <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Era · Rules · BV limit checked
                </div>
              </div>

              {forceRows.map(
                ({ force, currentBV, remainingBV, validation }) => (
                  <div
                    key={force.id}
                    className={`rounded-3xl border p-4 ${validation.eligible ? "border-lime-400/30 bg-lime-400/10" : "border-zinc-800 bg-zinc-900/70"}`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {validation.eligible ? (
                            <CheckCircle2 className="text-lime-300" size={17} />
                          ) : (
                            <AlertTriangle
                              className="text-amber-300"
                              size={17}
                            />
                          )}
                          <h3 className="truncate text-lg font-black text-zinc-50">
                            {force.name}
                          </h3>
                          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                            {force.origin === "CampaignCopy" || force.campaignId
                              ? "Campaign"
                              : "Original"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                          <span>Era: {force.era || "Any"}</span>
                          <span>Rules: {force.rulesLevel || "Any"}</span>
                          <span>
                            BV: {currentBV.toLocaleString("en-US")} /{" "}
                            {Number(force.totalBV ?? 0).toLocaleString("en-US")}
                          </span>
                          <span>
                            Remaining: {remainingBV.toLocaleString("en-US")}
                          </span>
                        </div>
                        {!validation.eligible && (
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-200/90">
                            {validation.reasons.map((reason) => (
                              <li key={reason}>{reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col gap-2">
                        {force.forConquest && (
                          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                            Team
                            <select
                              value={selectedTeams[force.id] ?? ""}
                              onChange={(event) => setSelectedTeams((current) => ({ ...current, [force.id]: Number(event.target.value) }))}
                              className="mt-1 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm normal-case tracking-normal text-zinc-100 outline-none focus:border-lime-400"
                            >
                              <option value="">Choose team</option>
                              {Array.from({ length: force.combatTeamCount ?? 0 }, (_, index) => {
                                const teamNumber = index + 1;
                                return <option key={index} value={teamNumber}>{`Team ${teamNumber} — ${getForceTeamBV(force, teamNumber).toLocaleString("en-US")} / ${Number(force.combatTeamBV ?? 0).toLocaleString("en-US")} BV`}</option>;
                              })}
                            </select>
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            onAddUnitToForce(unit.id, force.id, force.forConquest ? selectedTeams[force.id] : undefined);
                            setAddConfirmation(`${unit.chassis || unit.name} ${unit.model || ""} mek has been added to ${force.name}.`.replace(/\s+/g, " ").trim());
                          }}
                          disabled={!validation.eligible || addUnitLoading || (force.forConquest && !selectedTeams[force.id])}
                          className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
                        >
                          {addUnitLoading ? "Adding…" : "Add to this force"}
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function getForceUnitBV(forceUnit: ForceUnit) {
  return Number(forceUnit.currentBV ?? forceUnit.snapshot?.totalBV ?? 0);
}

function getForceCurrentBV(force: Force, units: Unit[]) {
  if (force.forceUnits?.length) {
    return force.forceUnits.reduce((total, forceUnit) => total + getForceUnitBV(forceUnit), 0);
  }

  const unitMap = new Map(units.map((candidate) => [candidate.id, candidate]));
  return (force.unitIds ?? []).reduce((total, unitId) => {
    const existingUnit = unitMap.get(unitId);
    return total + Number(existingUnit?.totalBV ?? existingUnit?.bv ?? 0);
  }, 0);
}

function getForceTeamBV(force: Force, teamNumber: number) {
  return (force.forceUnits ?? [])
    .filter((forceUnit) => (forceUnit.teamNumber ?? 1) === teamNumber)
    .reduce((total, forceUnit) => total + getForceUnitBV(forceUnit), 0);
}

function getForceEligibility(force: Force, unit: Unit, units: Unit[], targetTeamNumber?: number) {
  const reasons: string[] = [];
  const currentBV = getForceCurrentBV(force, units);
  const unitBV = Number(unit.totalBV ?? unit.bv ?? 0);
  const forceBVLimit = Number(force.totalBV ?? 0);

  if (forceBVLimit > 0 && currentBV + unitBV > forceBVLimit) {
    reasons.push(
      `Adding this unit would exceed the force BV limit by ${(currentBV + unitBV - forceBVLimit).toLocaleString("en-US")} BV.`,
    );
  }

  if (force.forConquest && targetTeamNumber) {
    const teamBVLimit = Number(force.combatTeamBV ?? 0);
    const currentTeamBV = getForceTeamBV(force, targetTeamNumber);
    if (teamBVLimit > 0 && currentTeamBV + unitBV > teamBVLimit) {
      reasons.push(
        `Adding this unit would exceed Team ${targetTeamNumber}'s BV limit by ${(currentTeamBV + unitBV - teamBVLimit).toLocaleString("en-US")} BV.`,
      );
    }
  }

  const forceRulesRank = getRulesRank(force.rulesLevel);
  const unitRulesRank = getRulesRank(unit.rulesLevel);
  if (
    forceRulesRank !== null &&
    unitRulesRank !== null &&
    unitRulesRank > forceRulesRank
  ) {
    reasons.push(
      `${unit.rulesLevel} units are above this force's ${force.rulesLevel} rules level.`,
    );
  }

  const forceEraRank = getEraRank(force.era);
  const unitEraRank = getEraRank(unit.era || normalizeEra(unit.era, unit.year));
  if (
    forceEraRank !== null &&
    unitEraRank !== null &&
    unitEraRank > forceEraRank
  ) {
    reasons.push(
      `${unit.era || "This unit's era"} is later than this force's ${force.era} era.`,
    );
  }

  return { eligible: reasons.length === 0, reasons };
}

function getRulesRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown")
    return null;
  const normalized = value.toLowerCase();
  const order = ["introductory", "standard", "advanced", "experimental"];
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

function UnitToolbar({
  units,
  query,
  setQuery,
  onSelectByModel,
  typeFilter,
  setTypeFilter,
  weightFilter,
  setWeightFilter,
  eraFilter,
  setEraFilter,
  rulesFilter,
  setRulesFilter,
  roleFilter,
  setRoleFilter,
  techBaseFilter,
  setTechBaseFilter,
  filterOptions,
  minTonnage,
  setMinTonnage,
  maxTonnage,
  setMaxTonnage,
  minBV,
  setMinBV,
  maxBV,
  setMaxBV,
  minCost,
  setMinCost,
  maxCost,
  setMaxCost,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: {
  units: Unit[];
  query: string;
  setQuery: (query: string) => void;
  onSelectByModel: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  weightFilter: string;
  setWeightFilter: (weight: string) => void;
  eraFilter: string;
  setEraFilter: (era: string) => void;
  rulesFilter: string;
  setRulesFilter: (rules: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  techBaseFilter: string;
  setTechBaseFilter: (techBase: string) => void;
  filterOptions: { roles: string[]; unitTypes: string[]; techBases: string[] };
  minTonnage: number;
  setMinTonnage: (value: number) => void;
  maxTonnage: number;
  setMaxTonnage: (value: number) => void;
  minBV: number;
  setMinBV: (value: number) => void;
  maxBV: number;
  setMaxBV: (value: number) => void;
  minCost: number;
  setMinCost: (value: number) => void;
  maxCost: number;
  setMaxCost: (value: number) => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
}) {
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1.5fr)_minmax(220px,1fr)]">
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chassis, model, role, source file..."
            className="h-11 w-full rounded-2xl border border-zinc-700 bg-zinc-950 pl-10 pr-3 text-sm text-zinc-100 outline-none ring-lime-400/30 placeholder:text-zinc-600 focus:border-lime-400 focus:ring-4"
          />
        </label>

        <label className="relative block">
          <Boxes
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={17}
          />
          <input
            list="unit-models"
            onChange={(event) => onSelectByModel(event.target.value)}
            placeholder="Jump to model..."
            className="h-11 w-full rounded-2xl border border-zinc-700 bg-zinc-950 pl-10 pr-3 text-sm text-zinc-100 outline-none ring-lime-400/30 placeholder:text-zinc-600 focus:border-lime-400 focus:ring-4"
          />
          <datalist id="unit-models">
            {units.slice(0, 500).map((unit) => (
              <option key={unit.id} value={`${unit.model} - ${unit.name}`} />
            ))}
          </datalist>
        </label>
      </div>

      <div className="mt-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-black text-zinc-200 transition hover:border-lime-400 hover:text-lime-300"
        >
          <SlidersHorizontal size={16} />
          {mobileFiltersOpen
            ? "Hide Advanced Filters"
            : "Show Advanced Filters"}
        </button>
      </div>

      <div
        className={`${mobileFiltersOpen ? "grid" : "hidden"} mt-3 gap-3 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6`}
      >
        <CompactSelect
          label="Unit"
          value={typeFilter}
          onChange={setTypeFilter}
          options={filterOptions.unitTypes}
        />
        <CompactSelect
          label="Class"
          value={weightFilter}
          onChange={setWeightFilter}
          options={["All", "Light", "Medium", "Heavy", "Assault"]}
        />
        <CompactSelect
          label="Era"
          value={eraFilter}
          onChange={setEraFilter}
          options={ERA_OPTIONS}
        />
        <CompactSelect
          label="Rules"
          value={rulesFilter}
          onChange={setRulesFilter}
          options={RULE_OPTIONS}
        />
        <CompactSelect
          label="Tech"
          value={techBaseFilter}
          onChange={setTechBaseFilter}
          options={filterOptions.techBases}
        />
        <CompactSelect
          label="Role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={filterOptions.roles}
        />
      </div>

      <div
        className={`${mobileFiltersOpen ? "grid" : "hidden"} mt-3 gap-3 md:grid md:grid-cols-3`}
      >
        <RangePair
          label="Tonnage Range"
          min={minTonnage}
          max={maxTonnage}
          setMin={setMinTonnage}
          setMax={setMaxTonnage}
          step={5}
        />
        <RangePair
          label="BV Range"
          min={minBV}
          max={maxBV}
          setMin={setMinBV}
          setMax={setMaxBV}
          step={50}
        />
        <RangePair
          label="C-Bill Range"
          min={minCost}
          max={maxCost}
          setMin={setMinCost}
          setMax={setMaxCost}
          step={100000}
        />
      </div>
    </div>
  );
}

function BrowseUnitList({
  units,
  onSelectUnit,
  compact = false,
  sortBy = "name",
  setSortBy,
}: {
  units: Unit[];
  onSelectUnit: (id: string) => void;
  compact?: boolean;
  sortBy?: SortMode;
  setSortBy?: (sortBy: SortMode) => void;
}) {
  return (
    <section
      className={
        compact ? "" : "rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4"
      }
    >
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {!compact ? (
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
              Browse filtered units
            </div>
            <h2 className="mt-1 text-2xl font-black text-zinc-50">
              Select a BattleMech
            </h2>
          </div>
        ) : (
          <div className="text-xs text-zinc-500">
            {units.length.toLocaleString("en-US")} result
            {units.length === 1 ? "" : "s"}
          </div>
        )}

        {setSortBy && (
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortMode)}
            className="h-10 rounded-2xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none ring-lime-400/30 focus:border-lime-400 focus:ring-4"
          >
            <option value="name">Sort: Name</option>
            <option value="tonnage">Sort: Tons</option>
            <option value="bv">Sort: BV</option>
            <option value="cost">Sort: C-Bills</option>
          </select>
        )}
      </div>

      <div
        className={
          compact
            ? "max-h-[360px] overflow-auto rounded-2xl border border-zinc-800"
            : "max-h-[520px] overflow-auto rounded-2xl border border-zinc-800"
        }
      >
        <table className="w-full min-w-[520px] border-collapse text-left text-sm xl:min-w-[760px] 2xl:min-w-[900px]">
          <thead className="sticky top-0 z-10 bg-zinc-950 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-black">Chassis</th>
              <th className="px-4 py-3 font-black">Model</th>
              <th className="hidden px-4 py-3 font-black xl:table-cell">
                Tech Base
              </th>
              <th className="hidden px-4 py-3 font-black 2xl:table-cell">
                Rules
              </th>
              <th className="px-4 py-3 text-right font-black">BV</th>
              <th className="px-4 py-3 text-right font-black">Mass</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950/45">
            {units.map((unit) => (
              <tr
                key={unit.id}
                onClick={() => onSelectUnit(unit.id)}
                className="cursor-pointer transition hover:bg-lime-400/10"
              >
                <td className="px-4 py-3 font-bold text-zinc-100">
                  {unit.name}
                </td>
                <td className="px-4 py-3 text-zinc-300">{unit.model}</td>
                <td className="hidden px-4 py-3 text-zinc-400 xl:table-cell">
                  {unit.techBase}
                </td>
                <td className="hidden px-4 py-3 text-zinc-400 2xl:table-cell">
                  {unit.rulesLevel}
                </td>
                <td className="px-4 py-3 text-right font-bold text-lime-300">
                  {Number(unit.totalBV ?? unit.bv ?? 0).toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3 text-right text-zinc-300">
                  {unit.tonnage}t
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {units.length === 0 && (
          <div className="p-8 text-center text-zinc-500">
            No units match the current filters.
          </div>
        )}
      </div>
    </section>
  );
}

function CompactSelect({
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
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none ring-lime-400/30 focus:border-lime-400 focus:ring-4"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function RangePair({
  label,
  min,
  max,
  setMin,
  setMax,
  step,
}: {
  label: string;
  min: number;
  max: number;
  setMin: (value: number) => void;
  setMax: (value: number) => void;
  step: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberInput(min)}
          onChange={(event) => setMin(parseNumberInput(event.target.value))}
          className="h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100 outline-none focus:border-lime-400"
          data-step={step}
          aria-label={`${label} minimum`}
        />
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberInput(max)}
          onChange={(event) => setMax(parseNumberInput(event.target.value))}
          className="h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100 outline-none focus:border-lime-400"
          data-step={step}
          aria-label={`${label} maximum`}
        />
      </div>
    </div>
  );
}

function MechSummary({
  unit,
  panelMode,
  setPanelMode,
  onClose,
  onOpenAddUnitModal,
  addUnitLoading = false,
  addUnitError,
  embedded = false,
}: {
  unit: Unit;
  panelMode: UnitPanelMode;
  setPanelMode: (mode: UnitPanelMode) => void;
  onClose?: () => void;
  onOpenAddUnitModal?: () => void;
  addUnitLoading?: boolean;
  addUnitError?: string | null;
  embedded?: boolean;
}) {
  const wrapperClassName = embedded
    ? "btcm-scrollbar flex h-full w-full flex-1 min-w-0 flex-col overflow-y-scroll pr-2 [scrollbar-gutter:stable]"
    : "btcm-scrollbar flex h-[26rem] flex-col overflow-y-scroll rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 [scrollbar-gutter:stable]";

  return (
    <section className={wrapperClassName}>
      <div className="flex items-start gap-4">
        <div className="min-w-0 shrink-0">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
            Selected BattleMech
          </div>
          <h2 className="mt-2 truncate text-3xl font-black text-zinc-50 sm:text-4xl">
            {unit.model}
          </h2>
          <p className="truncate text-zinc-400">{unit.name}</p>
        </div>

        <div className="flex min-w-0 flex-1 justify-center px-3 pt-2">
          <button
            type="button"
            onClick={onOpenAddUnitModal}
            disabled={addUnitLoading || !onOpenAddUnitModal}
            className="w-full max-w-md rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300 disabled:opacity-50"
          >
            {addUnitLoading ? "Adding…" : "Add Unit to Force"}
          </button>
        </div>

        <div className="flex shrink-0 items-start gap-2">
          <div className="rounded-2xl border border-lime-400/20 bg-lime-400/10 px-4 py-3 text-center">
            <div className="text-2xl font-black text-lime-200">
              {Number(unit.totalBV ?? unit.bv ?? 0).toLocaleString("en-US")}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-300/70">
              BV
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-zinc-700 bg-zinc-950 text-zinc-400 transition hover:border-lime-400 hover:text-lime-300"
              aria-label="Close selected BattleMech"
              title="Close selected BattleMech"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {addUnitError && (
        <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
          {addUnitError}
        </div>
      )}

      <UnitWarningSummary warnings={unit.warnings ?? []} />

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3">
        <DetailStat
          label="Tons"
          value={`${unit.tonnage}t${unit.weightClass ? ` (${unit.weightClass})` : ""}`}
          icon={<Weight size={15} />}
        />
        <DetailStat
          label="Movement"
          value={`${unit.walk} / ${unit.run} / ${unit.jump}`}
          icon={<Gauge size={15} />}
        />
        <DetailStat
          label="Heat Sinks"
          value={`${unit.heatSinks ?? "—"} ${unit.heatSinkType || "Single"} Sinks`}
          icon={<Flame size={15} />}
        />
        <DetailStat
          label="Tech Base"
          value={unit.techBase || "—"}
          icon={<Cpu size={15} />}
        />
        <DetailStat
          label="Rules"
          value={unit.rulesLevel || "—"}
          icon={<BookOpen size={15} />}
        />
        <DetailStat
          label="Era"
          value={unit.era || "—"}
          icon={<Flag size={15} />}
        />
      </div>

      <button
        onClick={() =>
          setPanelMode(panelMode === "details" ? "slots" : "details")
        }
        className="mt-5 w-full rounded-2xl border border-lime-400/30 bg-lime-400/10 px-4 py-3 text-sm font-black text-lime-200 transition hover:bg-lime-400 hover:text-zinc-950"
      >
        {panelMode === "details" ? "View Slots" : "View All Information"}
      </button>
    </section>
  );
}

function getEngineDisplay(unit: Unit) {
  type UnitWithEngineDetails = Unit & {
    engineRating?: string | number;
    engineType?: string;
    engine?:
      | string
      | number
      | { rating?: string | number; type?: string; name?: string };
  };

  const extendedUnit = unit as UnitWithEngineDetails;
  const rawEngine = extendedUnit.engine;
  const engineObject =
    rawEngine && typeof rawEngine === "object" ? rawEngine : undefined;
  const engineText =
    typeof rawEngine === "string" || typeof rawEngine === "number"
      ? String(rawEngine).trim()
      : (engineObject?.name ?? "").trim();
  const rating = String(
    extendedUnit.engineRating ?? engineObject?.rating ?? "",
  ).trim();
  const type = String(
    extendedUnit.engineType ?? engineObject?.type ?? "",
  ).trim();

  if (rating && type) return `${rating} ${type}`;
  if (engineText && rating && !engineText.includes(rating))
    return `${rating} ${engineText}`;
  if (
    engineText &&
    type &&
    !engineText.toLowerCase().includes(type.toLowerCase())
  )
    return `${engineText} ${type}`;
  return engineText || rating || type || "—";
}

function WeaponSummary({ unit }: { unit: Unit }) {
  const weapons = unit.weapons ?? [];

  return (
    <section className="flex h-[26rem] min-w-0 flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Primary weapons
          </div>
          <h3 className="text-lg font-black text-zinc-50">Loadout Summary</h3>
        </div>
        <div className="rounded-2xl bg-zinc-950 px-3 py-2 text-sm font-black text-lime-300">
          {weapons.length}
        </div>
      </div>

      <div className="btcm-scrollbar min-h-0 flex-1 space-y-2 overflow-y-scroll pr-2 [scrollbar-gutter:stable]">
        {weapons.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/50 p-4 text-sm text-zinc-500">
            No weapon data loaded.
          </div>
        )}
        {weapons.map((weapon) => (
          <div
            key={weapon.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 font-bold text-zinc-100">
                {weapon.name}
              </div>
              <div className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {weapon.location}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-zinc-400 sm:grid-cols-4">
              <span>Dmg {weapon.damage}</span>
              <span>Heat {weapon.heat}</span>
              <span>Slots {weapon.slots}</span>
              <span className="truncate">Shots {weapon.shots}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MechLabPanel({
  unit,
  panelMode,
  setPanelMode,
  onClose,
}: {
  unit: Unit;
  panelMode: UnitPanelMode;
  setPanelMode: (mode: UnitPanelMode) => void;
  onClose?: () => void;
}) {
  return (
    <section className="min-h-[700px] rounded-3xl border border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.10),transparent_38%),rgba(24,24,27,0.82)] p-4 shadow-2xl shadow-black/30 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
            MechLab View
          </div>
          <h2 className="text-2xl font-black text-zinc-50">
            {panelMode === "slots"
              ? "Location Slots"
              : panelMode === "weapons"
                ? "Weapon Placement"
                : "All Information"}
          </h2>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="grid min-w-0 flex-1 grid-cols-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 sm:w-[360px] sm:flex-none">
            <button
              onClick={() => setPanelMode("slots")}
              className={`min-w-0 whitespace-nowrap rounded-xl px-2 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${panelMode === "slots" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}
            >
              Slots
            </button>
            <button
              onClick={() => setPanelMode("weapons")}
              className={`min-w-0 whitespace-nowrap rounded-xl px-2 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${panelMode === "weapons" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}
            >
              Weapons
            </button>
            <button
              onClick={() => setPanelMode("details")}
              className={`min-w-0 whitespace-nowrap rounded-xl px-2 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${panelMode === "details" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}
            >
              Details
            </button>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-zinc-700 bg-zinc-950 text-zinc-400 transition hover:border-lime-400 hover:text-lime-300"
              aria-label="Close selected BattleMech"
              title="Close selected BattleMech"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {panelMode === "slots" ? (
        <LocationGrid unit={unit} />
      ) : panelMode === "weapons" ? (
        <WeaponPlacementGrid unit={unit} />
      ) : (
        <FullInfoPanel unit={unit} />
      )}
    </section>
  );
}

function FullInfoPanel({ unit }: { unit: Unit }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
            Complete record
          </div>
          <h3 className="mt-1 text-2xl font-black text-zinc-50">
            {unit.model} Full Information
          </h3>
        </div>
        <Badge>
          {unit.detailSource
            ? unit.detailSource === "json"
              ? "Generated JSON"
              : unit.detailSource
            : (unit.relativePath ??
              unit.sourceFile ??
              unit.fileName ??
              "No source")}
        </Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TextInfoSection title="Overview" value={unit.overview} />
        <TextInfoSection title="Capabilities" value={unit.capabilities} />
        <TextInfoSection title="Deployment" value={unit.deployment} />
        <TextInfoSection title="History" value={unit.history} />

        <ManufacturingInfoSection unit={unit} />

        <QuirksInfoSection quirks={unit.quirks ?? []} />

        <InfoSection
          title="Construction"
          items={[
            "Engine",
            "Gyro",
            "Cockpit",
            "Myomer",
            "Internal Structure",
            "Armor Type",
          ]}
          values={[
            getEngineDisplay(unit),
            unit.gyro,
            unit.cockpit ?? "Standard",
            unit.myomer ?? "—",
            unit.structureType ?? "—",
            unit.armorType ?? "—",
          ]}
        />

        <InfoSection
          title="Rules / Source"
          items={[
            "Rules Level",
            "Tech Base",
            "Year",
            "Era",
            "Source File",
            "Source Book",
            "Detail Source",
            "MUL ID",
          ]}
          values={[
            unit.rulesLevel,
            unit.techBase,
            `${unit.year || "—"}`,
            unit.era || "",
            unit.relativePath ?? unit.sourceFile ?? unit.fileName ?? "—",
            unit.sourceBook ?? "—",
            unit.detailSource
              ? unit.detailSource === "json"
                ? "Generated JSON"
                : unit.detailSource
              : "—",
            unit.mulId ? String(unit.mulId) : "—",
          ]}
        />

        <JsonWarningsInfoSection warnings={unit.warnings ?? []} />
      </div>
    </section>
  );
}

function UnitWarningSummary({ warnings }: { warnings: Unit["warnings"] }) {
  const warningCount = getUnitWarningMessages(warnings).length;

  if (warningCount === 0) return null;

  return (
    <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
      <div className="flex items-center gap-2 font-black text-red-100">
        <AlertTriangle size={16} />
        JSON warnings / issues detected
      </div>
      <p className="mt-1 text-red-200/85">
        This generated JSON has {warningCount} warning
        {warningCount === 1 ? "" : "s"}. Check the Details tab before relying on
        this unit's parsed data.
      </p>
    </div>
  );
}

function JsonWarningsInfoSection({ warnings }: { warnings: Unit["warnings"] }) {
  const warningMessages = getUnitWarningMessages(warnings);

  return (
    <div className="rounded-3xl border border-red-500/35 bg-red-950/20 p-4 xl:col-span-2">
      <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-red-200">
        <AlertTriangle size={16} />
        JSON Warnings / Issues
      </h4>

      {warningMessages.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm text-red-100">
          {warningMessages.map((warning, index) => (
            <li
              key={`${warning}-${index}`}
              className="rounded-2xl border border-red-500/30 bg-red-950/30 px-3 py-2 leading-6"
            >
              {warning}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
          No JSON warnings reported for this unit.
        </p>
      )}
    </div>
  );
}

function getUnitWarningMessages(warnings: Unit["warnings"]): string[] {
  if (!Array.isArray(warnings)) return [];

  return warnings
    .map((warning) => {
      if (typeof warning === "string") return warning.trim();

      const message = warning?.message?.trim();
      const metadata = [warning?.severity, warning?.code, warning?.field]
        .filter(Boolean)
        .join(" — ");

      if (message && metadata) return `${metadata}: ${message}`;
      if (message) return message;
      return metadata;
    })
    .filter((warning): warning is string => Boolean(warning));
}

function TextInfoSection({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h4 className="text-sm font-black uppercase tracking-[0.16em] text-lime-300">
        {title}
      </h4>
      <p className="mt-3 min-h-28 whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-400">
        {value?.trim() || "—"}
      </p>
    </div>
  );
}

function ManufacturingInfoSection({ unit }: { unit: Unit }) {
  const systemManufacturers = Object.entries(unit.systemManufacturers ?? {}).filter(
    ([, manufacturer]) => Boolean(String(manufacturer ?? "").trim()),
  );

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 xl:col-span-2">
      <h4 className="text-sm font-black uppercase tracking-[0.16em] text-lime-300">
        Manufacturing
      </h4>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <ManufacturingField label="Manufacturer" value={unit.manufacturer} />
        <ManufacturingField label="Primary Factory" value={unit.primaryFactory ?? unit.factory} />
      </div>

      {systemManufacturers.length > 0 ? (
        <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            System Manufacturers
          </div>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {systemManufacturers.map(([system, manufacturer]) => (
              <div key={system} className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  {system}
                </div>
                <div className="mt-1 text-sm text-zinc-300">{manufacturer}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-500">
          No system manufacturer details loaded.
        </div>
      )}
    </div>
  );
}

function ManufacturingField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 min-h-5 text-sm text-zinc-300">{value?.trim() || "—"}</div>
    </div>
  );
}

function QuirksInfoSection({ quirks }: { quirks: string[] }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h4 className="text-sm font-black uppercase tracking-[0.16em] text-lime-300">
        Quirks
      </h4>
      <div className="mt-3 min-h-28 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
        {quirks.length > 0 ? (
          <ul className="space-y-2 text-sm text-zinc-400">
            {quirks.map((quirk, index) => (
              <li
                key={`${quirk}-${index}`}
                className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2"
              >
                {quirk}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-zinc-500">—</div>
        )}
      </div>
    </div>
  );
}

function InfoSection({
  title,
  items,
  values = [],
}: {
  title: string;
  items: string[];
  values?: React.ReactNode[];
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h4 className="text-sm font-black uppercase tracking-[0.16em] text-lime-300">
        {title}
      </h4>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <div
            key={item}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              {item}
            </div>
            <div className="mt-1 min-h-5 truncate text-sm text-zinc-400">
              {values[index] || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationGrid({ unit }: { unit: Unit }) {
  const locations = unit.locations ?? [];
  const byId = Object.fromEntries(
    locations.map((location) => [location.id, location]),
  ) as Record<string, UnitLocation>;
  const stackedLocations = [
    byId.head,
    byId.ct,
    byId.lt,
    byId.rt,
    byId.la,
    byId.ra,
    byId.ll,
    byId.rl,
  ].filter(Boolean) as UnitLocation[];

  if (stackedLocations.length === 0) {
    return <EmptyPanel message="No location/slot data loaded for this unit." />;
  }

  return (
    <>
      <div className="grid min-w-0 gap-3 lg:grid-cols-2 xl:hidden">
        {stackedLocations.map((location) => (
          <LocationCard key={location.id} location={location} mode="slots" />
        ))}
      </div>

      <div
        className="hidden min-w-0 w-full max-w-full xl:mt-2 xl:block"
        data-layout="head-ct-shared-column-v7"
      >
        <div className="grid min-w-0 w-full max-w-full grid-cols-[minmax(150px,0.85fr)_minmax(190px,1fr)_minmax(210px,1.05fr)_minmax(190px,1fr)_minmax(150px,0.85fr)] items-start gap-3">
          <div className="space-y-3 pt-20 2xl:pt-10">
            {byId.la && (
              <LocationCard location={byId.la} mode="slots" compact />
            )}
          </div>
          <div className="space-y-3">
            {byId.lt && (
              <LocationCard location={byId.lt} mode="slots" compact />
            )}
            {byId.ll && (
              <LocationCard location={byId.ll} mode="slots" compact />
            )}
          </div>
          <div className="space-y-3 -mt-4">
            {byId.head && (
              <div className="relative -top-4 2xl:-top-3">
                <LocationCard location={byId.head} mode="slots" compact head />
              </div>
            )}
            {byId.ct && (
              <LocationCard location={byId.ct} mode="slots" compact tall />
            )}
          </div>
          <div className="space-y-3">
            {byId.rt && (
              <LocationCard location={byId.rt} mode="slots" compact />
            )}
            {byId.rl && (
              <LocationCard location={byId.rl} mode="slots" compact />
            )}
          </div>
          <div className="space-y-3 pt-20 2xl:pt-10">
            {byId.ra && (
              <LocationCard location={byId.ra} mode="slots" compact />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function WeaponPlacementGrid({ unit }: { unit: Unit }) {
  const locations = unit.locations ?? [];
  const weapons = unit.weapons ?? [];
  const byId = Object.fromEntries(
    locations.map((location) => [location.id, location]),
  ) as Record<string, UnitLocation>;
  const stackedLocations = [
    byId.head,
    byId.ct,
    byId.lt,
    byId.rt,
    byId.la,
    byId.ra,
    byId.ll,
    byId.rl,
  ].filter(Boolean) as UnitLocation[];
  const weaponsFor = (location: UnitLocation) =>
    weapons.filter((weapon) => weapon.location === location.name);

  if (stackedLocations.length === 0) {
    return (
      <EmptyPanel message="No location/weapon placement data loaded for this unit." />
    );
  }

  return (
    <>
      <div className="grid min-w-0 gap-3 lg:grid-cols-2 xl:hidden">
        {stackedLocations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            mode="weapons"
            weapons={weaponsFor(location)}
          />
        ))}
      </div>

      <div
        className="hidden min-w-0 w-full max-w-full xl:mt-2 xl:block"
        data-layout="head-ct-shared-column-v7"
      >
        <div className="grid min-w-0 w-full max-w-full grid-cols-[minmax(150px,0.85fr)_minmax(190px,1fr)_minmax(210px,1.05fr)_minmax(190px,1fr)_minmax(150px,0.85fr)] items-start gap-3">
          <div className="space-y-3 pt-20 2xl:pt-10">
            {byId.la && (
              <LocationCard
                location={byId.la}
                mode="weapons"
                weapons={weaponsFor(byId.la)}
                compact
              />
            )}
          </div>
          <div className="space-y-3">
            {byId.lt && (
              <LocationCard
                location={byId.lt}
                mode="weapons"
                weapons={weaponsFor(byId.lt)}
                compact
              />
            )}
            {byId.ll && (
              <LocationCard
                location={byId.ll}
                mode="weapons"
                weapons={weaponsFor(byId.ll)}
                compact
              />
            )}
          </div>
          <div className="space-y-3 -mt-4">
            {byId.head && (
              <div className="relative -top-4 2xl:-top-3">
                <LocationCard
                  location={byId.head}
                  mode="weapons"
                  weapons={weaponsFor(byId.head)}
                  compact
                  head
                />
              </div>
            )}
            {byId.ct && (
              <LocationCard
                location={byId.ct}
                mode="weapons"
                weapons={weaponsFor(byId.ct)}
                compact
                tall
              />
            )}
          </div>
          <div className="space-y-3">
            {byId.rt && (
              <LocationCard
                location={byId.rt}
                mode="weapons"
                weapons={weaponsFor(byId.rt)}
                compact
              />
            )}
            {byId.rl && (
              <LocationCard
                location={byId.rl}
                mode="weapons"
                weapons={weaponsFor(byId.rl)}
                compact
              />
            )}
          </div>
          <div className="space-y-3 pt-20 2xl:pt-10">
            {byId.ra && (
              <LocationCard
                location={byId.ra}
                mode="weapons"
                weapons={weaponsFor(byId.ra)}
                compact
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function LocationCard({
  location,
  mode,
  weapons = [],
  compact = false,
  tall = false,
  head = false,
}: {
  location: UnitLocation;
  mode: UnitPanelMode;
  weapons?: UnitWeapon[];
  compact?: boolean;
  tall?: boolean;
  head?: boolean;
}) {
  const visibleSlots = head ? location.slots.slice(0, 6) : location.slots;
  const occupiedSlots = visibleSlots.filter(
    (slot) => slot.type !== "empty",
  ).length;
  const armorPct = Math.min(
    100,
    Math.round(
      (location.armor / Math.max(location.armor, location.structure || 1)) *
        100,
    ),
  );

  const cardClassName = [
    "min-w-0 rounded-3xl border border-zinc-800 bg-zinc-950/70",
    compact ? "p-3" : "p-4",
    tall ? "xl:min-h-[520px]" : "",
    head ? "xl:min-h-0" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className="mb-3 text-center">
        <h3 className="text-base font-black uppercase tracking-[0.14em] text-zinc-50">
          {location.name}
        </h3>
        <p className="mt-1 text-[11px] text-zinc-500">
          {occupiedSlots}/{visibleSlots.length} slots occupied
        </p>
      </div>

      <div
        className={`mb-4 grid gap-2 ${location.rearArmor !== undefined ? "grid-cols-3" : "grid-cols-2"}`}
      >
        <ArmorPip label="AR" value={location.armor} />
        {location.rearArmor !== undefined && (
          <ArmorPip label="RR" value={location.rearArmor} />
        )}
        <ArmorPip label="ST" value={location.structure} />
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-lime-400"
          style={{ width: `${armorPct}%` }}
        />
      </div>

      {mode === "slots" ? (
        <div className="grid grid-cols-1 gap-1.5">
          {visibleSlots.map((slot) => (
            <CriticalSlotRow key={`${location.id}-${slot.slot}`} slot={slot} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {weapons.length > 0 ? (
            weapons.map((weapon) => (
              <WeaponPlacementRow key={weapon.id} weapon={weapon} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-4 text-center text-sm text-zinc-500">
              No weapons in this location.
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function CriticalSlotRow({ slot }: { slot: CriticalSlot }) {
  return (
    <div
      className={`grid grid-cols-[26px_minmax(0,1fr)_44px] items-center gap-2 rounded-xl border px-2 py-1.5 text-xs ${slotClass(slot.type)}`}
      title={slot.item || "Empty"}
    >
      <span className="text-center font-mono text-zinc-500">
        {slot.slot.toString().padStart(2, "0")}
      </span>
      <span className="truncate text-left font-semibold">{slot.item}</span>
      <span className="rounded-lg bg-black/20 px-1.5 py-1 text-center text-[10px] font-black uppercase tracking-wider opacity-80">
        {slotTypeLabel(slot.type)}
      </span>
    </div>
  );
}

function WeaponPlacementRow({ weapon }: { weapon: UnitWeapon }) {
  return (
    <div
      className="grid gap-1.5"
      style={{
        gridTemplateRows: `repeat(${Math.max(1, weapon.slots)}, minmax(34px, auto))`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-2xl border border-lime-400/30 bg-lime-400/10 px-3 text-center font-black text-lime-100"
        style={{ gridRow: `span ${Math.max(1, weapon.slots)}` }}
        title={`${weapon.name} - ${weapon.slots} slot${weapon.slots === 1 ? "" : "s"}`}
      >
        {weapon.name}
      </div>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center text-zinc-500">
      {message}
    </div>
  );
}

function DetailStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {icon && <span className="text-lime-300">{icon}</span>}
        {label}
      </div>
      <div
        className="mt-1 truncate font-black text-zinc-100"
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function ArmorPip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2 text-center">
      <div className="text-base font-black text-zinc-50">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="max-w-full truncate rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-300">
      {children}
    </span>
  );
}

function formatNumberInput(value: number) {
  return Number.isFinite(value) ? value.toLocaleString("en-US") : "0";
}

function parseNumberInput(value: string) {
  const parsed = Number(value.replace(/,/g, "").replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function slotTypeLabel(type: CriticalSlot["type"]) {
  switch (type) {
    case "weapon":
      return "WPN";
    case "ammo":
      return "AMM";
    case "engine":
      return "ENG";
    case "structure":
      return "STR";
    case "equipment":
      return "EQP";
    default:
      return "—";
  }
}

function slotClass(type: CriticalSlot["type"]) {
  switch (type) {
    case "weapon":
      return "border-lime-400/30 bg-lime-400/10 text-lime-100";
    case "ammo":
      return "border-orange-300/25 bg-orange-300/10 text-orange-100";
    case "engine":
      return "border-sky-300/25 bg-sky-300/10 text-sky-100";
    case "structure":
      return "border-zinc-600 bg-zinc-900 text-zinc-300";
    case "equipment":
      return "border-violet-300/25 bg-violet-300/10 text-violet-100";
    default:
      return "border-zinc-800 bg-zinc-950/50 text-zinc-600";
  }
}
