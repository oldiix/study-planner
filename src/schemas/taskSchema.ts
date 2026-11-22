import * as z from 'zod'

export const taskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(120, 'Title must be at most 120 characters'),
    description: z
        .string()
        .trim()
        .max(500, 'Description must be at most 500 characters'),
    category: z
        .string()
        .trim()
        .min(1, 'Category is required')
        .max(30, 'Category must be at most 30 characters'),
    categoryColor: z.enum(['indigo', 'blue', 'green', 'orange', 'pink', 'gray'], 'Choose a color'),
    priority: z.enum(['low', 'medium', 'high'], 'Choose a priority'),
})

export type TaskFormData = z.infer<typeof taskSchema>
