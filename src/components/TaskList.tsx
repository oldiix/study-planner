import type {Task} from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

type TaskListProps = {
    tasks: Task[]
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}

export default function TaskList({tasks, onToggle, onDelete}: TaskListProps) {
    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete}/>
            ))}
        </ul>
    )
}