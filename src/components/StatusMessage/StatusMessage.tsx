import './StatusMessage.scss'

type StatusMessageProps = {
    variant: 'loading' | 'error' | 'empty'
    title: string
    text?: string
    actionLabel?: string
    onAction?: () => void
}

export default function StatusMessage({
                                          variant,
                                          title,
                                          text,
                                          actionLabel,
                                          onAction,
                                      }: StatusMessageProps) {
    return (
        <div
            className={`status-message status-message--${variant}`}
            role={variant === 'error' ? 'alert' : 'status'}
        >
            {variant === 'loading' && <span className="status-message__spinner" aria-hidden="true"/>}
            <p className="status-message__title">{title}</p>
            {text && <p className="status-message__text">{text}</p>}
            {actionLabel && onAction && (
                <button type="button" className="status-message__action" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    )
}