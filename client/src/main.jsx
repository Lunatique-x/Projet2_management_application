import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from './Securite/router'
import './Config/app.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
