# Study Planner

A study task planner built with React and TypeScript.

This branch contains **Lab 11 — React Router 8, forms, validation and authentication** (even variant, **Declarative
Mode**). Tasks are loaded from the [DummyJSON Todos API](https://dummyjson.com/docs/todos), authentication uses
[DummyJSON Auth](https://dummyjson.com/docs/auth).

## Features

- Multi-page SPA with React Router 8: shared layout, task list, task details page, login and profile
- Dynamic route `/tasks/:taskId` with a details page loaded by `id`
- Filters, sorting and page number stored in query params (`?status=completed&priority=high&sort=priority&page=2`)
- One `TaskFormDialog` for creating and editing tasks (React Hook Form + Zod, native `<dialog>`)
- Login form with React Hook Form and Zod validation
- `AuthContext` with `login`, `logout` and the current user
- Protected `/profile` route and auth checks before create, edit, complete and delete
- `Authorization: Bearer <token>` is added to API requests in one place (`httpClient`)
- Return to the previous page after login
- Session restore after page reload (`localStorage` + `GET /auth/me`)
- Loading, error, empty states, toast notifications, request cancellation with `AbortController`

## Tech stack

- React 19, TypeScript
- React Router 8 (Declarative Mode)
- React Hook Form, Zod
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

Test account: `emilys` / `emilyspass`.

| Variable       | Example                 | Description              |
|----------------|-------------------------|--------------------------|
| `VITE_API_URL` | `https://dummyjson.com` | base URL of the REST API |

| Script          | Description                         |
|-----------------|-------------------------------------|
| `npm run dev`   | start the development server        |
| `npm run build` | type-check and build for production |
| `npm run lint`  | run ESLint                          |

## Routes

| Path             | Page                 | Access         |
|------------------|----------------------|----------------|
| `/`              | redirect to `/tasks` | everyone       |
| `/tasks`         | `TasksPage`          | everyone       |
| `/tasks/:taskId` | `TaskDetailsPage`    | everyone       |
| `/login`         | `LoginPage`          | everyone       |
| `/profile`       | `ProfilePage`        | signed-in only |
| `*`              | redirect to `/tasks` | everyone       |

```tsx
<BrowserRouter>
    <Routes>
        <Route element={<AppLayout/>}>
            <Route index element={<Navigate to="/tasks" replace/>}/>
            <Route path="tasks" element={<TasksPage/>}/>
            <Route path="tasks/:taskId" element={<TaskDetailsPage/>}/>
            <Route path="login" element={<LoginPage/>}/>

            <Route element={<ProtectedRoute/>}>
                <Route path="profile" element={<ProfilePage/>}/>
            </Route>

            <Route path="*" element={<Navigate to="/tasks" replace/>}/>
        </Route>
    </Routes>
</BrowserRouter>
```

## Authentication

```
LoginPage → AuthProvider.login()
    → POST /auth/login          → accessToken (saved by tokenStorage)
    → GET  /auth/me             → current user (Authorization: Bearer <token>)
    → session in AuthContext    → header, profile and protected actions update
```

- `ProtectedRoute` is a layout route: it renders `<Outlet/>` for signed-in users and `<Navigate to="/login">` for
  guests.
- `useRequireAuth` checks the session right before create, edit, complete and delete. A guest is sent to `/login`.
- Both pass `state.from`, so after login the user returns to the page they came from.
- After a page reload the saved token is checked with `GET /auth/me`. An expired or invalid token is removed.
- The token is stored in `localStorage` for this lab. It is readable by any script on the page (XSS risk); production
  apps usually keep the access token in memory and the refresh token in an `httpOnly` cookie.

## Architecture

```
Pages and components     show data and react to user actions
      ↓
AuthProvider             session, login, logout
TaskProvider             tasks of the loaded page, CRUD operations, toasts
      ↓
authRepository           /auth/login, /auth/me
taskRepository           /todos endpoints, DTO ↔ Task mapping
      ↓
httpClient               fetch, VITE_API_URL, Authorization header, HttpError
      ↓
DummyJSON REST API
```

| Method | Endpoint                 | Repository method                            |
|--------|--------------------------|----------------------------------------------|
| POST   | `/auth/login`            | `authRepository.login(credentials)`          |
| GET    | `/auth/me`               | `authRepository.getCurrentUser(signal)`      |
| GET    | `/todos?limit=10&skip=0` | `taskRepository.getAll(page, limit, signal)` |
| GET    | `/todos/:id`             | `taskRepository.getById(id, signal)`         |
| POST   | `/todos/add`             | `taskRepository.create(task)`                |
| PATCH  | `/todos/:id`             | `taskRepository.update(id, changes)`         |
| DELETE | `/todos/:id`             | `taskRepository.delete(id)`                  |

## State

| State                                       | Where                             |
|---------------------------------------------|-----------------------------------|
| filter, priority, sort order, page          | URL query params (`useTaskQuery`) |
| selected task                               | URL route param `:taskId`         |
| tasks of the loaded page, total, load error | `useReducer` in `TaskProvider`    |
| current user, token, session check          | `AuthProvider`                    |
| access token for API requests               | `tokenStorage` (`localStorage`)   |
| form values and validation errors           | React Hook Form                   |
| dialog open, delete confirmation            | local state of components         |

## DummyJSON limitations

- POST, PATCH and DELETE are simulated: the server responds, but nothing is saved. The app updates its own state after a
  successful response.
- Every created todo gets the same `id` from the server. Created tasks get a unique local `id`, are marked as local and
  are changed only in the app.
- `description`, `category`, `categoryColor`, `priority` and `createdAt` are client-owned metadata: the API does not
  store them. `createdBy` is built from the server `userId`.
- Filters and sorting work within the loaded page because the API has no server-side filtering.

## Project structure

```
src/
├── api/            httpClient.ts, errors.ts, tokenStorage.ts
├── components/     Header, Pagination, StatusMessage, TaskFilters, TaskFormDialog,
│                   TaskItem, TaskList, TaskSort, TaskStats, Toast
├── context/        AuthContext.ts, AuthProvider.tsx, TaskContext.ts, TaskProvider.tsx
├── hooks/          useAuth.ts, useRequireAuth.ts, useTaskContext.ts, useTaskQuery.ts
├── layouts/        AppLayout.tsx
├── pages/          TasksPage, TaskDetailsPage, LoginPage, ProfilePage
├── reducers/       taskReducer.ts
├── repositories/   authRepository.ts, taskRepository.ts
├── routes/         ProtectedRoute.tsx
├── schemas/        authSchema.ts, taskSchema.ts
├── styles/         _variables.scss, _mixins.scss, global.scss
├── types/          api.ts, auth.ts, task.ts, toast.ts
├── constants.ts
├── App.tsx
└── main.tsx
```

## Branches

| Branch                       | Lab                                               |
|------------------------------|---------------------------------------------------|
| `main`                       | Vite starter project                              |
| `feature/react-fundamentals` | Lab 08 — React Fundamentals                       |
| `feature/state-effects`      | Lab 09 — React State and Effects                  |
| `feature/rest-api`           | Lab 10 — React and REST API                       |
| `feature/routing-auth`       | Lab 11 — React Router, forms, validation and auth |