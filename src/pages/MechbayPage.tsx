import React, { useMemo, useState } from "react";
import { ArrowLeft, ClipboardList, PackageSearch, X } from "lucide-react";
import PageTitle from "../components/PageTitle";
import BattleMechLocationLayout from "../components/BattleMechLocationLayout";
import type { Campaign, Force, ForceUnit, RepairComplexity, UnitLocation } from "../types/app";

type BayView = "all" | "repairs" | "queue";
type ReqView = "needed" | "delivery";

type RepairRow = {
  id: string;
  unitName: string;
  category: string;
  locationId?: string;
  itemName: string;
  quantity: number;
  action: "Repair" | "Replace" | "Rearm";
  repairRoll?: number;
  techRating?: string;
  availabilityRating?: string;
  replacementCostCBills?: number;
  status: string;
  requisitionStatus?: string;
  deliveryTurnsRemaining?: number;
};

export default function MechbayPage({ campaign, force, onBack, onResourceBalanceChange }: { campaign: Campaign; force?: Force; onBack: () => void; onResourceBalanceChange?: (resourceType: "Warchest" | "CBills", balance: number) => void }) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [view, setView] = useState<BayView>("repairs");
  const [partsOpen, setPartsOpen] = useState(false);
  const [localForce, setLocalForce] = useState(force);
  const [repairingId, setRepairingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [disposition, setDisposition] = useState<null | { unit: ForceUnit; action: "salvage" | "sell"; amount: number; resourceType: "Warchest" | "CBills"; bonus?: string | null }>(null);
  const [disposing, setDisposing] = useState(false);
  const isChaos = campaign.settings?.type === "Chaos";
  const allUnits = localForce?.forceUnits ?? [];
  const units = useMemo(() => view === "all" ? allUnits : allUnits.filter(unitNeedsRepair), [allUnits, view]);
  const repairRows = useMemo(() => collectRepairRows(allUnits), [allUnits]);
  const selectedUnit = allUnits.find((unit) => unit.id === selectedUnitId) ?? null;

  async function repairChaosUnit(unit: ForceUnit) {
    if (!localForce || !isChaos) return;
    setRepairingId(unit.id); setActionError(null);
    try {
      const token = localStorage.getItem("bcm-auth-token");
      const response = await fetch(`/api/forces/${localForce.id}/units/${unit.id}/chaos-repair`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ campaignId: campaign.id }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Unable to repair unit.");
      setLocalForce(payload.force ?? localForce);
      if (Number.isFinite(Number(payload.remainingWarchest))) onResourceBalanceChange?.("Warchest", Number(payload.remainingWarchest));
      setSelectedUnitId(null);
    } catch (error) { setActionError(error instanceof Error ? error.message : "Unable to repair unit."); }
    finally { setRepairingId(null); }
  }

  async function openDisposition(unit: ForceUnit, action: "salvage" | "sell") {
    if (!localForce) return;
    setActionError(null);
    try {
      const token = localStorage.getItem("bcm-auth-token");
      const response = await fetch(`/api/forces/${localForce.id}/units/${unit.id}/disposition`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ campaignId: campaign.id, action, preview: true }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Unable to ${action} unit.`);
      setDisposition({ unit, action, amount: Number(payload.amount ?? 0), resourceType: payload.resourceType, bonus: payload.bonus });
    } catch (error) { setActionError(error instanceof Error ? error.message : `Unable to ${action} unit.`); }
  }

  async function confirmDisposition() {
    if (!localForce || !disposition) return;
    setDisposing(true); setActionError(null);
    try {
      const token = localStorage.getItem("bcm-auth-token");
      const response = await fetch(`/api/forces/${localForce.id}/units/${disposition.unit.id}/disposition`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ campaignId: campaign.id, action: disposition.action }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Unable to ${disposition.action} unit.`);
      setLocalForce(payload.force ?? localForce);
      if (payload.resourceType && Number.isFinite(Number(payload.balance))) onResourceBalanceChange?.(payload.resourceType, Number(payload.balance));
      setSelectedUnitId(null); setDisposition(null);
    } catch (error) { setActionError(error instanceof Error ? error.message : "Unable to complete action."); }
    finally { setDisposing(false); }
  }

  return <section className="space-y-5">
    <PageTitle eyebrow="Campaign Operations" title="Mechbay" description={`${campaign.name} — review unit condition, repair work, requisitions, salvage, and disposition.`} actions={<button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-lime-400/40 hover:text-lime-200"><ArrowLeft size={16}/> Campaign Dashboard</button>} />

    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex w-fit flex-wrap rounded-xl border border-zinc-700 bg-zinc-900 p-1">
        <ViewButton active={view === "all"} onClick={() => setView("all")}>All Units</ViewButton>
        <ViewButton active={view === "repairs"} onClick={() => setView("repairs")}>Awaiting Repairs</ViewButton>
        {!isChaos && <ViewButton active={view === "queue"} onClick={() => setView("queue")}><ClipboardList size={14}/> Repair Queue</ViewButton>}
      </div>
      {!isChaos && <button type="button" onClick={() => setPartsOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-200"><PackageSearch size={16}/> Parts Requisitions</button>}
    </div>

    {actionError && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{actionError}</div>}

    {view === "queue" && !isChaos ? <RepairQueue rows={repairRows}/> : <UnitTable units={units} isChaos={isChaos} repairingId={repairingId} onSelect={setSelectedUnitId} onRepair={repairChaosUnit} onDisposition={openDisposition}/>} 

    {selectedUnit && view !== "queue" && <UnitDamagePanel unit={selectedUnit} onClose={() => setSelectedUnitId(null)}/>} 
    {partsOpen && <PartsRequisitionsModal rows={repairRows} onClose={() => setPartsOpen(false)}/>} 
    {disposition && <DispositionModal disposition={disposition} busy={disposing} onConfirm={confirmDisposition} onClose={() => setDisposition(null)}/>} 
  </section>;
}

function ViewButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-black ${active ? "bg-lime-400 text-zinc-950" : "text-zinc-400"}`}>{children}</button>;
}

function UnitTable({ units, isChaos, repairingId, onSelect, onRepair, onDisposition }: { units: ForceUnit[]; isChaos: boolean; repairingId: string | null; onSelect: (id: string) => void; onRepair: (unit: ForceUnit) => void; onDisposition: (unit: ForceUnit, action: "salvage" | "sell") => void }) {
  return <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950/60">
    {units.length ? <table className="min-w-[1080px] w-full text-left text-sm"><thead className="border-b border-zinc-800 bg-zinc-900/90 text-xs uppercase tracking-[0.13em] text-zinc-500"><tr>
      <th className="px-4 py-3">Unit</th><th className="px-4 py-3">Status</th>{!isChaos && <th className="px-4 py-3">Repair Summary</th>}{!isChaos && <th className="px-4 py-3">Complexity</th>}{!isChaos && <th className="px-4 py-3 text-right">Current BV</th>}<th className="px-4 py-3 text-right">Total BV</th><th className="px-4 py-3">Repair</th>{isChaos && <th className="px-4 py-3">Rearm</th>}<th className="px-4 py-3 text-right">Other Actions</th>
    </tr></thead><tbody className="divide-y divide-zinc-800">{units.map((unit) => {
      const status = statusLabel(unit); const destroyed = status === "Destroyed" || !!unit.isDestroyed; const damaged = unitNeedsRepair(unit); const complexity = repairComplexity(unit); const cost = chaosRepairCost(unit, status); const tonnage = Number(unit.snapshot?.tonnage ?? 0); const rearmCost = chaosRearmCost(unit); const salvageValue = Math.floor(tonnage / 2);
      return <tr key={unit.id} onClick={() => onSelect(unit.id)} className="cursor-pointer align-top transition hover:bg-zinc-900/70"><td className="px-4 py-4"><div className="font-black text-zinc-100">{unit.snapshot?.name ?? unit.baseUnitId}</div><div className="mt-1 text-xs text-zinc-500">{unit.snapshot?.weightClass ?? "Unknown"} · {unit.snapshot?.tonnage ?? "—"} tons</div></td><td className="px-4 py-4"><Tag text={status} className={statusClass(status)}/></td>{!isChaos && <td className="max-w-md px-4 py-4 text-xs leading-relaxed text-zinc-300">{repairSummary(unit)}</td>}{!isChaos && <td className="px-4 py-4"><Tag text={complexity} className={complexityClass(complexity)}/></td>}{!isChaos && <td className="px-4 py-4 text-right font-black text-zinc-200">{Number(unit.currentBV ?? 0).toLocaleString()}</td>}<td className="px-4 py-4 text-right font-black text-lime-200">{Number(unit.snapshot?.totalBV ?? 0).toLocaleString()}</td><td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>{isChaos ? <button disabled={destroyed || !damaged || repairingId === unit.id} onClick={() => onRepair(unit)} className="rounded-xl border border-lime-400/35 bg-lime-400/10 px-3 py-2 text-xs font-black text-lime-200 disabled:border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600">{destroyed ? "Not Repairable" : repairingId === unit.id ? "Repairing…" : `Repair (-${cost} WP)`}</button> : <select defaultValue={damaged ? "Repair" : "-"} disabled={!damaged} className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 disabled:text-zinc-500"><option value="-">-</option><option>Repair</option><option>Do Not Repair</option></select>}</td>{isChaos && <td className="px-4 py-4"><button disabled={!rearmCost} className="rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-200 disabled:border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600">{rearmCost ? `Rearm (-${rearmCost} WP)` : "Rearmed"}</button></td>}<td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><div className="flex justify-end gap-2"><button onClick={() => onDisposition(unit, "salvage")} className="rounded-xl border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-xs font-black text-amber-200">{isChaos ? `Salvage (+${salvageValue} WP)` : "Salvage"}</button><button disabled={isChaos && damaged} onClick={() => onDisposition(unit, "sell")} className="rounded-xl border border-blue-400/35 bg-blue-400/10 px-3 py-2 text-xs font-black text-blue-200 disabled:border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600">{isChaos ? `Sell (+${tonnage} WP)` : "Sell"}</button></div></td></tr>;
    })}</tbody></table> : <div className="p-10 text-center text-sm text-zinc-500">No units match this view.</div>}
  </div>;
}

function RepairQueue({ rows }: { rows: RepairRow[] }) {
  const total = rows.reduce((sum, row) => sum + Number(row.replacementCostCBills ?? 0), 0);
  return <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60"><div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4"><div><h2 className="font-black text-zinc-100">Repair Queue</h2><p className="text-xs text-zinc-500">Repair, replacement, and rearm work generated from official battle damage.</p></div><div className="text-right"><div className="text-xs uppercase text-zinc-500">Potential cost</div><div className="font-black text-lime-200">{total.toLocaleString()} C-bills</div></div></div><div className="max-h-[34rem] overflow-auto"><table className="w-full min-w-[1080px] text-left text-sm"><thead className="sticky top-0 z-10 bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="px-4 py-3">Unit</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Work</th><th className="px-4 py-3">Action</th><th className="px-4 py-3 text-center">2D6</th><th className="px-4 py-3">Tech</th><th className="px-4 py-3">Availability</th><th className="px-4 py-3 text-right">Cost</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-zinc-800">{rows.length ? rows.map((row) => <tr key={row.id}><td className="px-4 py-3 font-black text-zinc-100">{row.unitName}</td><td className="px-4 py-3 text-zinc-400">{prettyLocation(row.locationId)}</td><td className="px-4 py-3 text-zinc-200">{row.quantity > 1 ? `${row.quantity} × ` : ""}{row.itemName}</td><td className="px-4 py-3"><Tag text={row.action} className={actionClass(row.action)}/></td><td className="px-4 py-3 text-center font-black text-zinc-200">{row.repairRoll ?? "—"}</td><td className="px-4 py-3 text-zinc-300">{row.techRating ?? "—"}</td><td className="px-4 py-3 text-zinc-300">{row.availabilityRating ?? "—"}</td><td className="px-4 py-3 text-right font-black text-zinc-200">{Number(row.replacementCostCBills ?? 0).toLocaleString()}</td><td className="px-4 py-3 text-zinc-400">{row.status}</td></tr>) : <tr><td colSpan={9} className="px-4 py-10 text-center text-zinc-500">No repair work is currently queued.</td></tr>}</tbody></table></div></div>;
}

function PartsRequisitionsModal({ rows, onClose }: { rows: RepairRow[]; onClose: () => void }) {
  const [section, setSection] = useState<ReqView>("needed");
  const needed = rows.filter((row) => row.action === "Replace" && !["Ordered", "Awaiting Delivery", "Delivered"].includes(row.status) && row.requisitionStatus !== "Awaiting Delivery");
  const delivery = rows.filter((row) => ["Ordered", "Awaiting Delivery"].includes(row.status) || row.requisitionStatus === "Awaiting Delivery");
  const visible = section === "needed" ? needed : delivery;
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-zinc-950/85 p-4 backdrop-blur-sm"><div className="flex max-h-[85vh] w-full max-w-5xl flex-col rounded-3xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl"><div className="flex items-start justify-between"><div><div className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">Logistics</div><h2 className="mt-1 text-2xl font-black text-zinc-100">Parts Requisitions</h2><p className="mt-1 text-sm text-zinc-500">Replacement parts are derived directly from the repair queue.</p></div><button onClick={onClose} className="rounded-xl border border-zinc-700 p-2 text-zinc-300"><X size={18}/></button></div><div className="mt-5 inline-flex w-fit rounded-xl border border-zinc-700 bg-zinc-900 p-1"><ViewButton active={section === "needed"} onClick={() => setSection("needed")}>Needs Requisition ({needed.length})</ViewButton><ViewButton active={section === "delivery"} onClick={() => setSection("delivery")}>Awaiting Delivery ({delivery.length})</ViewButton></div><div className="mt-4 min-h-0 flex-1 overflow-auto rounded-2xl border border-zinc-800"><table className="w-full min-w-[760px] text-left text-sm"><thead className="sticky top-0 bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="px-4 py-3">Part</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3">Location</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3">Availability</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-zinc-800">{visible.length ? visible.map((row) => <tr key={row.id}><td className="px-4 py-3 font-black text-zinc-100">{row.itemName}</td><td className="px-4 py-3 text-zinc-300">{row.unitName}</td><td className="px-4 py-3 text-zinc-400">{prettyLocation(row.locationId)}</td><td className="px-4 py-3 text-right text-zinc-300">{row.quantity}</td><td className="px-4 py-3 text-zinc-300">{row.availabilityRating ?? "—"}</td><td className="px-4 py-3"><Tag text={section === "needed" ? (row.requisitionStatus === "Failed" ? "Failed to Find" : "Needs Order") : "Awaiting Delivery"} className={section === "needed" ? "border-yellow-400/40 bg-yellow-500/15 text-yellow-200" : "border-green-400/40 bg-green-500/15 text-green-200"}/></td></tr>) : <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-500">No parts in this section.</td></tr>}</tbody></table></div></div></div>;
}

function DispositionModal({ disposition, busy, onConfirm, onClose }: { disposition: { unit: ForceUnit; action: "salvage" | "sell"; amount: number; resourceType: "Warchest" | "CBills"; bonus?: string | null }; busy: boolean; onConfirm: () => void; onClose: () => void }) {
  const label = disposition.resourceType === "CBills" ? "C-bills" : "WP";
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-zinc-950/85 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-3xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl"><div className="text-xs font-black uppercase tracking-[.2em] text-amber-300">Confirm {disposition.action}</div><h2 className="mt-2 text-2xl font-black text-zinc-100">{disposition.unit.snapshot?.name}</h2><p className="mt-3 text-sm text-zinc-400">This unit will be permanently removed from the campaign force.</p><div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="text-xs uppercase tracking-wider text-zinc-500">Resources gained</div><div className="mt-1 text-2xl font-black text-lime-200">+{disposition.amount.toLocaleString()} {label}</div>{disposition.bonus && <div className="mt-2 text-xs text-cyan-200">{disposition.bonus}</div>}</div><div className="mt-6 flex justify-end gap-3"><button disabled={busy} onClick={onClose} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-black text-zinc-300">Cancel</button><button disabled={busy} onClick={onConfirm} className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-black text-red-200 disabled:opacity-50">{busy ? "Processing…" : `Confirm ${disposition.action}`}</button></div></div></div>;
}

function UnitDamagePanel({ unit, onClose }: { unit: ForceUnit; onClose: () => void }) {
  const locations = unit.snapshot?.locations ?? [];
  const detail = ((unit as any).currentDamage ?? (unit as any).damageOverlay)?.detailed ?? {};
  const damage = detail.locations ?? {};
  const equipmentRows = detail.equipmentDamage ?? [];

  return <div className="rounded-3xl border border-lime-400/25 bg-zinc-950 p-5 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><div className="text-xs font-black uppercase tracking-[.2em] text-lime-300">Unit Damage</div><h2 className="mt-1 text-2xl font-black text-zinc-100">{unit.snapshot?.name}</h2><p className="mt-1 text-sm text-zinc-500">Uses the same body arrangement and critical-slot layout as the battle damage reporter.</p></div><button onClick={onClose} className="rounded-xl border border-zinc-700 p-2 text-zinc-300"><X size={18}/></button></div><BattleMechLocationLayout locations={locations} renderLocation={(loc, options) => <LocationCard key={loc.id} loc={loc} damage={damage[loc.id] ?? damage[loc.name] ?? {}} equipmentRows={equipmentRows} head={options?.head} tall={options?.tall}/>} /></div>;
}

function LocationCard({ loc, damage: d, equipmentRows, head, tall }: { loc: UnitLocation; damage: any; equipmentRows: any[]; head?: boolean; tall?: boolean }) {
  const visibleSlots = head ? (loc.slots ?? []).slice(0, 6) : (loc.slots ?? []);
  const destroyedOrMissing = Boolean(d.destroyed || d.missing);
  const armorRemaining = destroyedOrMissing ? 0 : remainingPoints(loc.armor, d.armorDamage);
  const rearArmorRemaining = destroyedOrMissing ? 0 : remainingPoints(loc.rearArmor, d.rearArmorDamage);
  const structureRemaining = destroyedOrMissing ? 0 : remainingPoints(loc.structure, d.structureDamage);
  return <div className={`min-w-0 rounded-3xl border p-3 ${destroyedOrMissing ? "border-red-500/50 bg-red-500/10" : "border-zinc-800 bg-zinc-900/70"} ${head ? "xl:min-h-0" : ""} ${tall ? "xl:min-h-[520px]" : ""}`}><div className="flex justify-between gap-2"><div className="font-black text-zinc-100">{loc.name}</div>{destroyedOrMissing && <span className="text-[10px] font-black text-red-300">{d.missing ? "MISSING" : "DESTROYED"}</span>}</div><div className={`mt-3 grid gap-1.5 text-center text-xs ${loc.rearArmor != null ? "grid-cols-3" : "grid-cols-2"}`}><Metric label="Armor" value={`${armorRemaining} / ${Number(loc.armor ?? 0)}`}/>{loc.rearArmor != null && <Metric label="Rear" value={`${rearArmorRemaining} / ${Number(loc.rearArmor ?? 0)}`}/>}<Metric label="Internal" value={`${structureRemaining} / ${Number(loc.structure ?? 0)}`}/></div><div className="mt-3 space-y-1">{visibleSlots.map((slot: any) => { const slotNumber = Number(slot.slot ?? slot.slotIndex); const equipment = equipmentRows.find((row: any) => row.locationId === loc.id && Number(row.slotNumber) === slotNumber); const destroyed = (d.destroyedSlots ?? []).map(Number).includes(slotNumber); const damaged = (d.damagedSlots ?? []).map(Number).includes(slotNumber); return <div key={slotNumber} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[11px] ${destroyed ? "border-red-500/50 bg-red-500/10" : damaged ? "border-yellow-500/50 bg-yellow-500/10" : "border-zinc-800 bg-zinc-950/60"}`}><span className="w-4 text-right font-black text-zinc-600">{slotNumber}</span><span className="min-w-0 flex-1 truncate text-zinc-300">{slot.item ?? slot.displayName ?? slot.raw}</span>{equipment && <span className={`shrink-0 font-black ${equipment.disposition === "Replace" ? "text-red-300" : "text-green-300"}`}>{equipment.disposition}{equipment.repairRoll ? ` (${equipment.repairRoll})` : ""}</span>}</div>; })}</div></div>;
}

