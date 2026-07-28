// src/hooks/useArchiveCompleted.ts
import { useState } from "react";
import api from "../api/axios";

interface UseArchiveCompletedResult {
  archiveCompleted: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useArchiveCompleted(): UseArchiveCompletedResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const archiveCompleted = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.patch("/todos/archive-completed");
      return true;
    } catch (err) {
      setError("Failed to archive completed todos. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { archiveCompleted, isLoading, error };
}