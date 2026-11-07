import {useReducer, useState} from 'react'
import type {ReactNode} from 'react'
import {initialTasks} from '../data/initialTasks'
import {taskReducer} from '../reducers/taskReducer'
import type {NewTask, Task, TaskFilter, TaskSortOrder} from '../types/task'
import {TaskContext} from './TaskContext'

type TaskProviderProps = {
    children: ReactNode
}

export default function TaskProvider({children}: TaskProviderProps) {
    const [state, dispatch] = useReducer(taskReducer, {tasks: initialTasks})
    const [filter, setFilter] = useState<TaskFilter>('all')
    const [sortOrder, setSortOrder] = useState<TaskSortOrder>('newest')

    function addTask(newTask: NewTask) {
        const task: Task = {...newTask, id: Date.now(), completed: false}
        dispatch({type: 'add', task})
    }

    function toggleTask(id: number) {
        dispatch({type: 'toggle', id})
    }

    function deleteTask(id: number) {
        dispatch({type: 'delete', id})
    }

    const value = {
        tasks: state.tasks,
        filter,
        setFilter,
        sortOrder,
        setSortOrder,
        addTask,
        toggleTask,
        deleteTask,
    }

    return <TaskContext value={value}>{children}</TaskContext>
}