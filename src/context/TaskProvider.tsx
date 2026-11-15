import {useEffect, useReducer, useState} from 'react'
import type {ReactNode} from 'react'
import {isAbortError} from '../api/httpClient'
import {useLocalStorage} from '../hooks/useLocalStorage'
import {initialTaskState, taskReducer} from '../reducers/taskReducer'
import {taskRepository} from '../repositories/taskRepository'
import type {NewTask, TaskFilter, TaskSortOrder} from '../types/task'
import type {ToastMessage, ToastType} from '../types/toast'
import {TaskContext} from './TaskContext'

const PAGE_SIZE = 10
const TOAST_DURATION = 3000

function getErrorText(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback
}

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
                dispatch({type: 'loadError', message: getErrorText(error, 'Failed to load tasks')})
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

    async function addTask(newTask: NewTask) {
        try {
            const created = await taskRepository.create(newTask)
            dispatch({type: 'add', task: {...created, id: Date.now(), isLocal: true}})
            showToast('Task added')
        } catch (error) {
            showToast(getErrorText(error, 'Failed to add task'), 'error')
            throw error
        }
    }

    async function updateTask(id: number, changes: NewTask) {
        const task = state.tasks.find((item) => item.id === id)

        try {
            if (!task?.isLocal) {
                await taskRepository.update(id, {title: changes.title})
            }
            dispatch({type: 'update', id, changes})
            showToast('Task updated')
        } catch (error) {
            showToast(getErrorText(error, 'Failed to update task'), 'error')
            throw error
        }
    }

    async function toggleTask(id: number) {
        const task = state.tasks.find((item) => item.id === id)
        if (!task) {
            return
        }

        try {
            if (!task.isLocal) {
                await taskRepository.update(id, {completed: !task.completed})
            }
            dispatch({type: 'toggle', id})
        } catch (error) {
            showToast(getErrorText(error, 'Failed to update task'), 'error')
        }
    }

    async function deleteTask(id: number) {
        const task = state.tasks.find((item) => item.id === id)

        try {
            if (!task?.isLocal) {
                await taskRepository.delete(id)
            }
            dispatch({type: 'remove', id})
            showToast('Task deleted')
        } catch (error) {
            showToast(getErrorText(error, 'Failed to delete task'), 'error')
            throw error
        }
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