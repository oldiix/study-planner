import {createContext} from 'react'
import type {LoadStatus} from '../reducers/taskReducer'
import type {NewTask, Task, TaskFilter, TaskSortOrder} from '../types/task'
import type {ToastMessage, ToastType} from '../types/toast'

export type TaskContextValue = {
    tasks: Task[]
    total: number
    status: LoadStatus
    error: string | null
    page: number
    totalPages: number
    goToPage: (page: number) => void
    retry: () => void
    filter: TaskFilter
    setFilter: (filter: TaskFilter) => void
    sortOrder: TaskSortOrder
    setSortOrder: (sortOrder: TaskSortOrder) => void
    addTask: (task: NewTask) => Promise<void>
    updateTask: (id: number, changes: NewTask) => Promise<void>
    toggleTask: (id: number) => Promise<void>
    deleteTask: (id: number) => Promise<void>
    toast: ToastMessage | null
    showToast: (message: string, type?: ToastType) => void
    hideToast: () => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)