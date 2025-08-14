import { z } from "zod";

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(3, "Store name must be at least 3 characters long")
    .max(60, "Store name must not exceed 60 characters"),
  address: z
    .string()
    .max(400, "Address cannot exceed 400 characters")
});

export const updateStoreSchema = z.object({
  name: z
    .string()
    .min(3, "Store name must be at least 3 characters long")
    .max(60, "Store name must not exceed 60 characters")
    .optional(),
  address: z
    .string()
    .max(400, "Address cannot exceed 400 characters")
    .optional()
});
