import {useTaskContext} from '../../hooks/useTaskContext'
import type {TaskSortOrder} from '../../types/task'
import './TaskSort.scss'

export default function TaskSort() {
    const {sortOrder, setSortOrder} = useTaskContext()

    return (
        <label className="task-sort">
            <span className="task-sort__label">Sort by</span>
            <select
                className="task-sort__select"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as TaskSortOrder)}
            >
                <option value="newest">Newest first</option>
                <option value="priority">Priority</option>
            </select>
        </label>
    )
}