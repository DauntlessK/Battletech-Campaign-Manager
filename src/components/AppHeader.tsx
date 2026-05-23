import React from "react";
import { X, Menu, Bell, Shield } from "lucide-react";
import type { PageKey, User } from "../types/app";
import { navItems } from "../constants/appOptions";

export default function Header({
  activePage,
  onNavigate,
  mobileMenuOpen,
  setMobileMenuOpen,
  authUser,
  unreadNotifications,
  onOpenNotifications,
  onLogout,
}: {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  authUser: User | null;
  unreadNotifications: number;
  onOpenNotifications: () => void;
  onLogout: () => void;
}) {
  const hasUnreadNotifications = unreadNotifications > 0;

  return (
    <header className="sticky top-0 z-40 border-b border-lime-400/10 bg-zinc-950/90 backdrop-blur">
      <div className="flex h-16 w-full max-w-none items-center justify-between gap-3 px-3 sm:px-5 2xl:px-8">
        <button onClick={() => onNavigate("landing")} className="flex min-w-0 items-center gap-3 text-left">
          <div className="hidden min-w-0 sm:block">
            <img src="src/assets/logo_white.png" alt="Logo" className="h-10 w-auto" />
          </div>
          <div className="min-w-0 sm:hidden">
            <div className="truncate text-base font-bold leading-none text-zinc-50">Daunt's BCM</div>
          </div>
        </button>

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1 xl:flex">
          {navItems
            .filter((item) => item.key !== "myAccount" || authUser)
            .map((item) => (
              <NavButton key={item.key} active={activePage === item.key} onClick={() => onNavigate(item.key)} label={item.label} icon={item.icon} />
            ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {authUser ? (
            <>
              <button
                onClick={onOpenNotifications}
                aria-label={hasUnreadNotifications ? `Open account, ${unreadNotifications} unread notifications` : "Open account, no unread notifications"}
                title="Open account"
                className="relative rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 hover:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <div className="flex items-center gap-2">
                  <Bell className={`${hasUnreadNotifications ? "text-red-400" : "text-zinc-500"} h-4 w-4`} />
                  <span>{hasUnreadNotifications ? `${unreadNotifications} unread` : "No unread"}</span>
                </div>
                {hasUnreadNotifications && (
                  <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-black text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
                Signed in as <span className="font-semibold text-lime-300">{authUser.displayName}</span>
              </div>
              <button
                onClick={onLogout}
                className="rounded-2xl border border-lime-400 bg-lime-400 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate("myAccount")}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-lime-400 hover:text-lime-300"
            >
              Sign in
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 xl:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function NavButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm font-medium transition 2xl:px-4 ${
        active ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
      }`}
    >
      <span className="hidden 2xl:inline-flex">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function MobileMenu({ activePage, authUser, onNavigate, onClose }: { activePage: PageKey; authUser: User | null; onNavigate: (page: PageKey) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm xl:hidden">
      <div className="absolute right-3 top-3 w-[min(92vw,360px)] rounded-3xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl">
        <div className="mb-2 flex items-center justify-between px-2 py-2">
          <div className="font-semibold text-zinc-100">Menu</div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-1">
          {navItems
            .filter((item) => item.key !== "myAccount" || authUser)
            .map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${activePage === item.key ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:bg-zinc-900"}`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
