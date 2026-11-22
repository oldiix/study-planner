import {Navigate, Route, Routes} from 'react-router'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage/LoginPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import TaskDetailsPage from './pages/TaskDetailsPage/TaskDetailsPage'
import TasksPage from './pages/TasksPage/TasksPage'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
    return (
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
    )
}
