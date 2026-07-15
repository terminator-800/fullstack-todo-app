// src/components/AdminSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import api from "../api/axios";

const adminSidebarContent = {
  brand: {
    logoLetter: "L",
    name: "Ledger",
    role: "ADMIN CONSOLE",
  },
  sectionLabel: "MODERATION",
  navItems: [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" as const },
    { label: "Users", href: "/users", icon: "users" as const },
    { label: "Todo Moderation", href: "/todo-moderation", icon: "todo" as const },
    { label: "Reports", href: "/reports", icon: "reports" as const },
    { label: "Audit & Monitoring", href: "/audit-monitoring", icon: "audit" as const },
    { label: "Profile", href: "/profile", icon: "profile" as const },
  ],
  logoutButton: "Log out",
} as const;

function Icon({ name }: { name: (typeof adminSidebarContent.navItems)[number]["icon"] }) {
  const common = "h-[18px] w-[18px]";

  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M4 12h7V5H4v7zm0 7h7v-7H4v7zm9-7h7V5h-7v7zm0 7h7v-7h-7v7z" stroke="currentColor" strokeWidth={2} />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <path d="M21 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "todo":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "reports":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 15l5-5 4 4 8-8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "audit":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

export default function AdminSidebar() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }

    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-indigo-500" />

      {/* Brand */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600">
            <span className="font-serif text-sm font-bold text-white">
              {adminSidebarContent.brand.logoLetter}
            </span>
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white block">
              {adminSidebarContent.brand.name}
            </span>
            <span className="text-xs font-semibold text-violet-400">
              {adminSidebarContent.brand.role}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-500">
          {adminSidebarContent.sectionLabel}
        </p>

        <ul className="space-y-1">
          {adminSidebarContent.navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                  ].join(" ")
                }
              >
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer: user card + logout */}
      <div className="border-t border-slate-800 px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600">
            <span className="text-sm font-semibold text-white">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name ?? "Admin"}
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
          {adminSidebarContent.logoutButton}
        </button>
      </div>
    </aside>
  );
}