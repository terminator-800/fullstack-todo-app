// src/hooks/useCreateTodo.ts
import { useState } from "react";
import api from "../api/axios";

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  tags?: string[];
}

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

interface UseCreateTodoResult {
  createTodo: (data: CreateTodoInput) => Promise<Todo | null>;
  isLoading: boolean;
  error: string | null;
}

export function useCreateTodo(): UseCreateTodoResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTodo = async (data: CreateTodoInput): Promise<Todo | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Payload being sent to /add-todos:", data);
      const res = await api.post("/add-todos", data);
      return res.data.todo;
    } catch (err) {
      setError("Failed to create todo. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTodo, isLoading, error };
}