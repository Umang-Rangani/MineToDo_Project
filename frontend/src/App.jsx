import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'

import { useUser } from './context/UserContext'

import UserLayout from './User/UserLayout'
import Home from './User/Home'
import Notebook from './User/Notebook'
import Dashboard from './User/Dashboard'
import Profile from './User/Profile'
import NotFoundPage from './User/NotFoundPage'

import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Vault from './User/Vault/Vault'
import Todo from './User/Todo/Todo'

export default function App() {
  const { user, loading, showLogin, setShowLogin, showRegister, setShowRegister } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      setShowLogin(true)
    }
  }, [loading, user, setShowLogin])

  const handleLoginClose = () => {
    setShowLogin(false)
  }

  const handleOpenRegister = () => {
    setShowLogin(false)
    setShowRegister(true)
  }

  const handleRegisterClose = () => {
    setShowRegister(false)
  }

  const handleOpenLogin = () => {
    setShowRegister(false)
    setShowLogin(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--color-bg)">
        <div className="text-sm font-semibold text-(--color-primaryDark)">Loading...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />

          <Route path="todo" element={<Todo />} />

          <Route path="notebook" element={<Notebook />} />

          <Route path="vault" element={<Vault />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {showLogin && <Login onClose={handleLoginClose} onRegisterClick={handleOpenRegister} />}

      {showRegister && <Register onClose={handleRegisterClose} onLoginClick={handleOpenLogin} />}

      <ForgotPassword />
    </BrowserRouter>
  )
}
