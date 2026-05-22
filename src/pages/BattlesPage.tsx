import type { Battle, Campaign, User } from "../types/app";
import PageTitle from "../components/PageTitle";

export default function BattlesPage({
  authUser,
  campaigns,
  battles,
  loading,
  error,
  selectedCampaignId,
  onSelectCampaign,
  battleFormDate,
  onBattleFormDateChange,
  battleFormLocation,
  onBattleFormLocationChange,
  battleFormSummary,
  onBattleFormSummaryChange,
  battleFormLoading,
  battleFormError,
  onCreateBattle,
  onConfirmBattle,
  onDeleteBattle,
}: {
  authUser: User | null;
  campaigns: Campaign[];
  battles: Battle[];
  loading: boolean;
  error: string | null;
  selectedCampaignId: string;
  onSelectCampaign: (campaignId: string) => void;
  battleFormDate: string;
  onBattleFormDateChange: (value: string) => void;
  battleFormLocation: string;
  onBattleFormLocationChange: (value: string) => void;
  battleFormSummary: string;
  onBattleFormSummaryChange: (value: string) => void;
  battleFormLoading: boolean;
  battleFormError: string | null;
  onCreateBattle: () => Promise<void>;
  onConfirmBattle: (battleId: string) => Promise<void>;
  onDeleteBattle: (battleId: string) => Promise<void>;
}) {
  if (!authUser) {
    return (
      <section className="space-y-5">
        <PageTitle eyebrow="Battles" title="Sign in required" description="Please sign in to log or review battles." />
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400">Sign in on the Account page to continue.</div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <PageTitle eyebrow="Battles" title="Battle Log" description="Create and review battles for your campaigns." />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Campaign</div>
                <select
                  value={selectedCampaignId}
                  onChange={(event) => onSelectCampaign(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-lime-400"
                >
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">New Battle</div>
                <div className="text-sm text-zinc-400">Record a battle result for the selected campaign.</div>
              </div>
              <button
                onClick={onCreateBattle}
                disabled={battleFormLoading}
                className="rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Create Battle
              </button>
            </div>

            {battleFormError && <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">{battleFormError}</div>}

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Date</span>
                <input
                  type="date"
                  value={battleFormDate}
                  onChange={(event) => onBattleFormDateChange(event.target.value)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-lime-400"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span>Location</span>
                <input
                  type="text"
                  value={battleFormLocation}
                  onChange={(event) => onBattleFormLocationChange(event.target.value)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-lime-400"
                  placeholder="Battlefield or sector"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span>Summary</span>
                <textarea
                  value={battleFormSummary}
                  onChange={(event) => onBattleFormSummaryChange(event.target.value)}
                  className="min-h-[120px] rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-lime-400"
                  placeholder="Add a short summary of the battle outcome"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Battle History</div>
                <div className="text-sm text-zinc-400">Review past battles for the selected campaign.</div>
              </div>
            </div>

            {loading && <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 text-zinc-400">Loading battles...</div>}
            {error && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">{error}</div>}
            {!loading && !error && battles.length === 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">No battles recorded yet for this campaign.</div>
            )}
            {!loading && !error && battles.length > 0 && (
              <div className="space-y-3">
                {battles.map((battle) => (
                  <div key={battle.id} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm font-bold text-zinc-100">{new Date(battle.date).toLocaleDateString()}</div>
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">{battle.status}</div>
                        <div className="mt-2 text-sm text-zinc-300">{battle.location || "No location specified"}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {battle.status !== "Finalized" && (
                          <button
                            type="button"
                            onClick={() => onConfirmBattle(battle.id)}
                            className="rounded-2xl border border-lime-400/40 bg-lime-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-lime-200 transition hover:bg-lime-400/20"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteBattle(battle.id)}
                          className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-200 transition hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {battle.summary && <p className="mt-3 text-sm leading-6 text-zinc-400">{battle.summary}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
