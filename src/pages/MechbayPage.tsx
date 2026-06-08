import React, { useMemo, useState } from "react";
import { ArrowLeft, PackageSearch, X } from "lucide-react";
import PageTitle from "../components/PageTitle";
import type { Campaign, Force, ForceUnit, RepairComplexity, UnitLocation } from "../types/app";

type BayFilter = "all" | "repairs";
type PartStatus = "Being Ordered" | "Failed to Find" | "Awaiting Delivery";

const MOCK_PARTS: Array<{ part: string; unit: string; quantity: number; status: PartStatus }> = [
  { part: "Medium Laser", unit: "Hunchback HBK-4P", quantity: 1, status: "Being Ordered" },
  { part: "Right Arm Assembly", unit: "Warhammer WHM-6K", quantity: 1, status: "Failed to Find" },
  { part: "AC/10 Ammunition Bin", unit: "Highlander HGN-733", quantity: 2, status: "Awaiting Delivery" },
];

export default function MechbayPage({ campaign, force, onBack, onResourceBalanceChange }: { campaign: Campaign; force?: Force; onBack: () => void; onResourceBalanceChange?: (resourceType: "Warchest" | "CBills", balance: number) => void }) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [filter, setFilter] = useState<BayFilter>("repairs");
  const [partsOpen, setPartsOpen] = useState(false);
  const [localForce, setLocalForce] = useState(force);
  const [repairingId, setRepairingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [disposition, setDisposition] = useState<null | { unit: ForceUnit; action: "salvage" | "sell"; amount: number; resourceType: "Warchest" | "CBills"; bonus?: string | null }>(null);
  const [disposing, setDisposing] = useState(false);
  const isChaos = campaign.settings?.type === "Chaos";
  const allUnits = localForce?.forceUnits ?? [];
  const units = useMemo(() => filter === "all" ? allUnits : allUnits.filter(unitNeedsRepair), [allUnits, filter]);
  const selectedUnit = allUnits.find((unit) => unit.id === selectedUnitId) ?? null;

  async function repairChaosUnit(unit: ForceUnit) {
    if (!localForce || !isChaos) return;
    setRepairingId(unit.id);
    setActionError(null);
    try {
      const token = localStorage.getItem("bcm-auth-token");
      const response = await fetch(`/api/forces/${localForce.id}/units/${unit.id}/chaos-repair`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaign.id }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Unable to repair unit.");
      setLocalForce(payload.force ?? localForce);
      if (Number.isFinite(Number(payload.remainingWarchest))) onResourceBalanceChange?.("Warchest", Number(payload.remainingWarchest));
      setSelectedUnitId(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to repair unit.");
    } finally {
      setRepairingId(null);
    }
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
    } catch (error) { setActionError(error instanceof Error ? error.message : "Unable to complete action."); } finally { setDisposing(false); }
  }

  return <section className="space-y-5">
    <PageTitle eyebrow="Campaign Operations" title="Mechbay" description={`${campaign.name} — review unit condition, repairs, rearming, salvage, and disposition.`}
      actions={<button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-lime-400/40 hover:text-lime-200"><ArrowLeft size={16}/> Campaign Dashboard</button>} />

    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex w-fit rounded-xl border border-zinc-700 bg-zinc-900 p-1">
        <button type="button" onClick={() => setFilter("all")} className={`rounded-lg px-3 py-2 text-xs font-black ${filter === "all" ? "bg-lime-400 text-zinc-950" : "text-zinc-400"}`}>All Units</button>
        <button type="button" onClick={() => setFilter("repairs")} className={`rounded-lg px-3 py-2 text-xs font-black ${filter === "repairs" ? "bg-lime-400 text-zinc-950" : "text-zinc-400"}`}>Awaiting Repairs</button>
      </div>
      {!isChaos && <button type="button" onClick={() => setPartsOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-200"><PackageSearch size={16}/> Parts Requisitions</button>}
    </div>

    {actionError && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{actionError}</div>}

    <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950/60">
      {units.length ? <table className="min-w-[1080px] w-full text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/90 text-xs uppercase tracking-[0.13em] text-zinc-500"><tr>
          <th className="px-4 py-3">Unit</th><th className="px-4 py-3">Status</th>
          {!isChaos && <th className="px-4 py-3">Repair Summary</th>}
          {!isChaos && <th className="px-4 py-3">Complexity</th>}
          {!isChaos && <th className="px-4 py-3 text-right">Current BV</th>}
          <th className="px-4 py-3 text-right">Total BV</th><th className="px-4 py-3">Repair</th>
          {isChaos && <th className="px-4 py-3">Rearm</th>}<th className="px-4 py-3 text-right">Other Actions</th>
        </tr></thead>
        <tbody className="divide-y divide-zinc-800">{units.map((unit) => {
          const status = statusLabel(unit); const destroyed = status === "Destroyed" || !!unit.isDestroyed;
          const damaged = unitNeedsRepair(unit); const complexity = repairComplexity(unit); const cost = chaosRepairCost(unit, status);
          const tonnage = Number(unit.snapshot?.tonnage ?? 0); const rearmCost = chaosRearmCost(unit); const salvageValue = Math.floor(tonnage / 2);
          return <tr key={unit.id} onClick={() => setSelectedUnitId(unit.id)} className="cursor-pointer align-top transition hover:bg-zinc-900/70">
            <td className="px-4 py-4"><div className="font-black text-zinc-100">{unit.snapshot?.name ?? unit.baseUnitId}</div><div className="mt-1 text-xs text-zinc-500">{unit.snapshot?.weightClass ?? "Unknown"} · {unit.snapshot?.tonnage ?? "—"} tons</div></td>
            <td className="px-4 py-4"><Tag text={status} className={statusClass(status)}/></td>
            {!isChaos && <td className="max-w-md px-4 py-4 text-xs leading-relaxed text-zinc-300">{repairSummary(unit)}</td>}
            {!isChaos && <td className="px-4 py-4"><Tag text={complexity} className={complexityClass(complexity)}/></td>}
            {!isChaos && <td className="px-4 py-4 text-right font-black text-zinc-200">{Number(unit.currentBV ?? 0).toLocaleString()}</td>}
            <td className="px-4 py-4 text-right font-black text-lime-200">{Number(unit.snapshot?.totalBV ?? 0).toLocaleString()}</td>
            <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>{isChaos ? <button disabled={destroyed || !damaged || repairingId === unit.id} onClick={() => repairChaosUnit(unit)} className="rounded-xl border border-lime-400/35 bg-lime-400/10 px-3 py-2 text-xs font-black text-lime-200 disabled:border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600">{destroyed ? "Not Repairable" : repairingId === unit.id ? "Repairing…" : `Repair (-${cost} WP)`}</button> : <select defaultValue={damaged ? "Repair" : "-"} disabled={!damaged} className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 disabled:text-zinc-500"><option value="-">-</option><option>Repair</option><option>Do Not Repair</option></select>}</td>
            {isChaos && <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><button disabled={rearmCost <= 0} className="rounded-xl border border-sky-400/35 bg-sky-400/10 px-3 py-2 text-xs font-black text-sky-200 disabled:border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600">Rearm (-{rearmCost} WP)</button></td>}
            <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><div className="flex justify-end gap-2"><button onClick={() => openDisposition(unit, "salvage")} className="rounded-xl border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-xs font-black text-amber-200">{isChaos ? `Salvage (+${salvageValue} WP)` : "Salvage"}</button><button onClick={() => openDisposition(unit, "sell")} disabled={isChaos && damaged} className="rounded-xl border border-red-400/35 bg-red-400/10 px-3 py-2 text-xs font-black text-red-200 disabled:border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600">{isChaos ? `Sell (+${tonnage} WP)` : "Sell"}</button></div></td>
          </tr>})}</tbody>
      </table> : <div className="p-12 text-center"><div className="text-lg font-black text-zinc-100">{filter === "repairs" ? "No repairs required" : "No units found"}</div><p className="mt-2 text-sm text-zinc-500">{filter === "repairs" ? "Every unit in this campaign force is ready." : "This force has no units."}</p></div>}
    </div>
    <p className="text-xs text-zinc-600">Chaos repair is active. Rearm, salvage, sell, and Advanced/Conquest requisition controls remain staged for their later workflows.</p>
    {selectedUnit && <UnitDamagePanel unit={selectedUnit} onClose={() => setSelectedUnitId(null)}/>} 
    {partsOpen && <PartsRequisitionModal onClose={() => setPartsOpen(false)}/>}
    {disposition && <DispositionModal disposition={disposition} busy={disposing} onConfirm={confirmDisposition} onClose={() => setDisposition(null)}/>} 
  </section>;
}

function PartsRequisitionModal({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-zinc-950/85 px-4 py-8 backdrop-blur-sm"><div className="w-full max-w-4xl rounded-3xl border border-zinc-700 bg-zinc-950 p-5 shadow-2xl sm:p-6">
    <div className="flex items-start justify-between"><div><div className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">Logistics</div><h2 className="mt-1 text-2xl font-black text-zinc-100">Parts Requisitions</h2><p className="mt-1 text-sm text-zinc-500">Parts being sourced, unavailable, or in transit. This preview is not yet connected to repair orders.</p></div><button onClick={onClose} className="rounded-xl border border-zinc-700 p-2 text-zinc-300"><X size={18}/></button></div>
    <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-800"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500"><tr><th className="px-4 py-3">Part</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-zinc-800">{MOCK_PARTS.map((item) => <tr key={`${item.part}-${item.unit}`}><td className="px-4 py-4 font-black text-zinc-100">{item.part}</td><td className="px-4 py-4 text-zinc-300">{item.unit}</td><td className="px-4 py-4 text-right text-zinc-300">{item.quantity}</td><td className="px-4 py-4"><Tag text={item.status} className={partStatusClass(item.status)}/></td></tr>)}</tbody></table></div>
  </div></div>;
}

function DispositionModal({ disposition, busy, onConfirm, onClose }: { disposition: { unit: ForceUnit; action: "salvage" | "sell"; amount: number; resourceType: "Warchest" | "CBills"; bonus?: string | null }; busy: boolean; onConfirm: () => void; onClose: () => void }) {
  const label = disposition.resourceType === "CBills" ? "C-bills" : "WP";
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-zinc-950/85 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-3xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl"><div className="text-xs font-black uppercase tracking-[.2em] text-amber-300">Confirm {disposition.action}</div><h2 className="mt-2 text-2xl font-black text-zinc-100">{disposition.unit.snapshot?.name}</h2><p className="mt-3 text-sm text-zinc-400">This unit will be permanently removed from the campaign force.</p><div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="text-xs uppercase tracking-wider text-zinc-500">Resources gained</div><div className="mt-1 text-2xl font-black text-lime-200">+{disposition.amount.toLocaleString()} {label}</div>{disposition.bonus && <div className="mt-2 text-xs text-cyan-200">{disposition.bonus}</div>}</div><div className="mt-6 flex justify-end gap-3"><button disabled={busy} onClick={onClose} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-black text-zinc-300">Cancel</button><button disabled={busy} onClick={onConfirm} className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-black text-red-200 disabled:opacity-50">{busy ? "Processing…" : `Confirm ${disposition.action}`}</button></div></div></div>;
}

function UnitDamagePanel({ unit, onClose }: { unit: ForceUnit; onClose: () => void }) {
  const locations = unit.snapshot?.locations ?? []; const damage = ((unit as any).currentDamage ?? (unit as any).damageOverlay)?.detailed?.locations ?? {};
  return <div className="rounded-3xl border border-lime-400/25 bg-zinc-950 p-5 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><div className="text-xs font-black uppercase tracking-[.2em] text-lime-300">Unit Damage</div><h2 className="mt-1 text-2xl font-black text-zinc-100">{unit.snapshot?.name}</h2></div><button onClick={onClose} className="rounded-xl border border-zinc-700 p-2 text-zinc-300"><X size={18}/></button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{orderedLocations(locations).map((loc) => { const d=damage[loc.id] ?? damage[loc.name] ?? {}; return <div key={loc.id} className={`rounded-2xl border p-4 ${d.destroyed || d.missing ? "border-red-500/50 bg-red-500/10" : "border-zinc-800 bg-zinc-900/70"}`}><div className="flex justify-between"><div className="font-black text-zinc-100">{loc.name}</div>{(d.destroyed || d.missing) && <span className="text-xs font-black text-red-300">{d.missing ? "MISSING" : "DESTROYED"}</span>}</div><div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs"><Metric label="Armor" value={`${Number(d.armorDamage ?? 0)} / ${loc.armor}`}/>{loc.rearArmor != null ? <Metric label="Rear" value={`${Number(d.rearArmorDamage ?? 0)} / ${loc.rearArmor}`}/> : <Metric label="Rear" value="—"/>}<Metric label="Internal" value={`${Number(d.structureDamage ?? 0)} / ${loc.structure}`}/></div></div>})}</div></div>;
}
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2"><div className="text-[10px] uppercase text-zinc-500">{label}</div><div className="mt-1 font-black text-zinc-200">{value}</div></div>}
function Tag({text,className}:{text:string;className:string}){return <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${className}`}>{text}</span>}
function orderedLocations(locations: UnitLocation[]){const order=["Head","Center Torso","Left Torso","Right Torso","Left Arm","Right Arm","Left Leg","Right Leg"]; return [...locations].sort((a,b)=>order.indexOf(a.name)-order.indexOf(b.name));}
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
function partStatusClass(s:PartStatus){if(s==="Awaiting Delivery")return "border-green-400/40 bg-green-500/15 text-green-200";if(s==="Being Ordered")return "border-yellow-400/40 bg-yellow-500/15 text-yellow-200";return "border-red-400/40 bg-red-500/15 text-red-200";}
