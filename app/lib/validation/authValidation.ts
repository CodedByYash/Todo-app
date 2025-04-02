import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
  username: z.string().min(3).max(20),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});
