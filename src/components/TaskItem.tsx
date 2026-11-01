import type {Task} from '../types/task'
import './TaskItem.scss'

type TaskItemProps = {
    task: Task
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}

export default function TaskItem({task, onToggle, onDelete}: TaskItemProps) {
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
                <button type="button" className="task-item__button" onClick={() => onToggle(task.id)}>
                    {task.completed ? 'Undo' : 'Complete'}
                </button>
                {task.completed && (
                    <button
                        type="button"
                        className="task-item__button task-item__button--danger"
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </button>
                )}
            </div>
        </li>
    )
}