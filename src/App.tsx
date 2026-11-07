import {useState} from 'react'
import Header from './components/Header/Header.tsx'
import TaskFilters from './components/TaskFilters/TaskFilters.tsx'
import TaskForm from './components/TaskForm/TaskForm.tsx'
import TaskList from './components/TaskList/TaskList.tsx'
import TaskSort from './components/TaskSort/TaskSort.tsx'
import TaskStats from './components/TaskStats/TaskStats.tsx'
import {initialTasks} from './data/initialTasks'
import type {NewTask, Priority, Task, TaskFilter, TaskSortOrder} from './types/task'
import './App.scss'

const priorityRank: Record<Priority, number> = {
    high: 0,
    medium: 1,
    low: 2,
}

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [filter, setFilter] = useState<TaskFilter>('all')
    const [sortOrder, setSortOrder] = useState<TaskSortOrder>('newest')

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') {
            return task.completed
        }
        if (filter === 'active') {
            return !task.completed
        }
        return true
    })

    const visibleTasks =
        sortOrder === 'priority'
            ? [...filteredTasks].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
            : filteredTasks

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
                <TaskStats tasks={tasks}/>
                <div className="app__toolbar">
                    <TaskFilters filter={filter} onChange={setFilter}/>
                    <TaskSort value={sortOrder} onChange={setSortOrder}/>
                </div>
                <TaskList
                    tasks={visibleTasks}
                    hasAnyTasks={tasks.length > 0}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                />
            </main>
        </div>
    )
}