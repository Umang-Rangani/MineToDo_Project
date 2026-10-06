import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BarChart3, BookOpen, CheckSquare, ChevronLeft, ChevronRight, CircleUserRound, FileKey2, Home, LogOut, X } from 'lucide-react'
import { FiGrid } from 'react-icons/fi'

import { useUser } from '../context/UserContext'

const navigationItems = [
  {
    label: 'Home',
    path: '/',
    icon: Home,
  },
  {
    label: 'Todo',
    path: '/todo',
    icon: CheckSquare,
  },
  {
    label: 'Notebook',
    path: '/notebook',
    icon: BookOpen,
  },
  {
    label: 'Vault',
    path: '/vault',
    icon: FileKey2,
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: BarChart3,
  },
]

const accountItems = [
  {
    label: 'Profile',
    path: '/profile',
    icon: CircleUserRound,
  },
]

export default function Sidebar({ open = true, mobileOpen = false, onToggle, onClose }) {
  const navigate = useNavigate()
  const { user, logoutUser } = useUser()

  const getInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || 'U'
  }

  const handleNavigation = () => {
    onClose?.()
  }

  const handleLogout = async () => {
    await logoutUser()
    onClose?.()
    navigate('/')
  }

  const navItemClass = ({ isActive }) => {
    return `
      group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2
      text-[13px] font-semibold transition-all duration-200
      ${
        isActive
          ? 'bg-[#F7EBDD] text-[#7E563B] shadow-[0_3px_10px_rgba(121,82,50,0.05)] dark:bg-[#34271F] dark:text-[#D09A70]'
          : 'text-[#806F62] hover:bg-[#F7EBDD] hover:text-[#7E563B] dark:text-[#B8A394] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70]'
      }
    `
  }

  const renderNavItem = (item) => {
    const Icon = item.icon

    return (
      <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={handleNavigation} className={navItemClass}>
        {({ isActive }) => (
          <>
            {isActive && <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-[#B8794A] dark:bg-[#D09A70]" />}

            <span
              className={`
                flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                transition-all duration-200
                ${isActive ? 'bg-[#FFF9F2] text-[#B8794A] dark:bg-[#2D211B] dark:text-[#D09A70]' : 'text-[#8D7969] group-hover:text-[#A66F48] dark:text-[#9F8A79] dark:group-hover:text-[#C18B63]'}
              `}
            >
              <Icon size={17} strokeWidth={isActive ? 2.3 : 2} />
            </span>

            <span
              className={`
                min-w-0 truncate transition-opacity duration-200
                ${open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'}
              `}
            >
              {item.label}
            </span>
          </>
        )}
      </NavLink>
    )
  }

  return (
    <>
      {mobileOpen && <button type="button" aria-label="Close sidebar" onClick={onClose} className="fixed inset-0 z-40 bg-[#3B2A20]/25 backdrop-blur-[2px] lg:hidden dark:bg-black/45" />}

      <aside
        className={`
          fixed bottom-0 left-0 top-17 z-50 flex w-64 flex-col
          border-r border-[#E4D5C5] bg-[#FFF9F2]
          shadow-[8px_0_25px_rgba(121,82,50,0.05)]
          transition-all duration-300
          dark:border-[#3A2D25] dark:bg-[#211A16]
          dark:shadow-[8px_0_25px_rgba(0,0,0,0.18)]
          ${open ? 'lg:w-64' : 'lg:w-20'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto px-2.5 py-3">
          <div className="mb-3 px-1">
            <div
              className={`
                flex items-center gap-2
                text-[9px] font-bold uppercase tracking-[0.14em]
                text-[#A58C79] dark:text-[#806F62]
                ${open ? 'justify-start' : 'justify-center'}
              `}
            >
              <FiGrid size={11} />

              {open && <span>Workspace</span>}
            </div>
          </div>

          <nav className="space-y-0.5">{navigationItems.map(renderNavItem)}</nav>

          <div className="my-3 h-px bg-[#E8D8C8] dark:bg-[#3A2D25]" />

          <div className="mb-1.5 px-1">
            <p
              className={`
                text-[9px] font-bold uppercase tracking-[0.14em]
                text-[#A58C79] dark:text-[#806F62]
                ${open ? 'opacity-100' : 'text-center opacity-0'}
              `}
            >
              Account
            </p>
          </div>

          <nav className="space-y-0.5">{accountItems.map(renderNavItem)}</nav>
        </div>

        <div className="border-t border-[#E8D8C8] p-2.5 dark:border-[#3A2D25]">
          {user ? (
            <div
              className={`
                rounded-xl border border-[#E4D5C5] bg-[#F7F0E7]
                p-2 dark:border-[#49382D] dark:bg-[#2D211B]
                ${open ? '' : 'flex justify-center'}
              `}
            >
              <div
                className={`
                  flex items-center
                  ${open ? 'gap-2.5' : 'justify-center'}
                `}
              >
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  aria-label="Open profile"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#B8794A] to-[#7E563B] text-[11px] font-bold text-white shadow-sm transition-transform duration-200 hover:scale-105"
                >
                  {getInitial()}
                </button>

                {open && (
                  <>
                    <button type="button" onClick={() => navigate('/profile')} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[11px] font-bold text-[#3B2A20] dark:text-[#F7EBDD]">{user.name}</p>

                      <p className="mt-0.5 truncate text-[9px] text-[#806F62] dark:text-[#9F8A79]">{user.email}</p>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      aria-label="Sign out"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#A58C79] transition-colors hover:bg-[#FFF1EE] hover:text-[#B24F43] dark:text-[#9F8A79] dark:hover:bg-[#35221F] dark:hover:text-[#D09A70]"
                    >
                      <LogOut size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div
              className={`
                rounded-xl border border-[#E4D5C5] bg-[#F7F0E7]
                p-2 dark:border-[#49382D] dark:bg-[#2D211B]
                ${open ? '' : 'flex justify-center'}
              `}
            >
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className={`
                  flex items-center text-[11px] font-bold text-[#7E563B]
                  transition-colors hover:text-[#B8794A]
                  dark:text-[#D09A70] dark:hover:text-[#E2B18B]
                  ${open ? 'gap-2' : 'justify-center'}
                `}
              >
                <CircleUserRound size={16} />

                {open && <span>Guest Account</span>}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
            className="mt-2.5 hidden h-8 w-full items-center justify-center rounded-lg border border-[#E4D5C5] bg-[#FFF9F2] text-[#806F62] transition-all duration-200 hover:bg-[#F7EBDD] hover:text-[#7E563B] active:scale-[0.98] dark:border-[#49382D] dark:bg-[#211A16] dark:text-[#A89484] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70] lg:flex"
          >
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg text-[#806F62] transition-colors hover:bg-[#F7EBDD] hover:text-[#7E563B] lg:hidden dark:text-[#A89484] dark:hover:bg-[#34271F] dark:hover:text-[#D09A70]"
        >
          <X size={18} />
        </button>
      </aside>
    </>
  )
}
