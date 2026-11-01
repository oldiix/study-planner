import {useState} from 'react'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import {initialTasks} from './data/initialTasks'
import type {NewTask, Task, TaskFilter} from './types/task'
import './App.scss'

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [filter, setFilter] = useState<TaskFilter>('all')

    const visibleTasks = tasks.filter((task) => {
        if (filter === 'completed') {
            return task.completed
        }
        if (filter === 'active') {
            return !task.completed
        }
        return true
    })

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
                <TaskFilters filter={filter} onChange={setFilter}/>
                <TaskList tasks={visibleTasks} onToggle={handleToggleTask} onDelete={handleDeleteTask}/>
            </main>
        </div>
    )
}