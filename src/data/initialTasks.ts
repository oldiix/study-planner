import type {Task} from '../types/task'

export const initialTasks: Task[] = [
    {
        id: 1,
        title: 'React Components',
        description: 'Learn the basic principles of React components',
        completed: false,
        priority: 'high',
        category: 'React',
    },
    {
        id: 2,
        title: 'TypeScript Exercises',
        description: 'Complete the practical exercises',
        completed: true,
        priority: 'medium',
        category: 'TypeScript',
    },
    {
        id: 3,
        title: 'State and Events',
        description: 'Read about useState and event handlers',
        completed: false,
        priority: 'medium',
        category: 'React',
    },
    {
        id: 4,
        title: 'SCSS and BEM',
        description: 'Practice naming classes with the BEM methodology',
        completed: false,
        priority: 'low',
        category: 'CSS',
    },
]