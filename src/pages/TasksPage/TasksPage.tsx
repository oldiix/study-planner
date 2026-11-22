import {useEffect, useState} from 'react'
import Pagination from '../../components/Pagination/Pagination'
import TaskFilters from '../../components/TaskFilters/TaskFilters'
import TaskFormDialog from '../../components/TaskFormDialog/TaskFormDialog'
import TaskList from '../../components/TaskList/TaskList'
import TaskSort from '../../components/TaskSort/TaskSort'
import TaskStats from '../../components/TaskStats/TaskStats'
import {useTaskContext} from '../../hooks/useTaskContext'
import {useTaskQuery} from '../../hooks/useTaskQuery'
import './TasksPage.scss'

export default function TasksPage() {
    const {addTask, loadTasks, loadedPage, loadError} = useTaskContext()
    const {query} = useTaskQuery()
    const [isCreateOpen, setIsCreateOpen] = useState(false)

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
            <div className="tasks-page__header">
                <div>
                    <h1 className="tasks-page__title">Tasks</h1>
                    <p className="tasks-page__subtitle">Plan your study tasks and track your progress</p>
                </div>
                <button type="button" className="tasks-page__add" onClick={() => setIsCreateOpen(true)}>
                    <span aria-hidden="true">+</span> New task
                </button>
            </div>

            <TaskStats/>
            <div className="tasks-page__toolbar">
                <TaskFilters/>
                <TaskSort/>
            </div>
            <TaskList/>
            <Pagination/>

            <TaskFormDialog
                open={isCreateOpen}
                mode="create"
                onClose={() => setIsCreateOpen(false)}
                onSubmit={addTask}
            />
        </section>
    )
}
