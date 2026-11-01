export type Priority = 'low' | 'medium' | 'high'

export type CategoryColor = 'indigo' | 'blue' | 'green' | 'orange' | 'pink' | 'gray'

export type Task = {
    id: number
    title: string
    description: string
    completed: boolean
    priority: Priority
    category: string
    categoryColor: CategoryColor
}

export type NewTask = Omit<Task, 'id' | 'completed'>

export type TaskFilter = 'all' | 'completed' | 'active'

export type TaskSortOrder = 'newest' | 'priority'