function remainingPoints(total: unknown, damage: unknown) { const maximum = Math.max(0, Number(total ?? 0)); const taken = Math.max(0, Number(damage ?? 0)); return Math.max(0, maximum - taken); }
function collectRepairRows(units: ForceUnit[]): RepairRow[] { return units.flatMap((unit) => ((((unit as any).currentDamage ?? (unit as any).damageOverlay)?.detailed?.repairOrders ?? []) as any[]).map((order) => ({ ...order, unitName: unit.snapshot?.name ?? unit.baseUnitId }))); }
function groupLocationsByName(locations: UnitLocation[]) { const result: Record<string, UnitLocation | null> = { head: null, centerTorso: null, leftTorso: null, rightTorso: null, leftArm: null, rightArm: null, leftLeg: null, rightLeg: null }; for (const location of locations) { const name = String(location.name ?? "").toLowerCase(); if (name === "head") result.head = location; else if (name === "center torso") result.centerTorso = location; else if (name === "left torso") result.leftTorso = location; else if (name === "right torso") result.rightTorso = location; else if (name === "left arm") result.leftArm = location; else if (name === "right arm") result.rightArm = location; else if (name === "left leg") result.leftLeg = location; else if (name === "right leg") result.rightLeg = location; } return result; }
function prettyLocation(value?: string) { if (!value) return "—"; return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase()); }
function actionClass(action: string) { return action === "Replace" ? "border-red-400/40 bg-red-500/15 text-red-200" : action === "Rearm" ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200" : "border-green-400/40 bg-green-500/15 text-green-200"; }
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2"><div className="text-[9px] uppercase text-zinc-500">{label}</div><div className="mt-1 font-black text-zinc-200">{value}</div></div>}
function Tag({text,className}:{text:string;className:string}){return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black ${className}`}>{text}</span>}
function statusLabel(unit: ForceUnit){const raw=String(unit.status ?? "Ready"); return raw === "Available" ? "Ready" : raw;}
function unitNeedsRepair(unit: ForceUnit){if(!["Ready","Available"].includes(statusLabel(unit))) return true; const d=((unit as any).currentDamage ?? (unit as any).damageOverlay); return Object.values(d?.damageSummary ?? {}).some(v=>Number(v)>0);}
function repairComplexity(unit: ForceUnit):RepairComplexity{return (((unit as any).currentDamage ?? (unit as any).damageOverlay)?.repairComplexity ?? "Simple") as RepairComplexity;}
function repairSummary(unit: ForceUnit){const s=((unit as any).currentDamage ?? (unit as any).damageOverlay)?.damageSummary ?? {}; const parts=[[s.armor,"armor"],[s.internal,"internal"],[s.weapons,"weapons"],[s.components,"components"],[s.engineHits,"engine"],[s.gyroHits,"gyro"],[s.ammo,"ammo"],[s.limbs,"limbs"]].filter(([v])=>Number(v)>0).map(([v,l])=>`${v} ${l}`); return parts.length?parts.join(" · "):statusLabel(unit)==="Destroyed"?"Destroyed unit":"-";}
function chaosRepairCost(unit:ForceUnit,status:string){const w=String(unit.snapshot?.weightClass??"").toLowerCase(),c=status==="Crippled"; if(w==="light")return c?25:15;if(w==="medium")return c?45:30;if(w==="heavy")return c?75:60;return c?100:80;}
function chaosRearmCost(unit: ForceUnit){const overlay=((unit as any).currentDamage ?? (unit as any).damageOverlay); const spent=overlay?.detailed?.ammoSpent ?? {}; const pools=getAmmoPools(unit); return Math.ceil(pools.reduce((sum,pool)=>{const used=Math.max(0,Number(spent[pool.key]??0)); if(!used||!pool.shots)return sum; const tons=used/pool.shots; return sum + tons*(isMissileAmmo(pool.label)?6:4);},0));}
function getAmmoPools(unit: ForceUnit){const pools=new Map<string,{key:string;label:string;shots:number}>(); (unit.snapshot?.weapons??[]).forEach((weapon:any)=>{if(weapon.shots==="∞")return;const shots=Number(weapon.shots);if(!Number.isFinite(shots)||shots<=0)return;const label=friendlyAmmoLabel(String(weapon.ammoDisplayName??weapon.ammoName??weapon.ammo??weapon.ammoType??weapon.name??"Ammo"));const key=ammoKey(label);const old=pools.get(key);pools.set(key,{key,label,shots:Math.max(old?.shots??0,shots)});});return [...pools.values()];}
function friendlyAmmoLabel(value:string){let cleaned=value.replace(/[_-]+/g," ").replace(/^clan\s+/i,"").replace(/^is\s+/i,"").replace(/^ammo\s+/i,"").replace(/\s+ammo$/i,"").replace(/\s+/g," ").trim();if(!cleaned)return "Ammo";cleaned=cleaned.replace(/\bac\s*(\d+)\b/i,"AC/$1").replace(/\bultra\s+ac\s*(\d+)\b/i,"Ultra AC/$1").replace(/\blb\s*(\d+)x\b/i,"LB $1-X").replace(/\bsrm\s*(\d+)\b/i,"SRM-$1").replace(/\blrm\s*(\d+)\b/i,"LRM-$1").replace(/\bmrm\s*(\d+)\b/i,"MRM-$1").replace(/\bstreak\s+srm\s*(\d+)\b/i,"Streak SRM-$1").replace(/\bgauss\b/i,"Gauss").replace(/\bmg\b/i,"Machine Gun");return `${cleaned} Ammo`;}
function ammoKey(value:string){return friendlyAmmoLabel(value).toLowerCase().replace(/\s+ammo$/i,"").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");}
function isMissileAmmo(label:string){return /(lrm|srm|mrm|atm|narc|arrow|thunderbolt|rocket)/i.test(label);}
function statusClass(s:string){if(s==="Ready")return "border-green-400/40 bg-green-500/15 text-green-200";if(s==="Damaged")return "border-yellow-400/40 bg-yellow-500/15 text-yellow-200";if(s==="Crippled")return "border-orange-400/40 bg-orange-500/15 text-orange-200";return "border-red-400/40 bg-red-500/15 text-red-200";}
function complexityClass(c:RepairComplexity){if(c==="Simple")return "border-green-400/40 bg-green-500/15 text-green-200";if(c==="Intermediate")return "border-yellow-400/40 bg-yellow-500/15 text-yellow-200";if(c==="Difficult")return "border-orange-400/40 bg-orange-500/15 text-orange-200";return "border-red-400/40 bg-red-500/15 text-red-200";}
