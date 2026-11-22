import {createContext} from 'react'
import type {LoadError} from '../reducers/taskReducer'
import type {NewTask, Task} from '../types/task'
import type {ToastMessage, ToastType} from '../types/toast'

export type TaskContextValue = {
    tasks: Task[]
    total: number
    totalPages: number
    loadedPage: number | null
    loadError: LoadError | null
    loadTasks: (page: number, signal: AbortSignal) => Promise<void>
    retry: () => void
    addTask: (task: NewTask) => Promise<void>
    updateTask: (id: number, changes: NewTask) => Promise<void>
    toggleTask: (id: number) => Promise<void>
    deleteTask: (id: number) => Promise<void>
    toast: ToastMessage | null
    showToast: (message: string, type?: ToastType) => void
    hideToast: () => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)
