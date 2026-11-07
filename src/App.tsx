import Header from './components/Header/Header'
import TaskFilters from './components/TaskFilters/TaskFilters'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import TaskSort from './components/TaskSort/TaskSort'
import TaskStats from './components/TaskStats/TaskStats'
import {useTaskContext} from './hooks/useTaskContext'
import './App.scss'

export default function App() {
    const {addTask} = useTaskContext()

    return (
        <div className="app">
            <Header/>
            <main className="app__main">
                <TaskForm onAdd={addTask}/>
                <TaskStats/>
                <div className="app__toolbar">
                    <TaskFilters/>
                    <TaskSort/>
                </div>
                <TaskList/>
            </main>
        </div>
    )
}