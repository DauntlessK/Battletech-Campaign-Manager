import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Trash2, RefreshCw, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import PageTitle from "../components/PageTitle";
import type { Battle, Campaign, Force } from "../types/app";

type AdminTab = "campaigns" | "battles" | "forces" | "users";

type AdminUserSummary = {
  id: string;
  displayName: string;
  email: string;
  friendCode: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type AdminOverview = {
  users: AdminUserSummary[];
  campaigns: Campaign[];
  battles: Battle[];
  forces: Force[];
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function getCampaignName(campaigns: Campaign[], campaignId?: string) {
  return campaigns.find((campaign) => campaign.id === campaignId)?.name ?? "—";
}

export default function AdminPage({
  onBack,
  onDataChanged,
}: {
  onBack: () => void;
  onDataChanged?: () => void;
}) {
  const [tab, setTab] = useState<AdminTab>("campaigns");
  const [data, setData] = useState<AdminOverview>({
    users: [],
    campaigns: [],
    battles: [],
    forces: [],
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/overview");
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Unable to load dev admin data.");
      }
      setData(result as AdminOverview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dev admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const campaignBattleCounts = useMemo(() => {
    const counts = new Map<string, number>();
    data.battles.forEach((battle) => {
      counts.set(battle.campaignId, (counts.get(battle.campaignId) ?? 0) + 1);
    });
    return counts;
  }, [data.battles]);

  const runAction = async (
    key: string,
    confirmMessage: string,
    request: () => Promise<Response>,
    successMessage: string,
  ) => {
    if (!window.confirm(confirmMessage)) return;
    setActionLoading(key);
    setError(null);
    setSuccess(null);
    try {
      const response = await request();
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Dev admin action failed.");
      }
      setSuccess(successMessage);
      await loadAdminData();
      onDataChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dev admin action failed.");
    } finally {
      setActionLoading(null);
    }
  };


  const auditCampaign = async (campaign: Campaign) => {
    setActionLoading(`audit-${campaign.id}`);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/admin/campaigns/${campaign.id}/audit`);
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Unable to audit campaign.");
      }
      const counts = result?.counts ?? {};
      const summary = `${counts.forces ?? 0} forces, ${counts.units ?? 0} units, ${counts.pilots ?? 0} pilots, ${counts.damageRecords ?? 0} damage records, ${counts.repairOrders ?? 0} repair orders, ${counts.resourceAccounts ?? 0} resource accounts.`;
      if (result?.ok) {
        setSuccess(`Audit passed for ${campaign.name}: ${summary}`);
      } else {
        setError(`Audit found ${result?.issues?.length ?? 0} issue(s) in ${campaign.name}: ${(result?.issues ?? []).join(" ")}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to audit campaign.");
    } finally {
      setActionLoading(null);
    }
  };

  const resetUserPassword = async (user: AdminUserSummary) => {
    const password = window.prompt(`Enter a new password for ${user.displayName}:`);
    if (password === null) return;
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    await runAction(
      `reset-password-${user.id}`,
      `Reset password for ${user.displayName}? This will sign out existing sessions for that user.`,
      () =>
        fetch(`/api/admin/users/${user.id}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }),
      `Password reset for ${user.displayName}.`,
    );
  };

  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Development tools"
        title="Dev Admin"
        description="Rebuild, audit, or delete local development campaign data. These controls are intentionally only exposed by the dev flag in App.tsx."
        actions={
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-100 transition hover:bg-zinc-800"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        }
      />

      <div className="rounded-3xl border border-amber-400/30 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100">
        These tools directly mutate the local dev store. Reset now rebuilds campaign forces from their original rosters and clears battles, damage, repair orders, pilot changes, resources, notifications, and turn/control progress. Audit checks the campaign for broken references before or after testing.
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {([
              ["campaigns", `Campaigns (${data.campaigns.length})`],
              ["battles", `Battles (${data.battles.length})`],
              ["forces", `Forces (${data.forces.length})`],
              ["users", `Users (${data.users.length})`],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  tab === key
                    ? "bg-lime-400 text-zinc-950"
                    : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void loadAdminData()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-bold text-zinc-100 hover:bg-zinc-800"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 text-zinc-400">
          Loading dev admin data...
        </div>
      )}
      {error && (
        <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-5 text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-3xl border border-lime-400/30 bg-lime-950/20 p-5 text-lime-200">
          {success}
        </div>
      )}

      {!loading && tab === "campaigns" && (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-zinc-950/80 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Era</th>
                  <th className="px-4 py-3">Turn</th>
                  <th className="px-4 py-3">Battles</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.campaigns.map((campaign) => (
                  <tr key={campaign.id} className="align-top text-zinc-200">
                    <td className="px-4 py-3">
                      <div className="font-bold text-zinc-50">{campaign.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">{campaign.id}</div>
                    </td>
                    <td className="px-4 py-3">{campaign.settings?.type ?? "—"}</td>
                    <td className="px-4 py-3">{campaign.status}</td>
                    <td className="px-4 py-3">{campaign.settings?.era ?? "—"}</td>
                    <td className="px-4 py-3">{campaign.turnNumber ?? 1}</td>
                    <td className="px-4 py-3">{campaignBattleCounts.get(campaign.id) ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={actionLoading === `audit-${campaign.id}`}
                          onClick={() => void auditCampaign(campaign)}
                          className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-950/30 px-3 py-2 text-xs font-bold text-sky-100 hover:bg-sky-900/40 disabled:opacity-50"
                        >
                          <ShieldCheck size={14} /> Audit
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === `reset-${campaign.id}`}
                          onClick={() =>
                            void runAction(
                              `reset-${campaign.id}`,
                              `Reset campaign \"${campaign.name}\"? This completely rebuilds its campaign forces and clears battles, damage, repair orders, pilot changes, resources, notifications, and turn/control progress.`,
                              () => fetch(`/api/admin/campaigns/${campaign.id}/reset`, { method: "POST" }),
                              `Reset ${campaign.name}.`,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-950/30 px-3 py-2 text-xs font-bold text-amber-100 hover:bg-amber-900/40 disabled:opacity-50"
                        >
                          <RotateCcw size={14} /> Reset
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === `delete-campaign-${campaign.id}`}
                          onClick={() =>
                            void runAction(
                              `delete-campaign-${campaign.id}`,
                              `Delete campaign \"${campaign.name}\" and all associated battles/campaign copies?`,
                              () => fetch(`/api/admin/campaigns/${campaign.id}`, { method: "DELETE" }),
                              `Deleted ${campaign.name}.`,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs font-bold text-red-100 hover:bg-red-900/40 disabled:opacity-50"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.campaigns.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && tab === "battles" && (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-zinc-950/80 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Battle</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Objective</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.battles.map((battle) => (
                  <tr key={battle.id} className="align-top text-zinc-200">
                    <td className="px-4 py-3">
                      <div className="font-bold text-zinc-50">#{battle.turnNumber ?? "—"}</div>
                      <div className="mt-1 text-xs text-zinc-500">{battle.id}</div>
                    </td>
                    <td className="px-4 py-3">{getCampaignName(data.campaigns, battle.campaignId)}</td>
                    <td className="px-4 py-3">{formatDate(battle.date)}</td>
                    <td className="px-4 py-3">{battle.objectiveName || "—"}</td>
                    <td className="px-4 py-3">{battle.status}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={actionLoading === `delete-battle-${battle.id}`}
                        onClick={() =>
                          void runAction(
                            `delete-battle-${battle.id}`,
                            `Delete this battle log? This does not roll back any already-applied campaign effects.`,
                            () => fetch(`/api/admin/battles/${battle.id}`, { method: "DELETE" }),
                            "Deleted battle.",
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs font-bold text-red-100 hover:bg-red-900/40 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {data.battles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                      No battles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && tab === "forces" && (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-zinc-950/80 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Force</th>
                  <th className="px-4 py-3">Origin</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">BV</th>
                  <th className="px-4 py-3">Units</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.forces.map((force) => (
                  <tr key={force.id} className="align-top text-zinc-200">
                    <td className="px-4 py-3">
                      <div className="font-bold text-zinc-50">{force.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">{force.id}</div>
                    </td>
                    <td className="px-4 py-3">{force.origin ?? "—"}</td>
                    <td className="px-4 py-3">{getCampaignName(data.campaigns, force.campaignId)}</td>
                    <td className="px-4 py-3">{force.totalBV?.toLocaleString() ?? "—"}</td>
                    <td className="px-4 py-3">{force.forceUnits?.length ?? force.unitIds?.length ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={actionLoading === `delete-force-${force.id}`}
                        onClick={() =>
                          void runAction(
                            `delete-force-${force.id}`,
                            `Delete force \"${force.name}\"?`,
                            () => fetch(`/api/admin/forces/${force.id}`, { method: "DELETE" }),
                            `Deleted ${force.name}.`,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs font-bold text-red-100 hover:bg-red-900/40 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {data.forces.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                      No forces found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && tab === "users" && (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-zinc-950/80 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Friend Code</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.users.map((user) => (
                  <tr key={user.id} className="align-top text-zinc-200">
                    <td className="px-4 py-3">
                      <div className="font-bold text-zinc-50">{user.displayName}</div>
                      <div className="mt-1 text-xs text-zinc-500">{user.id}</div>
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-lime-200">{user.friendCode}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">{user.status}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={actionLoading === `reset-password-${user.id}`}
                        onClick={() => void resetUserPassword(user)}
                        className="inline-flex items-center gap-2 rounded-xl border border-lime-400/40 bg-lime-950/20 px-3 py-2 text-xs font-bold text-lime-100 hover:bg-lime-900/30 disabled:opacity-50"
                      >
                        <KeyRound size={14} /> Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </section>
  );
}
