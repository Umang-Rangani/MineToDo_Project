import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, User, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { axiosInstance } from '../axiosConfig/axiosInstance'

export default function Register() {
  const navigate = useNavigate()

  const [obj, setObj] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const changeHandle = (e) => {
    setObj((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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

      setSuccess('Registration successful! Redirecting to login...')

      setObj({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-68px)] overflow-hidden bg-[#050C09] px-4 py-8 sm:py-10">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/5 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-105 justify-center">
        <div className="w-full rounded-3xl border border-slate-800/80 bg-[#0A1410]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-2xl border border-emerald-800/60 bg-emerald-950/50 text-emerald-400 shadow-[0_8px_25px_rgba(16,185,129,0.10)]">
              <UserPlus size={23} />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Create Account</h1>

            <p className="mt-2 text-sm text-slate-500">Create your MineSpace account and start managing your todos.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-800/60 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={submitHandle} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Name</label>

              <div className="relative">
                <User size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />

                <input
                  type="text"
                  name="name"
                  value={obj.name}
                  onChange={changeHandle}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-[#07100C] py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-700 focus:bg-[#09150F] focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Email</label>

              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />

                <input
                  type="email"
                  name="email"
                  value={obj.email}
                  onChange={changeHandle}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-[#07100C] py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-700 focus:bg-[#09150F] focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Password</label>

              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />

                <input
                  type="password"
                  name="password"
                  value={obj.password}
                  onChange={changeHandle}
                  placeholder="Enter password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-800 bg-[#07100C] py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-700 focus:bg-[#09150F] focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-600">Minimum 6 characters</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Confirm Password</label>

              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />

                <input
                  type="password"
                  name="confirmPassword"
                  value={obj.confirmPassword}
                  onChange={changeHandle}
                  placeholder="Confirm password"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-[#07100C] py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-700 focus:bg-[#09150F] focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(16,185,129,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 hover:shadow-[0_14px_35px_rgba(16,185,129,0.22)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  REGISTERING...
                </>
              ) : (
                <>
                  CREATE ACCOUNT
                  <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 h-px bg-slate-800" />

          <div className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
