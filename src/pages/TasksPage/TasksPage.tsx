import {useEffect} from 'react'
import Pagination from '../../components/Pagination/Pagination'
import TaskFilters from '../../components/TaskFilters/TaskFilters'
import TaskForm from '../../components/TaskForm/TaskForm'
import TaskList from '../../components/TaskList/TaskList'
import TaskSort from '../../components/TaskSort/TaskSort'
import TaskStats from '../../components/TaskStats/TaskStats'
import {useTaskContext} from '../../hooks/useTaskContext'
import {useTaskQuery} from '../../hooks/useTaskQuery'
import './TasksPage.scss'

export default function TasksPage() {
    const {addTask, loadTasks, loadedPage, loadError} = useTaskContext()
    const {query} = useTaskQuery()

    const page = query.page
    const failedPage = loadError?.page ?? null

    useEffect(() => {
        if (loadedPage === page || failedPage === page) {
            return
        }

        const controller = new AbortController()
        loadTasks(page, controller.signal)

        return () => controller.abort()
    }, [page, loadedPage, failedPage, loadTasks])

    return (
        <section className="tasks-page">
            <div className="tasks-page__intro">
                <h1 className="tasks-page__title">Tasks</h1>
                <p className="tasks-page__subtitle">Plan your study tasks and track your progress</p>
            </div>

            <TaskForm heading="New task" submitLabel="Add" onSubmit={addTask}/>
            <TaskStats/>
            <div className="tasks-page__toolbar">
                <TaskFilters/>
                <TaskSort/>
            </div>
            <TaskList/>
            <Pagination/>
        </section>
    )
}
