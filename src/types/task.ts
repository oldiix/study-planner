export type Priority = 'low' | 'medium' | 'high'

export type CategoryColor = 'indigo' | 'blue' | 'green' | 'orange' | 'pink' | 'gray'

export type ServerTaskFields = {
    id: number
    title: string
    completed: boolean
    createdBy: string
}

// Client-owned metadata: DummyJSON does not store these fields, only the app owns them
export type ClientTaskFields = {
    description: string
    priority: Priority
    category: string
    categoryColor: CategoryColor
    createdAt: string | null
    isLocal?: boolean
}

export type Task = ServerTaskFields & ClientTaskFields

export type NewTask = Pick<Task, 'title' | 'description' | 'category' | 'categoryColor' | 'priority'>

export type TaskFilter = 'all' | 'completed' | 'active'

export type PriorityFilter = 'all' | Priority

export type TaskSortOrder = 'newest' | 'priority'
