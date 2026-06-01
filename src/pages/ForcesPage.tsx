import React, { useEffect, useMemo, useState } from "react";
import type { Force, ForceUnit, Unit, User } from "../types/app";
import PageTitle from "../components/PageTitle";
import { X } from "lucide-react";
import { ERA_OPTIONS, RULE_OPTIONS, FACTION_OPTIONS, getTeamLabel } from "../constants/appOptions";
import { normalizeEra } from "../utils/unitNormalization";

function formatNumber(value?: number) {
  return value !== undefined && value !== null ? value.toLocaleString() : "—";
}

function isCampaignForce(force: Force) {
  return force.origin === "CampaignCopy" || Boolean(force.campaignId);
}

function getRulesRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown") return null;
  const normalized = value.toLowerCase();
  const order = ["introductory", "standard", "advanced", "experimental", "unofficial"];
  const index = order.findIndex((entry) => normalized.includes(entry));
  return index >= 0 ? index : null;
}

function getEraRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown") return null;
  const normalized = value.toLowerCase();
  if (normalized.includes("succession war")) return 2;
  if (normalized.includes("republic")) return 6;
  const eraOrder = ["age of war", "star league", "clan invasion", "civil war", "jihad", "dark age", "ilclan"];
  const index = eraOrder.findIndex((era) => normalized.includes(era));
  if (index < 0) return null;
  return index >= 2 ? index + 1 : index;
}

function getForceEligibility(force: Force, unit: Unit, currentBV: number, currentForceUnits: ForceUnit[] = [], targetTeamNumber?: number) {
  const reasons: string[] = [];
  const unitBV = Number(unit.totalBV ?? unit.bv ?? 0);
  const forceBVLimit = Number(force.totalBV ?? 0);
  if (forceBVLimit > 0 && currentBV + unitBV > forceBVLimit) {
    reasons.push(`Adding this unit would exceed the force BV limit by ${(currentBV + unitBV - forceBVLimit).toLocaleString("en-US")} BV.`);
  }

  if (force.forConquest) {
    const teamLimit = Number(force.combatTeamBV ?? 0);
    const teamNumber = targetTeamNumber ?? 1;
    const teamCurrentBV = teamBVTotal(currentForceUnits, teamNumber);
    if (teamLimit > 0 && teamCurrentBV + unitBV > teamLimit) {
      reasons.push(`Adding this unit would exceed ${getTeamLabel(force.faction ?? "")} ${teamNumber}'s BV limit by ${(teamCurrentBV + unitBV - teamLimit).toLocaleString("en-US")} BV.`);
    }
  }

  const forceRulesRank = getRulesRank(force.rulesLevel);
  const unitRulesRank = getRulesRank(unit.rulesLevel);
  if (forceRulesRank !== null && unitRulesRank !== null && unitRulesRank > forceRulesRank) {
    reasons.push(`${unit.rulesLevel} units are above this force's ${force.rulesLevel} rules level.`);
  }

  const forceEraRank = getEraRank(force.era);
  const unitEraRank = getEraRank(unit.era) ?? getEraRank(normalizeEra(unit.era, unit.year));
  if (forceEraRank !== null && unitEraRank !== null && unitEraRank > forceEraRank) {
    reasons.push(`${unit.era || normalizeEra(unit.era, unit.year) || "This unit's era"} is later than this force's ${force.era} era.`);
  }

  return { eligible: reasons.length === 0, reasons };
}

function getForceUnitBV(forceUnit: ForceUnit) {
  return Number(forceUnit.currentBV ?? forceUnit.snapshot?.totalBV ?? 0);
}

function forceUnitBVTotal(force: Force) {
  if (force.forceUnits?.length) {
    return force.forceUnits.reduce((total, forceUnit) => total + getForceUnitBV(forceUnit), 0);
  }
  return 0;
}

function forceUnitsBVTotal(forceUnits: ForceUnit[] = []) {
  return forceUnits.reduce((total, forceUnit) => total + getForceUnitBV(forceUnit), 0);
}

