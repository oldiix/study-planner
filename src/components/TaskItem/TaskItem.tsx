import {useState} from 'react'
import {Link, useLocation} from 'react-router'
import {useTaskContext} from '../../hooks/useTaskContext'
import type {NewTask, Task} from '../../types/task'
import TaskForm from '../TaskForm/TaskForm'
import './TaskItem.scss'

type TaskItemProps = {
    task: Task
}

export default function TaskItem({task}: TaskItemProps) {
    const {updateTask, toggleTask, deleteTask} = useTaskContext()
    const location = useLocation()
    const [isEditing, setIsEditing] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const [isBusy, setIsBusy] = useState(false)

    async function handleSave(changes: NewTask) {
        await updateTask(task.id, changes)
        setIsEditing(false)
    }

    async function handleToggle() {
        setIsBusy(true)
        await toggleTask(task.id)
        setIsBusy(false)
    }

    async function handleDelete() {
        setIsBusy(true)
        try {
            await deleteTask(task.id)
        } catch {
            setIsBusy(false)
            setIsConfirmingDelete(false)
        }
    }

    if (isEditing) {
        return (
            <li className="task-item task-item--editing">
                <TaskForm
                    submitLabel="Save"
                    initialValues={{
                        title: task.title,
                        description: task.description,
                        category: task.category,
                        categoryColor: task.categoryColor,
                        priority: task.priority,
                    }}
                    onSubmit={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            </li>
        )
    }

    const className = task.completed ? 'task-item task-item--completed' : 'task-item'

    return (
        <li className={className}>
            <div className="task-item__content">
                <h3 className="task-item__title">
                    <Link
                        to={`/tasks/${task.id}`}
                        state={{backTo: `${location.pathname}${location.search}`}}
                        className="task-item__title-link"
                    >
                        {task.title}
                    </Link>
                </h3>
                {task.description && <p className="task-item__description">{task.description}</p>}

                <div className="task-item__meta">
          <span className={`task-item__category task-item__category--${task.categoryColor}`}>
            {task.category}
          </span>
                    <span className={`task-item__priority task-item__priority--${task.priority}`}>
            {task.priority}
          </span>
                    <span className="task-item__status">{task.completed ? 'Completed' : 'In progress'}</span>
                </div>
            </div>

            <div className="task-item__actions">
                {isConfirmingDelete ? (
                    <>
                        <span className="task-item__confirm-text">Delete this task?</span>
                        <button
                            type="button"
                            className="task-item__button task-item__button--danger"
                            onClick={handleDelete}
                            disabled={isBusy}
                        >
                            {isBusy ? 'Deleting...' : 'Yes'}
                        </button>
                        <button
                            type="button"
                            className="task-item__button"
                            onClick={() => setIsConfirmingDelete(false)}
                            disabled={isBusy}
                        >
                            No
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className="task-item__button"
                            onClick={handleToggle}
                            disabled={isBusy}
                        >
                            {task.completed ? 'Reopen' : 'Complete'}
                        </button>
                        <button
                            type="button"
                            className="task-item__button"
                            onClick={() => setIsEditing(true)}
                            disabled={isBusy}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="task-item__button task-item__button--danger"
                            onClick={() => setIsConfirmingDelete(true)}
                            disabled={isBusy}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>

        </li>
    )
}