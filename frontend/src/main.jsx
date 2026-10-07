import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingProvider } from './context/LoadingContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)