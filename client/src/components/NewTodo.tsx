// src/components/NewTodo.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTodo, type CreateTodoInput } from "../hooks/useCreateTodo";
import { newTodoSchema, type NewTodoFormValues } from "../schemas/todoSchema";

const newTodoContent = {
  heading: "New todo",
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
    submitButton: "Create todo",
    submitButtonLoading: "Creating...",
  },
  priorities: [
    { value: "LOW", label: "Low", dot: "bg-emerald-500", active: "border-emerald-500 bg-emerald-50 text-emerald-700" },
    { value: "MEDIUM", label: "Medium", dot: "bg-amber-500", active: "border-amber-500 bg-amber-50 text-amber-700" },
    { value: "HIGH", label: "High", dot: "bg-red-500", active: "border-red-500 bg-red-50 text-red-700" },
  ] as const,
} as const;

interface NewTodoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NewTodo({ isOpen, onClose, onSuccess }: NewTodoProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { createTodo, isLoading, error } = useCreateTodo();

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
      priority: "MEDIUM",
    },
  });

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
    setTags([]);
    setTagInput("");
    onClose();
  };

  const onSubmit = async (data: NewTodoFormValues) => {
    const payload: CreateTodoInput = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      tags,
    };

    const result = await createTodo(payload);

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
            {newTodoContent.heading}
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
              {newTodoContent.form.titleLabel}
            </label>
            <input
              type="text"
              placeholder={newTodoContent.form.titlePlaceholder}
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
              {newTodoContent.form.descriptionLabel}
            </label>
            <textarea
              rows={3}
              placeholder={newTodoContent.form.descriptionPlaceholder}
              {...register("description")}
              className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Priority + Due Date */}
          <div className="flex items-start gap-6">
            {/* Priority */}
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600">
                {newTodoContent.form.priorityLabel}
              </label>
              <div className="flex items-center gap-2">
                {newTodoContent.priorities.map((p) => (
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
                {newTodoContent.form.dueDateLabel}
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
              {newTodoContent.form.tagsLabel}
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
                placeholder={tags.length === 0 ? newTodoContent.form.tagsPlaceholder : ""}
                className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">{newTodoContent.form.tagsHint}</p>
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
              {newTodoContent.form.cancelButton}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 active:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? newTodoContent.form.submitButtonLoading
                : newTodoContent.form.submitButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}