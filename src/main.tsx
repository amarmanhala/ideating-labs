import { AppsSDKUIProvider } from '@openai/apps-sdk-ui/components/AppsSDKUIProvider'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Link } from 'react-router'
import './index.css'
import App from './App.tsx'
import { store } from './app/store.ts'
import { AuthSessionProvider } from './components/AuthSessionProvider.tsx'

declare global {
  interface AppsSDKUIConfig {
    LinkComponent: typeof Link
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppsSDKUIProvider linkComponent={Link}>
          <AuthSessionProvider>
            <App />
          </AuthSessionProvider>
        </AppsSDKUIProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
