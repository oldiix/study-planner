import {useTaskContext} from '../../hooks/useTaskContext'
import './TaskActions.scss'

export default function TaskActions() {
    const {resetTasks} = useTaskContext()

    return (
        <div className="task-actions">
            <button type="button" className="task-actions__button" onClick={resetTasks}>
                Reset data
            </button>
        </div>
    )
}