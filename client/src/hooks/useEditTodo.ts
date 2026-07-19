// src/hooks/useEditTodo.ts
import { useState } from "react";
import api from "../api/axios";
import type { Todo } from "./useGetTodos";

export interface EditTodoInput {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  tags?: string[];
}

interface UseEditTodoResult {
  editTodo: (id: string, data: EditTodoInput) => Promise<Todo | null>;
  isLoading: boolean;
  error: string | null;
}

export function useEditTodo(): UseEditTodoResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTodo = async (id: string, data: EditTodoInput): Promise<Todo | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.put(`/todos/${id}`, data);
      return res.data.todo;
    } catch (err) {
      setError("Failed to update todo. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { editTodo, isLoading, error };
}