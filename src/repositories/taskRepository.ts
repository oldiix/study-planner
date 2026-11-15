import {httpClient} from '../api/httpClient'
import type {ApiTodo, TodosResponse} from '../types/api'
import type {NewTask, Task} from '../types/task'

const RESOURCE = '/todos'
const DEFAULT_USER_ID = 1

export type TaskPage = {
    tasks: Task[]
    total: number
}

export type TaskChanges = Partial<Pick<Task, 'title' | 'completed'>>

function toTask(todo: ApiTodo): Task {
    return {
        id: todo.id,
        title: todo.todo,
        description: '',
        completed: todo.completed,
        priority: 'medium',
        category: 'General',
        categoryColor: 'indigo',
    }
}

export const taskRepository = {
    async getAll(page: number, limit: number, signal?: AbortSignal): Promise<TaskPage> {
        const skip = (page - 1) * limit
        const data = await httpClient.get<TodosResponse>(
            `${RESOURCE}?limit=${limit}&skip=${skip}`,
            signal,
        )
        return {tasks: data.todos.map(toTask), total: data.total}
    },

    async getById(id: number, signal?: AbortSignal): Promise<Task> {
        const todo = await httpClient.get<ApiTodo>(`${RESOURCE}/${id}`, signal)
        return toTask(todo)
    },

    async create(task: NewTask): Promise<Task> {
        const created = await httpClient.post<ApiTodo>(`${RESOURCE}/add`, {
            todo: task.title,
            completed: false,
            userId: DEFAULT_USER_ID,
        })
        return {...task, id: created.id, completed: created.completed}
    },

    async update(id: number, changes: TaskChanges): Promise<Task> {
        const updated = await httpClient.patch<ApiTodo>(`${RESOURCE}/${id}`, {
            todo: changes.title,
            completed: changes.completed,
        })
        return toTask(updated)
    },

    async delete(id: number): Promise<void> {
        await httpClient.delete<ApiTodo>(`${RESOURCE}/${id}`)
    },
}