function teamBVTotal(forceUnits: ForceUnit[] = [], teamNumber: number) {
  return forceUnits
    .filter((forceUnit) => (forceUnit.teamNumber ?? 1) === teamNumber)
    .reduce((total, forceUnit) => total + getForceUnitBV(forceUnit), 0);
}

function validateForceRoster(force: Force, forceUnits: ForceUnit[]) {
  const reasons: string[] = [];
  const forceBVLimit = Number(force.totalBV ?? 0);
  const totalBV = forceUnitsBVTotal(forceUnits);

  if (forceBVLimit > 0 && totalBV > forceBVLimit) {
    reasons.push(`This force exceeds its total BV limit by ${(totalBV - forceBVLimit).toLocaleString("en-US")} BV.`);
  }

  if (force.forConquest) {
    const teamLimit = Number(force.combatTeamBV ?? 0);
    const teamCount = Math.max(1, Number(force.combatTeamCount ?? 1));
    if (teamLimit > 0) {
      for (let teamNumber = 1; teamNumber <= teamCount; teamNumber += 1) {
        const total = teamBVTotal(forceUnits, teamNumber);
        if (total > teamLimit) {
          reasons.push(`${getTeamLabel(force.faction ?? "")} ${teamNumber} exceeds its BV limit by ${(total - teamLimit).toLocaleString("en-US")} BV.`);
        }
      }
    }
  }

  return { valid: reasons.length === 0, reasons };
}

