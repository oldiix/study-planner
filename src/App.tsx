import {useEffect} from 'react'
import Header from './components/Header/Header'
import TaskFilters from './components/TaskFilters/TaskFilters'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import TaskSort from './components/TaskSort/TaskSort'
import TaskStats from './components/TaskStats/TaskStats'
import Toast from './components/Toast/Toast'
import {useTaskContext} from './hooks/useTaskContext'
import './App.scss'

export default function App() {
    const {tasks, addTask, toast, hideToast} = useTaskContext()

    const activeCount = tasks.filter((task) => !task.completed).length

    useEffect(() => {
        const label = activeCount === 1 ? 'active task' : 'active tasks'
        document.title = `Study Planner — ${activeCount} ${label}`
    }, [activeCount])

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
            {toast && (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hideToast}/>
            )}
        </div>
    )
}