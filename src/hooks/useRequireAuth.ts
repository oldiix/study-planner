import {useLocation, useNavigate} from 'react-router'
import {useAuth} from './useAuth'

export function useRequireAuth() {
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    return function requireAuth(): boolean {
        if (isAuthenticated) {
            return true
        }

        navigate('/login', {state: {from: `${location.pathname}${location.search}`}})
        return false
    }
}
