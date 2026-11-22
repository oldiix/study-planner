import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import App from './App'
import AuthProvider from './context/AuthProvider'
import TaskProvider from './context/TaskProvider'
import '@fontsource-variable/inter'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <TaskProvider>
                    <App/>
                </TaskProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
