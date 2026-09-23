import { z } from "zod";

export const emailSchema = z.string().trim().email();

export const addressSchema = z.object({
  full_name: z.string().trim().min(1),
  line1: z.string().trim().min(1),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  region: z.string().trim().min(1),
  postal_code: z.string().trim().min(1),
  country: z.string().trim().length(2),
  phone: z.string().trim().optional(),
});
