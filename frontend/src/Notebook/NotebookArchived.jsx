import React, { useState } from 'react'
import { Archive, ArchiveRestore, BookOpen, Check, MoreHorizontal, Trash2 } from 'lucide-react'
import { FaRegCalendarAlt } from 'react-icons/fa'

const archiveDates = [
  {
    key: '2026-10-08',
    weekday: 'Thu',
    day: 8,
    month: 'Oct',
  },
  {
    key: '2026-10-07',
    weekday: 'Wed',
    day: 7,
    month: 'Oct',
  },
  {
    key: '2026-10-06',
    weekday: 'Tue',
    day: 6,
    month: 'Oct',
  },
]

const notes = [
  {
    id: 1,
    title: 'React Project Ideas',
    content: 'Build a clean productivity application with Todo, Notebook and Vault features.',
    archivedAt: 'Oct 08, 2026 · 05:42 PM',
  },
  {
    id: 2,
    title: 'Learning Notes',
    content: 'Important concepts and things to revise later from the current learning session.',
    archivedAt: 'Oct 07, 2026 · 08:20 PM',
  },
]

export default function NotebookArchived() {
  const [selectedDate, setSelectedDate] = useState('2026-10-08')
  const [showMenu, setShowMenu] = useState(null)

  const filteredNotes = notes.filter((note) => {
    if (selectedDate === '2026-10-08') return note.id === 1
    if (selectedDate === '2026-10-07') return note.id === 2
    return false
  })

  return (
    <div className="min-h-full bg-(--color-bg)">
      <div className="mx-auto w-full">
        {/* header */}
        <div className="mb-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primary)">
              <Archive size={18} />
            </div>

            <div className="min-w-0">
              <h1 className="text-sm font-extrabold text-(--color-text)">Archived Notes</h1>

              <p className="mt-0.5 text-[10px] text-(--color-muted)">Keep your archived notes organized</p>
            </div>
          </div>
        </div>

        {/* archived content */}
        <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
          <div className="flex min-h-140 flex-col lg:flex-row">
            {/* date sidebar */}
            <aside className="w-full shrink-0 border-b border-(--color-border) lg:w-24 lg:border-b-0 lg:border-r">
              <div className="flex h-full flex-col">
                <div className="border-b border-(--color-border) px-3 py-2.5 lg:px-2 lg:py-3">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-(--color-muted)">Archived</p>
                </div>

                <div className="min-w-0 flex-1 p-2.5 lg:overflow-y-auto lg:p-2 no-scrollbar">
                  <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar lg:flex-col lg:items-center lg:overflow-x-hidden">
                    {archiveDates.map((date) => {
                      const active = selectedDate === date.key

                      return (
                        <button
                          key={date.key}
                          type="button"
                          onClick={() => setSelectedDate(date.key)}
                          className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border transition sm:h-13 sm:w-13 ${
                            active ? 'border-(--color-primary) bg-(--color-primary) text-white shadow-sm' : 'border-(--color-border) bg-(--color-bg) text-(--color-text) hover:border-(--color-primary)/30 hover:bg-(--color-soft)'
                          }`}
                        >
                          <span className={`text-[8px] font-bold uppercase leading-none tracking-wide sm:text-[9px] ${active ? 'text-white/75' : 'text-(--color-muted)'}`}>{date.weekday}</span>

                          <span className="mt-0.5 text-base font-extrabold leading-none sm:text-lg">{date.day}</span>

                          <span className={`mt-0.5 text-[8px] font-semibold leading-none sm:text-[9px] ${active ? 'text-white/75' : 'text-(--color-muted)'}`}>{date.month}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* notes */}
            <main className="min-w-0 flex-1">
              {filteredNotes.length > 0 ? (
                <div className="divide-y divide-(--color-border)">
                  {filteredNotes.map((note) => (
                    <article key={note.id} className="group p-4 transition hover:bg-(--color-bg) sm:p-5">
                      <div className="flex gap-3">
                        {/* icon */}
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primary)">
                          <BookOpen size={16} />
                        </div>

                        {/* content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="truncate text-sm font-extrabold text-(--color-text)">{note.title}</h2>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-(--color-muted)">{note.content}</p>
                            </div>

                            {/* menu */}
                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() => setShowMenu(showMenu === note.id ? null : note.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text)"
                              >
                                <MoreHorizontal size={17} />
                              </button>

                              {showMenu === note.id && (
                                <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-lg">
                                  <button type="button" className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[10px] font-bold text-(--color-text) transition hover:bg-(--color-soft)">
                                    <ArchiveRestore size={14} />
                                    Unarchive
                                  </button>

                                  <button type="button" className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[10px] font-bold text-(--color-danger) transition hover:bg-(--color-dangerBg)">
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* archived info */}
                          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-(--color-muted)">
                              <FaRegCalendarAlt size={11} />
                              Archived
                            </div>

                            <span className="text-[10px] font-medium text-(--color-muted)">{note.archivedAt}</span>
                          </div>

                          {/* unarchive */}
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-(--color-soft) px-3 py-2 text-[10px] font-bold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white active:scale-[0.97]"
                          >
                            <ArchiveRestore size={13} />
                            Unarchive
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-140 flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-muted)">
                    <Archive size={24} />
                  </div>

                  <h3 className="mt-4 text-sm font-extrabold text-(--color-text)">No archived notes</h3>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-(--color-muted)">Notes archived on this date will appear here.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
