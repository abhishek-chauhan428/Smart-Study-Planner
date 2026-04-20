import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { SessionProvider } from './context/SessionProvider.jsx'
import { TaskProvider } from './context/TaskProvider.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <SessionProvider>
            <App />
          </SessionProvider>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
