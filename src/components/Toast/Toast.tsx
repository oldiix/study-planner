import type {ToastType} from '../../types/toast'
import './Toast.scss'

type ToastProps = {
    message: string
    type: ToastType
    onClose: () => void
}

export default function Toast({message, type, onClose}: ToastProps) {
    return (
        <div className={`toast toast--${type}`} role="status">
            <p className="toast__message">{message}</p>
            <button type="button" className="toast__close" aria-label="Close notification" onClick={onClose}>
                ×
            </button>
        </div>
    )
}