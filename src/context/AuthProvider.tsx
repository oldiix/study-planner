import {useState} from 'react'
import type {ReactNode} from 'react'
import {tokenStorage} from '../api/tokenStorage'
import {authRepository} from '../repositories/authRepository'
import type {LoginCredentials, User} from '../types/auth'
import {AuthContext} from './AuthContext'

type Session = {
    user: User
    accessToken: string
}

type AuthProviderProps = {
    children: ReactNode
}

export default function AuthProvider({children}: AuthProviderProps) {
    const [session, setSession] = useState<Session | null>(null)

    async function login(credentials: LoginCredentials) {
        const accessToken = await authRepository.login(credentials)
        tokenStorage.set(accessToken)

        try {
            const user = await authRepository.getCurrentUser()
            setSession({user, accessToken})
        } catch (error) {
            tokenStorage.clear()
            throw error
        }
    }

    function logout() {
        tokenStorage.clear()
        setSession(null)
    }

    const value = {
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        isAuthenticated: session !== null,
        login,
        logout,
    }

    return <AuthContext value={value}>{children}</AuthContext>
}
