import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut, Menu, UserPlus, X, ChevronRight, Sparkles } from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function Header({ onLoginClick }) {
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

  const openLogin = () => {
    setMenuOpen(false)
    onLoginClick?.()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#07110D]/95 shadow-[0_8px_35px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
      <div className="mx-auto flex h-17 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => goTo(user ? '/todo' : '/')} className="group flex min-w-0 items-center">
          <div className="flex items-center leading-none">
            <img src="/minespace-logo.png" alt="MineSpace" className="h-10 w-auto object-contain sm:h-11" />

            <div className="-ml-0.5 flex items-center leading-none">
              <span className="text-[20px] font-extrabold tracking-[-0.04em] text-[#35C979]">Mine</span>

              <span className="text-[20px] font-extrabold tracking-[-0.04em] text-[#20B8A2]">Space</span>
            </div>
          </div>
        </button>

        <div className="hidden items-center md:flex">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 shadow-[0_4px_18px_rgba(16,185,129,0.06)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 via-green-500 to-teal-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">{getInitial()}</div>

                <div className="hidden leading-tight lg:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/70">Welcome back</p>

                  <p className="max-w-36 truncate text-sm font-bold text-slate-200">{user.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goTo('/todo')}
                className="group flex items-center gap-2 rounded-xl border border-emerald-800/70 bg-[#0B1A14] px-4 py-2.5 text-sm font-semibold text-emerald-400 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-950/70 hover:shadow-[0_8px_22px_rgba(16,185,129,0.12)]"
              >
                <Sparkles size={15} className="text-emerald-400 transition-transform duration-200 group-hover:rotate-12" />
                Workspace
                <ChevronRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={logoutHandle}
                className="group flex items-center gap-2 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-800 hover:bg-red-950/60 hover:shadow-[0_8px_22px_rgba(239,68,68,0.10)]"
              >
                <LogOut size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={openLogin}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0B1712] px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-emerald-800 hover:bg-emerald-950/40 hover:text-emerald-400"
              >
                <LogIn size={17} />
                Login
              </button>

              <button
                type="button"
                onClick={() => goTo('/register')}
                className="group flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/15 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 hover:shadow-xl hover:shadow-emerald-500/20"
              >
                <UserPlus size={17} className="transition-transform duration-200 group-hover:scale-110" />
                Get Started
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-emerald-400 transition-all duration-200 hover:border-emerald-800 hover:bg-emerald-950/60 active:scale-95 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`overflow-hidden border-t border-slate-800 bg-[#07110D]/98 backdrop-blur-2xl transition-all duration-300 md:hidden ${menuOpen ? 'max-h-125 opacity-100' : 'max-h-0 border-t-0 opacity-0'}`}>
        <div className="px-4 py-4 sm:px-6">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/60 bg-linear-to-br from-emerald-950/70 to-slate-900 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 via-green-500 to-teal-500 text-base font-bold text-white shadow-lg shadow-emerald-500/20">{getInitial()}</div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/70">Welcome back</p>

                  <p className="truncate text-base font-bold text-slate-200">{user.name}</p>

                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goTo('/todo')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-800/70 bg-linear-to-r from-emerald-950/60 to-green-950/40 py-3 text-sm font-bold text-emerald-400 transition active:scale-[0.98] hover:border-emerald-600 hover:bg-emerald-950"
              >
                <Sparkles size={17} />
                Workspace
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={logoutHandle}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/60 bg-red-950/30 py-3 text-sm font-semibold text-red-400 transition active:scale-[0.98] hover:border-red-800 hover:bg-red-950/60"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={openLogin}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-sm font-semibold text-slate-300 transition active:scale-[0.98] hover:border-emerald-800 hover:bg-emerald-950/50 hover:text-emerald-400"
              >
                <LogIn size={18} />
                Login
              </button>

              <button
                type="button"
                onClick={() => goTo('/register')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/15 transition hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98]"
              >
                <UserPlus size={18} />
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
