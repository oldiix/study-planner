import type {TaskSortOrder} from '../types/task'
import './TaskSort.scss'

type TaskSortProps = {
    value: TaskSortOrder
    onChange: (value: TaskSortOrder) => void
}

export default function TaskSort({value, onChange}: TaskSortProps) {
    return (
        <label className="task-sort">
            <span className="task-sort__label">Sort by</span>
            <select
                className="task-sort__select"
                value={value}
                onChange={(event) => onChange(event.target.value as TaskSortOrder)}
            >
                <option value="newest">Newest first</option>
                <option value="priority">Priority</option>
            </select>
        </label>
    )
}