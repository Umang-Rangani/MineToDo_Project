import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Header from './components/Header'
import Todo from './components/Todo'
import Login from './pages/Login'
import Register from './pages/Register'

const LOGIN_POPUP_KEY = 'minespace_login_popup_closed'

function AppContent() {
  const location = useLocation()

  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const popupClosed = localStorage.getItem(LOGIN_POPUP_KEY)

    if (!popupClosed) {
      setShowLogin(true)
    }
  }, [])

  const openLogin = () => {
    setShowLogin(true)
  }

  const closeLogin = () => {
    setShowLogin(false)
    localStorage.setItem(LOGIN_POPUP_KEY, 'true')
  }

  const isRegisterPage = location.pathname === '/register'

  return (
    <div className="min-h-screen bg-[#F7F0E7] text-[#3B2A20]">
      {!isRegisterPage && <Header onLoginClick={openLogin} />}

      <main>
        <Routes>
          <Route path="/" element={<Todo />} />

          <Route path="/login" element={<Navigate to="/" replace />} />

          <Route path="/register" element={<Register onLoginClick={openLogin} />} />

          <Route path="/todo" element={<Todo />} />
        </Routes>
      </main>

      {showLogin && <Login onClose={closeLogin} />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
