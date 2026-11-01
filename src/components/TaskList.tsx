import type {Task} from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

type TaskListProps = {
    tasks: Task[]
    hasAnyTasks: boolean
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}

export default function TaskList({tasks, hasAnyTasks, onToggle, onDelete}: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="task-list task-list--empty">
                {hasAnyTasks ? (
                    <p className="task-list__empty-title">No tasks match this filter.</p>
                ) : (
                    <>
                        <p className="task-list__empty-title">No tasks yet.</p>
                        <p className="task-list__empty-text">Add your first study task.</p>
                    </>
                )}
            </div>
        )
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete}/>
            ))}
        </ul>
    )
}