// src/components/EditTodo.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newTodoSchema, type NewTodoFormValues } from "../schemas/todoSchema";
import { useEditTodo } from "../hooks/useEditTodo";
import type { Todo } from "../hooks/useGetTodos";
import { formatDateForInput } from "../helpers/formatDateForInput";

const editTodoContent = {
  heading: "Edit todo",
  form: {
    titleLabel: "TITLE",
    titlePlaceholder: "What needs doing?",
    descriptionLabel: "DESCRIPTION",
    descriptionPlaceholder: "Add more detail (optional)",
    priorityLabel: "PRIORITY",
    dueDateLabel: "DUE DATE",
    tagsLabel: "TAGS / CATEGORIES",
    tagsPlaceholder: "Type and press Enter",
    tagsHint: "Press Enter to add a tag.",
    cancelButton: "Cancel",
    submitButton: "Save changes",
    submitButtonLoading: "Saving...",
  },
  priorities: [
    { value: "LOW", label: "Low", dot: "bg-emerald-500", active: "border-emerald-500 bg-emerald-50 text-emerald-700" },
    { value: "MEDIUM", label: "Medium", dot: "bg-amber-500", active: "border-amber-500 bg-amber-50 text-amber-700" },
    { value: "HIGH", label: "High", dot: "bg-red-500", active: "border-red-500 bg-red-50 text-red-700" },
  ] as const,
} as const;

interface EditTodoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  todo: Todo;
}

export default function EditTodo({ isOpen, onClose, onSuccess, todo }: EditTodoProps) {
  const [tags, setTags] = useState<string[]>(todo.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const { editTodo, isLoading, error } = useEditTodo();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NewTodoFormValues>({
    resolver: zodResolver(newTodoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description ?? "",
      priority: todo.priority,
      dueDate: todo.dueDate ?? "",
    },
  });

  // Reset form with latest todo data when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        title: todo.title,
        description: todo.description ?? "",
        priority: todo.priority,
        dueDate: formatDateForInput(todo.dueDate),
      });
      setTags(todo.tags ?? []);
      setTagInput("");
    }
  }, [isOpen, todo, reset]);

  const selectedPriority = watch("priority");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleClose = () => {
    reset();
    setTags(todo.tags ?? []);
    setTagInput("");
    onClose();
  };

  const onSubmit = async (data: NewTodoFormValues) => {
    const result = await editTodo(todo.id, {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      tags,
    });

    if (result) {
      handleClose();
      onSuccess?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            {editTodoContent.heading}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600">
              {editTodoContent.form.titleLabel}
            </label>
            <input
              type="text"
              placeholder={editTodoContent.form.titlePlaceholder}
              {...register("title")}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600">
              {editTodoContent.form.descriptionLabel}
            </label>
            <textarea
              rows={3}
              placeholder={editTodoContent.form.descriptionPlaceholder}
              {...register("description")}
              className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Priority + Due Date */}
          <div className="flex items-start gap-6">
            {/* Priority */}
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600">
                {editTodoContent.form.priorityLabel}
              </label>
              <div className="flex items-center gap-2">
                {editTodoContent.priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setValue("priority", p.value)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      selectedPriority === p.value
                        ? p.active
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600">
                {editTodoContent.form.dueDateLabel}
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600">
              {editTodoContent.form.tagsLabel}
            </label>
            <div className="rounded-lg border border-slate-300 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? editTodoContent.form.tagsPlaceholder : ""}
                className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">{editTodoContent.form.tagsHint}</p>
          </div>

          {/* API error */}
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
            >
              {editTodoContent.form.cancelButton}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 active:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? editTodoContent.form.submitButtonLoading
                : editTodoContent.form.submitButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}