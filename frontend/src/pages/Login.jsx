import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, CheckCircle2, Circle, Eye, EyeOff, FileText, LockKeyhole, Mail, PenLine, Sparkles, Target, Video, X } from 'lucide-react'
import { axiosInstance } from '../axiosConfig/axiosInstance'
import { useUser } from '../context/UserContext'

export default function Login({ onClose }) {
  const navigate = useNavigate()
  const { loginUser } = useUser()

  const [obj, setObj] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    setDarkMode(mediaQuery.matches)

    const themeChange = (event) => {
      setDarkMode(event.matches)
    }

    mediaQuery.addEventListener('change', themeChange)

    return () => {
      document.body.style.overflow = ''
      mediaQuery.removeEventListener('change', themeChange)
    }
  }, [])

  const changeHandle = (e) => {
    setObj((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const closeHandle = () => {
    onClose()
  }

  const registerHandle = () => {
    onClose()
    navigate('/register')
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const res = await axiosInstance.post('/users/login', obj)

      loginUser(res.data.user)

      onClose()
      navigate('/todo')
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const theme = {
    overlay: darkMode ? 'bg-[#081C11]/80' : 'bg-[#DDEFE3]/70',

    card: darkMode ? 'border-emerald-400/15 bg-[#153A23]/98 shadow-[0_25px_80px_rgba(0,0,0,0.5)]' : 'border-emerald-200 bg-white/98 shadow-[0_25px_80px_rgba(22,101,52,0.16)]',

    top: darkMode ? 'from-[#164C2A] via-[#17663A] to-[#0E8060]' : 'from-[#087F45] via-[#10A957] to-[#10A98A]',

    label: darkMode ? 'text-emerald-50/85' : 'text-slate-700',

    input: darkMode
      ? 'border-emerald-400/15 bg-[#0C2918] text-white placeholder:text-white/30 focus:border-emerald-400/50 focus:bg-[#10331D] focus:ring-emerald-400/10'
      : 'border-emerald-200 bg-emerald-50/40 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-emerald-500/10',

    icon: darkMode ? 'text-emerald-300' : 'text-emerald-600',

    muted: darkMode ? 'text-white/40' : 'text-slate-500',

    close: darkMode ? 'border-emerald-400/15 bg-[#173B25] text-emerald-100 hover:bg-red-500/15 hover:text-red-300' : 'border-emerald-100 bg-white text-slate-500 hover:bg-red-50 hover:text-red-500',

    divider: darkMode ? 'bg-emerald-400/10' : 'bg-emerald-100',
  }

  return (
    <div className={`fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto px-3 py-4 backdrop-blur-xl transition-colors duration-300 sm:px-5 ${theme.overlay}`}>
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -left-28 -top-28 h-72 w-72 rounded-full blur-3xl ${darkMode ? 'bg-emerald-500/8' : 'bg-emerald-300/30'}`} />

        <div className={`absolute -bottom-28 -right-28 h-80 w-80 rounded-full blur-3xl ${darkMode ? 'bg-teal-500/8' : 'bg-green-200/30'}`} />
      </div>

      {/* Floating workspace icons */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
        <div className={`absolute left-[9%] top-[24%] -rotate-12 rounded-xl border p-2.5 ${darkMode ? 'border-emerald-300/10 bg-emerald-300/5 text-emerald-300/20' : 'border-emerald-400/15 bg-white/40 text-emerald-600/20'}`}>
          <PenLine size={19} />
        </div>

        <div className={`absolute right-[10%] top-[20%] rotate-12 rounded-xl border p-2.5 ${darkMode ? 'border-teal-300/10 bg-teal-300/5 text-teal-300/20' : 'border-teal-400/15 bg-white/40 text-teal-600/20'}`}>
          <Video size={20} />
        </div>

        <div className={`absolute bottom-[20%] left-[11%] rotate-6 rounded-xl border p-2.5 ${darkMode ? 'border-green-300/10 bg-green-300/5 text-green-300/20' : 'border-green-400/15 bg-white/40 text-green-600/20'}`}>
          <CalendarDays size={19} />
        </div>

        <div className={`absolute bottom-[19%] right-[11%] rotate-[-8deg] rounded-xl border p-2.5 ${darkMode ? 'border-emerald-300/10 bg-emerald-300/5 text-emerald-300/20' : 'border-emerald-400/15 bg-white/40 text-emerald-600/20'}`}>
          <Target size={20} />
        </div>

        <Sparkles size={16} className={`absolute left-[24%] top-[15%] ${darkMode ? 'text-emerald-300/15' : 'text-emerald-600/15'}`} />

        <Sparkles size={17} className={`absolute bottom-[15%] right-[25%] ${darkMode ? 'text-teal-300/15' : 'text-teal-600/15'}`} />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-100">
        {/* Close */}
        <button
          type="button"
          onClick={closeHandle}
          aria-label="Close login"
          className={`absolute -right-2 -top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg transition-all duration-200 hover:scale-105 ${theme.close}`}
        >
          <X size={18} />
        </button>

        <div className={`overflow-hidden rounded-3xl border backdrop-blur-2xl transition-all duration-300 ${theme.card}`}>
          {/* Compact header */}
          <div className={`relative overflow-hidden bg-linear-to-br px-5 pb-5 pt-5 text-white sm:px-6 sm:pb-6 sm:pt-6 ${theme.top}`}>
            <div className="pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-md">
                  <LockKeyhole size={21} />
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/75 backdrop-blur-md">
                  <Circle size={6} fill="currentColor" className="text-emerald-200" />
                  Secure
                </div>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-[27px]">Welcome Back 👋</h1>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">Login to continue to your MineSpace workspace.</p>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/10 px-2.5 py-1.5 backdrop-blur-md">
                  <CheckCircle2 size={12} />
                  <span className="text-[9px] font-medium text-white/75">Workspace</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/10 px-2.5 py-1.5 backdrop-blur-md">
                  <Sparkles size={12} />
                  <span className="text-[9px] font-medium text-white/75">Focus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            {error && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-500">
                <Circle size={7} fill="currentColor" className="shrink-0" />

                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitHandle} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className={`mb-1.5 block text-xs font-semibold ${theme.label}`}>
                  Email
                </label>

                <div className="relative">
                  <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.icon}`} />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={obj.email}
                    onChange={changeHandle}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className={`w-full rounded-xl border py-3 pl-10 pr-3.5 text-xs outline-none transition-all duration-200 focus:ring-4 sm:text-sm ${theme.input}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className={`block text-xs font-semibold ${theme.label}`}>
                    Password
                  </label>

                  <span className={`flex items-center gap-1 text-[9px] ${theme.muted}`}>
                    <LockKeyhole size={10} />
                    Protected
                  </span>
                </div>

                <div className="relative">
                  <LockKeyhole size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.icon}`} />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={obj.password}
                    onChange={changeHandle}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className={`w-full rounded-xl border py-3 pl-10 pr-11 text-xs outline-none transition-all duration-200 focus:ring-4 sm:text-sm ${theme.input}`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 transition ${darkMode ? 'text-white/35 hover:bg-emerald-400/10 hover:text-emerald-300' : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'}`}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-0.5 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 hover:shadow-xl hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:text-sm"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    LOGGING IN...
                  </>
                ) : (
                  <>
                    LOGIN
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className={`h-px flex-1 ${theme.divider}`} />

              <span className={`text-[9px] font-semibold uppercase tracking-widest ${theme.muted}`}>OR</span>

              <div className={`h-px flex-1 ${theme.divider}`} />
            </div>

            {/* Register */}
            <div className="text-center">
              <p className={`text-xs ${theme.muted}`}>
                Don't have an account?{' '}
                <Link to="/register" onClick={registerHandle} className={`font-bold transition hover:underline ${darkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'}`}>
                  Create one
                </Link>
              </p>
            </div>

            {/* Small trust line */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <FileText size={11} className={theme.muted} />

              <span className={`text-[9px] ${theme.muted}`}>Secure access to your workspace</span>
            </div>
          </div>
        </div>

        <p className={`mt-3 text-center text-[10px] ${darkMode ? 'text-white/30' : 'text-slate-400'}`}>Your workspace. Your focus. Your MineSpace.</p>
      </div>
    </div>
  )
}
