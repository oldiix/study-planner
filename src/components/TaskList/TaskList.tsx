import {useTaskContext} from '../../hooks/useTaskContext'
import type {Priority} from '../../types/task'
import TaskItem from '../TaskItem/TaskItem'
import './TaskList.scss'

const priorityRank: Record<Priority, number> = {
    high: 0,
    medium: 1,
    low: 2,
}

export default function TaskList() {
    const {tasks, filter, sortOrder} = useTaskContext()

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') {
            return task.completed
        }
        if (filter === 'active') {
            return !task.completed
        }
        return true
    })

    const visibleTasks =
        sortOrder === 'priority'
            ? [...filteredTasks].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
            : filteredTasks

    if (visibleTasks.length === 0) {
        return (
            <div className="task-list task-list--empty">
                {tasks.length > 0 ? (
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
            {visibleTasks.map((task) => (
                <TaskItem key={task.id} task={task}/>
            ))}
        </ul>
    )
}