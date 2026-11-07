import {useState} from 'react'
import {useTaskContext} from '../../hooks/useTaskContext'
import type {NewTask, Task} from '../../types/task'
import TaskForm from '../TaskForm/TaskForm'
import './TaskItem.scss'

type TaskItemProps = {
    task: Task
}

export default function TaskItem({task}: TaskItemProps) {
    const {updateTask, toggleTask, requestDelete, pendingDeleteIds} = useTaskContext()
    const [isEditing, setIsEditing] = useState(false)

    const isPendingDelete = pendingDeleteIds.includes(task.id)

    function handleSave(changes: NewTask) {
        updateTask(task.id, changes)
        setIsEditing(false)
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

    let className = 'task-item'
    if (task.completed) {
        className += ' task-item--completed'
    }
    if (isPendingDelete) {
        className += ' task-item--pending'
    }

    return (
        <li className={className}>
            <div className="task-item__content">
                <h3 className="task-item__title">{task.title}</h3>
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
                {isPendingDelete ? (
                    <span className="task-item__pending-label">Will be deleted</span>
                ) : (
                    <>
                        <button type="button" className="task-item__button" onClick={() => toggleTask(task.id)}>
                            {task.completed ? 'Reopen' : 'Complete'}
                        </button>
                        <button type="button" className="task-item__button" onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button
                            type="button"
                            className="task-item__button task-item__button--danger"
                            onClick={() => requestDelete(task.id)}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </li>
    )
}