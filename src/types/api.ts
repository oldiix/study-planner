export type ApiTodo = {
    id: number
    todo: string
    completed: boolean
    userId: number
}

export type TodosResponse = {
    todos: ApiTodo[]
    total: number
    skip: number
    limit: number
}