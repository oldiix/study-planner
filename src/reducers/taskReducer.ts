import type {NewTask, Task} from '../types/task'

export type LoadStatus = 'loading' | 'success' | 'error'

export type TaskState = {
    tasks: Task[]
    total: number
    status: LoadStatus
    error: string | null
}

export type TaskAction =
    | { type: 'loadStart' }
    | { type: 'loadSuccess'; tasks: Task[]; total: number }
    | { type: 'loadError'; message: string }
    | { type: 'add'; task: Task }
    | { type: 'update'; id: number; changes: NewTask }
    | { type: 'toggle'; id: number }
    | { type: 'remove'; id: number }

export const initialTaskState: TaskState = {
    tasks: [],
    total: 0,
    status: 'loading',
    error: null,
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'loadStart':
            return {...state, status: 'loading', error: null}

        case 'loadSuccess':
            return {tasks: action.tasks, total: action.total, status: 'success', error: null}

        case 'loadError':
            return {...state, tasks: [], status: 'error', error: action.message}

        case 'add':
            return {...state, tasks: [action.task, ...state.tasks], total: state.total + 1}

        case 'update':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.id ? {...task, ...action.changes} : task,
                ),
            }

        case 'toggle':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.id ? {...task, completed: !task.completed} : task,
                ),
            }

        case 'remove':
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.id),
                total: state.total - 1,
            }
    }
}