import React, { useEffect, useRef } from "react";
import type { AuthMode, NotificationItem, PendingInvite, User } from "../types/app";
import PageTitle from "../components/PageTitle";

export default function AccountPage({
  user,
  mode,
  onToggleMode,
  onChangeMode,
  email,
  password,
  displayName,
  loading,
  error,
  success,
  onEmailChange,
  onPasswordChange,
  onDisplayNameChange,
  invites,
  notifications,
  onSubmit,
  onLogout,
  scrollToNotificationsSignal,
}: {
  user: User | null;
  mode: AuthMode;
  onToggleMode: () => void;
  onChangeMode: (mode: AuthMode) => void;
  email: string;
  password: string;
  displayName: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  invites: PendingInvite[];
  notifications: NotificationItem[];
  onSubmit: () => void;
  onLogout: () => void;
  scrollToNotificationsSignal?: number;
}) {
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollToNotificationsSignal && notificationsRef.current) {
      notificationsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      notificationsRef.current.focus();
    }
  }, [scrollToNotificationsSignal]);

  const unreadCount = notifications.filter((note) => !note.read).length;
  const hasUnreadNotifications = unreadCount > 0;

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Account"
        title="Commander login"
        description="Create a BattleTech Campaign Manager account or sign in to access campaigns, invites, and notifications."
        actions={user ? <button onClick={onLogout} className="rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300">Logout</button> : null}
      />

      {loading && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">Checking session...</div>
      )}

      {user ? (
        <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] w-full xl:max-w-[50%] xl:mx-auto">
          <div className="space-y-4 xl:col-span-2">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="text-sm text-zinc-400">Signed in as</div>
              <div className="text-xl font-bold text-zinc-50">{user.displayName}</div>
              <div className="text-sm text-zinc-400">{user.email}</div>
            </div>
          </div>
          <div ref={notificationsRef} tabIndex={-1} className="grid gap-3 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-sm text-zinc-400">Friend code</div>
            <div className="font-semibold text-zinc-100">{user.friendCode}</div>
            <div className="text-sm text-zinc-400">Role</div>
            <div className="font-semibold text-zinc-100 capitalize">{user.role}</div>
          </div>
          <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Pending invitations</div>
                  <div className="text-sm text-zinc-400">{invites.length} invite{invites.length === 1 ? "" : "s"}</div>
                </div>
              </div>
              {invites.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">No pending campaigns at the moment.</div>
              ) : (
                <div className="space-y-3">
                  {invites.map((invite) => (
                    <div key={invite.participant.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                      <div className="flex items-center justify-between gap-2 text-sm text-zinc-200">
                        <div>
                          <div className="font-semibold text-zinc-100">{invite.campaign.name}</div>
                          <div className="text-xs text-zinc-500">Invited by {invite.participant.invitedById}</div>
                        </div>
                        <span className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">{invite.participant.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Notifications</div>
                  <div className="text-sm text-zinc-400">{notifications.length} recent notification{notifications.length === 1 ? "" : "s"}</div>
                </div>
              </div>
              {notifications.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">No notifications yet.</div>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((note) => (
                    <div key={note.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-zinc-100">{note.type}</div>
                          <div className="text-xs text-zinc-500">{new Date(note.createdAt).toLocaleString()}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${note.read ? "bg-zinc-800 text-zinc-400" : "bg-lime-400/10 text-lime-200"}`}>
                          {note.read ? "Read" : "New"}
                        </span>
                      </div>
                      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm text-zinc-400">{JSON.stringify(note.payload, null, 2)}</pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-2 xl:col-span-2">
            <p className="text-sm text-zinc-400">Use the account page to manage your login and sign out when you're done with a session.</p>
            <p className="text-sm text-zinc-400">After signing in, return to Campaigns and Forces to use campaign-level features.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 w-full xl:max-w-[50%] xl:mx-auto">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <p className="text-sm text-zinc-400">You can sign in or create a new account to access campaign invites and notifications.</p>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-2">
              <button
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"}`}
                onClick={() => onChangeMode("login")}
              >
                Sign in
              </button>
              <button
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === "register" ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"}`}
                onClick={() => onChangeMode("register")}
              >
                Register
              </button>
            </div>
          </div>

          {error && <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">{error}</div>}
          {success && <div className="rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4 text-sm text-lime-200">{success}</div>}

          <div className="grid gap-4">
            <div className="grid gap-4 xl:grid-cols-2">
              {mode === "register" && (
                <label className="grid gap-2 text-sm">
                  <span>Commander name</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => onDisplayNameChange(event.target.value)}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-lime-400"
                    placeholder="Commander display name"
                  />
                </label>
              )}

              <label className="grid gap-2 text-sm">
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-lime-400"
                  placeholder="you@example.com"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-lime-400"
                  placeholder="Choose a secure password"
                />
              </label>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mode === "register" ? "Create account" : "Sign in"}
              </button>

              <button type="button" onClick={onToggleMode} className="text-sm font-semibold text-lime-300 underline-offset-4 transition hover:text-lime-100">
                {mode === "login" ? "Need a new account? Register instead" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
