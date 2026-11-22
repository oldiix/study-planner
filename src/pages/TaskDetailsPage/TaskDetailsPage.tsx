import {Link, useParams} from 'react-router'

export default function TaskDetailsPage() {
    const {taskId} = useParams()

    return (
        <section>
            <Link to="/tasks">Back to tasks</Link>
            <h1>Task #{taskId}</h1>
            <p>Task details will be loaded in the next step.</p>
        </section>
    )
}