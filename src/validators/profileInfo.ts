import { z } from "zod";

export const profileInfoSchema = z.object({
    displayName: z.string().optional(),
    sportType: z.string().optional(),
    age: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    place: z.string().optional(),
    license: z.string().optional()
});
