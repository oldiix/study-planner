import type {Task} from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

type TaskListProps = {
    tasks: Task[]
}

export default function TaskList({tasks}: TaskListProps) {
    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task}/>
            ))}
        </ul>
    )
}