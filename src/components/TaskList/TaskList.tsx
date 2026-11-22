import {useTaskContext} from '../../hooks/useTaskContext'
import {useTaskQuery} from '../../hooks/useTaskQuery'
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
    const {tasks, loadedPage, loadError, retry} = useTaskContext()
    const {query, updateQuery} = useTaskQuery()

    if (loadError?.page === query.page) {
        return (
            <StatusMessage
                variant="error"
                title="Failed to load tasks."
                text={loadError.message}
                actionLabel="Try again"
                onAction={retry}
            />
        )
    }

    if (loadedPage !== query.page) {
        return <StatusMessage variant="loading" title="Loading..."/>
    }

    if (tasks.length === 0) {
        return <StatusMessage variant="empty" title="No tasks found." text="Add your first study task."/>
    }

    const filteredTasks = tasks.filter((task) => {
        if (query.status === 'completed' && !task.completed) {
            return false
        }
        if (query.status === 'active' && task.completed) {
            return false
        }
        if (query.priority !== 'all' && task.priority !== query.priority) {
            return false
        }
        return true
    })

    const visibleTasks =
        query.sort === 'priority'
            ? [...filteredTasks].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
            : filteredTasks

    if (visibleTasks.length === 0) {
        return (
            <StatusMessage
                variant="empty"
                title="No tasks match these filters."
                actionLabel="Reset filters"
                onAction={() => updateQuery({status: 'all', priority: 'all'})}
            />
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
