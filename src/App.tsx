import {useEffect} from 'react'
import Header from './components/Header/Header'
import TaskFilters from './components/TaskFilters/TaskFilters'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import TaskSort from './components/TaskSort/TaskSort'
import TaskStats from './components/TaskStats/TaskStats'
import Toast from './components/Toast/Toast'
import {UNDO_DELETE_DURATION} from './constants'
import {useTaskContext} from './hooks/useTaskContext'
import './App.scss'

export default function App() {
    const {tasks, pendingDeleteIds, addTask, undoDelete, toast, hideToast} = useTaskContext()

    const activeCount = tasks.filter((task) => !task.completed).length
    const pendingCount = pendingDeleteIds.length

    useEffect(() => {
        const label = activeCount === 1 ? 'active task' : 'active tasks'
        document.title = `Study Planner — ${activeCount} ${label}`
    }, [activeCount])

    let toastElement = null
    if (pendingCount > 0) {
        toastElement = (
            <Toast
                key={`pending-${pendingDeleteIds.join('-')}`}
                type="info"
                message={pendingCount === 1 ? 'Task will be deleted' : `${pendingCount} tasks will be deleted`}
                duration={UNDO_DELETE_DURATION}
                action={{label: 'Undo', onClick: undoDelete}}
            />
        )
    } else if (toast) {
        toastElement = (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hideToast}/>
        )
    }

    return (
        <div className="app">
            <Header/>
            <main className="app__main">
                <TaskForm heading="New task" submitLabel="Add" onSubmit={addTask}/>
                <TaskStats/>
                <div className="app__toolbar">
                    <TaskFilters/>
                    <TaskSort/>
                </div>
                <TaskList/>
            </main>
            {toastElement}
        </div>
    )
}