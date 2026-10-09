import React from 'react'
import { Archive, BookOpen, CheckSquare } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function Archived() {
  const navigate = useNavigate()
  const location = useLocation()

  const active = location.pathname.includes('/archived/notebook') ? 'notebook' : 'todo'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-(--color-bg)">
      <div className="mx-auto flex h-full min-h-0 w-full flex-col">
        {/* header */}
        <div className="mb-6 shrink-0 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            {/* title */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primary)">
                <Archive size={18} />
              </div>

              <div className="min-w-0">
                <h1 className="text-sm font-extrabold text-(--color-text)">Archived</h1>

                <p className="mt-0.5 text-[10px] text-(--color-muted)">Keep your workspace organized</p>
              </div>
            </div>

            {/* navigation switch */}
            <div className="flex shrink-0 items-center rounded-xl border border-(--color-border) bg-(--color-bg) p-1">
              <button
                type="button"
                onClick={() => navigate('/archived')}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[10px] font-bold transition active:scale-[0.97] ${
                  active === 'todo' ? 'bg-(--color-primary) text-white shadow-sm' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)'
                }`}
              >
                <CheckSquare size={14} />
                Todo
              </button>

              <button
                type="button"
                onClick={() => navigate('/archived/notebook')}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[10px] font-bold transition active:scale-[0.97] ${
                  active === 'notebook' ? 'bg-(--color-primary) text-white shadow-sm' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)'
                }`}
              >
                <BookOpen size={14} />
                Notebook
              </button>
            </div>
          </div>
        </div>

        {/* archived content */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
