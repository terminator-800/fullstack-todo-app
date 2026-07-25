// src/pages/ArchiveLayout.tsx
const pageContent = {
  title: "Archive",
  subtitle: "Completed tasks you have tucked away.",
  emptyState: {
    title: "Nothing archived yet",
    subtitle: "Completed todos you archive will appear here.",
  },
} as const;

// Placeholder archived todos — replace with real fetch later
const archivedTodos = [
  {
    id: "1",
    number: "No.001",
    title: "123",
    description: "12312",
    priority: "MEDIUM" as const,
    dueDate: "Jul 22",
    completed: true,
  },
];

const priorityConfig = {
  LOW: { label: "Low", color: "bg-emerald-600 text-white" },
  MEDIUM: { label: "Medium", color: "bg-amber-500 text-white" },
  HIGH: { label: "High", color: "bg-red-500 text-white" },
} as const;

export default function ArchiveLayout() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          {pageContent.title}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">{pageContent.subtitle}</p>
      </div>

      {/* Archive list */}
      {archivedTodos.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <p className="font-serif text-lg font-bold text-slate-900">
            {pageContent.emptyState.title}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {pageContent.emptyState.subtitle}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {archivedTodos.map((todo) => {
            const priority = priorityConfig[todo.priority];

            return (
              <div
                key={todo.id}
                className="relative flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:shadow-sm"
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-emerald-600" />

                {/* Number + Checkbox */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-slate-400">
                    {todo.number}
                  </span>
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-700">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-white">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 line-through">
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="mt-0.5 text-xs text-slate-500">{todo.description}</p>
                  )}

                  {/* Footer: priority + due date */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priority.color}`}>
                      {priority.label}
                    </span>
                    {todo.dueDate && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
                          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                        </svg>
                        {todo.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions: restore + delete */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Restore button */}
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <path d="M1 4v6h6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 p-1.5 text-slate-500 transition hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}