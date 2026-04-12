import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from './Router'
import './app.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
