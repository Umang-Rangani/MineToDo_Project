import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Header from './components/Header'
import Todo from './components/Todo'
import Login from './pages/Login'
import Register from './pages/Register'

const LOGIN_POPUP_KEY = 'minespace_login_popup_closed'

export default function App() {
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

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050C09] text-slate-200">
        <Header onLoginClick={openLogin} />

        <main>
          <Routes>
            <Route path="/" element={<Todo />} />

            <Route path="/login" element={<Navigate to="/" replace />} />

            <Route path="/register" element={<Register />} />

            <Route path="/todo" element={<Todo />} />
          </Routes>
        </main>

        {showLogin && <Login onClose={closeLogin} />}
      </div>
    </BrowserRouter>
  )
}
