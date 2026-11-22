import {Navigate, Route, Routes} from 'react-router'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage/LoginPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import TaskDetailsPage from './pages/TaskDetailsPage/TaskDetailsPage'
import TasksPage from './pages/TasksPage/TasksPage'

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout/>}>
                <Route index element={<Navigate to="/tasks" replace/>}/>
                <Route path="tasks" element={<TasksPage/>}/>
                <Route path="tasks/:taskId" element={<TaskDetailsPage/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="*" element={<Navigate to="/tasks" replace/>}/>
            </Route>
        </Routes>
    )
}