import {useEffect, useState} from 'react'
import type {ReactNode} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router'
import {getErrorMessage} from '../../api/errors'
import {isAbortError} from '../../api/httpClient'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import TaskFormDialog from '../../components/TaskFormDialog/TaskFormDialog'
import {useTaskContext} from '../../hooks/useTaskContext'
import {taskRepository} from '../../repositories/taskRepository'
import type {TaskFormData} from '../../schemas/taskSchema'
import type {Task} from '../../types/task'
import './TaskDetailsPage.scss'

type DetailsState =
    | { status: 'success'; task: Task }
    | { status: 'error'; message: string }

type LoadResult = {
    id: number
    state: DetailsState
}

type DetailsLocationState = {
    backTo?: string
} | null

function formatDate(value: string | null): string {
    if (!value) {
        return 'Not provided by the API'
    }
    return new Date(value).toLocaleString('en-GB', {dateStyle: 'medium', timeStyle: 'short'})
}

type DetailsRowProps = {
    term: string
    children: ReactNode
}

function DetailsRow({term, children}: DetailsRowProps) {
    return (
        <div className="task-details-page__row">
            <dt className="task-details-page__term">{term}</dt>
            <dd className="task-details-page__value">{children}</dd>
        </div>
    )
}

type TaskInfoProps = {
    task: Task
    actions: ReactNode
}

function TaskInfo({task, actions}: TaskInfoProps) {
    const statusClassName = task.completed
        ? 'task-details-page__status task-details-page__status--completed'
        : 'task-details-page__status'

    return (
        <article className="task-details-page__card">
            <div className="task-details-page__header">
                <h1 className="task-details-page__title">{task.title}</h1>
                <span className={statusClassName}>{task.completed ? 'Completed' : 'In progress'}</span>
            </div>

            <dl className="task-details-page__list">
                <DetailsRow term="Description">{task.description || 'No description'}</DetailsRow>
                <DetailsRow term="Category">
                    <span className={`task-details-page__category task-details-page__category--${task.categoryColor}`}>
                        {task.category}
                    </span>
                </DetailsRow>
                <DetailsRow term="Priority">
                    <span className={`task-details-page__priority task-details-page__priority--${task.priority}`}>
                        {task.priority}
                    </span>
                </DetailsRow>
                <DetailsRow term="Created by">{task.createdBy}</DetailsRow>
                <DetailsRow term="Created at">{formatDate(task.createdAt)}</DetailsRow>
                <DetailsRow term="ID">{task.isLocal ? 'Local task' : task.id}</DetailsRow>
            </dl>

            <div className="task-details-page__actions">{actions}</div>

            <p className="task-details-page__note">
                {task.isLocal
                    ? 'This task was created in the app and is not stored on the server.'
                    : 'Title, status and author are loaded from the server. Description, category, priority and creation date are client-owned data.'}
            </p>
        </article>
    )
}

export default function TaskDetailsPage() {
    const {taskId} = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const {tasks, updateTask, deleteTask} = useTaskContext()
    const [result, setResult] = useState<LoadResult | null>(null)
    const [reloadCount, setReloadCount] = useState(0)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const id = Number(taskId)
    const isValidId = Number.isInteger(id) && id > 0
    const listTask = tasks.find((task) => task.id === id)
    const isLocalTask = listTask?.isLocal === true
    const backTo = (location.state as DetailsLocationState)?.backTo ?? '/tasks'

    useEffect(() => {
        if (!isValidId || isLocalTask) {
            return
        }

        const controller = new AbortController()

        taskRepository
            .getById(id, controller.signal)
            .then((task) => setResult({id, state: {status: 'success', task}}))
            .catch((error: unknown) => {
                if (isAbortError(error)) {
                    return
                }
                setResult({id, state: {status: 'error', message: getErrorMessage(error)}})
            })

        return () => controller.abort()
    }, [id, isValidId, isLocalTask, reloadCount])

    function handleRetry() {
        setResult(null)
        setReloadCount((count) => count + 1)
    }

    async function handleEdit(data: TaskFormData) {
        await updateTask(id, data)
        // DummyJSON does not save changes, so keep the edited values in the loaded result
        setResult((current) =>
            current?.id === id && current.state.status === 'success'
                ? {id, state: {status: 'success', task: {...current.state.task, ...data}}}
                : current,
        )
    }

    async function handleDelete() {
        setIsDeleting(true)
        try {
            await deleteTask(id)
            navigate(backTo, {replace: true})
        } catch {
            setIsDeleting(false)
            setIsConfirmingDelete(false)
        }
    }

    const details = result?.id === id ? result.state : null

    let task: Task | null = null
    if (listTask?.isLocal) {
        task = listTask
    } else if (details?.status === 'success') {
        task = listTask
            ? {
                ...listTask,
                title: details.task.title,
                completed: details.task.completed,
                createdBy: details.task.createdBy,
            }
            : details.task
    }

    const actions = isConfirmingDelete ? (
        <>
            <span className="task-details-page__confirm-text">Delete this task?</span>
            <button
                type="button"
                className="task-details-page__button task-details-page__button--danger"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Yes'}
            </button>
            <button
                type="button"
                className="task-details-page__button"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
            >
                No
            </button>
        </>
    ) : (
        <>
            <button type="button" className="task-details-page__button" onClick={() => setIsEditOpen(true)}>
                Edit
            </button>
            <button
                type="button"
                className="task-details-page__button task-details-page__button--danger"
                onClick={() => setIsConfirmingDelete(true)}
            >
                Delete
            </button>
        </>
    )

    let content
    if (!isValidId) {
        content = (
            <StatusMessage
                variant="error"
                title="Invalid task id."
                text={`"${taskId}" is not a valid task number.`}
            />
        )
    } else if (task) {
        content = <TaskInfo task={task} actions={actions}/>
    } else if (details?.status === 'error') {
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
        content = <StatusMessage variant="loading" title="Loading task..."/>
    }

    return (
        <section className="task-details-page">
            <Link to={backTo} className="task-details-page__back">
                ← Back to tasks
            </Link>
            {content}

            {task && (
                <TaskFormDialog
                    open={isEditOpen}
                    mode="edit"
                    task={task}
                    onClose={() => setIsEditOpen(false)}
                    onSubmit={handleEdit}
                />
            )}
        </section>
    )
}
