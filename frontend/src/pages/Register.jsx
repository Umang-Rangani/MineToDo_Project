import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, User, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { axiosInstance } from '../axiosConfig/axiosInstance'

export default function Register({ onLoginClick }) {
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F0E7] px-3 py-4 sm:px-5 sm:py-5">
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#D8B08C]/25 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#B8794A]/15 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8D4C0]/25 blur-3xl" />

      <div className="pointer-events-none absolute left-[8%] top-[20%] hidden rotate-[-10deg] rounded-xl border border-[#B8794A]/15 bg-[#FFF9F2]/30 p-2.5 text-[#A97850]/25 sm:block">
        <Sparkles size={18} />
      </div>

      <div className="pointer-events-none absolute bottom-[18%] right-[9%] hidden rotate-12 rounded-xl border border-[#B8794A]/15 bg-[#FFF9F2]/30 p-2.5 text-[#A97850]/25 sm:block">
        <UserPlus size={18} />
      </div>

      <div className="relative w-full max-w-95 sm:max-w-105">
        <div className="overflow-hidden rounded-3xl border border-[#E4D5C5] bg-[#FFF9F2]/98 shadow-[0_20px_60px_rgba(91,61,39,0.18)] backdrop-blur-xl">
          <div className="relative overflow-hidden bg-linear-to-br from-[#9A6847] via-[#B8794A] to-[#7E563B] px-5 py-4 text-white sm:px-6 sm:py-5">
            <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/15 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-14 -left-8 h-28 w-28 rounded-full bg-[#F7EBDD]/15 blur-2xl" />

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
              <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-[#E2BDB4] bg-[#FFF1EE] px-3 py-2.5 text-[11px] font-medium text-[#B24F43]">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-[#D8C3A9] bg-[#F8F0E6] px-3 py-2.5 text-[11px] font-medium text-[#8C694C]">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={submitHandle} className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-[#594235]">Name</label>

                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A97850]" />

                  <input
                    type="text"
                    name="name"
                    value={obj.name}
                    onChange={changeHandle}
                    placeholder="Enter your name"
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#E4D5C5] bg-[#FDF8F2] py-2.5 pl-10 pr-3.5 text-xs text-[#3B2A20] outline-none placeholder:text-[#A8988A] transition-all duration-200 focus:border-[#B8794A] focus:bg-[#FFFDF9] focus:ring-4 focus:ring-[#B8794A]/10 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-[#594235]">Email</label>

                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A97850]" />

                  <input
                    type="email"
                    name="email"
                    value={obj.email}
                    onChange={changeHandle}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#E4D5C5] bg-[#FDF8F2] py-2.5 pl-10 pr-3.5 text-xs text-[#3B2A20] outline-none placeholder:text-[#A8988A] transition-all duration-200 focus:border-[#B8794A] focus:bg-[#FFFDF9] focus:ring-4 focus:ring-[#B8794A]/10 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-[#594235]">Password</label>

                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A97850]" />

                  <input
                    type="password"
                    name="password"
                    value={obj.password}
                    onChange={changeHandle}
                    placeholder="Enter password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#E4D5C5] bg-[#FDF8F2] py-2.5 pl-10 pr-3.5 text-xs text-[#3B2A20] outline-none placeholder:text-[#A8988A] transition-all duration-200 focus:border-[#B8794A] focus:bg-[#FFFDF9] focus:ring-4 focus:ring-[#B8794A]/10 sm:text-sm"
                  />
                </div>

                <p className="mt-1 text-[9px] text-[#9A897B]">Minimum 6 characters</p>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-[#594235]">Confirm Password</label>

                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A97850]" />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={obj.confirmPassword}
                    onChange={changeHandle}
                    placeholder="Confirm password"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#E4D5C5] bg-[#FDF8F2] py-2.5 pl-10 pr-3.5 text-xs text-[#3B2A20] outline-none placeholder:text-[#A8988A] transition-all duration-200 focus:border-[#B8794A] focus:bg-[#FFFDF9] focus:ring-4 focus:ring-[#B8794A]/10 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#B8794A] via-[#A66F48] to-[#7E563B] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#A97850]/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#C48758] hover:via-[#B8794A] hover:to-[#8C6043] hover:shadow-xl hover:shadow-[#A97850]/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:py-3 sm:text-sm"
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

            <div className="my-3.5 h-px bg-[#E8D8C8]" />

            <div className="text-center text-[11px] text-[#806F62] sm:text-xs">
              Already have an account?{' '}
              <button type="button" onClick={onLoginClick} className="font-bold text-[#A66F48] transition-colors hover:text-[#7E563B] hover:underline">
                Login
              </button>
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-center text-[9px] text-[#806F62]">Your workspace. Your focus. Your MineSpace.</p>
      </div>
    </div>
  )
}
