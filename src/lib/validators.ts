import { z } from 'zod'

export const authSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(4)
})

export const practiceCasualSchema = z.object({
    range: z.object({
        from: z.coerce.number().positive(),
        to: z.coerce.number().positive()
    }),
    quantity: z.object({
        min: z.coerce.number().positive(),
        max: z.coerce.number().gt(2)
    }),
    timer: z.coerce.number().gt(5),
    timeInterval: z.coerce.number().positive()
})

export const practiceAnswerRushSchema = z.object({
    range: z.object({
        from: z.coerce.number().positive(),
        to: z.coerce.number().positive()
    }),
    quantity: z.object({
        min: z.coerce.number().positive(),
        max: z.coerce.number().positive().gt(2)
    }),
    timer: z.coerce.number().positive().gt(5),
})