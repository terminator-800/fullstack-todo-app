// src/hooks/useDeleteTodo.ts
import { useState } from "react";
import api from "../api/axios";

interface UseDeleteTodoResult {
  deleteTodo: (id: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useDeleteTodo(): UseDeleteTodoResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTodo = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/todos/${id}`);
      return true;
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTodo, isLoading, error };
}