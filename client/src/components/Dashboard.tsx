// src/pages/Dashboard.tsx
const dashboardContent = {
  heading: {
    title: "Owner Dashboard",
    subtitle: "Full-platform snapshot: users, todos, staff, and system health.",
  },
  actions: {
    viewAnalytics: "View platform analytics",
  },
  stats: [
    { label: "TOTAL USERS", value: "5", sub: "0 new today" },
    { label: "TOTAL TODOS", value: "1", sub: "1 completed · 0 pending" },
    { label: "STAFF ACCOUNTS", value: "0", sub: "0 admin · 0 super admin" },
    { label: "STORAGE USAGE", value: "133.5", unit: "KB", sub: "Mock local database size" },
  ],
  mostActiveUsers: {
    title: "Most active users",
    subtitle: "Ranked by number of non-deleted todos.",
    users: [
      { name: "dennese", count: 1 },
    ],
  },
  systemStatus: {
    title: "System status",
    subtitle: "Key toggles at a glance.",
    items: [
      { label: "Registrations", status: "Open", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
      { label: "Email verification", status: "Required", color: "text-amber-700 bg-amber-50 border-amber-200" },
      { label: "Attachments", status: "Enabled", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
      { label: "Two-factor auth", status: "Disabled", color: "text-slate-600 bg-slate-100 border-slate-200" },
      { label: "Maintenance mode", status: "Off", color: "text-slate-600 bg-slate-100 border-slate-200" },
    ],
  },
  recentActivity: {
    title: "Recent platform activity",
    subtitle: "Combined feed of role changes, moderation, and system actions.",
    items: [
      { actor: "Mo Reyes", action: "promoted to", target: "admin", name: "awe", time: "16h ago", type: "promote" },
      { actor: "Mo Reyes", action: "promoted to", target: "admin", name: "keith", time: "16h ago", type: "promote" },
      { actor: "Mo Reyes", action: "promoted to", target: "admin", name: "keith", time: "16h ago", type: "promote" },
      { actor: "Mo Reyes", action: "demoted to", target: "user", name: "Ada Reyes", time: "16h ago", type: "demote" },
      { actor: "Mo Reyes", action: "disabled platform-wide", target: "two-factor authentication", name: "", time: "21h ago", type: "system" },
    ],
  },
} as const;

function ActivityIcon({ type }: { type: string }) {
  if (type === "promote") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-700">
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (type === "demote") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-red-600">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate-600">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const maxCount = Math.max(...dashboardContent.mostActiveUsers.users.map((u) => u.count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            {dashboardContent.heading.title}
          </h1>
          <p className="mt-0.5 text-sm text-emerald-700">
            {dashboardContent.heading.subtitle}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 active:bg-emerald-900"
        >
          {dashboardContent.actions.viewAnalytics}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {dashboardContent.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4"
          >
            <p className="text-xs font-semibold tracking-wider text-slate-400">
              {stat.label}
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-900">
              {stat.value}
              {"unit" in stat && (
                <span className="ml-1 text-lg font-semibold text-slate-500">
                  {stat.unit}
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-slate-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Most active users */}
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
          <p className="font-serif text-base font-bold text-slate-900">
            {dashboardContent.mostActiveUsers.title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {dashboardContent.mostActiveUsers.subtitle}
          </p>
          <div className="mt-4 space-y-3">
            {dashboardContent.mostActiveUsers.users.map((u) => (
              <div key={u.name} className="flex items-center gap-3">
                <span className="w-20 truncate text-sm text-slate-700">{u.name}</span>
                <div className="flex-1 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-700"
                    style={{ width: `${(u.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-4 text-right text-sm text-slate-500">{u.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System status */}
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
          <p className="font-serif text-base font-bold text-slate-900">
            {dashboardContent.systemStatus.title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {dashboardContent.systemStatus.subtitle}
          </p>
          <div className="mt-4 space-y-2.5">
            {dashboardContent.systemStatus.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${item.color}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
        <p className="font-serif text-base font-bold text-slate-900">
          {dashboardContent.recentActivity.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {dashboardContent.recentActivity.subtitle}
        </p>
        <div className="mt-4 space-y-4">
          {dashboardContent.recentActivity.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <ActivityIcon type={item.type} />
              <div className="flex-1 text-sm text-slate-700">
                <span className="font-semibold">{item.actor}</span>{" "}
                {item.action}{" "}
                <span className="font-semibold text-emerald-700">{item.target}</span>
                {item.name && (
                  <>
                    {" — "}
                    <span className="font-semibold">{item.name}</span>
                  </>
                )}
              </div>
              <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}