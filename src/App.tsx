import Header from './components/Header'
import TaskList from './components/TaskList'
import {initialTasks} from './data/initialTasks'
import './App.scss'

export default function App() {
    return (
        <div className="app">
            <Header/>
            <main className="app__main">
                <TaskList tasks={initialTasks}/>
            </main>
        </div>
    )
}