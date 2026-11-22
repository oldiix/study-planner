import {useEffect, useState} from 'react'
import type {ReactNode} from 'react'
import {Link, useParams} from 'react-router'
import {getErrorMessage} from '../../api/errors'
import {isAbortError} from '../../api/httpClient'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import {useTaskContext} from '../../hooks/useTaskContext'
import {taskRepository} from '../../repositories/taskRepository'
import type {Task} from '../../types/task'
import './TaskDetailsPage.scss'

type DetailsState =
    | { status: 'success'; task: Task }
    | { status: 'error'; message: string }

type LoadResult = {
    id: number
    state: DetailsState
}

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
}

function TaskInfo({task}: TaskInfoProps) {
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
    const {tasks} = useTaskContext()
    const [result, setResult] = useState<LoadResult | null>(null)
    const [reloadCount, setReloadCount] = useState(0)

    const id = Number(taskId)
    const isValidId = Number.isInteger(id) && id > 0
    const listTask = tasks.find((task) => task.id === id)
    const isLocalTask = listTask?.isLocal === true

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

    const details = result?.id === id ? result.state : null

    let content
    if (!isValidId) {
        content = (
            <StatusMessage
                variant="error"
                title="Invalid task id."
                text={`"${taskId}" is not a valid task number.`}
            />
        )
    } else if (listTask?.isLocal) {
        content = <TaskInfo task={listTask}/>
    } else if (!details) {
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
        const task = listTask
            ? {
                ...listTask,
                title: details.task.title,
                completed: details.task.completed,
                createdBy: details.task.createdBy,
            }
            : details.task
        content = <TaskInfo task={task}/>
    }

    return (
        <section className="task-details-page">
            <Link to="/tasks" className="task-details-page__back">
                ← Back to tasks
            </Link>
            {content}
        </section>
    )
}
