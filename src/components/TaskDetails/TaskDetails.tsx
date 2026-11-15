import {useEffect, useId, useState} from 'react'
import type {MouseEvent} from 'react'
import {createPortal} from 'react-dom'
import {isAbortError} from '../../api/httpClient'
import {taskRepository} from '../../repositories/taskRepository'
import type {Task} from '../../types/task'
import StatusMessage from '../StatusMessage/StatusMessage'
import './TaskDetails.scss'

type TaskDetailsProps = {
    task: Task
    onClose: () => void
}

type DetailsState =
    | { status: 'loading' }
    | { status: 'success'; task: Task }
    | { status: 'error'; message: string }

export default function TaskDetails({task, onClose}: TaskDetailsProps) {
    const headingId = useId()
    const [details, setDetails] = useState<DetailsState>(
        task.isLocal ? {status: 'success', task} : {status: 'loading'},
    )
    const [reloadCount, setReloadCount] = useState(0)

    useEffect(() => {
        if (task.isLocal) {
            return
        }

        const controller = new AbortController()

        taskRepository
            .getById(task.id, controller.signal)
            .then((serverTask) =>
                setDetails({
                    status: 'success',
                    task: {...task, title: serverTask.title, completed: serverTask.completed},
                }),
            )
            .catch((error: unknown) => {
                if (isAbortError(error)) {
                    return
                }
                setDetails({
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Failed to load the task',
                })
            })

        return () => controller.abort()
    }, [task, reloadCount])

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    function handleRetry() {
        setDetails({status: 'loading'})
        setReloadCount((count) => count + 1)
    }

    function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    let content
    if (details.status === 'loading') {
        content = <StatusMessage variant="loading" title="Loading task..."/>
    } else if (details.status === 'error') {
        content = (
            <StatusMessage
                variant="error"
                title="Failed to load the task."
                text={details.message}
                actionLabel="Try again"
                onAction={handleRetry}
            />
        )
    } else {
        const loaded = details.task
        content = (
            <>
                <h3 className="task-details__title">{loaded.title}</h3>
                <dl className="task-details__list">
                    <div className="task-details__row">
                        <dt className="task-details__term">Description</dt>
                        <dd className="task-details__value">{loaded.description || 'No description'}</dd>
                    </div>
                    <div className="task-details__row">
                        <dt className="task-details__term">Category</dt>
                        <dd className="task-details__value">
              <span className={`task-details__badge task-details__badge--${loaded.categoryColor}`}>
                {loaded.category}
              </span>
                        </dd>
                    </div>
                    <div className="task-details__row">
                        <dt className="task-details__term">Priority</dt>
                        <dd className="task-details__value task-details__value--capitalize">{loaded.priority}</dd>
                    </div>
                    <div className="task-details__row">
                        <dt className="task-details__term">Status</dt>
                        <dd className="task-details__value">{loaded.completed ? 'Completed' : 'In progress'}</dd>
                    </div>
                    <div className="task-details__row">
                        <dt className="task-details__term">ID</dt>
                        <dd className="task-details__value">{loaded.isLocal ? 'Local task' : loaded.id}</dd>
                    </div>
                </dl>
                <p className="task-details__note">
                    {loaded.isLocal
                        ? 'This task was created in the app and is not stored on the server.'
                        : 'Title and status are loaded from the server. Other fields are stored only in the app.'}
                </p>
            </>
        )
    }

    return createPortal(
        <div className="task-details" onClick={handleOverlayClick}>
            <div
                className="task-details__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={headingId}
            >
                <div className="task-details__header">
                    <h2 id={headingId} className="task-details__heading">
                        Task details
                    </h2>
                    <button
                        type="button"
                        className="task-details__close"
                        aria-label="Close details"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                {content}
            </div>
        </div>,
        document.body,
    )
}