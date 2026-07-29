// src/hooks/useRestoreTodo.ts
import { useState } from "react";
import api from "../api/axios";

interface UseRestoreTodoResult {
  restoreTodo: (id: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useRestoreTodo(): UseRestoreTodoResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restoreTodo = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.patch(`/todos/${id}/restore`);
      return true;
    } catch (err) {
      setError("Failed to restore todo. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { restoreTodo, isLoading, error };
}