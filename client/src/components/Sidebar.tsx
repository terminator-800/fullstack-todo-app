// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";

// All page text/icons live here — edit this object to change copy or add nav items
const sidebarContent = {
  brand: {
    logoLetter: "L",
    name: "Ledger",
  },
  sectionLabel: "WORKSPACE",
  navItems: [
    { label: "My Todos", href: "/my-todo", icon: "list" as const, count: 0 },
    { label: "Archive", href: "/archive", icon: "archive" as const, count: 0 },
    { label: "Trash", href: "/trash", icon: "trash" as const, count: 0 },
    { label: "Analytics", href: "/analytics", icon: "chart" as const, count: null },
    { label: "Profile", href: "/profile", icon: "profile" as const, count: null },
  ],
  logoutButton: "Log out",
  sessionLabel: "session",
} as const;

// Simple inline icon set so we don't need to install lucide-react etc.
// Each icon is a small stroke-based SVG matching the ~18px sizing in the design.
function Icon({ name }: { name: (typeof sidebarContent.navItems)[number]["icon"] }) {
  const common = "h-[18px] w-[18px]";

  switch (name) {
    case "list":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "archive":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M4 7h16M6 7v12a1 1 0 001 1h10a1 1 0 001-1V7M9 11h6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 4h18v3H3z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
        </svg>
      );
    case "trash":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
          <path d="M12 3v9l6 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={2} />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
  }
}

export default function Sidebar() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = () => {
    logout();
    // Navigation after logout is handled by the parent route guard
    // redirecting unauthenticated users back to /login.
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900">
      {/* Top accent bar matches the emerald→amber gradient used on auth pages */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-600 to-amber-500" />

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700">
          <span className="font-serif text-sm font-bold text-white">
            {sidebarContent.brand.logoLetter}
          </span>
        </div>
        <span className="font-serif text-lg font-bold text-white">
          {sidebarContent.brand.name}
        </span>
      </div>

      <div className="border-t border-slate-800" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-500">
          {sidebarContent.sectionLabel}
        </p>

        <ul className="space-y-1">
          {sidebarContent.navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                  ].join(" ")
                }
              >
                <span className="flex items-center gap-2.5">
                  <Icon name={item.icon} />
                  {item.label}
                </span>
                {item.count !== null && (
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                    {item.count}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer: user card + logout */}
      <div className="border-t border-slate-800 px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700">
            <span className="text-sm font-semibold text-white">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name ?? "Guest"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.email ?? ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-slate-700 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 active:bg-slate-700"
        >
          {sidebarContent.logoutButton}
        </button>
      </div>
    </aside>
  );
}