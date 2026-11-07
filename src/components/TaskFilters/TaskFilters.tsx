import {useTaskContext} from '../../hooks/useTaskContext'
import type {TaskFilter} from '../../types/task'
import './TaskFilters.scss'

const filterOptions: { value: TaskFilter; label: string }[] = [
    {value: 'all', label: 'All'},
    {value: 'completed', label: 'Completed'},
    {value: 'active', label: 'Active'},
]

export default function TaskFilters() {
    const {filter, setFilter} = useTaskContext()

    return (
        <div className="task-filters">
            {filterOptions.map((option) => {
                const isActive = option.value === filter

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={
                            isActive ? 'task-filters__button task-filters__button--active' : 'task-filters__button'
                        }
                        aria-pressed={isActive}
                        onClick={() => setFilter(option.value)}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}