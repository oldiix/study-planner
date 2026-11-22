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

export type ApiUser = {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    image: string
}

export type ApiLoginResponse = ApiUser & {
    accessToken: string
    refreshToken: string
}
