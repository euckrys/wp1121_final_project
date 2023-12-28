import { z } from "zod";

export const profileInfoSchema = z.object({
    displayName: z.string().optional(),
    avatarUrl: z.string().optional(),
    sportType: z.string().optional(),
    age: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    place: z.string().optional(),
    license: z.string().optional(),
    availableTime: z.boolean().array().optional(),
    appointment: z.string().array().optional()
});

export const availableTimeSchema = z.object({
    availableTime: z.boolean().array(),
    appointment: z.string().array().optional(),
});