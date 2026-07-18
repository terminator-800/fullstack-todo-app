// src/pages/MyTodoLayout.tsx
import { useState } from "react";
import NewTodo from "../components/NewTodo";
import TodoCard from "../cards/TodoCard";
import { useGetTodos } from "../hooks/useGetTodos";

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
      { label: "Low", dot: "bg-emerald-500", value: "LOW" },      
      { label: "Medium", dot: "bg-amber-500", value: "MEDIUM" },  
      { label: "High", dot: "bg-red-500", value: "HIGH" },        
    ],
  },
  emptyState: {
    title: "Nothing on the ledger yet",
    subtitle: "Add your first task to start tracking your day.",
  },
} as const;

type PriorityFilter = "LOW" | "MEDIUM" | "HIGH" | null;

export default function MyTodoLayout() {
  const [isNewTodoOpen, setIsNewTodoOpen] = useState(false);
  const { todos, isLoading, error, refetch } = useGetTodos();

  const [selectedPriority, setSelectedPriority] = useState<PriorityFilter>(null);

  const handlePriorityClick = (value: PriorityFilter) => {
    setSelectedPriority((prev) => (prev === value ? null : value));
  };

  const filteredTodos = selectedPriority
    ? todos.filter((todo) => todo.priority === selectedPriority)
    : todos;

  return (
    <>
      <div className="space-y-4">
        {/* Page header */}
        <div className="flex items-start justify-between">
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
              onClick={() => setIsNewTodoOpen(true)}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 active:bg-emerald-900"
            >
              {pageContent.buttons.newTodo}
            </button>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
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
                onClick={() => handlePriorityClick(p.value as PriorityFilter)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  selectedPriority === p.value
                    ? "border-slate-700 bg-slate-900 text-white"  
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Todo list */}
        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-slate-200 bg-white">
            <p className="text-sm text-slate-400">Loading todos...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-slate-200 bg-white">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <p className="font-serif text-lg font-bold text-slate-900">
              {/* CHANGED: show different message when filter is active */}
              {selectedPriority ? `No ${selectedPriority.toLowerCase()} priority todos` : pageContent.emptyState.title}
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {pageContent.emptyState.subtitle}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>

      {/* New Todo Modal */}
      <NewTodo
        isOpen={isNewTodoOpen}
        onClose={() => setIsNewTodoOpen(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
}