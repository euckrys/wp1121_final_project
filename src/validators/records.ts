import { z } from "zod";

export const recordSchema = z.object({
    toChartId: z.string().min(1),
    year: z.number(),
    month: z.number(),
    date: z.number(),
    sportType: z.string().min(1),
    time: z.string().min(1),
    description: z.string().min(1),
    totalTime: z.number().array().optional(),
})