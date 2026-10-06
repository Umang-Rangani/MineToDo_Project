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
    <header className="sticky top-0 z-50 w-full border-b border-[#E8D8C8] bg-[#FFF9F2]/95 shadow-[0_8px_35px_rgba(121,82,50,0.10)] backdrop-blur-2xl">
      <div className="mx-auto flex h-17 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => goTo(user ? '/todo' : '/')} className="group flex min-w-0 items-center">
          <div className="flex items-center leading-none">
            <img src="/minespace-logo.png" alt="MineSpace" className="h-10 w-auto object-contain sm:h-11" />

            <div className="-ml-0.5 flex items-center leading-none">
              <span className="text-[20px] font-extrabold tracking-[-0.04em] text-[#A97850]">Mine</span>

              <span className="text-[20px] font-extrabold tracking-[-0.04em] text-[#7E563B]">Space</span>
            </div>
          </div>
        </button>

        <div className="hidden items-center md:flex">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 rounded-2xl border border-[#E5D2C0] bg-[#F7EDE2] px-3 py-2 shadow-[0_4px_18px_rgba(121,82,50,0.08)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#B8794A] via-[#A66F48] to-[#7E563B] text-sm font-bold text-white shadow-lg shadow-[#A97850]/20">{getInitial()}</div>

                <div className="hidden leading-tight lg:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#A97850]">Welcome back</p>

                  <p className="max-w-36 truncate text-sm font-bold text-[#3B2A20]">{user.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goTo('/todo')}
                className="group flex items-center gap-2 rounded-xl border border-[#D8B99D] bg-[#FFF9F2] px-4 py-2.5 text-sm font-semibold text-[#8C5D3D] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8794A] hover:bg-[#F7EBDD] hover:text-[#70482F] hover:shadow-[0_8px_22px_rgba(121,82,50,0.12)]"
              >
                <Sparkles size={15} className="text-[#B8794A] transition-transform duration-200 group-hover:rotate-12" />
                Workspace
                <ChevronRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={logoutHandle}
                className="group flex items-center gap-2 rounded-xl border border-[#E2BDB4] bg-[#FFF5F2] px-4 py-2.5 text-sm font-semibold text-[#B24F43] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C97A6E] hover:bg-[#FBE7E3] hover:shadow-[0_8px_22px_rgba(178,79,67,0.10)]"
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
                className="flex items-center gap-2 rounded-xl border border-[#DDC9B7] bg-[#FFF9F2] px-4 py-2.5 text-sm font-semibold text-[#624838] transition-all duration-200 hover:border-[#B8794A] hover:bg-[#F7EBDD] hover:text-[#8C5D3D]"
              >
                <LogIn size={17} />
                Login
              </button>

              <button
                type="button"
                onClick={() => goTo('/register')}
                className="group flex items-center gap-2 rounded-xl bg-linear-to-r from-[#B8794A] via-[#A66F48] to-[#7E563B] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#A97850]/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#C48758] hover:via-[#B8794A] hover:to-[#8C6043] hover:shadow-xl hover:shadow-[#A97850]/25"
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
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDC9B7] bg-[#F7EBDD] text-[#8C5D3D] transition-all duration-200 hover:border-[#B8794A] hover:bg-[#EEDCCB] hover:text-[#70482F] active:scale-95 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`overflow-hidden border-t border-[#E8D8C8] bg-[#FFF9F2]/98 backdrop-blur-2xl transition-all duration-300 md:hidden ${menuOpen ? 'max-h-125 opacity-100' : 'max-h-0 border-t-0 opacity-0'}`}>
        <div className="px-4 py-4 sm:px-6">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-[#E5D2C0] bg-linear-to-br from-[#F7EBDD] to-[#FFF9F2] p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#B8794A] via-[#A66F48] to-[#7E563B] text-base font-bold text-white shadow-lg shadow-[#A97850]/20">{getInitial()}</div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#A97850]">Welcome back</p>

                  <p className="truncate text-base font-bold text-[#3B2A20]">{user.name}</p>

                  <p className="truncate text-xs text-[#806F62]">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goTo('/todo')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D8B99D] bg-linear-to-r from-[#F7EBDD] to-[#F1DFCF] py-3 text-sm font-bold text-[#8C5D3D] transition active:scale-[0.98] hover:border-[#B8794A] hover:bg-[#EEDCCB]"
              >
                <Sparkles size={17} />
                Workspace
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={logoutHandle}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2BDB4] bg-[#FFF5F2] py-3 text-sm font-semibold text-[#B24F43] transition active:scale-[0.98] hover:border-[#C97A6E] hover:bg-[#FBE7E3]"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDC9B7] bg-[#FFF9F2] py-3 text-sm font-semibold text-[#624838] transition active:scale-[0.98] hover:border-[#B8794A] hover:bg-[#F7EBDD] hover:text-[#8C5D3D]"
              >
                <LogIn size={18} />
                Login
              </button>

              <button
                type="button"
                onClick={() => goTo('/register')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#B8794A] via-[#A66F48] to-[#7E563B] py-3 text-sm font-bold text-white shadow-lg shadow-[#A97850]/20 transition hover:from-[#C48758] hover:via-[#B8794A] hover:to-[#8C6043] hover:shadow-xl hover:shadow-[#A97850]/25] active:scale-[0.98]"
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
