# Study Planner

A study task planner built with React and TypeScript.

This branch contains **Lab 09 — React State and Effects**: `useReducer`, Context API, `useEffect`, custom hooks and
`localStorage` persistence. It continues Lab 08 without losing its features.

## Features

- Add, edit and complete study tasks
- Undoable delete with a 5-second timer, progress bar and Undo button
- Clear all completed tasks with Undo
- Reset tasks to the initial data
- Filter (All, Completed, Active) and sort by priority
- Statistics: total, completed and active tasks
- Toast notifications for create, edit, delete and errors
- Tasks, filter and sort order are saved in `localStorage`
- Browser tab title shows the number of active tasks

## Tech stack

- React 19, TypeScript
- Vite
- SCSS with BEM naming
- ESLint

## Getting started

```bash
npm install
npm run dev
```

| Script          | Description                         |
|-----------------|-------------------------------------|
| `npm run dev`   | start the development server        |
| `npm run build` | type-check and build for production |
| `npm run lint`  | run ESLint                          |

## State management

```
main.tsx
└── TaskProvider       useReducer (tasks, pendingDeleteIds)
    │                  useLocalStorage (filter, sortOrder)
    │                  useState (toast)
    │                  effects: save tasks, hide toast, undo delete timer
    └── App            document.title effect, toast rendering
        ├── TaskForm
        ├── TaskStats    ← useTaskContext
        ├── TaskFilters  ← useTaskContext
        ├── TaskSort     ← useTaskContext
        ├── TaskList     ← useTaskContext
        │   └── TaskItem ← useTaskContext + local editing state
        └── TaskActions  ← useTaskContext
```

- `taskReducer` is a pure function that handles `add`, `update`, `toggle`, `requestDelete`, `undoDelete`,
  `confirmDelete`, `clearCompleted` and `reset`.
- `TaskProvider` shares state and actions through `TaskContext`. Components use `useTaskContext()` instead of props
  passed through several levels.
- Side effects (saving to `localStorage`, timers, `document.title`) live in `useEffect`, never in the reducer.
- Filtered and sorted tasks and statistics are calculated during rendering.

## Project structure

```
src/
├── components/     Header, TaskActions, TaskFilters, TaskForm, TaskItem,
│                   TaskList, TaskSort, TaskStats, Toast (each with its own .scss)
├── context/        TaskContext.ts, TaskProvider.tsx
├── data/           initialTasks.ts
├── hooks/          useLocalStorage.ts, useTaskContext.ts
├── reducers/       taskReducer.ts
├── styles/         _variables.scss, _mixins.scss, global.scss
├── types/          task.ts, toast.ts
├── constants.ts
├── App.tsx
└── main.tsx
```

## Branches

| Branch                       | Lab                              |
|------------------------------|----------------------------------|
| `main`                       | Vite starter project             |
| `feature/react-fundamentals` | Lab 08 — React Fundamentals      |
| `feature/state-effects`      | Lab 09 — React State and Effects |