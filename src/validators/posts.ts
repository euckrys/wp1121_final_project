import { z } from "zod";

export const postSchema = z.object({
    // authorId: z.string().min(1),
    author: z.string().min(1),
    sportType: z.string().min(1),
    description: z.string().min(1),
    updatedAt: z.date().optional(),
})