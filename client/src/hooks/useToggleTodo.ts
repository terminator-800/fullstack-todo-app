// src/hooks/useToggleTodo.ts
import { useState } from "react";
import api from "../api/axios";

interface UseToggleTodoResult {
  toggleTodo: (id: string, completed: boolean) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useToggleTodo(): UseToggleTodoResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTodo = async (id: string, completed: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.patch(`/todos/${id}/complete`, { completed });
      return true;
    } catch (err) {
      setError("Failed to update todo. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleTodo, isLoading, error };
}