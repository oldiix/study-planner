import type {ToastType} from '../../types/toast'
import './Toast.scss'

type ToastAction = {
    label: string
    onClick: () => void
}

type ToastProps = {
    message: string
    type: ToastType
    action?: ToastAction
    duration?: number
    onClose?: () => void
}

export default function Toast({message, type, action, duration, onClose}: ToastProps) {
    return (
        <div className={`toast toast--${type}`} role="status">
            <p className="toast__message">{message}</p>

            {action && (
                <button type="button" className="toast__action" onClick={action.onClick}>
                    {action.label}
                </button>
            )}

            {onClose && (
                <button
                    type="button"
                    className="toast__close"
                    aria-label="Close notification"
                    onClick={onClose}
                >
                    ×
                </button>
            )}

            {duration !== undefined && (
                <span className="toast__progress" style={{animationDuration: `${duration}ms`}}/>
            )}
        </div>
    )
}