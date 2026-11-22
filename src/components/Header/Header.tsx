import {Link, NavLink} from 'react-router'
import {useAuth} from '../../hooks/useAuth'
import {useTaskContext} from '../../hooks/useTaskContext'
import './Header.scss'

function getLinkClassName({isActive}: { isActive: boolean }): string {
    return isActive ? 'header__link header__link--active' : 'header__link'
}

export default function Header() {
    const {isAuthenticated, logout} = useAuth()
    const {showToast} = useTaskContext()

    function handleLogout() {
        logout()
        showToast('You have logged out')
    }

    return (
        <header className="header">
            <Link to="/tasks" className="header__brand">
                Study Planner
            </Link>

            <nav className="header__nav" aria-label="Main navigation">
                <NavLink to="/tasks" className={getLinkClassName}>
                    Tasks
                </NavLink>
                <NavLink to="/profile" className={getLinkClassName}>
                    Profile
                </NavLink>
                {isAuthenticated ? (
                    <button type="button" className="header__link header__link--button" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <NavLink to="/login" className={getLinkClassName}>
                        Login
                    </NavLink>
                )}
            </nav>
        </header>
    )
}
