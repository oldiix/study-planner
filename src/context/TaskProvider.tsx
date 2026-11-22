import {useCallback, useEffect, useReducer, useState} from 'react'
import type {ReactNode} from 'react'
import {getErrorMessage} from '../api/errors'
import {isAbortError} from '../api/httpClient'
import {PAGE_SIZE} from '../constants'
import {initialTaskState, taskReducer} from '../reducers/taskReducer'
import {taskRepository} from '../repositories/taskRepository'
import type {NewTask} from '../types/task'
import type {ToastMessage, ToastType} from '../types/toast'
import {TaskContext} from './TaskContext'

const TOAST_DURATION = 3000

type TaskProviderProps = {
    children: ReactNode
}

export default function TaskProvider({children}: TaskProviderProps) {
    const [state, dispatch] = useReducer(taskReducer, initialTaskState)
    const [toast, setToast] = useState<ToastMessage | null>(null)

    const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE))

    const loadTasks = useCallback(async (page: number, signal: AbortSignal) => {
        try {
            const result = await taskRepository.getAll(page, PAGE_SIZE, signal)
            dispatch({type: 'loadSuccess', page, tasks: result.tasks, total: result.total})
        } catch (error) {
            if (isAbortError(error)) {
                return
            }
            dispatch({type: 'loadError', page, message: getErrorMessage(error)})
        }
    }, [])

    useEffect(() => {
        if (!toast) {
            return
        }

        const timerId = setTimeout(() => setToast(null), TOAST_DURATION)
        return () => clearTimeout(timerId)
    }, [toast])

    function retry() {
        dispatch({type: 'clearLoadError'})
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
            dispatch({
                type: 'add',
                task: {...created, id: Date.now(), isLocal: true, createdAt: new Date().toISOString()},
            })
            showToast('Task added')
        } catch (error) {
            showToast(getErrorMessage(error), 'error')
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
            showToast(getErrorMessage(error), 'error')
            throw error
        }
    }

    async function toggleTask(id: number) {
        const task = state.tasks.find((item) => item.id === id)
        if (!task) {
            return
        }

        dispatch({type: 'toggle', id})

        if (task.isLocal) {
            return
        }

        try {
            await taskRepository.update(id, {completed: !task.completed})
        } catch (error) {
            dispatch({type: 'toggle', id})
            showToast(getErrorMessage(error), 'error')
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
            showToast(getErrorMessage(error), 'error')
            throw error
        }
    }

    const value = {
        tasks: state.tasks,
        total: state.total,
        totalPages,
        loadedPage: state.loadedPage,
        loadError: state.loadError,
        loadTasks,
        retry,
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
