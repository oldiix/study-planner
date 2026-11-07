import {useEffect, useReducer, useState} from 'react'
import type {ReactNode} from 'react'
import {UNDO_DELETE_DURATION} from '../constants'
import {initialTasks} from '../data/initialTasks'
import {useLocalStorage} from '../hooks/useLocalStorage'
import {taskReducer} from '../reducers/taskReducer'
import type {TaskState} from '../reducers/taskReducer'
import type {NewTask, Task, TaskFilter, TaskSortOrder} from '../types/task'
import type {ToastMessage, ToastType} from '../types/toast'
import {TaskContext} from './TaskContext'

const TASKS_STORAGE_KEY = 'study-planner:tasks'
const TOAST_DURATION = 3000

function createInitialState(fallbackTasks: Task[]): TaskState {
    try {
        const saved = localStorage.getItem(TASKS_STORAGE_KEY)
        if (saved === null) {
            return {tasks: fallbackTasks, pendingDeleteIds: []}
        }

        const parsed: unknown = JSON.parse(saved)
        return {
            tasks: Array.isArray(parsed) ? (parsed as Task[]) : fallbackTasks,
            pendingDeleteIds: [],
        }
    } catch {
        return {tasks: fallbackTasks, pendingDeleteIds: []}
    }
}

type TaskProviderProps = {
    children: ReactNode
}

export default function TaskProvider({children}: TaskProviderProps) {
    const [state, dispatch] = useReducer(taskReducer, initialTasks, createInitialState)
    const [filter, setFilter] = useLocalStorage<TaskFilter>('study-planner:filter', 'all')
    const [sortOrder, setSortOrder] = useLocalStorage<TaskSortOrder>('study-planner:sort', 'newest')
    const [toast, setToast] = useState<ToastMessage | null>(null)

    const {tasks, pendingDeleteIds} = state

    useEffect(() => {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    }, [tasks])

    useEffect(() => {
        if (!toast) {
            return
        }

        const timerId = setTimeout(() => setToast(null), TOAST_DURATION)
        return () => clearTimeout(timerId)
    }, [toast])

    useEffect(() => {
        if (pendingDeleteIds.length === 0) {
            return
        }

        const count = pendingDeleteIds.length
        const timerId = setTimeout(() => {
            dispatch({type: 'confirmDelete'})
            setToast({
                id: Date.now(),
                message: count === 1 ? 'Task deleted' : `${count} tasks deleted`,
                type: 'success',
            })
        }, UNDO_DELETE_DURATION)

        return () => clearTimeout(timerId)
    }, [pendingDeleteIds])

    function showToast(message: string, type: ToastType = 'success') {
        setToast({id: Date.now(), message, type})
    }

    function hideToast() {
        setToast(null)
    }

    function addTask(newTask: NewTask) {
        const task: Task = {...newTask, id: Date.now(), completed: false}
        dispatch({type: 'add', task})
        showToast('Task added')
    }

    function updateTask(id: number, changes: NewTask) {
        dispatch({type: 'update', id, changes})
        showToast('Task updated')
    }

    function toggleTask(id: number) {
        dispatch({type: 'toggle', id})
    }

    function requestDelete(id: number) {
        dispatch({type: 'requestDelete', id})
    }

    function undoDelete() {
        dispatch({type: 'undoDelete'})
    }

    function resetTasks() {
        dispatch({type: 'reset', tasks: initialTasks})
        showToast('Data reset', 'info')
    }

    const value = {
        tasks,
        pendingDeleteIds,
        filter,
        setFilter,
        sortOrder,
        setSortOrder,
        addTask,
        updateTask,
        toggleTask,
        requestDelete,
        undoDelete,
        resetTasks,
        toast,
        showToast,
        hideToast,
    }

    return <TaskContext value={value}>{children}</TaskContext>
}