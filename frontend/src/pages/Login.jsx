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

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto bg-[#3B2A20]/45 px-3 py-4 backdrop-blur-xl sm:px-5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#D8B08C]/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-[#B8794A]/15 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F0DCC8]/30 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
        <div className="absolute left-[9%] top-[24%] -rotate-12 rounded-xl border border-[#B8794A]/15 bg-[#FFF9F2]/20 p-2.5 text-[#A97850]/30">
          <PenLine size={19} />
        </div>

        <div className="absolute right-[10%] top-[20%] rotate-12 rounded-xl border border-[#B8794A]/15 bg-[#FFF9F2]/20 p-2.5 text-[#A97850]/30">
          <Video size={20} />
        </div>

        <div className="absolute bottom-[20%] left-[11%] rotate-6 rounded-xl border border-[#D8B08C]/20 bg-[#FFF9F2]/25 p-2.5 text-[#A97850]/30">
          <CalendarDays size={19} />
        </div>

        <div className="absolute bottom-[19%] right-[11%] rotate-[-8deg] rounded-xl border border-[#B8794A]/15 bg-[#FFF9F2]/20 p-2.5 text-[#A97850]/30">
          <Target size={20} />
        </div>

        <Sparkles size={16} className="absolute left-[24%] top-[15%] text-[#A97850]/25" />

        <Sparkles size={17} className="absolute bottom-[15%] right-[25%] text-[#A97850]/25" />
      </div>

      <div className="relative w-full max-w-100">
        <button
          type="button"
          onClick={closeHandle}
          aria-label="Close login"
          className="absolute -right-2 -top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#DCC7B4] bg-[#FFF9F2] text-[#806F62] shadow-lg shadow-[#795232]/15 transition-all duration-200 hover:scale-105 hover:border-[#C97A6E] hover:bg-[#FBE7E3] hover:text-[#B24F43]"
        >
          <X size={18} />
        </button>

        <div className="overflow-hidden rounded-3xl border border-[#E4D5C5] bg-[#FFF9F2] shadow-[0_25px_80px_rgba(91,61,39,0.25)] backdrop-blur-2xl">
          <div className="relative overflow-hidden bg-linear-to-br from-[#9A6847] via-[#B8794A] to-[#7E563B] px-5 pb-5 pt-5 text-white sm:px-6 sm:pb-6 sm:pt-6">
            <div className="pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full bg-white/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-[#F7EBDD]/15 blur-3xl" />

            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/12 shadow-lg backdrop-blur-md">
                  <LockKeyhole size={21} />
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-md">
                  <Circle size={6} fill="currentColor" className="text-[#F7EBDD]" />
                  Secure
                </div>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-[27px]">Welcome Back 👋</h1>

              <p className="mt-1.5 text-xs leading-5 text-white/75 sm:text-sm">Login to continue to your MineSpace workspace.</p>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/10 px-2.5 py-1.5 backdrop-blur-md">
                  <CheckCircle2 size={12} />

                  <span className="text-[9px] font-medium text-white/80">Workspace</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/10 px-2.5 py-1.5 backdrop-blur-md">
                  <Sparkles size={12} />

                  <span className="text-[9px] font-medium text-white/80">Focus</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">
            {error && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-[#E2BDB4] bg-[#FFF1EE] px-3.5 py-2.5 text-xs font-medium text-[#B24F43]">
                <Circle size={7} fill="currentColor" className="shrink-0" />

                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitHandle} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[#594235]">
                  Email
                </label>

                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A97850]" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={obj.email}
                    onChange={changeHandle}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#E4D5C5] bg-[#FDF8F2] py-3 pl-10 pr-3.5 text-xs text-[#3B2A20] outline-none placeholder:text-[#A8988A] transition-all duration-200 focus:border-[#B8794A] focus:bg-[#FFFDF9] focus:ring-4 focus:ring-[#B8794A]/10 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-[#594235]">
                    Password
                  </label>

                  <span className="flex items-center gap-1 text-[9px] text-[#9A897B]">
                    <LockKeyhole size={10} />
                    Protected
                  </span>
                </div>

                <div className="relative">
                  <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A97850]" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={obj.password}
                    onChange={changeHandle}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[#E4D5C5] bg-[#FDF8F2] py-3 pl-10 pr-11 text-xs text-[#3B2A20] outline-none placeholder:text-[#A8988A] transition-all duration-200 focus:border-[#B8794A] focus:bg-[#FFFDF9] focus:ring-4 focus:ring-[#B8794A]/10 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#9A897B] transition hover:bg-[#F3E5D7] hover:text-[#8C5D3D]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-0.5 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#B8794A] via-[#A66F48] to-[#7E563B] py-3 text-xs font-bold text-white shadow-lg shadow-[#A97850]/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#C48758] hover:via-[#B8794A] hover:to-[#8C6043] hover:shadow-xl hover:shadow-[#A97850]/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:text-sm"
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

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E8D8C8]" />

              <span className="text-[9px] font-semibold uppercase tracking-widest text-[#A8988A]">OR</span>

              <div className="h-px flex-1 bg-[#E8D8C8]" />
            </div>

            <div className="text-center">
              <p className="text-xs text-[#806F62]">
                Don't have an account?{' '}
                <Link to="/register" onClick={registerHandle} className="font-bold text-[#A66F48] transition hover:text-[#7E563B] hover:underline">
                  Create one
                </Link>
                
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <FileText size={11} className="text-[#A8988A]" />

              <span className="text-[9px] text-[#A8988A]">Secure access to your workspace</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-[#806F62]">Your workspace. Your focus. Your MineSpace.</p>
      </div>
    </div>
  )
}
