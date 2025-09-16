import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.tsx'
import {Toaster as SonnerToaster} from './components/ui/sonner'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <Toaster />
      <SonnerToaster />
      <Toaster />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
