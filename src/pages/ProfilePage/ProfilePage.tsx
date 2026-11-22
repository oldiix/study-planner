import {useAuth} from '../../hooks/useAuth'
import {useTaskContext} from '../../hooks/useTaskContext'
import './ProfilePage.scss'

export default function ProfilePage() {
    const {user, isAuthenticated, logout} = useAuth()
    const {showToast} = useTaskContext()

    function handleLogout() {
        logout()
        showToast('You have logged out')
    }

    if (!user) {
        return null
    }

    return (
        <section className="profile-page">
            <article className="profile-page__card">
                <div className="profile-page__header">
                    <img className="profile-page__avatar" src={user.image} alt="" width={72} height={72}/>
                    <div>
                        <h1 className="profile-page__name">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="profile-page__username">@{user.username}</p>
                    </div>
                </div>

                <dl className="profile-page__list">
                    <div className="profile-page__row">
                        <dt className="profile-page__term">Username</dt>
                        <dd className="profile-page__value">{user.username}</dd>
                    </div>
                    <div className="profile-page__row">
                        <dt className="profile-page__term">Email</dt>
                        <dd className="profile-page__value">{user.email}</dd>
                    </div>
                    <div className="profile-page__row">
                        <dt className="profile-page__term">Status</dt>
                        <dd className="profile-page__value">
                            <span className="profile-page__status">
                                {isAuthenticated ? 'Authenticated' : 'Guest'}
                            </span>
                        </dd>
                    </div>
                </dl>

                <button type="button" className="profile-page__logout" onClick={handleLogout}>
                    Logout
                </button>
            </article>
        </section>
    )
}
