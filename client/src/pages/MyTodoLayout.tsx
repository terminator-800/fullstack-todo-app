// src/pages/DashboardLayout.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import NotificationBar, { type Notification } from "../components/NotificationBar";

// All page text lives here — edit this object to change any copy on the page
const pageContent = {
  title: "My Todos",
  subtitle: "Everything on your plate right now.",
  buttons: {
    archiveCompleted: "Archive completed",
    newTodo: "+ New todo",
  },
  filters: {
    dueDate: "Any due date",
    sort: "Sort: Newest",
    priorities: [
      { label: "Low", dot: "bg-emerald-500" },
      { label: "Medium", dot: "bg-amber-500" },
      { label: "High", dot: "bg-red-500" },
    ],
  },
  emptyState: {
    title: "Nothing on the ledger yet",
    subtitle: "Add your first task to start tracking your day.",
  },
} as const;

// Placeholder data — replace with a real fetch (e.g. GET /notifications)
// once that endpoint exists on the backend.
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to Ledger",
    description: "Your account is set up and ready to go.",
    time: "Just now",
    read: false,
  },
];

export default function MyTodoLayout() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = sampleNotifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen bg-slate-100">
      {/* <Sidebar /> */}

      {/* min-w-0 lets the main column shrink properly inside the flex
          container instead of overflowing when content is wide. */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* <Navbar
          onBellClick={() => setIsNotifOpen(true)}
          notificationCount={unreadCount}
        /> */}

        <main className="flex-1 overflow-y-auto p-6">
          {/* Page header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900">
                {pageContent.title}
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">{pageContent.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
              >
                {pageContent.buttons.archiveCompleted}
              </button>
              <button
                type="button"
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 active:bg-emerald-900"
              >
                {pageContent.buttons.newTodo}
              </button>
            </div>
          </div>

          {/* Filter row */}
          <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <select className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
                <option>{pageContent.filters.dueDate}</option>
              </select>
              <select className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
                <option>{pageContent.filters.sort}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {pageContent.filters.priorities.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Todo list / empty state */}
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <p className="font-serif text-lg font-bold text-slate-900">
              {pageContent.emptyState.title}
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {pageContent.emptyState.subtitle}
            </p>
          </div>
        </main>
      </div>

      {/* <NotificationBar
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={sampleNotifications}
      /> */}
    </div>
  );
}