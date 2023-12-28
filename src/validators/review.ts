import { z } from "zod";

export const reviewPostSchema = z.object({
    authorId: z.string(),
    author: z.string().min(1),
    isAnonymous: z.boolean(),
    star: z.number(),
    content: z.string(),
})