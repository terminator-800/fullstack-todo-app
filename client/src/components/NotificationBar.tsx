// src/components/NotificationBar.tsx
import { useEffect } from "react";

// All page text lives here — edit this object to change any copy on the page
const notificationContent = {
  title: "Notifications",
  emptyState: "You're all caught up.",
  markAllRead: "Mark all as read",
} as const;

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationBarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export default function NotificationBar({ isOpen, onClose, notifications }: NotificationBarProps) {
  // Close on Escape for keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop: fades in/out, click to close. pointer-events toggled so it
          doesn't block clicks when hidden, even mid-transition. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 bg-slate-900/20 transition-opacity duration-300",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Panel: same width as Sidebar.tsx (w-64), slides in from the right.
          translate-x-full pushes it fully offscreen when closed; transform
          + transition-transform gives a GPU-accelerated slide instead of
          animating `right`, which is cheaper for the browser to render. */}
      <aside
        role="dialog"
        aria-label={notificationContent.title}
        aria-hidden={!isOpen}
        className={[
          "fixed right-0 top-0 z-50 flex h-screen w-64 flex-col border-l border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Top accent bar, matches the emerald→amber gradient used elsewhere */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-600 to-amber-500" />

        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="font-serif text-base font-bold text-slate-900">
            {notificationContent.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-slate-300">
                <path
                  d="M12 3a6 6 0 00-6 6v3.5c0 .9-.35 1.77-.98 2.4L4 16h16l-1.02-1.1a3.4 3.4 0 01-.98-2.4V9a6 6 0 00-6-6z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-slate-400">{notificationContent.emptyState}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={[
                    "px-4 py-3 transition-colors hover:bg-slate-50",
                    !n.read && "bg-emerald-50/50",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />}
                    <div className={n.read ? "pl-3.5" : ""}>
                      <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{n.description}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-slate-200 px-4 py-3">
            <button
              type="button"
              className="w-full rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
            >
              {notificationContent.markAllRead}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}