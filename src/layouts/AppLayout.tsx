import {useEffect} from 'react'
import {Outlet} from 'react-router'
import Header from '../components/Header/Header'
import Toast from '../components/Toast/Toast'
import {useTaskContext} from '../hooks/useTaskContext'
import './AppLayout.scss'

export default function AppLayout() {
    const {tasks, toast, hideToast} = useTaskContext()

    const activeCount = tasks.filter((task) => !task.completed).length

    useEffect(() => {
        const label = activeCount === 1 ? 'active task' : 'active tasks'
        document.title = `Study Planner — ${activeCount} ${label}`
    }, [activeCount])

    return (
        <div className="app-layout">
            <Header/>
            <main className="app-layout__main">
                <Outlet/>
            </main>
            {toast && (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hideToast}/>
            )}
        </div>
    )
}