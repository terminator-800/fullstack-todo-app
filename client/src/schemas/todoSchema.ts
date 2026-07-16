// src/schemas/todoSchema.ts
import { z } from "zod";

export const newTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional(),
});

export type NewTodoFormValues = z.infer<typeof newTodoSchema>;