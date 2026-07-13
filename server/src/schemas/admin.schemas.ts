// src/schemas/admin.schemas.ts
import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;