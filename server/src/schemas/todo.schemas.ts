import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.string().date().optional(), // Change from .datetime() to .date()
  tags: z.array(z.string()).optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;