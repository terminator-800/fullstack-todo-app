// src/components/DeleteTodo.tsx
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import type { Todo } from "../hooks/useGetTodos";

const deleteTodoContent = {
  heading: "Delete todo",
  message: "Are you sure you want to delete",
  warning: "This action cannot be undone.",
  cancelButton: "Cancel",
  deleteButton: "Delete todo",
  deleteButtonLoading: "Deleting...",
} as const;

interface DeleteTodoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  todo: Todo;
}

export default function DeleteTodo({ isOpen, onClose, onSuccess, todo }: DeleteTodoProps) {
  const { deleteTodo, isLoading, error } = useDeleteTodo();

  const handleDelete = async () => {
    const success = await deleteTodo(todo.id);

    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            {deleteTodoContent.heading}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Warning icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-red-600">
                <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <p className="text-center text-sm text-slate-700">
            {deleteTodoContent.message}{" "}
            <span className="font-semibold text-slate-900">"{todo.title}"</span>?
          </p>
          <p className="mt-1 text-center text-xs text-slate-400">
            {deleteTodoContent.warning}
          </p>

          {/* API error */}
          {error && (
            <p className="mt-3 text-center text-xs text-red-600">{error}</p>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
            >
              {deleteTodoContent.cancelButton}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? deleteTodoContent.deleteButtonLoading
                : deleteTodoContent.deleteButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}