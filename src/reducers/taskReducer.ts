import type {Task} from '../types/task'

export type TaskState = {
    tasks: Task[]
}

export type TaskAction =
    | { type: 'add'; task: Task }
    | { type: 'toggle'; id: number }
    | { type: 'delete'; id: number }

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'add':
            return {...state, tasks: [action.task, ...state.tasks]}

        case 'toggle':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.id ? {...task, completed: !task.completed} : task,
                ),
            }

        case 'delete':
            return {...state, tasks: state.tasks.filter((task) => task.id !== action.id)}
    }
}