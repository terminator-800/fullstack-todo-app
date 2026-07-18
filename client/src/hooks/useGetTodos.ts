// src/hooks/useGetTodos.ts
import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  tags?: string[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseGetTodosResult {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetTodos(): UseGetTodosResult {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get("/todos");
      setTodos(res.data.todos);
    } catch (err) {
      setError("Failed to fetch todos. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { todos, isLoading, error, refetch: fetchTodos };
}