import React from "react";
import type { Campaign, User } from "../types/app";
import PageTitle from "../components/PageTitle";

export default function CampaignsPage({
  authUser,
  campaigns,
  loading,
  error,
}: {
  authUser: User | null;
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}) {
  if (!authUser) {
    return (
      <section className="space-y-5">
        <PageTitle eyebrow="Campaigns" title="Sign in required" description="Please sign in to view your active campaigns and invitations." />
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400">Sign in on the Account page to continue.</div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <PageTitle eyebrow="Campaigns" title="My Campaigns" description="View the campaigns you are participating in and track current progress." />
      {loading && <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">Loading campaigns...</div>}
      {error && <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-6 text-red-200">{error}</div>}
      {!loading && !error && (
        <div className="grid gap-4">
          {campaigns.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">You have no active campaigns yet.</div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Campaign</div>
                    <div className="mt-2 text-xl font-black text-zinc-50">{campaign.name}</div>
                    <div className="mt-1 text-sm text-zinc-400">{campaign.description ?? "No description provided."}</div>
                  </div>
                  <div className="rounded-3xl border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-200">{campaign.status ?? "Setup"}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
