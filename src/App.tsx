import {useState} from 'react'
import Header from './components/Header'
import TaskList from './components/TaskList'
import {initialTasks} from './data/initialTasks'
import type {Task} from './types/task'
import './App.scss'

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)

    function handleToggleTask(id: number) {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? {...task, completed: !task.completed} : task)),
        )
    }

    function handleDeleteTask(id: number) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    }

    return (
        <div className="app">
            <Header/>
            <main className="app__main">
                <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask}/>
            </main>
        </div>
    )
}