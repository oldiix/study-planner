import * as z from 'zod'

export const loginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, 'Username is required'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
