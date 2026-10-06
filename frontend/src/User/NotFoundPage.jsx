import React from 'react'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { FaRegCompass } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-bg) px-4 py-8 text-(--color-text)">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primaryDark)">
            <FaRegCompass className="text-4xl" />
          </div>

          <div className="mt-6">
            <p className="text-6xl font-black tracking-tighter text-(--color-primaryDark) sm:text-7xl">404</p>

            <h1 className="mt-3 text-xl font-extrabold tracking-tight sm:text-2xl">Page not found</h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-(--color-muted)">The page you are looking for does not exist or may have been moved somewhere else.</p>
          </div>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link to="/" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-4 text-sm font-bold text-white transition hover:bg-(--color-primaryDark)">
              <Home size={16} />
              Go Home
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg) px-4 text-sm font-bold text-(--color-primaryDark) transition hover:bg-(--color-soft)"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-(--color-border) pt-5 text-xs text-(--color-muted)">
            <Search size={13} />
            <span>Try navigating from the sidebar</span>
          </div>
        </div>
      </div>
    </main>
  )
}
