import {Navigate, Outlet, useLocation} from 'react-router'
import StatusMessage from '../components/StatusMessage/StatusMessage'
import {useAuth} from '../hooks/useAuth'

export default function ProtectedRoute() {
    const {isAuthenticated, isCheckingSession} = useAuth()
    const location = useLocation()

    if (isCheckingSession) {
        return <StatusMessage variant="loading" title="Checking your session..."/>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{from: `${location.pathname}${location.search}`}}/>
    }

    return <Outlet/>
}