function getDisplayForceUnits(force: Force, units?: Unit[]): ForceUnit[] {
  if (force.forceUnits?.length) {
    return [...force.forceUnits].sort((a, b) => (a.teamNumber ?? 1) - (b.teamNumber ?? 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  // Backward-compatible display for older forces saved before forceUnits existed.
  const unitMap = new Map((units ?? []).map((unit) => [unit.id, unit]));
  return (force.unitIds ?? [])
    .map((unitId, index): ForceUnit | null => {
      const unit = unitMap.get(unitId);
      if (!unit) return null;
      return {
        id: `${force.id}-${unitId}-${index}`,
        forceId: force.id,
        baseUnitId: unitId,
        currentBV: Number(unit.totalBV ?? unit.bv ?? 0),
        teamNumber: 1,
        sortOrder: index,
        pilot: { gunnery: 4, piloting: 5 },
        snapshot: {
          id: unit.id,
          name: unit.name,
          model: unit.model,
          chassis: unit.chassis,
          type: unit.type,
          techBase: unit.techBase,
          era: unit.era,
          year: unit.year,
          tonnage: unit.tonnage,
          weightClass: unit.weightClass,
          totalBV: Number(unit.totalBV ?? unit.bv ?? 0),
          role: unit.role,
        },
      };
    })
    .filter((entry): entry is ForceUnit => Boolean(entry));
}

function cloneForceForDraft(force: Force, units?: Unit[]): Force {
  return {
    ...force,
    forceUnits: getDisplayForceUnits(force, units).map((forceUnit) => ({
      ...forceUnit,
      snapshot: forceUnit.snapshot ? { ...forceUnit.snapshot } : undefined,
      pilot: forceUnit.pilot ? { ...forceUnit.pilot } : { gunnery: 4, piloting: 5 },
    })),
    unitIds: [...(force.unitIds ?? [])],
  };
}

function makeForceUnitFromUnit(force: Force, unit: Unit, teamNumber: number, sortOrder: number): ForceUnit {
  return {
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2)}-${unit.id}`,
    forceId: force.id,
    baseUnitId: unit.id,
    currentBV: Number(unit.totalBV ?? unit.bv ?? 0),
    teamNumber,
    sortOrder,
    pilot: { gunnery: 4, piloting: 5 },
    snapshot: {
      id: unit.id,
      name: unit.name,
      model: unit.model,
      chassis: unit.chassis,
      type: unit.type,
      techBase: unit.techBase,
      era: unit.era,
      year: unit.year,
      tonnage: unit.tonnage,
      weightClass: unit.weightClass,
      totalBV: Number(unit.totalBV ?? unit.bv ?? 0),
      role: unit.role,
    },
  };
}

function sortForceUnitsForDisplay(forceUnits: ForceUnit[] = []) {
  return [...forceUnits].sort((a, b) => (a.teamNumber ?? 1) - (b.teamNumber ?? 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function ForceUnitCard({
  force,
  forceUnit,
  draggable,
  onDragStart,
  onDropOnUnit,
  onUpdateForceUnit,
}: {
  force: Force;
  forceUnit: ForceUnit;
  draggable: boolean;
  onDragStart: (forceUnitId: string) => void;
  onDropOnUnit: (targetForceUnit: ForceUnit) => void;
  onUpdateForceUnit: (forceUnitId: string, updates: { teamNumber?: number; sortOrder?: number; pilotName?: string; gunnery?: number; piloting?: number }) => void;
}) {
  const snapshot = forceUnit.snapshot;
  const pilot = forceUnit.pilot ?? { gunnery: 4, piloting: 5 };
  const title = [snapshot?.chassis, snapshot?.model].filter(Boolean).join(" ") || snapshot?.name || forceUnit.baseUnitId;
  const details = [snapshot?.weightClass, snapshot?.tonnage ? `${snapshot.tonnage}t` : null, `${formatNumber(forceUnit.currentBV ?? snapshot?.totalBV)} BV`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      draggable={draggable}
      onDragStart={() => onDragStart(forceUnit.id)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDropOnUnit(forceUnit);
      }}
      className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-black text-zinc-100">{title}</div>
          <div className="mt-1 text-xs text-zinc-500">{snapshot?.name && snapshot.name !== title ? `${snapshot.name} · ` : ""}{details}</div>
        </div>
        {force.forConquest && (
          <select
            value={forceUnit.teamNumber ?? 1}
            onChange={(event) => onUpdateForceUnit(forceUnit.id, { teamNumber: Number(event.target.value) })}
            className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-100 outline-none focus:border-lime-400"
          >
            {Array.from({ length: force.combatTeamCount ?? 0 }, (_, index) => (
              <option key={index} value={index + 1}>{`${getTeamLabel(force.faction ?? "")} ${index + 1}`}</option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Pilot
          <input
            value={pilot.name ?? ""}
            onChange={(event) => onUpdateForceUnit(forceUnit.id, { pilotName: event.target.value })}
            placeholder="Unnamed pilot"
            className="mt-1 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm normal-case tracking-normal text-zinc-100 outline-none focus:border-lime-400"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Gunnery
          <select
            value={pilot.gunnery}
            onChange={(event) => onUpdateForceUnit(forceUnit.id, { gunnery: Number(event.target.value) })}
            className="mt-1 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm normal-case tracking-normal text-zinc-100 outline-none focus:border-lime-400"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Piloting
          <select
            value={pilot.piloting}
            onChange={(event) => onUpdateForceUnit(forceUnit.id, { piloting: Number(event.target.value) })}
            className="mt-1 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm normal-case tracking-normal text-zinc-100 outline-none focus:border-lime-400"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-3 text-[11px] text-zinc-500">
        Drag to reorder or move between teams. Changes stay local until you click Save Changes.
      </div>
    </div>
  );
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
  onUpdateForce,
  onDeleteForce,
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
  onUpdateForce: (forceId: string, updates: { name?: string; description?: string; forceUnits?: ForceUnit[] }) => Promise<void>;
  onDeleteForce: (forceId: string) => Promise<void>;
  onCreateForce: () => Promise<boolean>;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [addUnitSearch, setAddUnitSearch] = useState("");
  const [selectedAddUnitId, setSelectedAddUnitId] = useState<string | null>(null);
  const [selectedAddTeam, setSelectedAddTeam] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"original" | "campaign">("original");
  const [selectedForceId, setSelectedForceId] = useState<string | null>(null);
  const [draftForce, setDraftForce] = useState<Force | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [draggedForceUnitId, setDraggedForceUnitId] = useState<string | null>(null);

  const selectedSavedForce = selectedForceId ? forces.find((force) => force.id === selectedForceId) ?? null : null;
  const selectedForce = draftForce ?? selectedSavedForce;
  const displayForces = forces.filter((force) => (viewMode === "campaign" ? isCampaignForce(force) : !isCampaignForce(force)));
  const selectedForceUnits = selectedForce ? sortForceUnitsForDisplay(selectedForce.forceUnits ?? getDisplayForceUnits(selectedForce, units)) : [];
  const selectedForceBV = selectedForce ? selectedForceUnits.reduce((total, forceUnit) => total + Number(forceUnit.currentBV ?? forceUnit.snapshot?.totalBV ?? 0), 0) : 0;
  const selectedAddUnit = selectedAddUnitId ? units?.find((unit) => unit.id === selectedAddUnitId) ?? null : null;
  const selectedAddValidation = selectedForce && selectedAddUnit ? getForceEligibility(selectedForce, selectedAddUnit, selectedForceBV, selectedForceUnits, selectedForce.forConquest ? selectedAddTeam : 1) : { eligible: true, reasons: [] };
  const draftForceValidation = selectedForce ? validateForceRoster(selectedForce, selectedForceUnits) : { valid: true, reasons: [] };
  const hasAddUnitSearch = addUnitSearch.trim().length > 0;

  useEffect(() => {
    if (!selectedSavedForce) {
      setDraftForce(null);
      setHasUnsavedChanges(false);
      return;
    }
    setDraftForce(cloneForceForDraft(selectedSavedForce, units));
    setHasUnsavedChanges(false);
    setActionError(null);
    setSelectedAddTeam(1);
  }, [selectedSavedForce?.id, selectedSavedForce?.updatedAt, units]);

  const filteredAddUnitOptions = useMemo(() => {
    if (!units) return [];
    const query = addUnitSearch.trim().toLowerCase();
    if (!query) return [];
    return units
      .filter((unit) => {
        const searchable = `${unit.name} ${unit.model} ${unit.chassis}`.toLowerCase();
        return searchable.includes(query);
      })
      .slice(0, 50);
  }, [addUnitSearch, units]);

  const addUnitLabel = selectedForce ? getTeamLabel(selectedForce.faction ?? forceFaction) : "Team";
  const closeModal = () => setShowCreateModal(false);

  const updateDraftForce = (updater: (force: Force) => Force) => {
    setDraftForce((current) => {
      if (!current) return current;
      return updater(current);
    });
    setHasUnsavedChanges(true);
  };

  const updateDraftForceUnit = (forceUnitId: string, updates: { teamNumber?: number; sortOrder?: number; pilotName?: string; gunnery?: number; piloting?: number }) => {
    updateDraftForce((force) => ({
      ...force,
      forceUnits: (force.forceUnits ?? []).map((forceUnit) =>
        forceUnit.id === forceUnitId
          ? {
              ...forceUnit,
              teamNumber: updates.teamNumber ?? forceUnit.teamNumber,
              sortOrder: updates.sortOrder ?? forceUnit.sortOrder,
              pilot: {
                name: updates.pilotName ?? forceUnit.pilot?.name,
                gunnery: updates.gunnery ?? forceUnit.pilot?.gunnery ?? 4,
                piloting: updates.piloting ?? forceUnit.pilot?.piloting ?? 5,
              },
            }
          : forceUnit
      ),
    }));
  };

  const handleDropInTeam = (teamNumber: number, target?: ForceUnit) => {
    if (!selectedForce || !draggedForceUnitId) return;
    updateDraftForce((force) => {
      const forceUnits = sortForceUnitsForDisplay(force.forceUnits ?? []);
      const draggedUnit = forceUnits.find((forceUnit) => forceUnit.id === draggedForceUnitId);
      if (!draggedUnit) return force;

      const maxTeamNumber = force.forConquest ? Math.max(1, Number(force.combatTeamCount ?? 1)) : 1;
      const normalizedTeamNumber = force.forConquest ? Math.max(1, Math.min(maxTeamNumber, teamNumber)) : 1;
      const remainingUnits = forceUnits.filter((forceUnit) => forceUnit.id !== draggedForceUnitId);
      const reorderedUnits: ForceUnit[] = [];

      for (let currentTeamNumber = 1; currentTeamNumber <= maxTeamNumber; currentTeamNumber += 1) {
        const teamUnits = remainingUnits.filter((forceUnit) => (forceUnit.teamNumber ?? 1) === currentTeamNumber);
        if (currentTeamNumber === normalizedTeamNumber) {
          const movedUnit = { ...draggedUnit, teamNumber: normalizedTeamNumber };
          const targetIndex = target ? teamUnits.findIndex((forceUnit) => forceUnit.id === target.id) : -1;
          if (targetIndex >= 0) teamUnits.splice(targetIndex, 0, movedUnit);
          else teamUnits.push(movedUnit);
        }
        teamUnits.forEach((forceUnit, index) => reorderedUnits.push({ ...forceUnit, teamNumber: currentTeamNumber, sortOrder: index }));
      }

      return { ...force, forceUnits: reorderedUnits };
    });
    setDraggedForceUnitId(null);
  };

  const handleAddUnitToDraft = () => {
    if (!selectedForce || !selectedAddUnit || !selectedAddValidation.eligible) return;
    const teamNumber = selectedForce.forConquest ? selectedAddTeam : 1;
    const sortOrder = selectedForceUnits.filter((forceUnit) => (forceUnit.teamNumber ?? 1) === teamNumber).length;
    const nextForceUnit = makeForceUnitFromUnit(selectedForce, selectedAddUnit, teamNumber, sortOrder);
    updateDraftForce((force) => ({ ...force, forceUnits: [...(force.forceUnits ?? []), nextForceUnit] }));
    setSelectedAddUnitId(null);
    setAddUnitSearch("");
    setSelectedAddTeam(1);
    setShowAddUnitModal(false);
  };

  const handleDiscardChanges = () => {
    if (!selectedSavedForce) return;
    setDraftForce(cloneForceForDraft(selectedSavedForce, units));
    setHasUnsavedChanges(false);
    setActionError(null);
  };

  const handleSaveForce = async () => {
    if (!draftForce) return;
    const rosterValidation = validateForceRoster(draftForce, sortForceUnitsForDisplay(draftForce.forceUnits ?? []));
    if (!rosterValidation.valid) {
      setActionError(rosterValidation.reasons.join(" "));
      return;
    }
    setActionError(null);
    setSaveLoading(true);
    try {
      await onUpdateForce(draftForce.id, {
        name: draftForce.name,
        description: draftForce.description ?? "",
        forceUnits: sortForceUnitsForDisplay(draftForce.forceUnits ?? []).map((forceUnit, index) => ({
          ...forceUnit,
          sortOrder: forceUnit.sortOrder ?? index,
        })),
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to save force changes.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (!authUser) {
    return (
      <section className="space-y-5">
        <PageTitle eyebrow="Forces" title="Sign in required" description="Please sign in to manage your forces and assign them to campaigns." />
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400">Sign in on the Account page to continue.</div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageTitle eyebrow="Forces" title="My Forces" description="Create forces, filter the library, and view selected force details." />
        <button type="button" onClick={() => setShowCreateModal(true)} className="rounded-2xl bg-lime-400 px-6 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300">New Force</button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Force library</div>
              <h2 className="mt-2 text-2xl font-black text-zinc-50">{displayForces.length} force{displayForces.length === 1 ? "" : "s"}</h2>
            </div>
            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
              <button type="button" onClick={() => { setViewMode("original"); setSelectedForceId(null); }} className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${viewMode === "original" ? "bg-lime-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-zinc-100"}`}>Originals</button>
              <button type="button" onClick={() => { setViewMode("campaign"); setSelectedForceId(null); }} className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${viewMode === "campaign" ? "bg-lime-400 text-zinc-950" : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-zinc-100"}`}>Campaigns</button>
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
                  <div key={force.id} onClick={() => setSelectedForceId(force.id)} className={`cursor-pointer rounded-3xl border p-5 transition ${selectedForceId === force.id ? "border-lime-400/60 bg-lime-400/10" : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/80"}`}>
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="text-lg font-black text-zinc-50">{force.name}</div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-zinc-300">{force.era ?? "Any era"}</span>
                          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-zinc-300">{force.rulesLevel ?? "Standard"}</span>
                          {force.forConquest && <span className="rounded-full border border-lime-400/40 bg-lime-400/10 px-2.5 py-1 text-lime-200">Conquest</span>}
                          {isCampaignForce(force) && <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-sky-200">Campaign</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                        <span>{force.forceUnits?.length ?? force.unitIds?.length ?? 0} units</span>
                        <span>{formatNumber(forceUnitBVTotal(force) || force.totalBV)} BV</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="min-h-[360px] rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
          {!selectedForce ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-zinc-950/70 p-10 text-center text-zinc-400">
              <div className="text-lg font-black text-zinc-100">Select a force to view details</div>
              <div className="mt-3 text-sm">Force-level details and assigned units will appear here.</div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">Force details</div>
                  <input value={selectedForce.name} onChange={(event) => updateDraftForce((force) => ({ ...force, name: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-2xl font-black text-zinc-50 outline-none focus:border-lime-400" />
                  <textarea value={selectedForce.description ?? ""} onChange={(event) => updateDraftForce((force) => ({ ...force, description: event.target.value }))} rows={2} placeholder="No description provided." className="mt-3 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-lime-400" />
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" onClick={handleSaveForce} disabled={!hasUnsavedChanges || saveLoading || !draftForceValidation.valid} className="rounded-2xl bg-lime-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50">{saveLoading ? "Saving…" : "Save Changes"}</button>
                  <button type="button" onClick={handleDiscardChanges} disabled={!hasUnsavedChanges || saveLoading} className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-lime-400 hover:text-lime-50 disabled:cursor-not-allowed disabled:opacity-50">Discard</button>
                  <button type="button" onClick={async () => { if (!confirm(`Delete ${selectedForce.name}?`)) return; setActionError(null); try { await onDeleteForce(selectedForce.id); setSelectedForceId(null); } catch (error) { setActionError(error instanceof Error ? error.message : "Unable to delete force."); } }} className="rounded-2xl border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-400">Delete</button>
                  <button
                    type="button"
                    onClick={() => setSelectedForceId(null)}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-zinc-700 bg-zinc-950 text-zinc-400 transition hover:border-lime-400 hover:text-lime-300"
                    aria-label="Close selected force"
                    title="Close selected force"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {hasUnsavedChanges && <div className="rounded-3xl border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-100">You have unsaved force changes. Drag/drop, pilot edits, team changes, and added units are local until you click Save Changes.</div>}
              {!draftForceValidation.valid && (
                <ul className="rounded-3xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
                  {draftForceValidation.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                </ul>
              )}
              {actionError && <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">{actionError}</div>}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Era</div><div className="mt-2 text-sm text-zinc-100">{selectedForce.era ?? "Any"}</div></div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Rules</div><div className="mt-2 text-sm text-zinc-100">{selectedForce.rulesLevel ?? "Standard"}</div></div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-zinc-500">BV</div><div className="mt-2 text-sm text-zinc-100">{formatNumber(selectedForceBV)} / {formatNumber(selectedForce.totalBV)}</div></div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Faction</div><div className="mt-2 text-sm text-zinc-100">{selectedForce.faction ?? "Unknown"}</div></div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Status</div><div className="mt-2 text-sm text-zinc-100">{selectedForce.forConquest ? `${selectedForce.combatTeamCount ?? 0} ${getTeamLabel(selectedForce.faction ?? forceFaction).toLowerCase()} · ${formatNumber(selectedForce.combatTeamBV)} BV` : "Standard force"}</div></div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Units</div>
                    <div className="mt-1 text-sm text-zinc-400">{selectedForceUnits.length} assigned unit{selectedForceUnits.length === 1 ? "" : "s"}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setShowAddUnitModal(true)} className="rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300">Add units</button>
                    <button type="button" onClick={() => onBeginForceUnitAssignment(selectedForce)} className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-bold text-zinc-100 transition hover:border-lime-400">Browse Units page</button>
                  </div>
                </div>

                {selectedForce.forConquest ? (
                  <div className="mt-6 space-y-4">
                    {Array.from({ length: selectedForce.combatTeamCount ?? 0 }, (_, index) => {
                      const teamNumber = index + 1;
                      const teamUnits = selectedForceUnits.filter((forceUnit) => (forceUnit.teamNumber ?? 1) === teamNumber);
                      return (
                        <div key={teamNumber} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleDropInTeam(teamNumber); }} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{getTeamLabel(selectedForce.faction ?? forceFaction)} {teamNumber}</div>
                            <div className="text-xs text-zinc-500">{formatNumber(teamBVTotal(teamUnits, teamNumber))} / {formatNumber(selectedForce.combatTeamBV)} BV · Drop units here</div>
                          </div>
                          <div className="mt-4 space-y-3">
                            {teamUnits.length === 0 ? (
                              <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950/70 p-4 text-sm text-zinc-400">No units assigned to this team yet.</div>
                            ) : (
                              teamUnits.map((forceUnit) => (
                                <ForceUnitCard key={forceUnit.id} force={selectedForce} forceUnit={forceUnit} draggable onDragStart={setDraggedForceUnitId} onDropOnUnit={(target) => handleDropInTeam(teamNumber, target)} onUpdateForceUnit={updateDraftForceUnit} />
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleDropInTeam(1); }} className="mt-6 space-y-3">
                    {selectedForceUnits.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/60 p-6 text-sm text-zinc-400">No units are currently assigned to this force.</div>
                    ) : (
                      selectedForceUnits.map((forceUnit) => (
                        <ForceUnitCard key={forceUnit.id} force={selectedForce} forceUnit={forceUnit} draggable onDragStart={setDraggedForceUnitId} onDropOnUnit={(target) => handleDropInTeam(1, target)} onUpdateForceUnit={updateDraftForceUnit} />
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
              <div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">New force</div><h2 className="mt-2 text-2xl font-black text-zinc-50">Create a force</h2></div>
              <button type="button" onClick={closeModal} className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-red-400 hover:text-red-400">Close</button>
            </div>

            <div className="space-y-5">
              <label className="block text-sm font-semibold text-zinc-200">Force name <span className="text-red-400">*</span><input value={forceName} onChange={(event) => onForceNameChange(event.target.value)} placeholder="E.g. Black Lancers" className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4" /></label>
              <label className="block text-sm font-semibold text-zinc-200">Description<textarea value={forceDescription} onChange={(event) => onForceDescriptionChange(event.target.value)} placeholder="Optional background description" className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4" rows={3} /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-zinc-200">Era<select value={forceEra} onChange={(event) => onForceEraChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4">{ERA_OPTIONS.filter((option) => option !== "All").map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block text-sm font-semibold text-zinc-200">Rules level<select value={forceRulesLevel} onChange={(event) => onForceRulesLevelChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4">{RULE_OPTIONS.filter((option) => option !== "All").map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-zinc-200">Faction<select value={forceFaction} onChange={(event) => onForceFactionChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4">{FACTION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block text-sm font-semibold text-zinc-200">BV limit <span className="text-red-400">*</span><input type="number" min={1} value={forceBVLimit} onChange={(event) => onForceBVLimitChange(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4" /></label>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4"><label className="flex items-center gap-3 text-sm font-semibold text-zinc-200"><input type="checkbox" checked={forceForConquest} onChange={(event) => onForceForConquestChange(event.target.checked)} className="h-5 w-5 rounded border-zinc-700 bg-zinc-950 text-lime-400 focus:ring-lime-400" />Conquest ready</label><p className="mt-2 text-xs text-zinc-500">Enable conquest to organize units into {getTeamLabel(forceFaction).toLowerCase()}.</p></div>
              {forceForConquest && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-zinc-200">Number of {getTeamLabel(forceFaction).toLowerCase()}<input type="number" min={1} value={forceCombatTeamCount} onChange={(event) => onForceCombatTeamCountChange(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4" /></label><label className="block text-sm font-semibold text-zinc-200">BV per {getTeamLabel(forceFaction).toLowerCase()}<input type="number" min={0} value={forceCombatTeamBV} onChange={(event) => onForceCombatTeamBVChange(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4" /></label></div>}
              {forceFormError && <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">{forceFormError}</div>}
              <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={closeModal} className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-black text-zinc-200 transition hover:border-zinc-600 hover:text-zinc-100">Cancel</button><button type="button" onClick={async () => { const success = await onCreateForce(); if (success) closeModal(); }} disabled={forceFormLoading} className="flex-1 rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:opacity-50">{forceFormLoading ? "Creating force…" : "Create Force"}</button></div>
            </div>
          </div>
        </div>
      )}

      {showAddUnitModal && selectedForce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl overflow-y-auto rounded-3xl border border-zinc-700 bg-zinc-950 p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Add unit</div><h2 className="mt-2 text-2xl font-black text-zinc-50">Add a unit to {selectedForce.name}</h2></div>
              <button type="button" onClick={() => setShowAddUnitModal(false)} className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-red-400 hover:text-red-400">Close</button>
            </div>

            <div className="space-y-5">
              <label className="block text-sm font-semibold text-zinc-200">Search chassis, model, or name<input value={addUnitSearch} onChange={(event) => setAddUnitSearch(event.target.value)} placeholder="Search for a unit..." className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4" /></label>
              <label className="block text-sm font-semibold text-zinc-200">Choose unit<select value={selectedAddUnitId ?? ""} disabled={!hasAddUnitSearch} onChange={(event) => setSelectedAddUnitId(event.target.value || null)} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50"><option value="">{hasAddUnitSearch ? "Select a unit" : "Search first to choose a unit"}</option>{filteredAddUnitOptions.map((unit) => <option key={unit.id} value={unit.id}>{unit.chassis} {unit.model} — {unit.name}</option>)}</select></label>
              {selectedForce.forConquest && <label className="block text-sm font-semibold text-zinc-200">Assign to {addUnitLabel.toLowerCase()}<select value={selectedAddTeam} onChange={(event) => setSelectedAddTeam(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-4">{Array.from({ length: selectedForce.combatTeamCount ?? 0 }, (_, index) => <option key={index} value={index + 1}>{`${addUnitLabel} ${index + 1}`}</option>)}</select></label>}
              {!selectedAddValidation.eligible && <ul className="rounded-3xl border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-100">{selectedAddValidation.reasons.map((reason) => <li key={reason}>• {reason}</li>)}</ul>}
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddUnitModal(false)} className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-black text-zinc-200 transition hover:border-zinc-600 hover:text-zinc-100">Cancel</button><button type="button" onClick={handleAddUnitToDraft} disabled={!hasAddUnitSearch || !selectedAddUnitId || !selectedAddValidation.eligible} className="flex-1 rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:opacity-50">Add unit to draft</button></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
