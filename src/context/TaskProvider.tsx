import {useEffect, useReducer, useState} from 'react'
import type {ReactNode} from 'react'
import {isAbortError} from '../api/httpClient'
import {useLocalStorage} from '../hooks/useLocalStorage'
import {initialTaskState, taskReducer} from '../reducers/taskReducer'
import {taskRepository} from '../repositories/taskRepository'
import type {NewTask, Task, TaskFilter, TaskSortOrder} from '../types/task'
import type {ToastMessage, ToastType} from '../types/toast'
import {TaskContext} from './TaskContext'

const PAGE_SIZE = 10
const TOAST_DURATION = 3000

type TaskProviderProps = {
    children: ReactNode
}

export default function TaskProvider({children}: TaskProviderProps) {
    const [state, dispatch] = useReducer(taskReducer, initialTaskState)
    const [page, setPage] = useState(1)
    const [reloadCount, setReloadCount] = useState(0)
    const [filter, setFilter] = useLocalStorage<TaskFilter>('study-planner:filter', 'all')
    const [sortOrder, setSortOrder] = useLocalStorage<TaskSortOrder>('study-planner:sort', 'newest')
    const [toast, setToast] = useState<ToastMessage | null>(null)

    const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE))

    useEffect(() => {
        const controller = new AbortController()

        taskRepository
            .getAll(page, PAGE_SIZE, controller.signal)
            .then((result) => dispatch({type: 'loadSuccess', tasks: result.tasks, total: result.total}))
            .catch((error: unknown) => {
                if (isAbortError(error)) {
                    return
                }
                const message = error instanceof Error ? error.message : 'Failed to load tasks'
                dispatch({type: 'loadError', message})
            })

        return () => controller.abort()
    }, [page, reloadCount])

    useEffect(() => {
        if (!toast) {
            return
        }

        const timerId = setTimeout(() => setToast(null), TOAST_DURATION)
        return () => clearTimeout(timerId)
    }, [toast])

    function goToPage(nextPage: number) {
        if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
            return
        }
        dispatch({type: 'loadStart'})
        setPage(nextPage)
    }

    function retry() {
        dispatch({type: 'loadStart'})
        setReloadCount((count) => count + 1)
    }

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

    function deleteTask(id: number) {
        dispatch({type: 'remove', id})
        showToast('Task deleted')
    }

    const value = {
        tasks: state.tasks,
        total: state.total,
        status: state.status,
        error: state.error,
        page,
        totalPages,
        goToPage,
        retry,
        filter,
        setFilter,
        sortOrder,
        setSortOrder,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        toast,
        showToast,
        hideToast,
    }

    return <TaskContext value={value}>{children}</TaskContext>
}