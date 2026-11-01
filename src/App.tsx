import {useState} from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import {initialTasks} from './data/initialTasks'
import type {NewTask, Task} from './types/task'
import './App.scss'

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)

    function handleAddTask(newTask: NewTask) {
        const task: Task = {...newTask, id: Date.now(), completed: false}
        setTasks((prevTasks) => [task, ...prevTasks])
    }

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
                <TaskForm onAdd={handleAddTask}/>
                <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask}/>
            </main>
        </div>
    )
}