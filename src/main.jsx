import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/error-boundary.css'

// PrimeReact CSS imports
import 'primereact/resources/themes/lara-dark-amber/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Logger
import { logger } from './utils/logger.js'

// Set global logger context and wire runtime listeners
if (typeof window !== 'undefined') {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const locale = navigator.language
    logger.setDefaultContext({ app: 'software-architecture-learning', locale, tz })
    logger.info('App', 'Boot', { time: new Date().toISOString() })

    // Global error listeners (complement ErrorBoundary for non-React errors)
    window.addEventListener('error', (e) => {
      logger.error('Global', 'Unhandled error', {
        error: e.error || new Error(e.message || 'Unknown error'),
        source: e.filename,
        lineno: e.lineno,
        colno: e.colno
      })
    })
    window.addEventListener('unhandledrejection', (e) => {
      const reason = e.reason instanceof Error ? e.reason : new Error(typeof e.reason === 'string' ? e.reason : 'Promise rejected')
      logger.error('Global', 'Unhandled promise rejection', { error: reason })
    })
  } catch { /* no-op */ }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
