# Study Planner

A simple study task planner built with React and TypeScript.

This branch contains **Lab 08 — React Fundamentals**: components, JSX, props, state, events, lists and conditional
rendering. Data is stored in React state only, so it resets after a page reload.

## Features

- Add a task with title, description, category, category color and priority
- Required title validation without third-party libraries
- Mark a task as completed or return it to the active state
- Delete completed tasks
- Filter tasks: All, Completed, Active
- Sort tasks by priority
- Statistics: total, completed and active tasks
- Empty state messages for an empty list and an empty filter result

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

## Project structure

```
src/
├── components/
│   ├── Header.tsx
│   ├── TaskFilters.tsx
│   ├── TaskForm.tsx
│   ├── TaskItem.tsx
│   ├── TaskList.tsx
│   ├── TaskSort.tsx
│   └── TaskStats.tsx
├── data/
│   └── initialTasks.ts
├── styles/
│   ├── _mixins.scss
│   ├── _variables.scss
│   └── global.scss
├── types/
│   └── task.ts
├── App.tsx
└── main.tsx
```

## Component tree

```
App            state: tasks, filter, sortOrder
├── Header
├── TaskForm   local state: form fields, validation error
├── TaskStats  derived: total, completed, active
├── TaskFilters
├── TaskSort
└── TaskList
    └── TaskItem
```

Shared state lives in `App` and is passed down through props. Child components report user actions back to `App` through
callback props (`onAdd`, `onToggle`, `onDelete`, `onChange`). The filtered and sorted list and the statistics are
calculated during rendering instead of being stored in separate state.

## Branches

| Branch                       | Lab                         |
|------------------------------|-----------------------------|
| `main`                       | Vite starter project        |
| `feature/react-fundamentals` | Lab 08 — React Fundamentals |