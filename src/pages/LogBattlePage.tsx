import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Info,
  MapPin,
  Save,
  Swords,
  XCircle,
} from "lucide-react";
import PageTitle from "../components/PageTitle";
import { WEAPONS } from "../data/weapons";
import { COMPONENTS } from "../data/components";
import type {
  Battle,
  Campaign,
  CampaignUnitDamageOverlay,
  Force,
  ForceUnit,
  UnitLocation,
  User,
} from "../types/app";

const PILOT_DAMAGE_OPTIONS: Array<number | "KIA"> = [0, 1, 2, 3, 4, 5, "KIA"];
const LIMB_LOCATION_HINTS = ["arm", "leg"];

type UnitStatusLabel = "Ready" | "Damaged" | "Crippled" | "Destroyed";

type UnitDamageDraft = CampaignUnitDamageOverlay & {
  saved?: boolean;
  chaosCondition?: "ready" | "damaged" | "crippled" | "destroyed";
};

type BattleLogPayload = {
  battleId?: string;
  sourceLogId?: string;
  date: string;
  opponentUserId?: string;
  objectiveId?: string;
  objectiveName?: string;
  outcome: string;
  controlsField: boolean;
  campaignForceId?: string;
  unitDamage: CampaignUnitDamageOverlay[];
  summary?: string;
};

type BattleLogPrefill = Partial<
  Pick<
    BattleLogPayload,
    | "date"
    | "opponentUserId"
    | "objectiveId"
    | "objectiveName"
    | "outcome"
    | "controlsField"
    | "summary"
    | "battleId"
    | "sourceLogId"
    | "unitDamage"
  >
> & { editingSourceLog?: boolean };

