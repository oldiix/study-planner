import {createContext} from 'react'
import type {LoginCredentials, User} from '../types/auth'

export type AuthContextValue = {
    user: User | null
    accessToken: string | null
    isAuthenticated: boolean
    isCheckingSession: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
