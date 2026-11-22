import type {NewTask, Task} from '../types/task'

export type LoadError = {
    page: number
    message: string
}

export type TaskState = {
    tasks: Task[]
    total: number
    loadedPage: number | null
    loadError: LoadError | null
}

export type TaskAction =
    | { type: 'loadSuccess'; page: number; tasks: Task[]; total: number }
    | { type: 'loadError'; page: number; message: string }
    | { type: 'clearLoadError' }
    | { type: 'add'; task: Task }
    | { type: 'update'; id: number; changes: NewTask }
    | { type: 'toggle'; id: number }
    | { type: 'remove'; id: number }

export const initialTaskState: TaskState = {
    tasks: [],
    total: 0,
    loadedPage: null,
    loadError: null,
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'loadSuccess':
            return {tasks: action.tasks, total: action.total, loadedPage: action.page, loadError: null}

        case 'loadError':
            return {...state, loadError: {page: action.page, message: action.message}}

        case 'clearLoadError':
            return {...state, loadError: null}

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
