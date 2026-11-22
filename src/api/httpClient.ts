import {tokenStorage} from './tokenStorage'

const BASE_URL = import.meta.env.VITE_API_URL

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
    method?: HttpMethod
    body?: unknown
    signal?: AbortSignal
}

export class HttpError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'HttpError'
        this.status = status
    }
}

export function isAbortError(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'AbortError'
}

async function readErrorMessage(response: Response): Promise<string> {
    try {
        const data = (await response.json()) as { message?: string }
        return data.message ?? `Request failed with status ${response.status}`
    } catch {
        return `Request failed with status ${response.status}`
    }
}

function createHeaders(hasBody: boolean): Record<string, string> {
    const headers: Record<string, string> = {}

    if (hasBody) {
        headers['Content-Type'] = 'application/json'
    }
    const token = tokenStorage.get()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    return headers
}

async function request<T>(path: string, {method = 'GET', body, signal}: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: createHeaders(body !== undefined),
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
    })

    if (!response.ok) {
        throw new HttpError(response.status, await readErrorMessage(response))
    }

    return (await response.json()) as T
}

export const httpClient = {
    get: <T>(path: string, signal?: AbortSignal) => request<T>(path, {signal}),
    post: <T>(path: string, body: unknown) => request<T>(path, {method: 'POST', body}),
    patch: <T>(path: string, body: unknown) => request<T>(path, {method: 'PATCH', body}),
    delete: <T>(path: string) => request<T>(path, {method: 'DELETE'}),
}
