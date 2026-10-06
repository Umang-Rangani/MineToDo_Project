import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogIn, LogOut, Menu, Palette, Search, Settings, UserRound, UserPlus, X } from 'lucide-react'
import { FiCommand } from 'react-icons/fi'

import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'

export default function Header({ onMenuClick }) {
  const navigate = useNavigate()

  const { user, logoutUser, setShowLogin, setShowRegister } = useUser()

  const { theme, themes, changeTheme } = useTheme()

  const [searchValue, setSearchValue] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || 'U'
  }

  const closeMenus = () => {
    setShowAccount(false)
    setShowNotifications(false)
    setShowThemes(false)
    setMobileMenuOpen(false)
  }

  const goTo = (path) => {
    navigate(path)
    closeMenus()
  }

  const openLogin = () => {
    setShowRegister(false)
    setShowLogin(true)
    closeMenus()
  }

  const openRegister = () => {
    setShowLogin(false)
    setShowRegister(true)
    closeMenus()
  }

  const logoutHandle = async () => {
    await logoutUser()

    closeMenus()
    navigate('/')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    const value = searchValue.trim()

    if (!value) {
      return
    }

    navigate(`/todo?search=${encodeURIComponent(value)}`)

    setMobileSearchOpen(false)
    closeMenus()
  }

  const handleThemeChange = (themeName) => {
    changeTheme(themeName)
    setShowThemes(false)
  }

  const currentTheme = themes[theme]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--color-border) bg-(--color-surface)/95 text-(--color-text) shadow-[0_4px_20px_rgba(121,82,50,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-17 w-full items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--color-primaryDark) transition-all duration-200 hover:bg-(--color-soft) hover:text-(--color-primary) active:scale-95 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <button type="button" onClick={() => goTo('/')} className="group flex shrink-0 items-center leading-none" aria-label="Go to home">
          <img src="/minespace-logo.png" alt="MineSpace" className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:h-10" />

          <div className="-ml-0.5 flex items-center leading-none">
            <span className="text-[18px] font-extrabold tracking-[-0.04em] text-(--color-secondary) sm:text-[20px]">Mine</span>

            <span className="text-[18px] font-extrabold tracking-[-0.04em] text-(--color-primaryDark) sm:text-[20px]">Space</span>
          </div>
        </button>
{/* 
        <form onSubmit={handleSearchSubmit} className="mx-auto hidden w-full max-w-130 md:block">
          <div className="group flex h-9 items-center gap-2 rounded-lg border border-(--color-border) bg-(--color-bg) px-3 transition-all duration-200 focus-within:border-(--color-primary) focus-within:bg-(--color-surface) focus-within:shadow-[0_0_0_3px_rgba(184,121,74,0.07)]">
            <Search size={17} className="shrink-0 text-(--color-muted) transition-colors group-focus-within:text-(--color-primary)" />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search your workspace..."
              className="min-w-0 flex-1 bg-transparent text-[13px] text-(--color-text) outline-none placeholder:text-(--color-muted)"
            />

            <div className="hidden items-center gap-1 rounded-md border border-(--color-border) bg-(--color-surface) px-1.5 py-0.5 text-[9px] font-semibold text-(--color-muted) lg:flex">
              <FiCommand size={10} />
              <span>K</span>
            </div>
          </div>
        </form> */}

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen((prev) => !prev)
              setMobileMenuOpen(false)
              setShowAccount(false)
              setShowNotifications(false)
              setShowThemes(false)
            }}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-(--color-muted) transition-all duration-200 hover:bg-(--color-soft) hover:text-(--color-primaryDark) active:scale-95 md:hidden"
          >
            {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setShowAccount((prev) => !prev)
                setShowNotifications(false)
                setShowThemes(false)
              }}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-bg) px-1.5 transition-all duration-200 hover:border-(--color-secondary) hover:bg-(--color-soft) sm:px-2"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-white shadow-sm">
                {user ? <span className="text-[11px] font-bold">{getInitial()}</span> : <UserRound size={14} />}
              </span>

              <span className="hidden max-w-25 truncate text-[11px] font-bold text-(--color-text) lg:block">{user?.name || 'Account'}</span>

              <ChevronDown size={14} className={`hidden text-(--color-muted) transition-transform duration-200 sm:block ${showAccount ? 'rotate-180' : ''}`} />
            </button>

            {showAccount && (
              <div className="absolute right-0 top-11 z-100 w-56 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-[0_14px_35px_rgba(121,82,50,0.12)]">
                {user ? (
                  <>
                    <div className="border-b border-(--color-borderSoft) px-2.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-xs font-bold text-white">{getInitial()}</div>

                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-bold text-(--color-text)">{user.name}</p>

                          <p className="truncate text-[10px] text-(--color-muted)">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => goTo('/profile')}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-(--color-muted) transition-colors hover:bg-(--color-soft) hover:text-(--color-primaryDark)"
                    >
                      <UserRound size={16} />
                      Profile
                    </button>

                    <button type="button" className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-(--color-muted) transition-colors hover:bg-(--color-soft) hover:text-(--color-primaryDark)">
                      <Settings size={16} />
                      Settings
                    </button>

                    <div className="my-1 h-px bg-(--color-borderSoft)" />

                    <button type="button" onClick={logoutHandle} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-(--color-danger) transition-colors hover:bg-(--color-dangerBg)">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={openLogin}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-(--color-muted) transition-colors hover:bg-(--color-soft) hover:text-(--color-primaryDark)"
                    >
                      <LogIn size={16} />
                      Login
                    </button>

                    <button type="button" onClick={openRegister} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-(--color-primary) transition-colors hover:bg-(--color-soft)">
                      <UserPlus size={16} />
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev)
                setShowAccount(false)
                setShowThemes(false)
              }}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-(--color-muted) transition-all duration-200 hover:bg-(--color-soft) hover:text-(--color-primaryDark) active:scale-95"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-1.75 h-1.5 w-1.5 rounded-full bg-(--color-primary) ring-2 ring-(--color-surface)" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-11 z-100 w-68 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) shadow-[0_14px_35px_rgba(121,82,50,0.12)]">
                <div className="border-b border-(--color-borderSoft) px-3.5 py-2.5">
                  <p className="text-[13px] font-bold text-(--color-text)">Notifications</p>

                  <p className="mt-0.5 text-[11px] text-(--color-muted)">Your latest updates</p>
                </div>

                <div className="px-3.5 py-6 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primary)">
                    <Bell size={17} />
                  </div>

                  <p className="mt-2.5 text-[11px] font-medium text-(--color-muted)">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowThemes((prev) => !prev)
                setShowAccount(false)
                setShowNotifications(false)
              }}
              aria-label="Choose theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-(--color-muted) transition-all duration-200 hover:bg-(--color-soft) hover:text-(--color-primaryDark) active:scale-95"
            >
              <Palette size={18} />
            </button>

            {showThemes && (
              <div className="absolute right-0 top-11 z-100 w-56 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-[0_14px_35px_rgba(121,82,50,0.12)]">
                <div className="px-2.5 py-2">
                  <p className="text-[12px] font-bold text-(--color-text)">Choose Theme</p>

                  <p className="mt-0.5 text-[10px] text-(--color-muted)">Customize your workspace</p>
                </div>

                <div className="space-y-0.5">
                  {Object.entries(themes).map(([themeKey, themeData]) => {
                    const isActive = theme === themeKey

                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => handleThemeChange(themeKey)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-200 ${isActive ? 'bg-(--color-soft)' : 'hover:bg-(--color-soft)'}`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-(--color-bg) text-sm">{themeData.emoji}</span>

                        <span className="min-w-0 flex-1">
                          <span className={`block text-[11px] font-bold ${isActive ? 'text-(--color-primaryDark)' : 'text-(--color-text)'}`}>{themeData.name}</span>
                        </span>

                        {isActive && <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-(--color-primary) text-[9px] font-bold text-white">✓</span>}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-1.5 border-t border-(--color-borderSoft) px-2.5 py-2">
                  <p className="text-[9px] font-medium text-(--color-muted)">
                    Current: {currentTheme?.emoji} {currentTheme?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen((prev) => !prev)
              setMobileSearchOpen(false)
              setShowAccount(false)
              setShowNotifications(false)
              setShowThemes(false)
            }}
            aria-label="Open account menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-primaryDark) transition-all duration-200 hover:bg-(--color-soft) active:scale-95 sm:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <UserRound size={18} />}
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <form onSubmit={handleSearchSubmit} className="border-t border-(--color-borderSoft) bg-(--color-surface) px-3 py-2.5 md:hidden">
          <div className="flex h-10 items-center gap-2 rounded-lg border border-(--color-border) bg-(--color-bg) px-3">
            <Search size={17} className="shrink-0 text-(--color-primary)" />

            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search your workspace..."
              className="min-w-0 flex-1 bg-transparent text-[13px] text-(--color-text) outline-none placeholder:text-(--color-muted)"
            />
          </div>
        </form>
      )}

      {mobileMenuOpen && (
        <div className="border-t border-(--color-borderSoft) bg-(--color-surface) px-3 py-2.5 sm:hidden">
          {user ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-(--color-border) bg-(--color-soft) p-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-xs font-bold text-white">{getInitial()}</div>

                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-(--color-text)">{user.name}</p>

                  <p className="truncate text-[10px] text-(--color-muted)">{user.email}</p>
                </div>
              </div>

              <button type="button" onClick={() => goTo('/profile')} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-semibold text-(--color-muted) hover:bg-(--color-soft)">
                <UserRound size={17} />
                Profile
              </button>

              <button type="button" onClick={logoutHandle} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-semibold text-(--color-danger) hover:bg-(--color-dangerBg)">
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={openLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-(--color-border) bg-(--color-surface) py-2.5 text-[13px] font-semibold text-(--color-text) transition hover:bg-(--color-soft) active:scale-[0.98]"
              >
                <LogIn size={17} />
                Login
              </button>

              <button
                type="button"
                onClick={openRegister}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-(--color-primary) via-(--color-secondary) to-(--color-primaryDark) py-2.5 text-[13px] font-bold text-white shadow-md transition hover:-translate-y-0.5 active:scale-[0.98]"
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
