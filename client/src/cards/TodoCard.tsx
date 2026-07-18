// src/cards/TodoCard.tsx
import type { Todo } from "../hooks/useGetTodos";

interface TodoCardProps {
  todo: Todo;
}

const priorityConfig = {
  LOW: {
    label: "Low",
    dot: "bg-emerald-500",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    badge: "text-amber-700 bg-amber-50 border-amber-200",
  },
  HIGH: {
    label: "High",
    dot: "bg-red-500",
    badge: "text-red-700 bg-red-50 border-red-200",
  },
} as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TodoCard({ todo }: TodoCardProps) {
  const priority = priorityConfig[todo.priority];

  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:shadow-sm">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        readOnly
        className="mt-0.5 h-4 w-4 cursor-pointer accent-emerald-700"
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p
            className={`text-sm font-semibold text-slate-900 ${
              todo.completed ? "line-through text-slate-400" : ""
            }`}
          >
            {todo.title}
          </p>

          {/* Priority badge */}
          <span
            className={`shrink-0 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${priority.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
        </div>

        {/* Description */}
        {todo.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{todo.description}</p>
        )}

        {/* Footer: tags + due date */}
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Due date */}
          {todo.dueDate && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}