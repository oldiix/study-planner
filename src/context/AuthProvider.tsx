import {useEffect, useState} from 'react'
import type {ReactNode} from 'react'
import {isAbortError} from '../api/httpClient'
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
    const [isCheckingSession, setIsCheckingSession] = useState(() => tokenStorage.get() !== null)

    useEffect(() => {
        const accessToken = tokenStorage.get()
        if (!accessToken) {
            return
        }

        const controller = new AbortController()

        authRepository
            .getCurrentUser(controller.signal)
            .then((user) => {
                setSession({user, accessToken})
                setIsCheckingSession(false)
            })
            .catch((error: unknown) => {
                if (isAbortError(error)) {
                    return
                }
                tokenStorage.clear()
                setIsCheckingSession(false)
            })

        return () => controller.abort()
    }, [])

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
        isCheckingSession,
        login,
        logout,
    }

    return <AuthContext value={value}>{children}</AuthContext>
}