export default function LogBattlePage({
  campaign,
  force,
  authUser,
  onBack,
  onSubmit,
  submitting = false,
  error,
  initialValues,
}: {
  campaign: Campaign;
  force?: Force;
  authUser: User;
  onBack: () => void;
  onSubmit: (
    campaignId: string,
    payload: BattleLogPayload,
  ) => Promise<Battle | null>;
  submitting?: boolean;
  error?: string | null;
  initialValues?: BattleLogPrefill;
}) {
  const settings = campaign.settings;
  const campaignType = settings?.type ?? "Advanced";
  const isChaos = campaignType === "Chaos";
  const isConquest = campaignType === "Conquest";
  const acceptedOpponents = useMemo(
    () =>
      (campaign.participants ?? []).filter(
        (participant) =>
          participant.status === "Accepted" &&
          participant.userId !== authUser.id,
      ),
    [campaign.participants, authUser.id],
  );
  const objectives = settings?.objectives ?? [];
  const forceUnits = force?.forceUnits ?? [];

  const [battleDate, setBattleDate] = useState(
    () => toInputDate(initialValues?.date) ?? new Date().toISOString().slice(0, 10),
  );
  const [opponentUserId, setOpponentUserId] = useState(
    initialValues?.opponentUserId ??
      (acceptedOpponents.length === 1 ? acceptedOpponents[0].userId : ""),
  );
  const [objectiveId, setObjectiveId] = useState(
    initialValues?.objectiveId ?? objectives[0]?.id ?? "",
  );
  const [outcome, setOutcome] = useState(initialValues?.outcome ?? "Victory");
  const [controlsField, setControlsField] = useState(
    Boolean(initialValues?.controlsField),
  );
  const [participatingIds, setParticipatingIds] = useState<Set<string>>(
    new Set(),
  );
  const [damageDrafts, setDamageDrafts] = useState<
    Record<string, UnitDamageDraft>
  >({});
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [battleNotes, setBattleNotes] = useState(initialValues?.summary ?? "");
  const isEditingSourceLog = Boolean(initialValues?.battleId && initialValues?.sourceLogId);
  const totalKillsMade = Object.values(damageDrafts).reduce(
    (sum: number, draft: UnitDamageDraft) =>
      sum + Number(draft.killsMade ?? 0),
    0,
  );
  const [editingBattleNotes, setEditingBattleNotes] = useState(false);

  useEffect(() => {
    if (!initialValues?.opponentUserId && acceptedOpponents.length === 1)
      setOpponentUserId(acceptedOpponents[0].userId);
  }, [acceptedOpponents, initialValues?.opponentUserId]);

  useEffect(() => {
    if (!initialValues) return;
    setBattleDate(toInputDate(initialValues.date) ?? new Date().toISOString().slice(0, 10));
    setOpponentUserId(
      initialValues.opponentUserId ??
        (acceptedOpponents.length === 1 ? acceptedOpponents[0].userId : ""),
    );
    setObjectiveId(initialValues.objectiveId ?? objectives[0]?.id ?? "");
    setOutcome(initialValues.outcome ?? "Victory");
    setControlsField(Boolean(initialValues.controlsField));
    setBattleNotes(initialValues.summary ?? "");
    if (Array.isArray((initialValues as any).unitDamage)) {
      const nextParticipating = new Set<string>();
      const nextDrafts: Record<string, UnitDamageDraft> = {};
      ((initialValues as any).unitDamage as CampaignUnitDamageOverlay[]).forEach((overlay) => {
        if (!overlay?.campaignForceUnitId) return;
        nextParticipating.add(overlay.campaignForceUnitId);
        nextDrafts[overlay.campaignForceUnitId] = damageOverlayToDraft(overlay, isChaos);
      });
      setParticipatingIds(nextParticipating);
      setDamageDrafts(nextDrafts);
    }
  }, [initialValues, acceptedOpponents, objectives, isChaos]);

  const selectedUnit =
    forceUnits.find((unit) => unit.id === selectedUnitId) ?? null;
  const selectedDraft = selectedUnit
    ? (damageDrafts[selectedUnit.id] ?? createBlankDamageDraft(selectedUnit))
    : null;
  const selectedValidation =
    selectedUnit && selectedDraft
      ? validateDamageDraft(selectedUnit, selectedDraft)
      : [];
  const needsDamageSave = true;
  const participatingUnits = forceUnits.filter((unit) =>
    participatingIds.has(unit.id),
  );
  const selectedBV = participatingUnits.reduce(
    (sum, unit) =>
      sum + Number(unit.currentBV ?? unit.snapshot?.totalBV ?? unit.bv ?? 0),
    0,
  );
  const selectedDestroyedCount = participatingUnits.filter((unit) => {
    const draft = damageDrafts[unit.id];
    if (!draft) return false;
    return getUnitStatus(unit, draft, isChaos) === "Destroyed";
  }).length;
  const selectedWoundedPilots = participatingUnits.filter((unit) => {
    const pilotDamage = damageDrafts[unit.id]?.pilotDamage;
    return typeof pilotDamage === "number" && pilotDamage > 0;
  }).length;
  const selectedKiaPilots = participatingUnits.filter(
    (unit) => damageDrafts[unit.id]?.pilotDamage === "KIA",
  ).length;
  const unsavedDetailedUnits = needsDamageSave
    ? participatingUnits.filter((unit) => !damageDrafts[unit.id]?.saved)
    : [];
  const canSubmit = Boolean(
    battleDate &&
    opponentUserId &&
    outcome &&
    force &&
    participatingUnits.length > 0 &&
    unsavedDetailedUnits.length === 0,
  );

  const toggleParticipating = (forceUnit: ForceUnit, checked: boolean) => {
    setSubmitMessage(null);
    setParticipatingIds((current) => {
      const next = new Set(current);
      if (checked) next.add(forceUnit.id);
      else next.delete(forceUnit.id);
      return next;
    });
    setDamageDrafts((current) => {
      if (!checked) return current;
      return current[forceUnit.id]
        ? current
        : {
            ...current,
            [forceUnit.id]: createBlankDamageDraft(forceUnit, isChaos),
          };
    });
    if (checked) setSelectedUnitId(forceUnit.id);
  };

  const openUnitDamage = (forceUnit: ForceUnit) => {
    if (!participatingIds.has(forceUnit.id)) return;
    setSelectedUnitId(forceUnit.id);
  };

  const updateSelectedDraft = (
    update: (draft: UnitDamageDraft) => UnitDamageDraft,
  ) => {
    if (!selectedUnit) return;
    setDamageDrafts((current) => {
      const existing =
        current[selectedUnit.id] ??
        createBlankDamageDraft(selectedUnit, isChaos);
      return { ...current, [selectedUnit.id]: update(existing) };
    });
  };

  const saveSelectedDamage = () => {
    if (!selectedUnit) return;
    const draft =
      damageDrafts[selectedUnit.id] ??
      createBlankDamageDraft(selectedUnit, isChaos);
    const validation = validateDamageDraft(selectedUnit, draft);
    if (validation.length) return;
    updateSelectedDraft((current) => ({ ...current, saved: true }));
    setSelectedUnitId(null);
  };

  const submitBattleLog = async () => {
    const objective = objectives.find(
      (candidate) => candidate.id === objectiveId,
    );
    const unitDamage = participatingUnits.map((forceUnit) => {
      const draft =
        damageDrafts[forceUnit.id] ??
        createBlankDamageDraft(forceUnit, isChaos);
      return sanitizeDamageDraft(draft, isChaos, forceUnit);
    });
    const created = await onSubmit(campaign.id, {
      battleId: initialValues?.battleId,
      sourceLogId: initialValues?.sourceLogId,
      date: battleDate,
      opponentUserId,
      objectiveId: isConquest ? undefined : objective?.id,
      objectiveName: isConquest ? undefined : objective?.name,
      outcome,
      controlsField,
      campaignForceId: force?.id,
      unitDamage,
      summary: battleNotes.trim() || undefined,
    });
    if (created) {
      setSubmitMessage(
        "Battle log submitted. It is awaiting the opponent's matching battle log.",
      );
      onBack();
    }
  };

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow={isEditingSourceLog ? "Edit Battle Source Log" : "Campaign Battle Log"}
        title={`${isEditingSourceLog ? "Edit Battle Log" : "Log Battle"} · ${campaign.name}`}
        description={
          isEditingSourceLog
            ? "Revise this submitted source log and resubmit it for validation against the opponent’s log."
            : "Record battle metadata, participating units, and campaign damage overlays. The opponent will be notified after submission."
        }
        actions={
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={!canSubmit || submitting}
              onClick={submitBattleLog}
              className="inline-flex items-center justify-center rounded-2xl bg-lime-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : isEditingSourceLog
                  ? "Resubmit Battle Log"
                  : "Log Battle"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
            >
              <ArrowLeft size={16} /> Back to Campaign Dashboard
            </button>
            {isEditingSourceLog && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm font-semibold text-red-100 transition hover:border-red-400/70"
              >
                Cancel Edit
              </button>
            )}
          </div>
        }
      />

      {isEditingSourceLog && (
        <div className="rounded-3xl border border-orange-400/40 bg-orange-500/10 p-4 text-sm text-orange-100">
          <div className="font-black">Editing an existing source log</div>
          <p className="mt-1 text-orange-100/80">
            Save this log again to resubmit it. If the corrected fields now match the opponent’s log, the battle can move out of dispute.
          </p>
        </div>
      )}

      {(error || submitMessage) && (
        <div
          className={`rounded-3xl border p-4 text-sm ${
            error
              ? "border-red-500/40 bg-red-950/30 text-red-200"
              : "border-lime-400/30 bg-lime-400/10 text-lime-100"
          }`}
        >
          {error || submitMessage}
        </div>
      )}

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
          <Swords size={16} /> Battle Details
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field label="Battle Date">
            <input
              type="date"
              value={battleDate}
              onChange={(event) => setBattleDate(event.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-lime-400/60"
            />
          </Field>
          <Field label="Opponent">
            {acceptedOpponents.length === 1 ? (
              <div className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold text-zinc-100">
                {acceptedOpponents[0].user?.displayName ?? "Opponent"}
              </div>
            ) : (
              <select
                value={opponentUserId}
                onChange={(event) => setOpponentUserId(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-lime-400/60"
              >
                <option value="">Choose opponent</option>
                {acceptedOpponents.map((participant) => (
                  <option key={participant.id} value={participant.userId}>
                    {participant.user?.displayName ?? "Commander"}
                  </option>
                ))}
              </select>
            )}
          </Field>
          {!isConquest && (
            <Field label="Objective">
              <select
                value={objectiveId}
                onChange={(event) => setObjectiveId(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-lime-400/60"
              >
                {objectives.length ? (
                  objectives.map((objective) => (
                    <option key={objective.id} value={objective.id}>
                      {objective.name}
                    </option>
                  ))
                ) : (
                  <option value="">No objectives configured</option>
                )}
              </select>
            </Field>
          )}
          <Field label="Result">
            <select
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-lime-400/60"
            >
              <option>Victory</option>
              <option>Defeat</option>
              <option>Draw</option>
            </select>
          </Field>
          <Field label="Field Control">
            <div className="flex gap-2">
              <label className="flex min-h-[42px] flex-1 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={controlsField}
                  onChange={(event) => setControlsField(event.target.checked)}
                  className="h-4 w-4 accent-lime-400"
                />
                Claim control of field
              </label>
              <button
                type="button"
                onClick={() => setEditingBattleNotes(true)}
                className={`grid h-[42px] w-[42px] place-items-center rounded-xl border transition ${battleNotes.trim() ? "border-lime-400/40 bg-lime-400/10 text-lime-200" : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-lime-400/40 hover:text-lime-200"}`}
                title="Add optional battle notes"
                aria-label="Add optional battle notes"
              >
                <FileText size={16} />
              </button>
            </div>
          </Field>
        </div>

        <div className="mt-4 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/45 p-3 sm:grid-cols-2 xl:grid-cols-5">
          <BattleSummaryFact label="Units Participated" value={String(participatingUnits.length)} />
          <BattleSummaryFact label="Selected BV" value={formatNumber(selectedBV)} />
          <BattleSummaryFact label="Kills Logged" value={String(totalKillsMade)} />
          <BattleSummaryFact label="Destroyed Units" value={String(selectedDestroyedCount)} />
          <BattleSummaryFact label="Wounded/KIA" value={`${selectedWoundedPilots}/${selectedKiaPilots}`} />
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
            Participating Units
          </div>
          <h2 className="mt-1 text-xl font-black text-zinc-50">
            {force?.name ?? "No campaign force"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Check each unit that fought. Detailed campaigns require each
            participating unit to have damage saved before the battle can be
            logged.
          </p>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/45">
          {forceUnits.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-[0.16em] text-zinc-500">
                  <tr>
                    <th className="w-[9%] px-4 py-3 font-semibold">Fought</th>
                    <th className="w-[28%] px-4 py-3 font-semibold">Unit</th>
                    <th className="w-[22%] px-4 py-3 font-semibold">Pilot</th>
                    <th className="w-[16%] px-4 py-3 font-semibold">
                      Unit Status
                    </th>
                    <th className="w-[15%] px-4 py-3 font-semibold">
                      Log Status
                    </th>
                    <th className="w-[10%] px-4 py-3 text-right font-semibold">
                      Current BV
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {sortForceUnits(forceUnits, isConquest).map(
                    (forceUnit, index, sortedUnits) => {
                      const previous = sortedUnits[index - 1];
                      const showTeamDivider =
                        isConquest &&
                        (index === 0 ||
                          previous?.teamNumber !== forceUnit.teamNumber);
                      const participated = participatingIds.has(forceUnit.id);
                      const draft = damageDrafts[forceUnit.id];
                      const unitStatus =
                        participated && draft
                          ? getUnitStatus(forceUnit, draft, isChaos)
                          : "";
                      const rowState = !participated
                        ? "neutral"
                        : draft?.saved
                          ? "saved"
                          : "needs";
                      return (
                        <React.Fragment key={forceUnit.id}>
                          {showTeamDivider && (
                            <tr className="bg-zinc-900/80">
                              <td
                                colSpan={6}
                                className="px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-lime-300"
                              >
                                Team {forceUnit.teamNumber ?? "Unassigned"}
                              </td>
                            </tr>
                          )}
                          <tr
                            onClick={() => openUnitDamage(forceUnit)}
                            className={`${rowState === "needs" ? "bg-red-950/30" : rowState === "saved" ? "bg-lime-950/20" : ""} ${participated ? "cursor-pointer" : ""} transition hover:bg-zinc-900/70`}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={participated}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) =>
                                  toggleParticipating(
                                    forceUnit,
                                    event.target.checked,
                                  )
                                }
                                className="h-4 w-4 accent-lime-400"
                              />
                            </td>
                            <td className="px-4 py-3 font-black text-zinc-100">
                              {forceUnitDisplayName(forceUnit)}
                            </td>
                            <td className="px-4 py-3 text-zinc-300">
                              <div className="font-semibold">
                                {forceUnit.pilot?.name || "No pilot"}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {forceUnit.pilot ? `${forceUnit.pilot.gunnery ?? 4}/${forceUnit.pilot.piloting ?? 5}` : "—"}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {unitStatus ? (
                                <UnitStatusPill
                                  status={unitStatus as UnitStatusLabel}
                                />
                              ) : (
                                <span className="text-zinc-600">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {isChaos && participated && draft?.saved ? (
                                <select
                                  onClick={(event) => event.stopPropagation()}
                                  value={draft?.chaosCondition ?? "ready"}
                                  onChange={(event) =>
                                    setDamageDrafts((current) => ({
                                      ...current,
                                      [forceUnit.id]: {
                                        ...(current[forceUnit.id] ??
                                          createBlankDamageDraft(
                                            forceUnit,
                                            true,
                                          )),
                                        chaosCondition: event.target
                                          .value as any,
                                        saved: false,
                                      },
                                    }))
                                  }
                                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100"
                                >
                                  <option value="ready">Ready</option>
                                  <option value="damaged">Damaged</option>
                                  <option value="crippled">Crippled</option>
                                  <option value="destroyed">Destroyed</option>
                                </select>
                              ) : rowState === "needs" ? (
                                <StatusPill color="red" label={isChaos ? "Kills/wounds needed" : unitHasAmmo(forceUnit) ? "Damage/ammo needed" : "Damage needed"} />
                              ) : rowState === "saved" ? (
                                <StatusPill
                                  color="green"
                                  label="Damage saved"
                                />
                              ) : (
                                <StatusPill label="Not selected" />
                              )}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-zinc-300">
                              BV{" "}
                              {formatNumber(
                                forceUnit.currentBV ??
                                  forceUnit.snapshot?.totalBV,
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-6 text-sm text-zinc-400">
              No campaign force units found.
            </p>
          )}
        </div>
      </section>

      {isChaos && selectedUnit && selectedDraft && (
        <ChaosDamageEditor
          forceUnit={selectedUnit}
          draft={selectedDraft}
          onChange={updateSelectedDraft}
          onSave={saveSelectedDamage}
        />
      )}

      {!isChaos && selectedUnit && selectedDraft && (
        <DamageEditor
          forceUnit={selectedUnit}
          draft={selectedDraft}
          validationMessages={selectedValidation}
          onChange={updateSelectedDraft}
          onSave={saveSelectedDamage}
        />
      )}

      {editingBattleNotes && (
        <BattleNotesModal
          notes={battleNotes}
          setNotes={setBattleNotes}
          onClose={() => setEditingBattleNotes(false)}
        />
      )}
    </section>
  );
}

function BattleNotesModal({
  notes,
  setNotes,
  onClose,
}: {
  notes: string;
  setNotes: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
              Battle Fluff
            </div>
            <h2 className="mt-1 text-2xl font-black text-zinc-50">
              Optional Battle Notes
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Add a short description, notable events, or after-action flavor
              for this battle log.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200"
            aria-label="Close battle notes"
          >
            ×
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={7}
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-sm text-zinc-100 outline-none transition focus:border-lime-400/60"
          placeholder="Example: A running fight through the factory district ended with both lances withdrawing under heavy fire..."
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setNotes("")}
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-red-400/50 hover:text-red-200"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-lime-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ChaosDamageEditor({
  forceUnit,
  draft,
  onChange,
  onSave,
}: {
  forceUnit: ForceUnit;
  draft: UnitDamageDraft;
  onChange: (update: (draft: UnitDamageDraft) => UnitDamageDraft) => void;
  onSave: () => void;
}) {
  const ammoPools = getAmmoPools(forceUnit);
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
              Chaos Battle Result
            </div>
            <h2 className="mt-1 text-xl font-black text-zinc-50">
              {forceUnitDisplayName(forceUnit)}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Pilot: {forceUnit.pilot?.name || "No pilot"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-1">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                Pilot Kills
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange((current) => ({
                    ...current,
                    saved: false,
                    killsMade: Math.max(0, Number(current.killsMade ?? 0) - 1),
                  }))
                }
                className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-700 text-zinc-200"
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm font-black text-zinc-100">
                {draft.killsMade ?? 0}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange((current) => ({
                    ...current,
                    saved: false,
                    killsMade: Number(current.killsMade ?? 0) + 1,
                  }))
                }
                className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-700 text-zinc-200"
              >
                +
              </button>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
              Pilot Wounds
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
              {PILOT_DAMAGE_OPTIONS.map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  title={`Pilot wounds: ${value}`}
                  onClick={() =>
                    onChange((current) => ({
                      ...current,
                      saved: false,
                      pilotDamage: value,
                    }))
                  }
                  className={`h-8 min-w-8 rounded-lg px-2 text-xs font-black transition ${draft.pilotDamage === value ? "bg-red-500 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"}`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={draft.chaosCondition ?? draft.chaos?.condition ?? "ready"}
                onChange={(event) =>
                  onChange((current) => ({
                    ...current,
                    saved: false,
                    chaosCondition: event.target.value as any,
                    chaos: { condition: event.target.value as any },
                  }))
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              >
                <option value="ready">Ready</option>
                <option value="damaged">Damaged</option>
                <option value="crippled">Crippled</option>
                <option value="destroyed">Destroyed</option>
              </select>
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-400"
                title="Crippled follows forced-withdrawal style conditions: two engine critical hits, two destroyed limbs including at least one leg, or one destroyed torso. For Chaos campaigns, select Crippled manually when the unit should withdraw but is not destroyed."
              >
                <Info size={15} />
              </span>
            </div>
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-lime-300"
            >
              <Save size={15} /> Save Chaos Result
            </button>
          </div>
        </div>
        <AmmoExpenditureSection
          ammoPools={ammoPools}
          spent={draft.detailed?.ammoSpent ?? {}}
          onChange={(ammoKey, spentShots) =>
            onChange((current) => ({
              ...current,
              saved: false,
              detailed: {
                ...(current.detailed ?? { locations: {} }),
                ammoSpent: {
                  ...(current.detailed?.ammoSpent ?? {}),
                  [ammoKey]: spentShots,
                },
                ammoConfirmed: true,
              },
            }))
          }
        />
      </div>
    </section>
  );
}

function DamageEditor({
  forceUnit,
  draft,
  validationMessages,
  onChange,
  onSave,
}: {
  forceUnit: ForceUnit;
  draft: UnitDamageDraft;
  validationMessages: string[];
  onChange: (update: (draft: UnitDamageDraft) => UnitDamageDraft) => void;
  onSave: () => void;
}) {
  const summary = damageSummary(forceUnit, draft);
  const ammoPools = getAmmoPools(forceUnit);
  const locations = forceUnit.snapshot?.locations ?? [];
  const byName = groupLocationsByName(locations);

  const updateLocation = (
    locationId: string,
    updater: (
      current: NonNullable<UnitDamageDraft["detailed"]>["locations"][string],
      location: UnitLocation,
    ) => NonNullable<UnitDamageDraft["detailed"]>["locations"][string],
  ) => {
    const location = locations.find((candidate) => candidate.id === locationId);
    if (!location) return;
    onChange((current) => {
      const detailed = current.detailed ?? { locations: {} };
      return {
        ...current,
        saved: false,
        detailed: {
          ...detailed,
          locations: {
            ...detailed.locations,
            [locationId]: updater(
              detailed.locations[locationId] ?? {},
              location,
            ),
          },
        },
      };
    });
  };

  const renderLocation = (
    location?: UnitLocation | null,
    options?: { head?: boolean; tall?: boolean },
  ) => {
    if (!location) return <div className="hidden xl:block" />;
    const state = draft.detailed?.locations?.[location.id] ?? {};
    return (
      <DamageLocationCard
        location={location}
        state={state}
        resetState={getPriorLocationState(forceUnit, location.id)}
        head={options?.head}
        tall={options?.tall}
        onUpdate={(updater) => updateLocation(location.id, updater)}
      />
    );
  };

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
              Damage Log
            </div>
            <h2 className="mt-1 text-xl font-black text-zinc-50">
              {forceUnitDisplayName(forceUnit)}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Pilot: {forceUnit.pilot?.name || "No pilot"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-1">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                Pilot Kills
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange((current) => ({
                    ...current,
                    saved: false,
                    killsMade: Math.max(0, Number(current.killsMade ?? 0) - 1),
                  }))
                }
                className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-700 text-zinc-200"
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm font-black text-zinc-100">
                {draft.killsMade ?? 0}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange((current) => ({
                    ...current,
                    saved: false,
                    killsMade: Number(current.killsMade ?? 0) + 1,
                  }))
                }
                className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-700 text-zinc-200"
              >
                +
              </button>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
              Pilot Wounds
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
              {PILOT_DAMAGE_OPTIONS.map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  title={`Pilot wounds: ${value}`}
                  onClick={() =>
                    onChange((current) => ({
                      ...current,
                      saved: false,
                      pilotDamage: value,
                    }))
                  }
                  className={`h-8 min-w-8 rounded-lg px-2 text-xs font-black transition ${draft.pilotDamage === value ? "bg-red-500 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"}`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300">
              {summary}
            </div>
            <button
              type="button"
              disabled={validationMessages.length > 0}
              onClick={onSave}
              className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={15} /> Save Damage
            </button>
          </div>
        </div>
        {validationMessages.length > 0 && (
          <div className="mt-3 rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-100">
            <div className="font-black">Resolve before saving this unit:</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-red-200">
              {validationMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-5 xl:hidden grid gap-3">
        {locations.map((location) => renderLocation(location))}
      </div>

      <div className="mt-5 hidden min-w-0 w-full max-w-full xl:block">
        <div className="grid min-w-0 w-full max-w-full grid-cols-[minmax(150px,0.85fr)_minmax(190px,1fr)_minmax(210px,1.05fr)_minmax(190px,1fr)_minmax(150px,0.85fr)] items-start gap-3">
          <div className="space-y-3 pt-20 2xl:pt-10">
            {renderLocation(byName.leftArm)}
          </div>
          <div className="space-y-3">
            {renderLocation(byName.leftTorso, { tall: true })}
            {renderLocation(byName.leftLeg)}
          </div>
          <div className="space-y-3">
            {renderLocation(byName.head, { head: true })}
            {renderLocation(byName.centerTorso, { tall: true })}
          </div>
          <div className="space-y-3">
            {renderLocation(byName.rightTorso, { tall: true })}
            {renderLocation(byName.rightLeg)}
          </div>
          <div className="space-y-3 pt-20 2xl:pt-10">
            {renderLocation(byName.rightArm)}
          </div>
        </div>
      </div>

      <AmmoExpenditureSection
        ammoPools={ammoPools}
        spent={draft.detailed?.ammoSpent ?? {}}
        onChange={(ammoKey, spentShots) =>
          onChange((current) => ({
            ...current,
            saved: false,
            detailed: {
              ...(current.detailed ?? { locations: {} }),
              locations: current.detailed?.locations ?? {},
              ammoSpent: {
                ...(current.detailed?.ammoSpent ?? {}),
                [ammoKey]: spentShots,
              },
              ammoConfirmed: true,
            },
          }))
        }
      />
    </section>
  );
}

function DamageLocationCard({
  location,
  state,
  resetState,
  head,
  tall,
  onUpdate,
}: {
  location: UnitLocation;
  state: NonNullable<UnitDamageDraft["detailed"]>["locations"][string];
  resetState: NonNullable<UnitDamageDraft["detailed"]>["locations"][string];
  head?: boolean;
  tall?: boolean;
  onUpdate: (
    updater: (
      current: NonNullable<UnitDamageDraft["detailed"]>["locations"][string],
      location: UnitLocation,
    ) => NonNullable<UnitDamageDraft["detailed"]>["locations"][string],
  ) => void;
}) {
  const isArm = location.name.toLowerCase().includes("arm");
  const isLeg = location.name.toLowerCase().includes("leg");
  const canBeBlownOff = isArm || isLeg;
  const locationDestroyed = Boolean(
    state.destroyed ||
    state.missing ||
    getCurrentStructure(location, state) <= 0,
  );
  const nonEmptySlots = (location.slots ?? []).filter(
    (slot) => !isEmptySlot(slot),
  );
  const setLocationState = (mode: "destroyed" | "missing" | "reset") => {
    onUpdate((current, loc) => {
      if (mode === "reset") return { ...resetState };
      if (mode === "missing") {
        return {
          ...current,
          destroyed: false,
          missing: true,
        };
      }
      const destroyedSlots = (loc.slots ?? [])
        .filter((slot) => !isEmptySlot(slot))
        .map((slot) => slot.slot);
      return {
        ...current,
        armorDamage: Number(loc.armor ?? 0),
        rearArmorDamage: Number(loc.rearArmor ?? 0),
        structureDamage: Number(loc.structure ?? 0),
        damagedSlots: [],
        destroyedSlots,
        destroyed: true,
        missing: false,
      };
    });
  };

  const visibleSlots = head ? (location.slots ?? []).slice(0, 6) : (location.slots ?? []);
  const occupiedSlots = visibleSlots.filter((slot) => !isEmptySlot(slot)).length;

  return (
    <article
      className={`min-w-0 rounded-3xl border p-3 ${locationDestroyed ? "border-red-400 border-dashed bg-red-950/30" : "border-zinc-800 bg-zinc-950/70"} ${head ? "xl:min-h-0" : ""} ${tall ? "xl:min-h-[520px]" : ""}`}
    >
      <div className="mb-3 text-center">
        <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-xl bg-lime-400/10 text-lime-300">
          <MapPin size={15} />
        </div>
        <h3 className="text-base font-black text-zinc-50">{location.name}</h3>
        <p className="text-[11px] text-zinc-500">
          {occupiedSlots}/{visibleSlots.length} slots occupied
        </p>
      </div>

      <div className="mb-3 flex flex-wrap justify-center gap-1">
        <ToggleMini
          active={Boolean(state.destroyed)}
          label="Destroyed"
          onClick={() =>
            setLocationState(state.destroyed ? "reset" : "destroyed")
          }
        />
        {canBeBlownOff && (
          <ToggleMini
            active={Boolean(state.missing)}
            label="Blown Off"
            onClick={() =>
              setLocationState(state.missing ? "reset" : "missing")
            }
          />
        )}
        <ToggleMini
          active={false}
          label="Reset"
          onClick={() => setLocationState("reset")}
        />
      </div>

      <div className={`mb-4 grid gap-2 ${location.rearArmor ? "grid-cols-3" : "grid-cols-2"}`}>
        <DamageInput
          label="Armor Hits"
          value={Number(state.armorDamage ?? 0)}
          max={location.armor ?? 0}
          onChange={(value) =>
            onUpdate((current, loc) =>
              updateDamageAssigned(current, loc, "armor", value),
            )
          }
        />
        {location.rearArmor ? (
          <DamageInput
            label="Rear Hits"
            value={Number(state.rearArmorDamage ?? 0)}
            max={location.rearArmor}
            onChange={(value) =>
              onUpdate((current, loc) =>
                updateDamageAssigned(current, loc, "rear", value),
              )
            }
          />
        ) : null}
        <DamageInput
          label="Internal Hits"
          value={Number(state.structureDamage ?? 0)}
          max={location.structure ?? 0}
          onChange={(value) =>
            onUpdate((current, loc) =>
              updateDamageAssigned(current, loc, "structure", value),
            )
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {visibleSlots.map((slot) => {
          const empty = isEmptySlot(slot);
          const damaged = state.damagedSlots?.includes(slot.slot) ?? false;
          const destroyed = state.destroyedSlots?.includes(slot.slot) ?? false;
          return (
            <button
              key={slot.slot}
              type="button"
              disabled={empty}
              onClick={() =>
                onUpdate((current) => ({
                  ...current,
                  damagedSlots: toggleNumber(
                    current.damagedSlots ?? [],
                    slot.slot,
                  ),
                  destroyedSlots: (current.destroyedSlots ?? []).filter(
                    (value) => value !== slot.slot,
                  ),
                }))
              }
              className={`grid grid-cols-[26px_minmax(0,1fr)_64px] items-center gap-2 rounded-xl border px-2 py-1.5 text-xs transition ${empty ? "cursor-not-allowed border-zinc-800 bg-zinc-950/50 text-zinc-600" : destroyed ? "border-red-400/70 bg-red-500/25 text-red-100" : damaged ? "border-orange-400/60 bg-orange-500/15 text-orange-100" : `${slotClass(slot.type)} hover:border-lime-400/40`}`}
            >
              <span className="text-center font-mono text-zinc-500">
                {slot.slot.toString().padStart(2, "0")}
              </span>
              <span className="truncate text-left font-semibold">
                {slot.item || "Empty"}
              </span>
              <span className="rounded-lg bg-black/20 px-1.5 py-1 text-center text-[10px] font-black uppercase tracking-wider opacity-80">
                {empty
                  ? "—"
                  : destroyed
                    ? "DEST"
                    : damaged
                      ? "REPR"
                      : slotTypeLabel(slot.type)}
              </span>
            </button>
          );
        })}
      </div>
      {!nonEmptySlots.length && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-center text-xs font-semibold text-zinc-600">
          No critical components in this location.
        </div>
      )}
    </article>
  );
}

function AmmoExpenditureSection({
  ammoPools,
  spent,
  onChange,
}: {
  ammoPools: Array<{ key: string; label: string; shots: number }>;
  spent: Record<string, number>;
  onChange: (ammoKey: string, spentShots: number) => void;
}) {
  if (!ammoPools.length) {
    return (
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-500">
        No ammunition expenditure to track for this unit.
      </div>
    );
  }
  return (
    <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-lime-300">
        Ammo Expenditure
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        Enter the number of shots spent during the battle. Energy weapons are ignored.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ammoPools.map((pool) => {
          const spentShots = Math.max(0, Math.min(pool.shots, Number(spent[pool.key] ?? 0)));
          return (
            <label key={pool.key} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <div className="text-sm font-black text-zinc-100">{pool.label}</div>
              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={pool.shots}
                  step={1}
                  value={spentShots}
                  onChange={(event) =>
                    onChange(
                      pool.key,
                      Math.max(0, Math.min(pool.shots, Number(event.target.value || 0))),
                    )
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-center text-sm font-black text-zinc-100 outline-none transition focus:border-lime-400/60"
                  aria-label={`${pool.label} shots spent`}
                />
                <div className="text-xs font-semibold text-zinc-500">/ {pool.shots} shots</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function BattleSummaryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-black text-zinc-100">{value}</div>
    </div>
  );
}


function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function DamageInput({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const safeValue = Math.max(0, Math.min(max, Number(value ?? 0)));
  return (
    <label className="block rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2 text-center">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <input
        type="number"
        min={0}
        max={max}
        value={safeValue}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-center text-sm font-black tabular-nums text-zinc-100 outline-none transition focus:border-lime-400/60"
      />
      <span className="mt-1 block text-[10px] uppercase tracking-wide text-zinc-500">
        of {max}
      </span>
    </label>
  );
}

function ToggleMini({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${active ? "border-red-400 bg-red-500/20 text-red-100" : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-lime-400/40 hover:text-zinc-100"}`}
    >
      {label}
    </button>
  );
}

function StatusPill({
  label,
  color = "neutral",
}: {
  label: string;
  color?: "neutral" | "red" | "green";
}) {
  const classes =
    color === "red"
      ? "border-red-500/40 bg-red-950/40 text-red-200"
      : color === "green"
        ? "border-lime-400/30 bg-lime-400/10 text-lime-100"
        : "border-zinc-700 bg-zinc-900 text-zinc-400";
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${classes}`}
    >
      {color === "green" ? (
        <CheckCircle2 className="mr-1" size={13} />
      ) : color === "red" ? (
        <XCircle className="mr-1" size={13} />
      ) : null}
      {label}
    </span>
  );
}

function UnitStatusPill({ status }: { status: UnitStatusLabel }) {
  const classes =
    status === "Ready"
      ? "border-lime-400/30 bg-lime-400/10 text-lime-100"
      : status === "Damaged"
        ? "border-yellow-400/40 bg-yellow-500/10 text-yellow-100"
        : status === "Crippled"
          ? "border-orange-400/50 bg-orange-500/15 text-orange-100"
          : "border-red-500/50 bg-red-950/40 text-red-100";
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-black ${classes}`}
    >
      {status}
    </span>
  );
}

function createBlankDamageDraft(
  forceUnit: ForceUnit,
  isChaos = false,
): UnitDamageDraft {
  return {
    campaignForceUnitId: forceUnit.id,
    participated: true,
    pilotDamage: 0,
    killsMade: 0,
    saved: false,
    chaosCondition: "ready",
    chaos: isChaos ? { condition: "ready" } : undefined,
    detailed: {
      locations: isChaos ? {} : getPriorDamageLocations(forceUnit),
      ammoSpent: getPriorAmmoSpent(forceUnit),
      ammoConfirmed: false,
    },
  };
}

function getPriorDamageLocations(
  forceUnit: ForceUnit,
): NonNullable<UnitDamageDraft["detailed"]>["locations"] {
  const overlay =
    (forceUnit as any).damageOverlay ??
    (forceUnit as any).damageState ??
    (forceUnit as any).currentDamage;
  return { ...(overlay?.detailed?.locations ?? {}) };
}

function getPriorLocationState(
  forceUnit: ForceUnit,
  locationId: string,
): NonNullable<UnitDamageDraft["detailed"]>["locations"][string] {
  return { ...(getPriorDamageLocations(forceUnit)[locationId] ?? {}) };
}

function sanitizeDamageDraft(
  draft: UnitDamageDraft,
  isChaos: boolean,
  forceUnit?: ForceUnit,
): CampaignUnitDamageOverlay {
  return {
    campaignForceUnitId: draft.campaignForceUnitId,
    unitName: forceUnit ? forceUnitDisplayName(forceUnit) : undefined,
    pilotName: forceUnit?.pilot?.name,
    participated: true,
    pilotDamage: draft.pilotDamage,
    killsMade: Number(draft.killsMade ?? 0),
    chaos: isChaos
      ? { condition: draft.chaosCondition ?? draft.chaos?.condition ?? "ready" }
      : undefined,
    detailed: isChaos
      ? {
          locations: {},
          ammoSpent: { ...(draft.detailed?.ammoSpent ?? {}) },
          ammoConfirmed: true,
        }
      : (draft.detailed ?? { locations: {} }),
    status: forceUnit ? getUnitStatus(forceUnit, draft, isChaos) : undefined,
    damageSummary: forceUnit ? damageSummaryBreakdown(forceUnit, draft) : undefined,
    repairComplexity: !isChaos && forceUnit ? calculateRepairComplexity(forceUnit, draft) : undefined,
  } as CampaignUnitDamageOverlay;
}

function calculateRepairComplexity(forceUnit: ForceUnit, draft: UnitDamageDraft): "Simple" | "Intermediate" | "Difficult" | "Impossible" {
  const locations = draft.detailed?.locations ?? {};
  let limbReplacements = 0;
  const grades: string[] = [];
  for (const location of forceUnit.snapshot?.locations ?? []) {
    const state = locations[location.id] ?? locations[location.name] ?? {};
    if ((state.destroyed || state.missing) && isLimbLocation(location)) limbReplacements += 1;
    const hitSlots = new Set([...(state.damagedSlots ?? []), ...(state.destroyedSlots ?? [])]);
    const counted = new Set<string>();
    for (const slot of location.slots ?? []) {
      if (!hitSlots.has(slot.slot) || isEmptySlot(slot)) continue;
      const key = `${location.id}:${slot.item}`;
      if (counted.has(key)) continue;
      counted.add(key);
      grades.push(repairGradeForItem(slot.item, forceUnit.snapshot?.era));
    }
  }
  const fCount = grades.filter((grade) => grade === "F" || grade === "X").length;
  const dCount = grades.filter((grade) => grade === "D").length;
  const eCount = grades.filter((grade) => grade === "E").length;
  if (fCount >= 2) return "Impossible";
  if (fCount === 1 || limbReplacements > 1 || dCount + eCount > 3 || eCount > 1) return "Difficult";
  if (limbReplacements === 1 || dCount > 0 || eCount === 1) return "Intermediate";
  return "Simple";
}

function repairGradeForItem(itemName: string, era?: string): string {
  const normalized = normalizeRepairName(itemName);
  const definitions = [...Object.values(WEAPONS), ...Object.values(COMPONENTS)];
  const match = definitions.find((definition: any) => {
    const names = [definition.name, ...(definition.altNames ?? [])].map(normalizeRepairName);
    return names.includes(normalized) || names.some((name) => name && (normalized.includes(name) || name.includes(normalized)));
  }) as any;
  if (!match) return "C";
  const eraKey = String(era ?? "").toLowerCase().includes("succession") ? "successionWars"
    : String(era ?? "").toLowerCase().includes("clan") ? "clanInvasion" : "starLeague";
  const availability = match.availability?.[eraKey];
  return worstRepairGrade(match.techRating, availability);
}
function normalizeRepairName(value: string): string { return String(value ?? "").toLowerCase().replace(/\(r\)/g, "").replace(/[^a-z0-9]/g, ""); }
function worstRepairGrade(...grades: Array<string | undefined>): string {
  const order = ["A", "B", "C", "D", "E", "F", "X"];
  return grades.filter(Boolean).sort((a,b) => order.indexOf(String(b)) - order.indexOf(String(a)))[0] ?? "C";
}

function damageSummary(forceUnit: ForceUnit, draft: UnitDamageDraft): string {
  const summary = damageSummaryBreakdown(forceUnit, draft);
  return `${summary.armor} armor • ${summary.internal} internal • ${summary.weapons} weapons • ${summary.components} components • ${summary.engineHits} engine • ${summary.gyroHits} gyro${summary.ammo ? ` • ${summary.ammo} ammo` : ""}${summary.limbs ? ` • ${summary.limbs} destroyed/blown off` : ""}`;
}

function damageSummaryBreakdown(forceUnit: ForceUnit, draft: UnitDamageDraft) {
  const locations = draft.detailed?.locations ?? {};
  const armor = Object.values(locations).reduce(
    (sum, loc) =>
      sum + Number(loc.armorDamage ?? 0) + Number(loc.rearArmorDamage ?? 0),
    0,
  );
  const internal = Object.values(locations).reduce(
    (sum, loc) => sum + Number(loc.structureDamage ?? 0),
    0,
  );
  const critical = summarizeCriticalHits(forceUnit, draft);
  const limbs = Object.values(locations).filter(
    (loc) => loc.destroyed || loc.missing,
  ).length;
  const ammo = Object.values(draft.detailed?.ammoSpent ?? {}).reduce(
    (sum, value) => sum + Number(value ?? 0),
    0,
  );
  return { armor, internal, ammo, limbs, ...critical };
}

function summarizeCriticalHits(forceUnit: ForceUnit, draft: UnitDamageDraft) {
  const locationStates = draft.detailed?.locations ?? {};
  let weapons = 0;
  let components = 0;
  let engineHits = 0;
  let gyroHits = 0;

  (forceUnit.snapshot?.locations ?? []).forEach((location) => {
    const state = locationStates[location.id] ?? {};
    const hitSlots = new Set([
      ...(state.damagedSlots ?? []),
      ...(state.destroyedSlots ?? []),
    ]);
    let currentGroup: { item: string; type?: string; hit: boolean } | null = null;
    const flushGroup = () => {
      if (!currentGroup?.hit) return;
      const item = currentGroup.item.toLowerCase();
      if (item.includes("engine")) engineHits += 1;
      else if (item.includes("gyro")) gyroHits += 1;
      else if (isWeaponSlotItem(currentGroup.item, currentGroup.type)) weapons += 1;
      else components += 1;
    };

    (location.slots ?? []).forEach((slot) => {
      if (isEmptySlot(slot)) {
        flushGroup();
        currentGroup = null;
        return;
      }
      const item = normalizeCriticalItemName(slot.item ?? "");
      const hit = hitSlots.has(slot.slot);
      if (!currentGroup || currentGroup.item !== item) {
        flushGroup();
        currentGroup = { item, type: slot.type, hit };
      } else {
        currentGroup.hit = currentGroup.hit || hit;
      }
    });
    flushGroup();
  });

  return { weapons, components, engineHits, gyroHits };
}

function isWeaponSlotItem(item: string, type?: string) {
  const normalized = item.toLowerCase();
  if (type === "weapon") return true;
  if (normalized.includes("ammo") || normalized.includes("engine") || normalized.includes("gyro")) return false;
  return /laser|ppc|autocannon|ac\/?\d|gauss|srm|lrm|mrm|streak|flamer|machine gun|rifle|cannon|launcher|mortar|missile/.test(normalized);
}

function normalizeCriticalItemName(item: string) {
  return item.trim().toLowerCase().replace(/\s+/g, " ");
}

function getUnitStatus(
  forceUnit: ForceUnit,
  draft: UnitDamageDraft,
  isChaos: boolean,
): UnitStatusLabel {
  if (isChaos) {
    const chaosCondition = draft.chaosCondition ?? draft.chaos?.condition;
    if (chaosCondition === "destroyed") return "Destroyed";
    if (chaosCondition === "crippled") return "Crippled";
    if (chaosCondition === "damaged") return "Damaged";
    return "Ready";
  }
  const locations = draft.detailed?.locations ?? {};
  const locationList = forceUnit.snapshot?.locations ?? [];
  if (
    draft.pilotDamage === "KIA" ||
    isLocationDestroyed(findByName(locationList, "center torso"), locations) ||
    isLocationDestroyed(findByName(locationList, "head"), locations)
  )
    return "Destroyed";

  const destroyedLimbs = locationList.filter(
    (location) =>
      isLimbLocation(location) && isLocationDestroyed(location, locations),
  );
  const destroyedLegs = destroyedLimbs.filter((location) =>
    location.name.toLowerCase().includes("leg"),
  );
  if (destroyedLegs.length >= 2) return "Destroyed";
  const destroyedTorsos = locationList.filter(
    (location) =>
      isTorsoLocation(location) && isLocationDestroyed(location, locations),
  );
  const engineHits = countEngineHits(forceUnit, draft);
  if (
    engineHits >= 2 ||
    destroyedTorsos.length >= 1 ||
    (destroyedLimbs.length >= 2 && destroyedLegs.length >= 1)
  )
    return "Crippled";

  const damaged = Object.values(locations).some(
    (location) =>
      Number(location.armorDamage ?? 0) > 0 ||
      Number(location.rearArmorDamage ?? 0) > 0 ||
      Number(location.structureDamage ?? 0) > 0 ||
      Boolean(location.destroyed || location.missing) ||
      (location.damagedSlots?.length ?? 0) > 0 ||
      (location.destroyedSlots?.length ?? 0) > 0,
  );
  return damaged ? "Damaged" : "Ready";
}

function validateDamageDraft(
  forceUnit: ForceUnit,
  draft: UnitDamageDraft,
): string[] {
  const messages: string[] = [];
  const locations = forceUnit.snapshot?.locations ?? [];
  const locationStates = draft.detailed?.locations ?? {};
  const leftTorso = findByName(locations, "left torso");
  const rightTorso = findByName(locations, "right torso");
  const leftArm = findByName(locations, "left arm");
  const rightArm = findByName(locations, "right arm");
  if (
    isLocationDestroyed(leftTorso, locationStates) &&
    leftArm &&
    !isLocationDestroyed(leftArm, locationStates)
  ) {
    messages.push(
      "Left Torso is destroyed, but the attached Left Arm has not been marked Destroyed or Blown Off.",
    );
  }
  if (
    isLocationDestroyed(rightTorso, locationStates) &&
    rightArm &&
    !isLocationDestroyed(rightArm, locationStates)
  ) {
    messages.push(
      "Right Torso is destroyed, but the attached Right Arm has not been marked Destroyed or Blown Off.",
    );
  }
  return messages;
}

function countEngineHits(forceUnit: ForceUnit, draft: UnitDamageDraft): number {
  const states = draft.detailed?.locations ?? {};
  return (forceUnit.snapshot?.locations ?? []).reduce((total, location) => {
    const state = states[location.id] ?? {};
    const damaged = new Set([
      ...(state.damagedSlots ?? []),
      ...(state.destroyedSlots ?? []),
    ]);
    return (
      total +
      (location.slots ?? []).filter(
        (slot) =>
          damaged.has(slot.slot) &&
          (slot.item ?? "").toLowerCase().includes("engine"),
      ).length
    );
  }, 0);
}

function getCurrentArmor(
  location: UnitLocation,
  state: NonNullable<UnitDamageDraft["detailed"]>["locations"][string],
): number {
  return Math.max(
    0,
    Number(location.armor ?? 0) - Number(state.armorDamage ?? 0),
  );
}

function getCurrentRearArmor(
  location: UnitLocation,
  state: NonNullable<UnitDamageDraft["detailed"]>["locations"][string],
): number {
  return Math.max(
    0,
    Number(location.rearArmor ?? 0) - Number(state.rearArmorDamage ?? 0),
  );
}

function getCurrentStructure(
  location: UnitLocation,
  state: NonNullable<UnitDamageDraft["detailed"]>["locations"][string],
): number {
  return Math.max(
    0,
    Number(location.structure ?? 0) - Number(state.structureDamage ?? 0),
  );
}

function updateDamageAssigned(
  current: NonNullable<UnitDamageDraft["detailed"]>["locations"][string],
  location: UnitLocation,
  kind: "armor" | "rear" | "structure",
  assignedDamage: number,
) {
  const max =
    kind === "armor"
      ? Number(location.armor ?? 0)
      : kind === "rear"
        ? Number(location.rearArmor ?? 0)
        : Number(location.structure ?? 0);
  const damage = Math.max(0, Math.min(max, assignedDamage));
  const next = { ...current };
  if (kind === "armor") next.armorDamage = damage;
  if (kind === "rear") next.rearArmorDamage = damage;
  if (kind === "structure") {
    next.structureDamage = damage;
    if (damage >= max && max > 0) {
      next.destroyed = true;
      next.missing = false;
      next.armorDamage = Number(location.armor ?? 0);
      next.rearArmorDamage = Number(location.rearArmor ?? 0);
      next.destroyedSlots = (location.slots ?? [])
        .filter((slot) => !isEmptySlot(slot))
        .map((slot) => slot.slot);
      next.damagedSlots = [];
    } else if (!next.missing) {
      next.destroyed = false;
    }
  }
  return next;
}

function isLocationDestroyed(
  location: UnitLocation | null | undefined,
  states: NonNullable<UnitDamageDraft["detailed"]>["locations"],
): boolean {
  if (!location) return false;
  const state = states[location.id] ?? {};
  return Boolean(
    state.destroyed ||
    state.missing ||
    getCurrentStructure(location, state) <= 0,
  );
}

function isLimbLocation(location: UnitLocation) {
  return LIMB_LOCATION_HINTS.some((hint) =>
    location.name.toLowerCase().includes(hint),
  );
}

function isTorsoLocation(location: UnitLocation) {
  const name = location.name.toLowerCase();
  return name.includes("torso");
}

function isEmptySlot(slot: { item?: string; type?: string }) {
  const item = (slot.item ?? "").trim().toLowerCase();
  return !item || item === "empty" || slot.type === "empty";
}

function slotTypeLabel(type?: string) {
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

function slotClass(type?: string) {
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

function findByName(locations: UnitLocation[], name: string) {
  const normalized = name.toLowerCase();
  return (
    locations.find((location) => location.name.toLowerCase() === normalized) ??
    null
  );
}

function groupLocationsByName(locations: UnitLocation[]) {
  return {
    head: findByName(locations, "head"),
    centerTorso: findByName(locations, "center torso"),
    leftTorso: findByName(locations, "left torso"),
    rightTorso: findByName(locations, "right torso"),
    leftArm: findByName(locations, "left arm"),
    rightArm: findByName(locations, "right arm"),
    leftLeg: findByName(locations, "left leg"),
    rightLeg: findByName(locations, "right leg"),
  };
}

function toggleNumber(values: number[], value: number): number[] {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value].sort((a, b) => a - b);
}

function forceUnitDisplayName(forceUnit: ForceUnit): string {
  const chassis = forceUnit.snapshot?.chassis ?? "";
  const model = forceUnit.snapshot?.model ?? forceUnit.snapshot?.name ?? "Unit";
  return [chassis, model].filter(Boolean).join(" ").trim();
}

function sortForceUnits(units: ForceUnit[], conquest: boolean): ForceUnit[] {
  return [...units].sort((a, b) => {
    if (conquest) {
      const teamCompare =
        Number(a.teamNumber ?? 999) - Number(b.teamNumber ?? 999);
      if (teamCompare !== 0) return teamCompare;
    }
    return Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0);
  });
}

function getAmmoPools(forceUnit: ForceUnit): Array<{ key: string; label: string; shots: number }> {
  const pools = new Map<string, { key: string; label: string; shots: number }>();
  const ammoSlotLabels = new Map<string, string>();

  (forceUnit.snapshot?.locations ?? []).forEach((location) => {
    (location.slots ?? []).forEach((slot) => {
      const item = String(slot.item ?? "").trim();
      if (!item || !/ammo/i.test(item)) return;
      const label = friendlyAmmoLabel(item);
      ammoSlotLabels.set(ammoKey(label), label);
    });
  });

  (forceUnit.snapshot?.weapons ?? []).forEach((weapon: any) => {
    if (weapon.shots === "∞") return;
    const shots = Number(weapon.shots);
    if (!Number.isFinite(shots) || shots <= 0) return;
    const label = friendlyAmmoLabel(
      String(
        weapon.ammoDisplayName ??
          weapon.ammoName ??
          weapon.ammo ??
          weapon.ammoType ??
          weapon.name ??
          "Ammo",
      ),
    );
    const key = ammoKey(label);
    const slotLabel = ammoSlotLabels.get(key);
    const existing = pools.get(key);
    pools.set(key, {
      key,
      label: slotLabel ?? label,
      shots: Math.max(existing?.shots ?? 0, shots),
    });
  });

  ammoSlotLabels.forEach((label, key) => {
    if (!pools.has(key)) pools.set(key, { key, label, shots: 0 });
  });

  return [...pools.values()].filter((pool) => pool.shots > 0).sort((a, b) => a.label.localeCompare(b.label));
}

function friendlyAmmoLabel(value: string): string {
  let cleaned = value
    .replace(/[_-]+/g, " ")
    .replace(/^clan\s+/i, "")
    .replace(/^is\s+/i, "")
    .replace(/^ammo\s+/i, "")
    .replace(/\s+ammo$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "Ammo";
  cleaned = cleaned
    .replace(/\bac\s*(\d+)\b/i, "AC/$1")
    .replace(/\bultra\s+ac\s*(\d+)\b/i, "Ultra AC/$1")
    .replace(/\blb\s*(\d+)x\b/i, "LB $1-X")
    .replace(/\bsrm\s*(\d+)\b/i, "SRM-$1")
    .replace(/\blrm\s*(\d+)\b/i, "LRM-$1")
    .replace(/\bmrm\s*(\d+)\b/i, "MRM-$1")
    .replace(/\bstreak\s+srm\s*(\d+)\b/i, "Streak SRM-$1")
    .replace(/\bgauss\b/i, "Gauss")
    .replace(/\bmg\b/i, "Machine Gun");
  cleaned = cleaned.replace(/\b(ac|srm|lrm|mrm|ppc|lb|atm|lbx)\b/gi, (match) => match.toUpperCase());
  return `${cleaned} Ammo`;
}

function ammoKey(value: string): string {
  return friendlyAmmoLabel(value)
    .toLowerCase()
    .replace(/\s+ammo$/i, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function unitHasAmmo(forceUnit: ForceUnit): boolean {
  return getAmmoPools(forceUnit).length > 0;
}

function getPriorAmmoSpent(forceUnit: ForceUnit): Record<string, number> {
  const overlay =
    (forceUnit as any).damageOverlay ??
    (forceUnit as any).damageState ??
    (forceUnit as any).currentDamage;
  return { ...(overlay?.detailed?.ammoSpent ?? {}) };
}

function toInputDate(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  const iso = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function damageOverlayToDraft(
  overlay: CampaignUnitDamageOverlay,
  isChaos: boolean,
): UnitDamageDraft {
  return {
    ...overlay,
    saved: true,
    chaosCondition: overlay.chaos?.condition ?? "ready",
    detailed: isChaos
      ? { locations: {}, ammoSpent: { ...(overlay.detailed?.ammoSpent ?? {}) }, ammoConfirmed: true }
      : (overlay.detailed ?? { locations: {} }),
  };
}

function formatNumber(value: unknown, fallback = "—"): string {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toLocaleString() : fallback;
}
