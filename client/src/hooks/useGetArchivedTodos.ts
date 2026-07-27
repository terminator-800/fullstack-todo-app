// src/hooks/useGetArchivedTodos.ts
import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export interface ArchivedTodo {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  tags?: string[];
  completed: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseGetArchivedTodosResult {
  todos: ArchivedTodo[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetArchivedTodos(): UseGetArchivedTodosResult {
  const [todos, setTodos] = useState<ArchivedTodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivedTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get("/todos/archived");
      setTodos(res.data.todos);
    } catch (err) {
      setError("Failed to fetch archived todos. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedTodos();
  }, [fetchArchivedTodos]);

  return { todos, isLoading, error, refetch: fetchArchivedTodos };
}