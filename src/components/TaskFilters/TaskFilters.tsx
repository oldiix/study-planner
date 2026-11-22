import {useTaskQuery} from '../../hooks/useTaskQuery'
import type {PriorityFilter, TaskFilter} from '../../types/task'
import './TaskFilters.scss'

const statusOptions: { value: TaskFilter; label: string }[] = [
    {value: 'all', label: 'All'},
    {value: 'completed', label: 'Completed'},
    {value: 'active', label: 'Active'},
]

const priorityOptions: { value: PriorityFilter; label: string }[] = [
    {value: 'all', label: 'All priorities'},
    {value: 'high', label: 'High'},
    {value: 'medium', label: 'Medium'},
    {value: 'low', label: 'Low'},
]

export default function TaskFilters() {
    const {query, updateQuery} = useTaskQuery()

    return (
        <div className="task-filters">
            <div className="task-filters__group" role="group" aria-label="Filter by status">
                {statusOptions.map((option) => {
                    const isActive = option.value === query.status

                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={
                                isActive ? 'task-filters__button task-filters__button--active' : 'task-filters__button'
                            }
                            aria-pressed={isActive}
                            onClick={() => updateQuery({status: option.value})}
                        >
                            {option.label}
                        </button>
                    )
                })}
            </div>

            <select
                className="task-filters__select"
                aria-label="Filter by priority"
                value={query.priority}
                onChange={(event) => updateQuery({priority: event.target.value as PriorityFilter})}
            >
                {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
