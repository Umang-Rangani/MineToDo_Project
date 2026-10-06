import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from './context/UserContext'
import UserLayout from './User/UserLayout'
import Home from './User/Home'
import Todo from './User/Todo'
import Notebook from './User/Notebook'
import Vault from './User/Vault'
import Dashboard from './User/Dashboard'
import Register from './pages/Register'
import NotFoundPage from './User/NotFoundPage'
import Login from './pages/Login'
import Profile from './User/Profile'



const LOGIN_POPUP_KEY = 'minespace_login_popup_closed'

export default function App() {
  const { user, loading, showLogin, setShowLogin } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      const loginPopupClosed = localStorage.getItem(LOGIN_POPUP_KEY)

      if (!loginPopupClosed) {
        setShowLogin(true)
      }
    }
  }, [loading, user, setShowLogin])

  const handleLoginClose = () => {
    localStorage.setItem(LOGIN_POPUP_KEY, 'true')
    setShowLogin(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F0E7]">
        <div className="text-sm font-semibold text-[#7E563B]">Loading...</div>
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

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {showLogin && <Login onClose={handleLoginClose} />}
    </BrowserRouter>
  )
}
