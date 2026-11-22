import {httpClient} from '../api/httpClient'
import type {ApiLoginResponse, ApiUser} from '../types/api'
import type {LoginCredentials, User} from '../types/auth'

const TOKEN_LIFETIME_MINUTES = 60

function toUser(apiUser: ApiUser): User {
    return {
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        image: apiUser.image,
    }
}

export const authRepository = {
    async login(credentials: LoginCredentials): Promise<string> {
        const data = await httpClient.post<ApiLoginResponse>('/auth/login', {
            username: credentials.username,
            password: credentials.password,
            expiresInMins: TOKEN_LIFETIME_MINUTES,
        })
        return data.accessToken
    },

    async getCurrentUser(signal?: AbortSignal): Promise<User> {
        const data = await httpClient.get<ApiUser>('/auth/me', signal)
        return toUser(data)
    },
}
