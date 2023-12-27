import { z } from "zod";

export const replySchema = z.object({
    toPostId: z.string().min(1),
    author: z.string().min(1),
    content: z.string().min(1),
});