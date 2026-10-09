import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ArchiveRestore, BarChart3, BookOpen, CheckSquare, ChevronLeft, ChevronRight, CircleUserRound, FileKey2, Home, LogOut, X } from 'lucide-react'
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
    label: 'Archived',
    path: '/archived',
    icon: ArchiveRestore,
  },
  // {
  //   label: 'Dashboard',
  //   path: '/dashboard',
  //   icon: BarChart3,
  // },
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
      ${isActive ? 'bg-(--color-soft) text-(--color-primaryDark) shadow-[0_3px_10px_rgba(121,82,50,0.05)]' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-primaryDark)'}
    `
  }

  const renderNavItem = (item) => {
    const Icon = item.icon

    return (
      <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={handleNavigation} className={navItemClass}>
        {({ isActive }) => (
          <>
            {isActive && <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-(--color-primary)" />}

            <span
              className={`
                flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                transition-all duration-200
                ${isActive ? 'bg-(--color-surface) text-(--color-primary)' : 'text-(--color-muted) group-hover:text-(--color-secondary)'}
              `}
            >
              <Icon size={17} strokeWidth={isActive ? 2.3 : 2} />
            </span>

            <span
              className={`
                min-w-0 truncate transition-all duration-200
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
      {mobileOpen && <button type="button" aria-label="Close sidebar" onClick={onClose} className="fixed inset-0 z-40 bg-(--color-text)/25 backdrop-blur-[2px] lg:hidden" />}

      <aside
        className={`
          fixed bottom-0 left-0 top-17 z-50 flex w-64 flex-col
          border-r border-(--color-border)
          bg-(--color-surface)
          shadow-[8px_0_25px_rgba(121,82,50,0.05)]
          transition-all duration-300

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
                text-(--color-muted)
                ${open ? 'justify-start' : 'justify-center'}
              `}
            >
              <FiGrid size={11} />

              {open && <span>Workspace</span>}
            </div>
          </div>

          <nav className="space-y-0.5">{navigationItems.map(renderNavItem)}</nav>

          <div className="my-3 h-px bg-(--color-borderSoft)" />

          <div className="mb-1.5 px-1">
            <p
              className={`
                text-[9px] font-bold uppercase tracking-[0.14em]
                text-(--color-muted)
                ${open ? 'opacity-100' : 'text-center opacity-0'}
              `}
            >
              Account
            </p>
          </div>

          <nav className="space-y-0.5">{accountItems.map(renderNavItem)}</nav>
        </div>

        <div className="border-t border-(--color-borderSoft) p-2.5">
          {user ? (
            <div
              className={`
                rounded-xl border border-(--color-border)
                bg-(--color-bg)
                p-2
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
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-[11px] font-bold text-white shadow-sm transition-transform duration-200 hover:scale-105"
                >
                  {getInitial()}
                </button>

                {open && (
                  <>
                    <button type="button" onClick={() => navigate('/profile')} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[11px] font-bold text-(--color-text)">{user.name}</p>

                      <p className="mt-0.5 truncate text-[9px] text-(--color-muted)">{user.email}</p>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      aria-label="Sign out"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-(--color-muted) transition-colors hover:bg-(--color-dangerBg) hover:text-(--color-danger)"
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
                rounded-xl border border-(--color-border)
                bg-(--color-bg)
                p-2
                ${open ? '' : 'flex justify-center'}
              `}
            >
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className={`
                  flex items-center
                  text-[11px] font-bold text-(--color-primaryDark)
                  transition-colors hover:text-(--color-primary)
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
            className="mt-2.5 hidden h-8 w-full items-center justify-center rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-muted) transition-all duration-200 hover:bg-(--color-soft) hover:text-(--color-primaryDark) active:scale-[0.98] lg:flex"
          >
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg text-(--color-muted) transition-colors hover:bg-(--color-soft) hover:text-(--color-primaryDark) lg:hidden"
        >
          <X size={18} />
        </button>
      </aside>
    </>
  )
}
