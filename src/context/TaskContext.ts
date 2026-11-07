import {createContext} from 'react'
import type {NewTask, Task, TaskFilter, TaskSortOrder} from '../types/task'

export type TaskContextValue = {
    tasks: Task[]
    filter: TaskFilter
    setFilter: (filter: TaskFilter) => void
    sortOrder: TaskSortOrder
    setSortOrder: (sortOrder: TaskSortOrder) => void
    addTask: (task: NewTask) => void
    updateTask: (id: number, changes: NewTask) => void
    toggleTask: (id: number) => void
    deleteTask: (id: number) => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)