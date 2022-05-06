import React from 'react'
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthWrapper>
          <Routes>
            <Route
              path='/'
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </AuthWrapper>
      </BrowserRouter>
    </div>
  )
}

export default App
