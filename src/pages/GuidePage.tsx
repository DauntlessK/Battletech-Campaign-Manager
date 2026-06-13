import { ArrowLeft, CheckCircle2, CircleHelp, ClipboardList, Flag, Shield, Swords, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import PageTitle from "../components/PageTitle";
import type { PageKey } from "../types/app";

type GuideCard = {
  key: PageKey;
  title: string;
  eyebrow: string;
  description: string;
  bullets: string[];
};

const campaignGuideCards: GuideCard[] = [
  {
    key: "guideWhichCampaign",
    eyebrow: "Start here",
    title: "Which Campaign?",
    description:
      "Compare Chaos, Advanced, and Conquest campaigns before committing a group to a rules package.",
    bullets: ["Feature comparison", "Best-fit recommendations", "How much bookkeeping to expect"],
  },
  {
    key: "guideChaosCampaign",
    eyebrow: "Fast campaign play",
    title: "Chaos Campaign Guide",
    description:
      "A streamlined campaign format centered on Warchest points, quick repairs, and lower bookkeeping.",
    bullets: ["Getting started", "Warchest economy", "Chaos repair and rearm flow"],
  },
  {
    key: "guideAdvancedCampaign",
    eyebrow: "Full logistics",
    title: "Advanced Campaign Guide",
    description:
      "The detailed campaign format for C-bills, repair queues, requisitions, pilot continuity, and attrition.",
    bullets: ["Turns and phases", "Repair orders", "Parts requisitions"],
  },
  {
    key: "guideConquestCampaign",
    eyebrow: "Territory focus",
    title: "Conquest Campaign Guide",
    description:
      "A strategic campaign format built around control, objectives, and territorial pressure.",
    bullets: ["Map/objective control", "Winning territory", "How it differs from Advanced"],
  },
];

export function GuideHomePage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Player guide"
        title="How to Play BTCM"
        subtitle="Use these guides as the starting point for campaign setup, rules expectations, and turn-by-turn play. Later, specific app screens can link directly to the relevant section."
      />

      <div className="rounded-3xl border border-lime-400/20 bg-lime-400/10 p-5 text-sm text-lime-50">
        <div className="flex items-start gap-3">
          <CircleHelp className="mt-0.5 shrink-0 text-lime-300" size={22} />
          <div>
            <h2 className="text-lg font-black text-lime-100">New players should start with “Which Campaign?”</h2>
            <p className="mt-1 text-lime-100/80">
              That page explains the practical differences between Chaos, Advanced, and Conquest so the group can pick the right amount of logistics and campaign pressure.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {campaignGuideCards.map((guide) => (
          <button
            key={guide.key}
            type="button"
            onClick={() => onNavigate(guide.key)}
            className="group flex h-full flex-col rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 text-left transition hover:border-lime-400/40 hover:bg-zinc-900"
          >
            <div className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">{guide.eyebrow}</div>
            <h2 className="mt-3 text-2xl font-black text-zinc-50">{guide.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{guide.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {guide.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-lime-300" />
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-5 text-sm font-black text-lime-300 group-hover:text-lime-200">Open guide →</div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function WhichCampaignGuidePage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <GuideShell
      eyebrow="Campaign selection"
      title="Which Campaign Should We Play?"
      subtitle="BTCM supports three campaign styles. The right choice depends on how much logistics, bookkeeping, and strategic pressure your group wants."
      onBack={() => onNavigate("guide")}
    >
      <section className="grid gap-4 lg:grid-cols-3">
        <CampaignTypeSummary
          title="Chaos"
          icon={<Swords size={22} />}
          bestFor="Fast campaign play with minimal recordkeeping."
          notes="Uses Warchest points for broad repairs and rearming. Great when the group wants linked battles without a detailed logistics layer."
        />
        <CampaignTypeSummary
          title="Advanced"
          icon={<Wrench size={22} />}
          bestFor="Detailed unit, pilot, repair, and requisition management."
          notes="Uses C-bills, repair queues, replacement parts, availability, technician time, and richer attrition."
        />
        <CampaignTypeSummary
          title="Conquest"
          icon={<Flag size={22} />}
          bestFor="Strategic territorial play."
          notes="Builds on a heavier campaign framework with a stronger focus on objectives, control, and map pressure."
        />
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <h2 className="text-xl font-black text-zinc-50">Feature comparison</h2>
        <div className="mt-4 overflow-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Chaos</th>
                <th className="px-4 py-3">Advanced</th>
                <th className="px-4 py-3">Conquest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <CompareRow feature="Primary economy" chaos="Warchest points" advanced="C-bills" conquest="C-bills / strategic resources" />
              <CompareRow feature="Repair depth" chaos="Simple WP repair/rearm" advanced="Full repair queue" conquest="Full repair queue" />
              <CompareRow feature="Parts requisitions" chaos="No" advanced="Yes" conquest="Yes" />
              <CompareRow feature="Pilot continuity" chaos="Supported" advanced="Supported" conquest="Supported" />
              <CompareRow feature="Objective control" chaos="Optional/simple" advanced="Objective percentage control" conquest="Core focus" />
              <CompareRow feature="Campaign phases" chaos="No phase bar" advanced="Main → Battle → Repairs & Reqs" conquest="Main → Battle → Repairs & Reqs" />
              <CompareRow feature="Best when" chaos="You want speed" advanced="You want logistics" conquest="You want strategy and territory" />
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Recommendation title="Choose Chaos if…" items={["You want a quick campaign night-to-night.", "You do not want to manage part availability.", "You prefer broad Warchest costs over detailed repair bills."]} />
        <Recommendation title="Choose Advanced if…" items={["You want damage, repair, pilots, and money to matter.", "You like attrition and logistics decisions.", "You want the most detailed unit-management experience."]} />
        <Recommendation title="Choose Conquest if…" items={["You want battlefield outcomes to shape territorial control.", "You want campaign geography/objectives to matter more.", "You still want the repair and requisition layer."]} />
      </section>
    </GuideShell>
  );
}

export function ChaosGuidePage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <CampaignGuideShell
      title="Chaos Campaign Guide"
      subtitle="Chaos campaigns are meant to move quickly. They use Warchest points instead of full C-bill accounting and keep repairs abstracted."
      onBack={() => onNavigate("guide")}
      sections={[
        {
          title: "Getting started",
          body: "Create a campaign, invite players, assign campaign copies of forces, and start logging battles. Chaos is the lowest-friction option for groups that want continuity without detailed logistics.",
        },
        {
          title: "How to win",
          body: "Chaos campaigns can use domination, capitulation, turn limits, and objective-control victory conditions depending on setup. The dashboard summarizes the active conditions.",
        },
        {
          title: "Turns and flow",
          body: "Chaos does not currently use the Main / Battle / Repairs & Reqs phase bar. Players mainly log battles, spend Warchest points, and keep their forces moving.",
        },
        {
          title: "Repairs and rearming",
          body: "Repairs are paid from Warchest points in the Mechbay. Rearming is tracked from ammo spent in battle logs and converted into a WP rearm cost.",
        },
        {
          title: "Salvage and selling",
          body: "Chaos salvage refunds half the unit tonnage in WP. Selling an undamaged unit grants its full tonnage in WP. Damaged or destroyed units cannot be sold.",
        },
      ]}
    />
  );
}

export function AdvancedGuidePage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <CampaignGuideShell
      title="Advanced Campaign Guide"
      subtitle="Advanced campaigns are the detailed logistics mode: C-bills, pilots, repair queues, requisitions, and technician time."
      onBack={() => onNavigate("guide")}
      sections={[
        {
          title: "Getting started",
          body: "Players create forces, join a campaign, and commit campaign-copy forces. The campaign tracks each player’s roster, pilots, resources, turns, and current unit condition.",
        },
        {
          title: "How to win",
          body: "Advanced campaigns can use resource capitulation, BV capitulation, domination, turn limits, and objective control. Resource and BV trackers are based on current live campaign state.",
        },
        {
          title: "Turn phases",
          body: "The expected flow is Main, Battle, then Repairs & Reqs. Main is for setup and admin. Battle is for playing and submitting matching logs. Repairs & Reqs is where pending technical work is resolved between turns.",
        },
        {
          title: "Battle logs",
          body: "Both players submit battle logs. Once matching logs become official, the system applies damage, pilot outcomes, BV changes, objective control, ammo expenditure, and repair-order generation.",
        },
        {
          title: "Mechbay and repair queue",
          body: "The Mechbay lists units needing work and the repair queue. Repair orders store cost, time, complexity, availability, and whether a part can be repaired or must be replaced.",
        },
        {
          title: "Requisitions",
          body: "Parts that are not repairable and are not in stock enter the requisition flow. Requisition attempts per turn are controlled by the global admin setting.",
        },
      ]}
    />
  );
}

export function ConquestGuidePage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <CampaignGuideShell
      title="Conquest Campaign Guide"
      subtitle="Conquest campaigns emphasize control, objectives, and territorial pressure while keeping the detailed repair framework available."
      onBack={() => onNavigate("guide")}
      sections={[
        {
          title: "Getting started",
          body: "Set campaign objectives, invite players, and establish the starting control state. Conquest campaigns are best when the group wants the map or objective layer to drive battle choices.",
        },
        {
          title: "How to win",
          body: "Conquest victories should usually focus on domination, key objectives, map control, or capitulation. Battle outcomes affect objective control through capped two-player transfers.",
        },
        {
          title: "Turns and phases",
          body: "Conquest uses the Main, Battle, and Repairs & Reqs phase concept. The phase bar is informational for now and does not yet enforce actions.",
        },
        {
          title: "Objective control",
          body: "Only the two players in a battle should gain or lose control from that battle. Uninvolved players retain their existing control share.",
        },
        {
          title: "Repairs and requisitions",
          body: "Conquest uses the same detailed repair and requisition framework as Advanced campaigns, including technician capacity and estimated repair time.",
        },
      ]}
    />
  );
}

