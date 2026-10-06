import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, CheckCircle2, Circle, Eye, EyeOff, FileText, LockKeyhole, Mail, PenLine, Sparkles, Target, UserPlus, Video, X, AlertCircle } from 'lucide-react'

import { axiosInstance } from '../axiosConfig/axiosInstance'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

export default function Login({ onClose, onRegisterClick }) {
  const { loginUser, setShowLogin, setShowRegister, setShowForgotPassword } = useUser()

  const navigate = useNavigate()

  const [obj, setObj] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: '',
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    })

    setTimeout(() => {
      setToast({
        show: false,
        type: '',
        message: '',
      })
    }, 3000)
  }

  const changeHandle = (e) => {
    setObj((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    if (error) {
      setError('')
    }
  }

  const closeHandle = () => {
    if (loading) return

    setShowLogin(false)
    onClose?.()
  }

  const registerHandle = () => {
    if (loading) return

    setShowLogin(false)
    setShowRegister(true)

    onRegisterClick?.()
  }

  const forgotPasswordHandle = () => {
    if (loading) return

    setShowLogin(false)
    setShowForgotPassword(true)
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    setError('')

    if (!obj.email.trim() || !obj.password.trim()) {
      setError('Please enter your email and password.')
      showToast('error', 'Please enter your email and password.')
      return
    }

    try {
      setLoading(true)

      const res = await axiosInstance.post('/users/login', obj)

      loginUser(res.data.user)

      showToast('success', 'Login successful! Welcome back.')

      setTimeout(() => {
        setShowLogin(false)
        onClose?.()
        navigate('/todo')
      }, 700)
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your email and password.'

      setError(message)
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  const loginContent = (
    <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto bg-(--color-text)/45 px-3 py-4 backdrop-blur-xl sm:px-5 sm:py-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-(--color-secondary)/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-(--color-primary)/15 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-soft)/25 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
        <div className="absolute left-[8%] top-[20%] -rotate-10 rounded-xl border border-(--color-primary)/15 bg-(--color-surface)/20 p-2.5 text-(--color-secondary)/30 backdrop-blur-sm">
          <PenLine size={18} />
        </div>

        <div className="absolute right-[9%] top-[22%] rotate-12 rounded-xl border border-(--color-primary)/15 bg-(--color-surface)/20 p-2.5 text-(--color-secondary)/30 backdrop-blur-sm">
          <Video size={18} />
        </div>

        <div className="absolute bottom-[18%] left-[10%] rotate-6 rounded-xl border border-(--color-secondary)/15 bg-(--color-surface)/20 p-2.5 text-(--color-secondary)/25 backdrop-blur-sm">
          <Target size={18} />
        </div>

        <div className="absolute bottom-[18%] right-[10%] -rotate-8 rounded-xl border border-(--color-primary)/15 bg-(--color-surface)/20 p-2.5 text-(--color-secondary)/25 backdrop-blur-sm">
          <CheckCircle2 size={18} />
        </div>

        <Sparkles size={16} className="absolute left-[23%] top-[14%] text-(--color-secondary)/25" />

        <Sparkles size={17} className="absolute bottom-[14%] right-[24%] text-(--color-secondary)/25" />
      </div>

      <div className="relative w-full max-w-105">
        <button
          type="button"
          onClick={closeHandle}
          disabled={loading}
          aria-label="Close login"
          className="absolute -right-2 -top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-muted) shadow-lg shadow-(--color-text)/15 transition-all duration-200 hover:scale-105 hover:border-(--color-danger) hover:bg-(--color-dangerBg) hover:text-(--color-danger) disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-[0_25px_80px_rgba(91,61,39,0.25)]">
          <div className="relative overflow-hidden bg-linear-to-br from-(--color-secondary) via-(--color-primary) to-(--color-primaryDark) px-5 py-4 text-white sm:px-6 sm:py-5">
            <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/15 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-14 -left-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/12 shadow-lg backdrop-blur-md">
                <LockKeyhole size={21} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight sm:text-[23px]">Welcome Back</h1>

                  <span className="hidden items-center gap-1 rounded-full border border-white/20 bg-black/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white/80 sm:flex">
                    <Circle size={6} fill="currentColor" className="text-(--color-soft)" />
                    Secure
                  </span>
                </div>

                <p className="mt-0.5 text-[11px] text-white/75 sm:text-xs">Login to continue to your MineSpace workspace.</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5 sm:py-5">
            {error && (
              <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-(--color-danger)/25 bg-(--color-dangerBg) px-3 py-2.5 text-[11px] font-medium text-(--color-danger)">
                <AlertCircle size={15} className="shrink-0" />

                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitHandle} className="flex flex-col gap-3">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                  Email
                </label>

                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-secondary)" />

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={obj.email}
                    onChange={changeHandle}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) py-2.5 pl-10 pr-3.5 text-xs text-(--color-text) outline-none placeholder:text-(--color-muted) transition-all duration-200 focus:border-(--color-primary) focus:bg-(--color-surface) focus:ring-4 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-secondary)" />

                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={obj.password}
                    onChange={changeHandle}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) py-2.5 pl-10 pr-11 text-xs text-(--color-text) outline-none placeholder:text-(--color-muted) transition-all duration-200 focus:border-(--color-primary) focus:bg-(--color-surface) focus:ring-4 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-(--color-muted) transition-colors hover:bg-(--color-soft) hover:text-(--color-primaryDark) disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={forgotPasswordHandle}
                  disabled={loading}
                  className="text-[11px] font-bold text-(--color-secondary) transition-colors hover:text-(--color-primaryDark) hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) via-(--color-secondary) to-(--color-primaryDark) py-2.5 text-xs font-bold text-white shadow-lg shadow-(--color-primary)/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-(--color-primary)/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:py-3 sm:text-sm"
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

            <div className="my-3.5 h-px bg-(--color-borderSoft)" />

            <div className="text-center text-[11px] text-(--color-muted) sm:text-xs">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={registerHandle}
                disabled={loading}
                className="inline-flex items-center gap-1 font-bold text-(--color-secondary) transition-colors hover:text-(--color-primaryDark) hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserPlus size={13} />
                Create Account
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <FileText size={11} className="text-(--color-muted)" />

              <span className="text-[9px] text-(--color-muted)">Secure access to your MineSpace workspace</span>
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-center text-[9px] text-(--color-muted)">Your workspace. Your focus. Your MineSpace.</p>
      </div>

      {toast.show && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-100000 flex justify-center px-4">
          <div
            className={`pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-semibold shadow-xl backdrop-blur-xl ${
              toast.type === 'success' ? 'border-(--color-secondary)/25 bg-(--color-surface) text-(--color-primaryDark)' : 'border-(--color-danger)/25 bg-(--color-surface) text-(--color-danger)'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={17} className="shrink-0" /> : <AlertCircle size={17} className="shrink-0" />}

            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )

  return createPortal(loginContent, document.body)
}
