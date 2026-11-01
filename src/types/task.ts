export type Priority = 'low' | 'medium' | 'high'
export type NewTask = Omit<Task, 'id' | 'completed'>
export type TaskFilter = 'all' | 'completed' | 'active'

export type Task = {
    id: number
    title: string
    description: string
    completed: boolean
    priority: Priority
    category: string
}