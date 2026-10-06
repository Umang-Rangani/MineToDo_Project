import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogIn, LogOut, Menu, Moon, Search, Settings, Sun, UserRound, UserPlus, X } from 'lucide-react'
import { FiCommand } from 'react-icons/fi'

import { useUser } from '../context/UserContext'

export default function Header({ onMenuClick, onLoginClick }) {
  const navigate = useNavigate()

  const { user, logoutUser } = useUser()

  const [searchValue, setSearchValue] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || 'U'
  }

  const goTo = (path) => {
    navigate(path)

    setShowAccount(false)
    setShowNotifications(false)
    setMobileMenuOpen(false)
  }

  const openLogin = () => {
    setMobileMenuOpen(false)
    onLoginClick?.()
  }

  const logoutHandle = async () => {
    await logoutUser()

    setShowAccount(false)
    setShowNotifications(false)
    setMobileMenuOpen(false)

    navigate('/')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    const value = searchValue.trim()

    if (!value) {
      return
    }

    navigate(`/todo?search=${encodeURIComponent(value)}`)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E4D5C5] bg-[#FFF9F2]/95 text-[#3B2A20] shadow-[0_4px_20px_rgba(121,82,50,0.06)] backdrop-blur-xl dark:border-[#3A2D25] dark:bg-[#211A16]/95 dark:text-[#F7EBDD]">
      <div className="mx-auto flex h-17 w-full items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-6">
        {/* Mobile sidebar */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#7E563B] transition-all duration-200 hover:bg-[#F7EBDD] hover:text-[#A66F48] active:scale-95 dark:text-[#D5B69B] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70] lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <button type="button" onClick={() => goTo('/')} className="group flex shrink-0 items-center leading-none" aria-label="Go to home">
          <img src="/minespace-logo.png" alt="MineSpace" className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:h-10" />

          <div className="-ml-0.5 flex items-center leading-none">
            <span className="text-[18px] font-extrabold tracking-[-0.04em] text-[#A97850] sm:text-[20px] dark:text-[#C9966D]">Mine</span>

            <span className="text-[18px] font-extrabold tracking-[-0.04em] text-[#7E563B] sm:text-[20px] dark:text-[#E2C3A8]">Space</span>
          </div>
        </button>

        {/* Desktop search */}
        <form onSubmit={handleSearchSubmit} className="mx-auto hidden w-full max-w-130 md:block">
          <div className="group flex h-9 items-center gap-2 rounded-lg border border-[#E4D5C5] bg-[#F7F0E7] px-3 transition-all duration-200 focus-within:border-[#C79B76] focus-within:bg-[#FFF9F2] focus-within:shadow-[0_0_0_3px_rgba(184,121,74,0.07)] dark:border-[#49382D] dark:bg-[#18120F] dark:focus-within:border-[#8F6346] dark:focus-within:bg-[#211A16]">
            <Search size={17} className="shrink-0 text-[#A58C79] transition-colors group-focus-within:text-[#A66F48] dark:text-[#8F7A6A] dark:group-focus-within:text-[#C18B63]" />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search your workspace..."
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#3B2A20] outline-none placeholder:text-[#A58C79] dark:text-[#F7EBDD] dark:placeholder:text-[#907D6E]"
            />

            <div className="hidden items-center gap-1 rounded-md border border-[#E4D5C5] bg-[#FFF9F2] px-1.5 py-0.5 text-[9px] font-semibold text-[#A58C79] lg:flex dark:border-[#49382D] dark:bg-[#2A201B] dark:text-[#9F8A79]">
              <FiCommand size={10} />
              <span>K</span>
            </div>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          {/* Mobile search */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#806F62] transition-all duration-200 hover:bg-[#F7EBDD] hover:text-[#7E563B] active:scale-95 dark:text-[#B8A394] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70] md:hidden"
          >
            {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          {/* Account */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setShowAccount((prev) => !prev)
                setShowNotifications(false)
              }}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E4D5C5] bg-[#F7F0E7] px-1.5 transition-all duration-200 hover:border-[#D5B596] hover:bg-[#F7EBDD] sm:px-2 dark:border-[#49382D] dark:bg-[#2A201B] dark:hover:border-[#70503A] dark:hover:bg-[#34271F]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br from-[#C8956C] to-[#8D6041] text-white shadow-sm">
                {user ? <span className="text-[11px] font-bold">{getInitial()}</span> : <UserRound size={14} />}
              </span>

              <span className="hidden max-w-25 truncate text-[11px] font-bold text-[#5D4232] lg:block dark:text-[#E1C7B1]">{user?.name || 'Account'}</span>

              <ChevronDown size={14} className={`hidden text-[#806F62] transition-transform duration-200 dark:text-[#A89484] sm:block ${showAccount ? 'rotate-180' : ''}`} />
            </button>

            {showAccount && (
              <div className="absolute right-0 top-11 w-56 overflow-hidden rounded-xl border border-[#E4D5C5] bg-[#FFF9F2] p-1.5 shadow-[0_14px_35px_rgba(121,82,50,0.12)] dark:border-[#49382D] dark:bg-[#211A16] dark:shadow-[0_14px_35px_rgba(0,0,0,0.3)]">
                {user ? (
                  <>
                    <div className="border-b border-[#E8D8C8] px-2.5 py-2.5 dark:border-[#3A2D25]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#B8794A] to-[#7E563B] text-xs font-bold text-white">{getInitial()}</div>

                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-bold text-[#3B2A20] dark:text-[#F7EBDD]">{user.name}</p>

                          <p className="truncate text-[10px] text-[#806F62] dark:text-[#9F8A79]">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => goTo('/profile')}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#806F62] transition-colors hover:bg-[#F7EBDD] hover:text-[#7E563B] dark:text-[#B8A394] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70]"
                    >
                      <UserRound size={16} />
                      Profile
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#806F62] transition-colors hover:bg-[#F7EBDD] hover:text-[#7E563B] dark:text-[#B8A394] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70]"
                    >
                      <Settings size={16} />
                      Settings
                    </button>

                    <div className="my-1 h-px bg-[#E8D8C8] dark:bg-[#3A2D25]" />

                    <button type="button" onClick={logoutHandle} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#B24F43] transition-colors hover:bg-[#FFF1EE] dark:hover:bg-[#35221F]">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={openLogin}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#806F62] transition-colors hover:bg-[#F7EBDD] hover:text-[#7E563B] dark:text-[#B8A394] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70]"
                    >
                      <LogIn size={16} />
                      Login
                    </button>

                    <button
                      type="button"
                      onClick={() => goTo('/register')}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#B8794A] transition-colors hover:bg-[#F7EBDD] dark:text-[#C18B63] dark:hover:bg-[#34271F]"
                    >
                      <UserPlus size={16} />
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Notification */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev)
                setShowAccount(false)
              }}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#806F62] transition-all duration-200 hover:bg-[#F7EBDD] hover:text-[#7E563B] active:scale-95 dark:text-[#B8A394] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70]"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-1.75 h-1.5 w-1.5 rounded-full bg-[#B8794A] ring-2 ring-[#FFF9F2] dark:ring-[#211A16]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-11 w-68 overflow-hidden rounded-xl border border-[#E4D5C5] bg-[#FFF9F2] shadow-[0_14px_35px_rgba(121,82,50,0.12)] dark:border-[#49382D] dark:bg-[#211A16] dark:shadow-[0_14px_35px_rgba(0,0,0,0.3)]">
                <div className="border-b border-[#E8D8C8] px-3.5 py-2.5 dark:border-[#3A2D25]">
                  <p className="text-[13px] font-bold text-[#3B2A20] dark:text-[#F7EBDD]">Notifications</p>

                  <p className="mt-0.5 text-[11px] text-[#806F62] dark:text-[#9F8A79]">Your latest updates</p>
                </div>

                <div className="px-3.5 py-6 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EBDD] text-[#B8794A] dark:bg-[#34271F] dark:text-[#C18B63]">
                    <Bell size={17} />
                  </div>

                  <p className="mt-2.5 text-[11px] font-medium text-[#806F62] dark:text-[#A89484]">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* Mode */}
          <button
            type="button"
            aria-label="Toggle theme"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#806F62] transition-all duration-200 hover:bg-[#F7EBDD] hover:text-[#7E563B] active:scale-95 dark:text-[#B8A394] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70] sm:flex"
          >
            <span className="dark:hidden">
              <Moon size={18} />
            </span>

            <span className="hidden dark:block">
              <Sun size={18} />
            </span>
          </button>

          {/* Mobile account */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open account menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4D5C5] bg-[#F7F0E7] text-[#7E563B] transition-all duration-200 hover:bg-[#F7EBDD] active:scale-95 dark:border-[#49382D] dark:bg-[#2A201B] dark:text-[#D09A70] dark:hover:bg-[#34271F] sm:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <UserRound size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {mobileSearchOpen && (
        <form onSubmit={handleSearchSubmit} className="border-t border-[#E8D8C8] bg-[#FFF9F2] px-3 py-2.5 dark:border-[#3A2D25] dark:bg-[#211A16] md:hidden">
          <div className="flex h-10 items-center gap-2 rounded-lg border border-[#E4D5C5] bg-[#F7F0E7] px-3 dark:border-[#49382D] dark:bg-[#18120F]">
            <Search size={17} className="shrink-0 text-[#A66F48] dark:text-[#C18B63]" />

            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search your workspace..."
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#3B2A20] outline-none placeholder:text-[#A58C79] dark:text-[#F7EBDD] dark:placeholder:text-[#907D6E]"
            />
          </div>
        </form>
      )}

      {/* Mobile account menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E8D8C8] bg-[#FFF9F2] px-3 py-2.5 dark:border-[#3A2D25] dark:bg-[#211A16] sm:hidden">
          {user ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-[#E4D5C5] bg-[#F7EBDD] p-2.5 dark:border-[#49382D] dark:bg-[#2D211B]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#B8794A] to-[#7E563B] text-xs font-bold text-white">{getInitial()}</div>

                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-[#3B2A20] dark:text-[#F7EBDD]">{user.name}</p>

                  <p className="truncate text-[10px] text-[#806F62] dark:text-[#9F8A79]">{user.email}</p>
                </div>
              </div>

              <button type="button" onClick={() => goTo('/profile')} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-semibold text-[#806F62] hover:bg-[#F7EBDD] dark:text-[#B8A394] dark:hover:bg-[#34271F]">
                <UserRound size={17} />
                Profile
              </button>

              <button type="button" onClick={logoutHandle} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-semibold text-[#B24F43] hover:bg-[#FFF1EE] dark:hover:bg-[#35221F]">
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={openLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#DDC9B7] bg-[#FFF9F2] py-2.5 text-[13px] font-semibold text-[#624838] transition hover:bg-[#F7EBDD] active:scale-[0.98] dark:border-[#49382D] dark:bg-[#2A201B] dark:text-[#D5B69B] dark:hover:bg-[#34271F]"
              >
                <LogIn size={17} />
                Login
              </button>

              <button
                type="button"
                onClick={() => goTo('/register')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#B8794A] via-[#A66F48] to-[#7E563B] py-2.5 text-[13px] font-bold text-white shadow-md shadow-[#A97850]/15 transition hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <UserPlus size={17} />
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
