import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6).max(40),
  householdId: z.string().optional()
})

export const LoginSchema = z.object({
  email: z.object(),
  password: z.string()
})

export const HouseHoldSchema = z.object({
  name: z.string().min(3).max(30),
  inviteCode: z.string().length(6),
  members: z.string(),
  wasteScore: z.number()
})
