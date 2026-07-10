// src/schemas/authSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  code: z.string().length(4, "Code must be 4 digits"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;