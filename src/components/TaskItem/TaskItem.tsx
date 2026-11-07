import {useState} from 'react'
import {useTaskContext} from '../../hooks/useTaskContext'
import type {NewTask, Task} from '../../types/task'
import TaskForm from '../TaskForm/TaskForm'
import './TaskItem.scss'

type TaskItemProps = {
    task: Task
}

export default function TaskItem({task}: TaskItemProps) {
    const {updateTask, toggleTask, deleteTask} = useTaskContext()
    const [isEditing, setIsEditing] = useState(false)

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

    const className = task.completed ? 'task-item task-item--completed' : 'task-item'

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
                <button type="button" className="task-item__button" onClick={() => toggleTask(task.id)}>
                    {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button type="button" className="task-item__button" onClick={() => setIsEditing(true)}>
                    Edit
                </button>
                {task.completed && (
                    <button
                        type="button"
                        className="task-item__button task-item__button--danger"
                        onClick={() => deleteTask(task.id)}
                    >
                        Delete
                    </button>
                )}
            </div>
        </li>
    )
}