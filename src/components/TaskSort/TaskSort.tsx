import {useTaskQuery} from '../../hooks/useTaskQuery'
import type {TaskSortOrder} from '../../types/task'
import './TaskSort.scss'

export default function TaskSort() {
    const {query, updateQuery} = useTaskQuery()

    return (
        <label className="task-sort">
            <span className="task-sort__label">Sort by</span>
            <select
                className="task-sort__select"
                value={query.sort}
                onChange={(event) => updateQuery({sort: event.target.value as TaskSortOrder})}
            >
                <option value="newest">Newest first</option>
                <option value="priority">Priority</option>
            </select>
        </label>
    )
}