function GuideShell({ eyebrow, title, subtitle, onBack, children }: { eyebrow: string; title: string; subtitle: string; onBack: () => void; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm font-black text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
      >
        <ArrowLeft size={16} /> Back to Guide
      </button>
      <PageTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
      {children}
    </section>
  );
}

function CampaignGuideShell({ title, subtitle, onBack, sections }: { title: string; subtitle: string; onBack: () => void; sections: Array<{ title: string; body: string }> }) {
  return (
    <GuideShell eyebrow="Campaign guide" title={title} subtitle={subtitle} onBack={onBack}>
      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-lime-300">
            <ClipboardList size={16} /> Sections
          </div>
          <ol className="mt-4 space-y-2 text-sm text-zinc-300">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a className="block rounded-xl px-3 py-2 hover:bg-zinc-900 hover:text-lime-200" href={`#${slug(section.title)}`}>
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>
        <div className="space-y-4">
          {sections.map((section) => (
            <article key={section.title} id={slug(section.title)} className="scroll-mt-24 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
              <h2 className="text-xl font-black text-zinc-50">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </GuideShell>
  );
}

function CampaignTypeSummary({ title, icon, bestFor, notes }: { title: string; icon: ReactNode; bestFor: string; notes: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex items-center gap-3 text-lime-300">
        {icon}
        <h2 className="text-xl font-black text-zinc-50">{title}</h2>
      </div>
      <div className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Best for</div>
      <p className="mt-1 text-sm font-semibold text-zinc-100">{bestFor}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{notes}</p>
    </div>
  );
}

function CompareRow({ feature, chaos, advanced, conquest }: { feature: string; chaos: string; advanced: string; conquest: string }) {
  return (
    <tr>
      <td className="px-4 py-3 font-black text-zinc-100">{feature}</td>
      <td className="px-4 py-3 text-zinc-300">{chaos}</td>
      <td className="px-4 py-3 text-zinc-300">{advanced}</td>
      <td className="px-4 py-3 text-zinc-300">{conquest}</td>
    </tr>
  );
}

function Recommendation({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <h3 className="flex items-center gap-2 text-lg font-black text-zinc-50"><Shield size={18} className="text-lime-300" /> {title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-lime-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
