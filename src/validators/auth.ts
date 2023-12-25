import { integer } from "drizzle-orm/pg-core";
import { z } from "zod";

export const authSchema = z.object({
  // Sign in doesn't require a username, but sign up does.
  isCoach: z.boolean(),
  username: z.string().optional(),
  email: z.string().email(),
  // Passwords must be at least 8 characters long.
  password: z.string().min(8),
  avatarUrl: z.string(),
  sportType: z.string().optional(),
  age: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  place: z.string().optional(),
  license: z.string().optional(),
});
