export type Priority = 'low' | 'medium' | 'high'

export type Task = {
    id: number
    title: string
    description: string
    completed: boolean
    priority: Priority
    category: string
}