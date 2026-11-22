import {Link, NavLink} from 'react-router'
import './Header.scss'

const navItems = [
    {to: '/tasks', label: 'Tasks'},
    {to: '/profile', label: 'Profile'},
    {to: '/login', label: 'Login'},
]

export default function Header() {
    return (
        <header className="header">
            <Link to="/tasks" className="header__brand">
                Study Planner
            </Link>

            <nav className="header__nav" aria-label="Main navigation">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({isActive}) =>
                            isActive ? 'header__link header__link--active' : 'header__link'
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </header>
    )
}