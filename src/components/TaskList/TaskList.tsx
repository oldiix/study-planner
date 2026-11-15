import {useTaskContext} from '../../hooks/useTaskContext'
import type {Priority} from '../../types/task'
import StatusMessage from '../StatusMessage/StatusMessage'
import TaskItem from '../TaskItem/TaskItem'
import './TaskList.scss'

const priorityRank: Record<Priority, number> = {
    high: 0,
    medium: 1,
    low: 2,
}

export default function TaskList() {
    const {tasks, status, error, retry, filter, sortOrder} = useTaskContext()

    if (status === 'loading') {
        return <StatusMessage variant="loading" title="Loading..."/>
    }

    if (status === 'error') {
        return (
            <StatusMessage
                variant="error"
                title="Failed to load tasks."
                text={error ?? undefined}
                actionLabel="Try again"
                onAction={retry}
            />
        )
    }

    if (tasks.length === 0) {
        return <StatusMessage variant="empty" title="No tasks found." text="Add your first study task."/>
    }

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
        return <StatusMessage variant="empty" title="No tasks match this filter."/>
    }

    return (
        <ul className="task-list">
            {visibleTasks.map((task) => (
                <TaskItem key={task.id} task={task}/>
            ))}
        </ul>
    )
}