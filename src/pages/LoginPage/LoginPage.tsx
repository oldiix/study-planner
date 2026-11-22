import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Navigate, useLocation} from 'react-router'
import {getErrorMessage} from '../../api/errors'
import {useAuth} from '../../hooks/useAuth'
import {useTaskContext} from '../../hooks/useTaskContext'
import {loginSchema} from '../../schemas/authSchema'
import type {LoginFormData} from '../../schemas/authSchema'
import './LoginPage.scss'

type LoginLocationState = {
    from?: string
} | null

export default function LoginPage() {
    const {isAuthenticated, login} = useAuth()
    const {showToast} = useTaskContext()
    const location = useLocation()
    const from = (location.state as LoginLocationState)?.from
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {username: '', password: ''},
    })

    async function onSubmit(data: LoginFormData) {
        try {
            await login(data)
            showToast('Logged in successfully')
        } catch (error) {
            setError('root', {message: getErrorMessage(error)})
        }
    }

    if (isAuthenticated) {
        return <Navigate to={from ?? '/profile'} replace/>
    }

    return (
        <section className="login-page">
            <div className="login-page__card">
                <h1 className="login-page__title">Login</h1>
                <p className="login-page__hint">
                    Test account: <code className="login-page__code">emilys</code> /{' '}
                    <code className="login-page__code">emilyspass</code>
                </p>

                {from && (
                    <p className="login-page__notice" role="status">
                        Please log in to continue.
                    </p>
                )}

                <form className="login-page__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="login-page__field">
                        <label className="login-page__label" htmlFor="login-username">
                            Username
                        </label>
                        <input
                            id="login-username"
                            type="text"
                            autoComplete="username"
                            className={errors.username ? 'login-page__input login-page__input--invalid' : 'login-page__input'}
                            aria-invalid={Boolean(errors.username)}
                            aria-describedby={errors.username ? 'login-username-error' : undefined}
                            {...register('username')}
                        />
                        {errors.username && (
                            <p id="login-username-error" className="login-page__error" role="alert">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="login-page__field">
                        <label className="login-page__label" htmlFor="login-password">
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            className={errors.password ? 'login-page__input login-page__input--invalid' : 'login-page__input'}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? 'login-password-error' : undefined}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p id="login-password-error" className="login-page__error" role="alert">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {errors.root && (
                        <p className="login-page__server-error" role="alert">
                            {errors.root.message}
                        </p>
                    )}

                    <button type="submit" className="login-page__submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
            </div>
        </section>
    )
}
