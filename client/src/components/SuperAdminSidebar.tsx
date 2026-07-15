// src/components/AdminSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import api from "../api/axios";

const adminSidebarContent = {
  brand: {
    logoLetter: "L",
    name: "Ledger",
    role: "SUPER ADMIN",
  },
  sectionLabel: "OWNER CONSOLE",
  navItems: [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" as const },
    { label: "Role Management", href: "/roles", icon: "role" as const },
    { label: "System Settings", href: "/settings", icon: "settings" as const },
    { label: "Security Center", href: "/security", icon: "security" as const },
    { label: "Audit Logs", href: "/audit-logs", icon: "audit" as const },
    { label: "Data Management", href: "/data", icon: "data" as const },
    { label: "Platform Analytics", href: "/analytics", icon: "analytics" as const },
    { label: "Emergency Actions", href: "/emergency", icon: "emergency" as const },
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
    case "role":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={2} />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m3.08-3.08l4.24-4.24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "security":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M12 2L2 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth={2} />
        </svg>
      );
    case "audit":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "data":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M4 7h16M6 7v12a1 1 0 001 1h10a1 1 0 001-1V7M9 11h6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "analytics":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 15l5-5 4 4 8-8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "emergency":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M12 2L2 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth={2} />
          <path d="M12 8v4m0 4v1" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
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

export default function SuperAdminSidebar() {  // ← correct
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
      <div className="h-1 w-full bg-gradient-to-r from-red-600 to-orange-500" />

      {/* Brand with admin role */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
            <span className="font-serif text-sm font-bold text-white">
              {adminSidebarContent.brand.logoLetter}
            </span>
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white block">
              {adminSidebarContent.brand.name}
            </span>
            <span className="text-xs font-semibold text-red-400">
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
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600">
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