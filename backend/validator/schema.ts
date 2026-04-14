import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6).max(40),
  householdId: z.string().optional()
})

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string()
})

export const HouseHoldSchema = z.object({
  name: z.string().min(3).max(30),
  inviteCode: z.string().length(6).optional(),
  members: z.array(z.string()).optional(),
  wasteScore: z.number()
})

export const ItemsSchema = z.object({
  name: z.string(),
  category: z.enum(['produce', 'dairy', 'meat', 'pantry', 'frozen', 'other']),
  quantity: z.number(),
  expiryDate: z.coerce.date(),
  status: z.enum(['fresh', 'expiring-soon', 'expired', 'used', 'wasted'])
})
