import type {NewTask, Task} from '../types/task'

export type TaskState = {
    tasks: Task[]
    pendingDeleteIds: number[]
}

export type TaskAction =
    | { type: 'add'; task: Task }
    | { type: 'update'; id: number; changes: NewTask }
    | { type: 'toggle'; id: number }
    | { type: 'requestDelete'; id: number }
    | { type: 'undoDelete' }
    | { type: 'confirmDelete' }
    | { type: 'reset'; tasks: Task[] }

function removePendingTasks(state: TaskState): Task[] {
    return state.tasks.filter((task) => !state.pendingDeleteIds.includes(task.id))
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'add':
            return {...state, tasks: [action.task, ...state.tasks]}

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

        case 'requestDelete':
            return {
                tasks: removePendingTasks(state),
                pendingDeleteIds: [action.id],
            }

        case 'undoDelete':
            return {...state, pendingDeleteIds: []}

        case 'confirmDelete':
            return {
                tasks: removePendingTasks(state),
                pendingDeleteIds: [],
            }
        case 'reset':
            return {tasks: action.tasks, pendingDeleteIds: []}
    }
}