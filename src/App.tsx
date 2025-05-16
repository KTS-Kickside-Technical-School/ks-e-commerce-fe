import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes'
import { HelmetProvider } from 'react-helmet-async'
import ScrollToTop from './components/ScrollTop'

const App: React.FC = () => {

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRouter />
      </BrowserRouter>
    </HelmetProvider >
  )
}

export default App
