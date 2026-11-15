# Study Planner

A study task planner built with React and TypeScript.

This branch contains **Lab 10 — React and REST API**: an API layer, the Repository pattern, asynchronous states, CRUD,
pagination and request cancellation. Tasks are loaded from the [DummyJSON Todos API](https://dummyjson.com/docs/todos).

## Features

- Load tasks from the REST API with pagination
- Loading, error (with Try again), empty and success states
- Task details in a modal loaded by `id`
- Create, edit, complete and delete tasks through the API
- Delete confirmation inside the task card
- Previous GET requests are cancelled with `AbortController`
- Optimistic update when completing a task
- Centralized error messages
- Toast notifications
- Filter and sort order are saved in `localStorage`

## Tech stack

- React 19, TypeScript
- Vite
- Fetch API
- SCSS with BEM naming
- ESLint

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

| Variable       | Example                 | Description              |
|----------------|-------------------------|--------------------------|
| `VITE_API_URL` | `https://dummyjson.com` | base URL of the REST API |

| Script          | Description                         |
|-----------------|-------------------------------------|
| `npm run dev`   | start the development server        |
| `npm run build` | type-check and build for production |
| `npm run lint`  | run ESLint                          |

## Architecture

```
React components        show data and react to user actions
      ↓
TaskProvider            server state (useReducer), client state, async operations
      ↓
taskRepository          endpoints, DTO ↔ Task mapping
      ↓
httpClient              fetch, VITE_API_URL, response.ok, HttpError
      ↓
DummyJSON REST API
```

Components never build URLs or call `fetch` directly.

| Method | Endpoint                 | Repository method             |
|--------|--------------------------|-------------------------------|
| GET    | `/todos?limit=10&skip=0` | `getAll(page, limit, signal)` |
| GET    | `/todos/:id`             | `getById(id, signal)`         |
| POST   | `/todos/add`             | `create(task)`                |
| PATCH  | `/todos/:id`             | `update(id, changes)`         |
| DELETE | `/todos/:id`             | `delete(id)`                  |

## State

| State                                                   | Kind         | Where                          |
|---------------------------------------------------------|--------------|--------------------------------|
| tasks of the current page, total, loading status, error | server state | `useReducer` in `TaskProvider` |
| task details                                            | server state | local state of `TaskDetails`   |
| current page                                            | client state | `useState` in `TaskProvider`   |
| filter, sort order                                      | client state | `useLocalStorage`              |
| form values, editing, delete confirmation               | client state | local state of components      |

## DummyJSON limitations

- POST, PATCH and DELETE are simulated: the server responds, but nothing is saved. The app updates its own state after a
  successful response.
- Every created todo gets the same `id` from the server. Created tasks get a unique local `id`, are marked as local and
  are changed only in the app.
- `description`, `category`, `categoryColor` and `priority` are not supported by the API and are stored only on the
  client.

## Project structure

```
src/
├── api/            httpClient.ts, errors.ts
├── repositories/   taskRepository.ts
├── components/     Header, Pagination, StatusMessage, TaskDetails, TaskFilters,
│                   TaskForm, TaskItem, TaskList, TaskSort, TaskStats, Toast
├── context/        TaskContext.ts, TaskProvider.tsx
├── hooks/          useLocalStorage.ts, useTaskContext.ts
├── reducers/       taskReducer.ts
├── styles/         _variables.scss, _mixins.scss, global.scss
├── types/          api.ts, task.ts, toast.ts
├── App.tsx
└── main.tsx
```

## Branches

| Branch                       | Lab                              |
|------------------------------|----------------------------------|
| `main`                       | Vite starter project             |
| `feature/react-fundamentals` | Lab 08 — React Fundamentals      |
| `feature/state-effects`      | Lab 09 — React State and Effects |
| `feature/rest-api`           | Lab 10 — React and REST API      |