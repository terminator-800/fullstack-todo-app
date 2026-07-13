// src/components/Navbar.tsx
import { useState } from "react";
import { useAuth } from "../store/auth";

// All page text lives here — edit this object to change any copy on the page
const navbarContent = {
  searchPlaceholder: "Search todos by title...",
} as const;

interface NavbarProps {
  onSearch?: (query: string) => void;
  onBellClick?: () => void;
  notificationCount?: number;
}

export default function Navbar({ onSearch, onBellClick, notificationCount = 0 }: NavbarProps) {
  const user = useAuth((state) => state.user);
  const [query, setQuery] = useState("");

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder={navbarContent.searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-500 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        />
      </div>

      {/* Right side: notifications + avatar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBellClick}
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50 active:bg-slate-100"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] text-amber-500">
            <path
              d="M12 3a6 6 0 00-6 6v3.5c0 .9-.35 1.77-.98 2.4L4 16h16l-1.02-1.1a3.4 3.4 0 01-.98-2.4V9a6 6 0 00-6-6z"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <path d="M9.5 19a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700">
          <span className="text-sm font-semibold text-white">{initial}</span>
        </div>
      </div>
    </header>
  );
}