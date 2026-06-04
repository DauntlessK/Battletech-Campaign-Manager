import React, { useEffect, useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import type {
  AuthMode,
  FriendRequestSummary,
  FriendSummary,
  NotificationItem,
  User,
} from "../types/app";
import PageTitle from "../components/PageTitle";

type FriendTab = "friends" | "pending";

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
  notifications,
  friends,
  friendRequests,
  friendsLoading,
  friendActionError,
  onSendFriendRequest,
  onRespondToFriendRequest,
  onClearNotifications,
  onOpenCampaignInvitations,
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
  notifications: NotificationItem[];
  friends: FriendSummary[];
  friendRequests: FriendRequestSummary[];
  friendsLoading: boolean;
  friendActionError: string | null;
  onSendFriendRequest: (friendCode: string) => Promise<void>;
  onRespondToFriendRequest: (
    requestId: string,
    accept: boolean,
  ) => Promise<void>;
  onClearNotifications: () => Promise<void>;
  onOpenCampaignInvitations: () => void;
  onSubmit: () => void;
  onLogout: () => void;
  scrollToNotificationsSignal?: number;
}) {
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const [friendTab, setFriendTab] = useState<FriendTab>("friends");
  const [addingFriend, setAddingFriend] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [friendSubmitting, setFriendSubmitting] = useState(false);
  const [respondingRequestId, setRespondingRequestId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (scrollToNotificationsSignal && notificationsRef.current) {
      notificationsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      notificationsRef.current.focus();
    }
  }, [scrollToNotificationsSignal]);

  const incomingRequests = friendRequests.filter(
    (request) => request.recipientId === user?.id,
  );
  const outgoingRequests = friendRequests.filter(
    (request) => request.requesterId === user?.id,
  );
  const unreadCount = notifications.filter((note) => !note.read).length;

  const notificationSummary = (note: NotificationItem) => {
    const payload = note.payload ?? {};
    switch (note.type) {
      case "friend.request":
        return {
          title: "Friend request",
          body: `${payload.requesterName ?? "Another commander"} sent you a friend request.`,
          action: null as string | null,
        };
      case "friend.accepted":
        return {
          title: "Friend request accepted",
          body: `${payload.friendName ?? "A commander"} accepted your friend request.`,
          action: null as string | null,
        };
      case "friend.declined":
        return {
          title: "Friend request declined",
          body: `${payload.friendName ?? "A commander"} declined your friend request.`,
          action: null as string | null,
        };
      case "campaign.invite":
        return {
          title: "Campaign invitation",
          body: `${payload.invitedByName ?? "A campaign owner"} invited you to ${payload.campaignName ?? "a campaign"}.`,
          action: "Review on Campaigns page",
        };
      case "campaign.uninvite":
        return {
          title: "Campaign invite removed",
          body: `Your invitation to ${payload.campaignName ?? "a campaign"} was removed.`,
          action: null as string | null,
        };
      default:
        return {
          title: note.type.replace(/[._]/g, " "),
          body: "Notification received.",
          action: null as string | null,
        };
    }
  };

  const submitFriendRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setFriendSubmitting(true);
    try {
      await onSendFriendRequest(friendCode);
      setFriendCode("");
      setAddingFriend(false);
      setFriendTab("pending");
    } catch {
      // Error text is owned by App state and shown in the friends panel.
    } finally {
      setFriendSubmitting(false);
    }
  };

  const respond = async (requestId: string, accept: boolean) => {
    setRespondingRequestId(requestId);
    try {
      await onRespondToFriendRequest(requestId, accept);
    } catch {
      // Error text is owned by App state and shown in the friends panel.
    } finally {
      setRespondingRequestId(null);
    }
  };

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Account"
        title="My Account"
        description="Create a BattleTech Campaign Manager account or sign in to access campaigns, friends, invites, and notifications."
      />

      {loading && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">
          Checking session...
        </div>
      )}

      {user ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="text-sm text-zinc-400">Signed in as</div>
              <div className="text-xl font-bold text-zinc-50">
                {user.displayName}
              </div>
              <div className="text-sm text-zinc-400">{user.email}</div>
            </div>

            <div
              ref={notificationsRef}
              tabIndex={-1}
              className="grid gap-3 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-zinc-400">Friend code</div>
                  <div className="font-semibold text-zinc-100">
                    {user.friendCode}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Role</div>
                  <div className="font-semibold capitalize text-zinc-100">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                      Notifications
                    </div>
                    <div className="text-sm text-zinc-400">
                      {notifications.length} recent notification
                      {notifications.length === 1 ? "" : "s"}
                      {unreadCount ? ` • ${unreadCount} new` : ""}
                    </div>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearNotifications}
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-lime-400/40 hover:text-lime-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((note) => {
                      const summary = notificationSummary(note);
                      const clickable = note.type === "campaign.invite";
                      return (
                        <button
                          key={note.id}
                          type="button"
                          onClick={
                            clickable ? onOpenCampaignInvitations : undefined
                          }
                          className={`w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left ${clickable ? "transition hover:border-lime-400/40 hover:bg-zinc-900" : "cursor-default"}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-semibold text-zinc-100">
                                {summary.title}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {new Date(note.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${note.read ? "bg-zinc-800 text-zinc-400" : "bg-lime-400/10 text-lime-200"}`}
                            >
                              {note.read ? "Read" : "New"}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-zinc-400">
                            {summary.body}
                          </p>
                          {summary.action && (
                            <div className="mt-2 text-xs font-semibold text-lime-300">
                              {summary.action}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                  Friends
                </div>
                <h2 className="mt-2 text-2xl font-black text-zinc-50">
                  Command Network
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Add friends by friend code, then invite them to campaigns from
                  the campaign dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddingFriend(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300"
              >
                <Plus size={16} /> Add Friend
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-1">
              <button
                type="button"
                onClick={() => setFriendTab("friends")}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${friendTab === "friends" ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"}`}
              >
                Active Friends ({friends.length})
              </button>
              <button
                type="button"
                onClick={() => setFriendTab("pending")}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${friendTab === "pending" ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"}`}
              >
                Pending ({friendRequests.length})
              </button>
            </div>

            {friendActionError && (
              <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
                {friendActionError}
              </div>
            )}

            <div className="mt-4 space-y-3">
              {friendsLoading ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-400">
                  Loading friends...
                </div>
              ) : friendTab === "friends" ? (
                friends.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/50 p-5 text-sm text-zinc-400">
                    No active friends yet. Use Add Friend and enter another
                    commander's friend code.
                  </div>
                ) : (
                  friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
                    >
                      <div className="font-black text-zinc-100">
                        {friend.displayName}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Friend code {friend.friendCode}
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Incoming
                    </div>
                    {incomingRequests.length === 0 ? (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-500">
                        No incoming friend requests.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {incomingRequests.map((request) => (
                          <div
                            key={request.id}
                            className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
                          >
                            <div className="font-black text-zinc-100">
                              {request.requester?.displayName ?? "Commander"}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Friend code {request.requester?.friendCode ?? "—"}
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                disabled={respondingRequestId === request.id}
                                onClick={() => respond(request.id, true)}
                                className="inline-flex items-center gap-1 rounded-xl bg-lime-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-lime-300 disabled:opacity-60"
                              >
                                <Check size={14} /> Accept
                              </button>
                              <button
                                type="button"
                                disabled={respondingRequestId === request.id}
                                onClick={() => respond(request.id, false)}
                                className="inline-flex items-center gap-1 rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400/70 disabled:opacity-60"
                              >
                                <X size={14} /> Deny
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Outgoing
                    </div>
                    {outgoingRequests.length === 0 ? (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-500">
                        No outgoing friend requests.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {outgoingRequests.map((request) => (
                          <div
                            key={request.id}
                            className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
                          >
                            <div className="font-black text-zinc-100">
                              {request.recipient?.displayName ?? "Commander"}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Friend code {request.recipient?.friendCode ?? "—"}
                            </div>
                            <span className="mt-3 inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                              Pending
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {addingFriend && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/80 px-4 backdrop-blur-sm">
              <form
                onSubmit={submitFriendRequest}
                className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
                      Add Friend
                    </div>
                    <h2 className="mt-2 text-2xl font-black text-zinc-50">
                      Enter friend code
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      The other commander will receive a request to accept or
                      deny.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddingFriend(false)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-red-400/50 hover:text-red-200"
                    aria-label="Close add friend modal"
                  >
                    <X size={18} />
                  </button>
                </div>
                <label className="space-y-2 text-sm font-semibold text-zinc-200">
                  Friend Code
                  <input
                    value={friendCode}
                    onChange={(event) =>
                      setFriendCode(event.target.value.toUpperCase())
                    }
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-lime-400/60"
                    placeholder="AB12CD34"
                    autoFocus
                  />
                </label>
                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setAddingFriend(false)}
                    className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!friendCode.trim() || friendSubmitting}
                    className="rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {friendSubmitting ? "Sending..." : "Add Friend"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 w-full xl:max-w-[50%] xl:mx-auto">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <p className="text-sm text-zinc-400">
              You can sign in or create a new account to access campaign invites
              and notifications.
            </p>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-2">
              <button
                type="button"
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"}`}
                onClick={() => onChangeMode("login")}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === "register" ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"}`}
                onClick={() => onChangeMode("register")}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4 text-sm text-lime-200">
              {success}
            </div>
          )}

          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <div className="grid gap-4 xl:grid-cols-2">
              {mode === "register" && (
                <label className="grid gap-2 text-sm">
                  <span>Commander name</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) =>
                      onDisplayNameChange(event.target.value)
                    }
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
                  placeholder={
                    mode === "login"
                      ? "Enter password"
                      : "Choose a secure password"
                  }
                />
              </label>
            </div>

            <div className="grid gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mode === "register" ? "Create account" : "Sign in"}
              </button>

              <button
                type="button"
                onClick={onToggleMode}
                className="text-sm font-semibold text-lime-300 underline-offset-4 transition hover:text-lime-100"
              >
                {mode === "login"
                  ? "Need a new account? Register instead"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
