import React from "react";
import type { Force, User } from "../types/app";
import PageTitle from "../components/PageTitle";

export default function ForcesPage({
  authUser,
  forces,
  loading,
  error,
}: {
  authUser: User | null;
  forces: Force[];
  loading: boolean;
  error: string | null;
}) {
  if (!authUser) {
    return (
      <section className="space-y-5">
        <PageTitle eyebrow="Forces" title="Sign in required" description="Please sign in to manage your forces and assign them to campaigns." />
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400">Sign in on the Account page to continue.</div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <PageTitle eyebrow="Forces" title="My Forces" description="View the forces you have created and assign them to campaigns once active." />
      {loading && <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">Loading forces...</div>}
      {error && <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-6 text-red-200">{error}</div>}
      {!loading && !error && (
        <div className="grid gap-4">
          {forces.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">No forces have been created yet.</div>
          ) : (
            forces.map((force) => (
              <div key={force.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Force</div>
                    <div className="mt-2 text-xl font-black text-zinc-50">{force.name}</div>
                    <div className="mt-1 text-sm text-zinc-400">{force.description ?? "No description provided."}</div>
                  </div>
                  <div className="rounded-3xl border border-zinc-700 bg-zinc-950/90 px-4 py-2 text-sm font-semibold text-zinc-200">{force.unitIds?.length ?? 0} units</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
