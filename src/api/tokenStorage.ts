const TOKEN_KEY = 'study-planner:access-token'

export const tokenStorage = {
    get(): string | null {
        return localStorage.getItem(TOKEN_KEY)
    },
    set(token: string) {
        localStorage.setItem(TOKEN_KEY, token)
    },
    clear() {
        localStorage.removeItem(TOKEN_KEY)
    },
}
