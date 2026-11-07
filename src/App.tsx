import {useReducer, useState} from 'react'
import Header from './components/Header/Header'
import TaskFilters from './components/TaskFilters/TaskFilters'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import TaskSort from './components/TaskSort/TaskSort'
import TaskStats from './components/TaskStats/TaskStats'
import {initialTasks} from './data/initialTasks'
import {taskReducer} from './reducers/taskReducer'
import type {NewTask, Priority, Task, TaskFilter, TaskSortOrder} from './types/task'
import './App.scss'

const priorityRank: Record<Priority, number> = {
    high: 0,
    medium: 1,
    low: 2,
}

export default function App() {
    const [state, dispatch] = useReducer(taskReducer, {tasks: initialTasks})
    const [filter, setFilter] = useState<TaskFilter>('all')
    const [sortOrder, setSortOrder] = useState<TaskSortOrder>('newest')

    const {tasks} = state

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
        dispatch({type: 'add', task})
    }

    function handleToggleTask(id: number) {
        dispatch({type: 'toggle', id})
    }

    function handleDeleteTask(id: number) {
        dispatch({type: 'delete', id})
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