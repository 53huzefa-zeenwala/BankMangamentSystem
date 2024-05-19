import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Alert } from './components'
import { StateContext } from './context/stateContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StateContext>
      <Alert />
      <App />
    </StateContext>
  </React.StrictMode>,
)
