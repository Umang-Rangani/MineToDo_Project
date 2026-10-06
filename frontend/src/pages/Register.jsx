import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { UserPlus, User, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, X, Eye, EyeOff } from 'lucide-react'

import { axiosInstance } from '../axiosConfig/axiosInstance'
import { useUser } from '../context/UserContext'

export default function Register({ onClose }) {
  const { setShowLogin, setShowRegister } = useUser()

  const [obj, setObj] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const changeHandle = (e) => {
    setObj((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    if (error) {
      setError('')
    }

    if (success) {
      setSuccess('')
    }
  }

  const handleClose = () => {
    if (loading) return

    setShowRegister(false)
    onClose?.()
  }

  const handleLoginClick = () => {
    if (loading) return

    setShowRegister(false)
    setShowLogin(true)
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (obj.password !== obj.confirmPassword) {
      setError('Password and Confirm Password do not match')
      return
    }

    if (obj.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)

      await axiosInstance.post('/users/register', obj)

      setSuccess('Registration successful! Opening login...')

      setObj({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      setTimeout(() => {
        setShowRegister(false)
        setShowLogin(true)
      }, 1200)
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const registerContent = (
    <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto bg-(--color-text)/45 px-3 py-4 backdrop-blur-xl sm:px-5 sm:py-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-(--color-secondary)/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-(--color-primary)/15 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-soft)/25 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
        <div className="absolute left-[8%] top-[20%] -rotate-10 rounded-xl border border-(--color-primary)/15 bg-(--color-surface)/20 p-2.5 text-(--color-secondary)/30 backdrop-blur-sm">
          <Sparkles size={18} />
        </div>

        <div className="absolute right-[9%] top-[22%] rotate-12 rounded-xl border border-(--color-primary)/15 bg-(--color-surface)/20 p-2.5 text-(--color-secondary)/30 backdrop-blur-sm">
          <UserPlus size={18} />
        </div>

        <div className="absolute bottom-[18%] left-[10%] rotate-6 rounded-xl border border-(--color-secondary)/15 bg-(--color-surface)/20 p-2.5 text-(--color-secondary)/25 backdrop-blur-sm">
          <ShieldCheck size={18} />
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
          onClick={handleClose}
          disabled={loading}
          aria-label="Close registration"
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
                <UserPlus size={21} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight sm:text-[23px]">Create Account</h1>

                  <span className="hidden items-center gap-1 rounded-full border border-white/20 bg-black/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white/80 sm:flex">
                    <ShieldCheck size={10} />
                    Secure
                  </span>
                </div>

                <p className="mt-0.5 text-[11px] text-white/75 sm:text-xs">Join MineSpace and manage your workspace.</p>
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

            {success && (
              <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-(--color-secondary)/20 bg-(--color-soft) px-3 py-2.5 text-[11px] font-medium text-(--color-primaryDark)">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={submitHandle} className="flex flex-col gap-3">
              <div>
                <label htmlFor="register-name" className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                  Name
                </label>

                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-secondary)" />

                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={obj.name}
                    onChange={changeHandle}
                    placeholder="Enter your name"
                    required
                    autoComplete="name"
                    disabled={loading}
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) py-2.5 pl-10 pr-3.5 text-xs text-(--color-text) outline-none placeholder:text-(--color-muted) transition-all duration-200 focus:border-(--color-primary) focus:bg-(--color-surface) focus:ring-4 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                  Email
                </label>

                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-secondary)" />

                  <input
                    id="register-email"
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
                <label htmlFor="register-password" className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                  Password
                </label>

                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-secondary)" />

                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={obj.password}
                    onChange={changeHandle}
                    placeholder="Enter password"
                    required
                    minLength={6}
                    autoComplete="new-password"
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

                <p className="mt-1 text-[9px] text-(--color-muted)">Minimum 6 characters</p>
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-secondary)" />

                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={obj.confirmPassword}
                    onChange={changeHandle}
                    placeholder="Confirm password"
                    required
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) py-2.5 pl-10 pr-11 text-xs text-(--color-text) outline-none placeholder:text-(--color-muted) transition-all duration-200 focus:border-(--color-primary) focus:bg-(--color-surface) focus:ring-4 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-(--color-muted) transition-colors hover:bg-(--color-soft) hover:text-(--color-primaryDark) disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) via-(--color-secondary) to-(--color-primaryDark) py-2.5 text-xs font-bold text-white shadow-lg shadow-(--color-primary)/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-(--color-primary)/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:py-3 sm:text-sm"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    REGISTERING...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="my-3.5 h-px bg-(--color-borderSoft)" />

            <div className="text-center text-[11px] text-(--color-muted) sm:text-xs">
              Already have an account?{' '}
              <button type="button" onClick={handleLoginClick} disabled={loading} className="font-bold text-(--color-secondary) transition-colors hover:text-(--color-primaryDark) hover:underline disabled:cursor-not-allowed disabled:opacity-50">
                Login
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <ShieldCheck size={11} className="text-(--color-muted)" />

              <span className="text-[9px] text-(--color-muted)">Secure access to your MineSpace workspace</span>
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-center text-[9px] text-(--color-muted)">Your workspace. Your focus. Your MineSpace.</p>
      </div>
    </div>
  )

  return createPortal(registerContent, document.body)
}
