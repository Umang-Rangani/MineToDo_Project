import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, LogIn, LogOut, Menu, UserPlus, X } from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function Header() {
  const navigate = useNavigate()
  const { user, logoutUser } = useUser()

  const [menuOpen, setMenuOpen] = useState(false)

  const logoutHandle = async () => {
    await logoutUser()
    setMenuOpen(false)
    navigate('/login')
  }

  const getInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || 'U'
  }

  const goTo = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      {/* Main Header */}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:h-18 sm:px-6 lg:px-8">
        {/* Logo */}
        <button type="button" onClick={() => goTo(user ? '/todo' : '/login')} className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transition duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
            <CheckSquare size={20} strokeWidth={2.5} className="sm:hidden" />

            <CheckSquare size={22} strokeWidth={2.5} className="hidden sm:block" />
          </div>

          <div className="min-w-0 text-left">
            <h1 className="truncate text-lg font-black tracking-tight text-gray-900 sm:text-xl">
              Todo<span className="text-blue-600">App</span>
            </h1>

            <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400 sm:block">Stay Productive</p>
          </div>
        </button>

        {/* Desktop */}
        <div className="hidden items-center md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              {/* User */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md">{getInitial()}</div>

                <div className="leading-tight">
                  <p className="text-[11px] font-medium text-gray-400">Welcome back</p>

                  <p className="max-w-35 truncate text-sm font-bold text-gray-800">{user.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={logoutHandle}
                className="group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-500 transition-all duration-200 hover:border-red-200 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20"
              >
                <LogOut size={17} className="transition-transform group-hover:-translate-x-0.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => goTo('/login')} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                <LogIn size={17} />
                Login
              </button>

              <button
                type="button"
                onClick={() => goTo('/register')}
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25"
              >
                <UserPlus size={17} />
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition-all duration-200 hover:bg-gray-100 active:scale-95 sm:h-10 sm:w-10 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 md:hidden ${menuOpen ? 'max-h-100 opacity-100' : 'max-h-0 border-t-0 opacity-0'}`}>
        <div className="px-3 py-3 sm:px-6">
          {user ? (
            <div className="space-y-3">
              {/* Mobile User Card */}
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-linear-to-br from-gray-50 to-white p-3 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-base font-bold text-white shadow-md">{getInitial()}</div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">Welcome back 👋</p>

                  <p className="truncate text-base font-bold text-gray-800">{user.name}</p>

                  <p className="truncate text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Todo Button */}
              <button
                type="button"
                onClick={() => goTo('/todo')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100 active:scale-[0.98]"
              >
                <CheckSquare size={18} />
                My Todos
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={logoutHandle}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white active:scale-[0.98]"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {/* Login */}
              <button
                type="button"
                onClick={() => goTo('/login')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
              >
                <LogIn size={18} />
                Login
              </button>

              {/* Register */}
              <button
                type="button"
                onClick={() => goTo('/register')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-xl active:scale-[0.98]"
              >
                <UserPlus size={18} />
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
