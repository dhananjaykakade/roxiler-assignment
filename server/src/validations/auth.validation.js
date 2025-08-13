import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(20, "Name must be at least 20 characters long")
    .max(60, "Name must not exceed 60 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must not exceed 16 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  address: z
    .string()
    .max(400, "Address cannot exceed 400 characters")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});
