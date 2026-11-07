import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import TaskProvider from './context/TaskProvider'
import '@fontsource-variable/inter'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TaskProvider>
            <App/>
        </TaskProvider>
    </StrictMode>,
)