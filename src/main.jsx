import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './i18n'
import * as serviceWorker from './serviceWorker'
import store from './store'
import { queryClient } from './helpers/api_helper'
import { QueryClientProvider } from '@tanstack/react-query'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.Fragment>
)

serviceWorker.unregister()