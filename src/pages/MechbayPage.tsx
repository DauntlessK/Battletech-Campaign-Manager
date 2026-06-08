import React, { useMemo, useState } from "react";
import { ArrowLeft, Wrench, X } from "lucide-react";
import PageTitle from "../components/PageTitle";
import type { Campaign, Force, ForceUnit, RepairComplexity, UnitLocation } from "../types/app";

export default function MechbayPage({ campaign, force, onBack }: { campaign: Campaign; force?: Force; onBack: () => void }) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const isChaos = campaign.settings?.type === "Chaos";
  const units = useMemo(() => (force?.forceUnits ?? []).filter(unitNeedsRepair), [force]);
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) ?? null;

  return <section className="space-y-5">
    <PageTitle eyebrow="Campaign Operations" title="Mechbay" description={`${campaign.name} — damaged units awaiting repair, salvage, or disposition.`}
      actions={<button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-lime-400/40 hover:text-lime-200"><ArrowLeft size={16}/> Campaign Dashboard</button>} />

    <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950/60">
      {units.length ? <table className="min-w-[1080px] w-full text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/90 text-xs uppercase tracking-[0.13em] text-zinc-500"><tr>
          <th className="px-4 py-3">Unit</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Repair Summary</th>
          {!isChaos && <th className="px-4 py-3">Complexity</th>}<th className="px-4 py-3 text-right">Current BV</th><th className="px-4 py-3 text-right">Total BV</th><th className="px-4 py-3">Repair Decision</th><th className="px-4 py-3 text-right">Other Actions</th>
        </tr></thead>
        <tbody className="divide-y divide-zinc-800">{units.map((unit) => {
          const status = statusLabel(unit); const destroyed = status === "Destroyed" || !!unit.isDestroyed;
          const complexity = repairComplexity(unit); const cost = chaosRepairCost(unit, status);
          return <tr key={unit.id} onClick={() => setSelectedUnitId(unit.id)} className="cursor-pointer align-top transition hover:bg-zinc-900/70">
            <td className="px-4 py-4"><div className="font-black text-zinc-100">{unit.snapshot?.name ?? unit.baseUnitId}</div><div className="mt-1 text-xs text-zinc-500">{unit.snapshot?.weightClass ?? "Unknown"} · {unit.snapshot?.tonnage ?? "—"} tons</div></td>
            <td className="px-4 py-4"><Tag text={status} className={statusClass(status)}/></td>
            <td className="max-w-md px-4 py-4 text-xs leading-relaxed text-zinc-300">{repairSummary(unit)}</td>
            {!isChaos && <td className="px-4 py-4"><Tag text={complexity} className={complexityClass(complexity)}/></td>}
            <td className="px-4 py-4 text-right font-black text-zinc-200">{Number(unit.currentBV ?? 0).toLocaleString()}</td>
            <td className="px-4 py-4 text-right font-black text-lime-200">{Number(unit.snapshot?.totalBV ?? 0).toLocaleString()}</td>
            <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>{isChaos ? <button disabled={destroyed} className="rounded-xl border border-lime-400/35 bg-lime-400/10 px-3 py-2 text-xs font-black text-lime-200 disabled:border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600">{destroyed ? "Not Repairable" : `Repair (${cost} WP cost)`}</button> : <select defaultValue="Repair" className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200"><option>Repair</option><option>Do Not Repair</option></select>}</td>
            <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><div className="flex justify-end gap-2"><button className="rounded-xl border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-xs font-black text-amber-200">Salvage</button><button className="rounded-xl border border-red-400/35 bg-red-400/10 px-3 py-2 text-xs font-black text-red-200">Sell</button></div></td>
          </tr>})}</tbody>
      </table> : <div className="p-12 text-center"><div className="text-lg font-black text-zinc-100">No repairs required</div><p className="mt-2 text-sm text-zinc-500">Every unit in this campaign force is ready.</p></div>}
    </div>
    <p className="text-xs text-zinc-600">Repair, salvage, and sell controls remain mockups. Repair complexity is stored with the battle damage report rather than recalculated here.</p>
    {selectedUnit && <UnitDamagePanel unit={selectedUnit} onClose={() => setSelectedUnitId(null)}/>} 
  </section>;
}

function UnitDamagePanel({ unit, onClose }: { unit: ForceUnit; onClose: () => void }) {
  const locations = unit.snapshot?.locations ?? []; const damage = ((unit as any).currentDamage ?? (unit as any).damageOverlay)?.detailed?.locations ?? {};
  return <div className="rounded-3xl border border-lime-400/25 bg-zinc-950 p-5 sm:p-6">
    <div className="mb-5 flex items-start justify-between"><div><div className="text-xs font-black uppercase tracking-[.2em] text-lime-300">Unit Damage</div><h2 className="mt-1 text-2xl font-black text-zinc-100">{unit.snapshot?.name}</h2></div><button onClick={onClose} className="rounded-xl border border-zinc-700 p-2 text-zinc-300 hover:text-white"><X size={18}/></button></div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{orderedLocations(locations).map((loc) => { const d=damage[loc.id] ?? damage[loc.name] ?? {}; return <div key={loc.id} className={`rounded-2xl border p-4 ${d.destroyed || d.missing ? "border-red-500/50 bg-red-500/10" : "border-zinc-800 bg-zinc-900/70"}`}><div className="flex justify-between"><div className="font-black text-zinc-100">{loc.name}</div>{(d.destroyed || d.missing) && <span className="text-xs font-black text-red-300">{d.missing ? "MISSING" : "DESTROYED"}</span>}</div><div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs"><Metric label="Armor" value={`${Number(d.armorDamage ?? 0)} / ${loc.armor}`}/>{loc.rearArmor != null ? <Metric label="Rear" value={`${Number(d.rearArmorDamage ?? 0)} / ${loc.rearArmor}`}/> : <Metric label="Rear" value="—"/>}<Metric label="Internal" value={`${Number(d.structureDamage ?? 0)} / ${loc.structure}`}/></div></div>})}</div>
  </div>
}
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2"><div className="text-[10px] uppercase text-zinc-500">{label}</div><div className="mt-1 font-black text-zinc-200">{value}</div></div>}
function Tag({text,className}:{text:string;className:string}){return <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${className}`}>{text}</span>}
function orderedLocations(locations: UnitLocation[]){const order=["Head","Center Torso","Left Torso","Right Torso","Left Arm","Right Arm","Left Leg","Right Leg"]; return [...locations].sort((a,b)=>order.indexOf(a.name)-order.indexOf(b.name));}
function statusLabel(unit: ForceUnit){const raw=String(unit.status ?? "Ready"); return raw === "Available" ? "Ready" : raw;}
function unitNeedsRepair(unit: ForceUnit){if(!["Ready","Available"].includes(statusLabel(unit))) return true; const d=((unit as any).currentDamage ?? (unit as any).damageOverlay); return Object.values(d?.damageSummary ?? {}).some(v=>Number(v)>0);}
function repairComplexity(unit: ForceUnit):RepairComplexity{return (((unit as any).currentDamage ?? (unit as any).damageOverlay)?.repairComplexity ?? "Simple") as RepairComplexity;}
function repairSummary(unit: ForceUnit){const s=((unit as any).currentDamage ?? (unit as any).damageOverlay)?.damageSummary ?? {}; const parts=[[s.armor,"armor"],[s.internal,"internal"],[s.weapons,"weapons"],[s.components,"components"],[s.engineHits,"engine"],[s.gyroHits,"gyro"],[s.ammo,"ammo"],[s.limbs,"limbs"]].filter(([v])=>Number(v)>0).map(([v,l])=>`${v} ${l}`); return parts.length?parts.join(" · "):statusLabel(unit)==="Destroyed"?"Destroyed unit":"Repair assessment required";}
function chaosRepairCost(unit:ForceUnit,status:string){const w=String(unit.snapshot?.weightClass??"").toLowerCase(),c=status==="Crippled"; if(w==="light")return c?25:15;if(w==="medium")return c?45:30;if(w==="heavy")return c?75:60;return c?100:80;}
function statusClass(s:string){if(s==="Ready")return "border-green-400/40 bg-green-500/15 text-green-200";if(s==="Damaged")return "border-yellow-400/40 bg-yellow-500/15 text-yellow-200";if(s==="Crippled")return "border-orange-400/40 bg-orange-500/15 text-orange-200";return "border-red-400/40 bg-red-500/15 text-red-200";}
function complexityClass(c:RepairComplexity){if(c==="Simple")return "border-green-400/40 bg-green-500/15 text-green-200";if(c==="Intermediate")return "border-yellow-400/40 bg-yellow-500/15 text-yellow-200";if(c==="Difficult")return "border-orange-400/40 bg-orange-500/15 text-orange-200";return "border-red-400/40 bg-red-500/15 text-red-200";}
