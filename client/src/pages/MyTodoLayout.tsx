// src/pages/MyTodoLayout.tsx
import { useState } from "react";
import NewTodo from "../components/NewTodo";
import EditTodo from "../components/EditTodo";
import DeleteTodo from "../components/DeleteTodo";
import TodoCard from "../cards/TodoCard";
import { useGetTodos } from "../hooks/useGetTodos";
import type { Todo } from "../hooks/useGetTodos";

const pageContent = {
  title: "My Todos",
  subtitle: "Everything on your plate right now.",
  buttons: {
    archiveCompleted: "Archive completed",
    newTodo: "+ New todo",
  },
  filters: {
    dueDates: [
      { label: "Any due date", value: null },
      { label: "Today", value: "today" },
      { label: "This week", value: "this-week" },
      { label: "This month", value: "this-month" },
      { label: "Overdue", value: "overdue" },
    ],
    sorts: [
      { label: "Sort: Newest", value: "newest" },
      { label: "Sort: Oldest", value: "oldest" },
    ],
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
type DueDateFilter = "today" | "this-week" | "this-month" | "overdue" | null;
type SortFilter = "newest" | "oldest";

function matchesDueDate(dueDate: string | undefined, filter: DueDateFilter): boolean {
  if (!filter) return true;
  if (!dueDate) return false;
 
  const today = new Date();
  today.setHours(0, 0, 0, 0);
 
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
 
  if (filter === "today") {
    return due.getTime() === today.getTime();
  }
 
  if (filter === "this-week") {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return due >= startOfWeek && due <= endOfWeek;
  }
 
  if (filter === "this-month") {
    return (
      due.getMonth() === today.getMonth() &&
      due.getFullYear() === today.getFullYear()
    );
  }
 
  if (filter === "overdue") {
    return due < today;
  }
 
  return true;
}

export default function MyTodoLayout() {
  const [isNewTodoOpen, setIsNewTodoOpen] = useState(false);
  const { todos, isLoading, error, refetch } = useGetTodos();

  const [selectedPriority, setSelectedPriority] = useState<PriorityFilter>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<DueDateFilter>(null);
  const [selectedSort, setSelectedSort] = useState<SortFilter>("newest");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const handlePriorityClick = (value: PriorityFilter) => {
    setSelectedPriority((prev) => (prev === value ? null : value));
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
  };

   const handleEditClose = () => {
    setSelectedTodo(null);
  };

  const handleDelete = (todo: Todo) => {
    setTodoToDelete(todo);
  };

  const handleDeleteClose = () => {
    setTodoToDelete(null);
  };

  const filteredTodos = todos
    .filter((todo) => {
      const matchesPriority = selectedPriority ? todo.priority === selectedPriority : true;
      const matchesDate = matchesDueDate(todo.dueDate, selectedDueDate);
      return matchesPriority && matchesDate;
    })
    // ADDED: sort todos by createdAt based on selectedSort
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return selectedSort === "newest" ? dateB - dateA : dateA - dateB;
    });

  const activeFilterLabel =
    selectedPriority && selectedDueDate
      ? `${selectedPriority.toLowerCase()} priority · ${selectedDueDate}`
      : selectedPriority
      ? `${selectedPriority.toLowerCase()} priority`
      : selectedDueDate
      ? selectedDueDate
      : null;

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
            {/* CHANGED: due date select now uses options from pageContent with onChange handler */}
            <select
              value={selectedDueDate ?? ""}
              onChange={(e) =>
                setSelectedDueDate((e.target.value as DueDateFilter) || null)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              {pageContent.filters.dueDates.map((d) => (
                <option key={d.label} value={d.value ?? ""}>
                  {d.label}
                </option>
              ))}
            </select>
 
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortFilter)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              {pageContent.filters.sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
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
                {activeFilterLabel
                ? `No todos matching "${activeFilterLabel}"`
                : pageContent.emptyState.title}
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {pageContent.emptyState.subtitle}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
             {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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

      {selectedTodo && (
        <EditTodo
          isOpen={!!selectedTodo}
          onClose={handleEditClose}
          onSuccess={() => {
            refetch();
            handleEditClose();
          }}
          todo={selectedTodo}
        />
      )}

      {todoToDelete && (
        <DeleteTodo
          isOpen={!!todoToDelete}
          onClose={handleDeleteClose}
          onSuccess={() => {
            refetch();
            handleDeleteClose();
          }}
          todo={todoToDelete}
        />
      )}
    </>
  );
}