import {useEffect, useReducer} from 'react'
import type {ReactNode} from 'react'
import {initialTasks} from '../data/initialTasks'
import {taskReducer} from '../reducers/taskReducer'
import type {TaskState} from '../reducers/taskReducer'
import type {NewTask, Task, TaskFilter, TaskSortOrder} from '../types/task'
import {TaskContext} from './TaskContext'
import {useLocalStorage} from '../hooks/useLocalStorage'

const TASKS_STORAGE_KEY = 'study-planner:tasks'

function createInitialState(fallbackTasks: Task[]): TaskState {
    try {
        const saved = localStorage.getItem(TASKS_STORAGE_KEY)
        if (saved === null) {
            return {tasks: fallbackTasks}
        }

        const parsed: unknown = JSON.parse(saved)
        return {tasks: Array.isArray(parsed) ? (parsed as Task[]) : fallbackTasks}
    } catch {
        return {tasks: fallbackTasks}
    }
}

type TaskProviderProps = {
    children: ReactNode
}

export default function TaskProvider({children}: TaskProviderProps) {
    const [state, dispatch] = useReducer(taskReducer, initialTasks, createInitialState)
    const [filter, setFilter] = useLocalStorage<TaskFilter>('study-planner:filter', 'all')
    const [sortOrder, setSortOrder] = useLocalStorage<TaskSortOrder>('study-planner:sort', 'newest')

    useEffect(() => {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks))
    }, [state.tasks])

    function addTask(newTask: NewTask) {
        const task: Task = {...newTask, id: Date.now(), completed: false}
        dispatch({type: 'add', task})
    }

    function updateTask(id: number, changes: NewTask) {
        dispatch({type: 'update', id, changes})
    }

    function toggleTask(id: number) {
        dispatch({type: 'toggle', id})
    }

    function deleteTask(id: number) {
        dispatch({type: 'delete', id})
    }

    const value = {
        tasks: state.tasks,
        filter,
        setFilter,
        sortOrder,
        setSortOrder,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
    }

    return <TaskContext value={value}>{children}</TaskContext>
}