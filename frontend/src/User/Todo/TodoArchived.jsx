import React, { useEffect, useMemo, useState } from 'react'
import { Archive, ArchiveRestore, MoreHorizontal, Trash2, Check, Clock3, CalendarDays } from 'lucide-react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { axiosInstance } from '../../axiosConfig/axiosInstance'

const priorityStyles = {
  High: {
    dot: 'bg-(--color-primary)',
    text: 'text-(--color-primaryDark)',
    bg: 'bg-(--color-soft)',
  },

  Medium: {
    dot: 'bg-(--color-secondary)',
    text: 'text-(--color-secondary)',
    bg: 'bg-(--color-soft)',
  },

  Low: {
    dot: 'bg-(--color-muted)',
    text: 'text-(--color-muted)',
    bg: 'bg-(--color-bg)',
  },
}

/* archive date format */
const formatArchiveDate = (value) => {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)

  const year = parts.find((item) => item.type === 'year')?.value
  const month = parts.find((item) => item.type === 'month')?.value
  const day = parts.find((item) => item.type === 'day')?.value

  if (!year || !month || !day) return null

  return `${year}-${month}-${day}`
}

/* date button data */
const getArchiveDateInfo = (value) => {
  if (!value) return null

  const [year, month, day] = value.split('-')

  if (!year || !month || !day) return null

  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (Number.isNaN(date.getTime())) return null

  return {
    key: value,
    weekday: date.toLocaleDateString('en-US', {
      weekday: 'short',
    }),
    day: date.getDate(),
    month: date.toLocaleDateString('en-US', {
      month: 'short',
    }),
  }
}

/* display date time */
const formatDateTime = (value) => {
  if (!value) return 'No date'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'No date'

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .replace(',', ' ·')
}

/* todo archived */
export default function TodoArchived() {
  const [archivedTodos, setArchivedTodos] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [showMenu, setShowMenu] = useState(null)

  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  /* fetch archived todos */
  const fetchArchivedTodos = async (preferredDate = null) => {
    try {
      setLoading(true)

      const response = await axiosInstance.get('/todos/archived')

      const todos = response.data?.todos || []

      setArchivedTodos(todos)

      const dates = todos.map((todo) => formatArchiveDate(todo.archivedAt)).filter(Boolean)

      const uniqueDates = [...new Set(dates)]

      if (preferredDate && uniqueDates.includes(preferredDate)) {
        setSelectedDate(preferredDate)
      } else if (selectedDate && uniqueDates.includes(selectedDate)) {
        setSelectedDate(selectedDate)
      } else {
        setSelectedDate(uniqueDates[0] || null)
      }
    } catch (error) {
      console.error('FETCH ARCHIVED TODOS ERROR:', error)

      setArchivedTodos([])
      setSelectedDate(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchivedTodos()
  }, [])

  /* archive dates */
  const archiveDates = useMemo(() => {
    const dates = archivedTodos.map((todo) => formatArchiveDate(todo.archivedAt)).filter(Boolean)

    const uniqueDates = [...new Set(dates)]

    return uniqueDates
      .sort((a, b) => b.localeCompare(a))
      .map(getArchiveDateInfo)
      .filter(Boolean)
  }, [archivedTodos])

  /* selected date todos */
  const filteredTodos = useMemo(() => {
    if (!selectedDate) return []

    return archivedTodos.filter((todo) => formatArchiveDate(todo.archivedAt) === selectedDate)
  }, [archivedTodos, selectedDate])

  /* toggle completed */
  const handleToggleTodo = async (id) => {
    try {
      setBusyId(id)

      const response = await axiosInstance.put(`/todos/toggle/${id}`)

      const updatedTodo = response.data?.todo

      if (!updatedTodo) return

      setArchivedTodos((prev) => prev.map((todo) => (todo._id === id ? updatedTodo : todo)))
    } catch (error) {
      console.error('TOGGLE TODO ERROR:', error)
    } finally {
      setBusyId(null)
    }
  }

  /* unarchive */
  const handleUnarchive = async (id) => {
    try {
      setBusyId(id)
      setShowMenu(null)

      const archiveDate = formatArchiveDate(archivedTodos.find((todo) => todo._id === id)?.archivedAt)

      await axiosInstance.put(`/todos/archive/${id}`)

      await fetchArchivedTodos(archiveDate)
    } catch (error) {
      console.error('UNARCHIVE TODO ERROR:', error)
    } finally {
      setBusyId(null)
    }
  }

  /* delete */
  const handleDelete = async (id) => {
    try {
      setBusyId(id)
      setShowMenu(null)

      const archiveDate = formatArchiveDate(archivedTodos.find((todo) => todo._id === id)?.archivedAt)

      await axiosInstance.delete(`/todos/${id}`)

      await fetchArchivedTodos(archiveDate)
    } catch (error) {
      console.error('DELETE ARCHIVED TODO ERROR:', error)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex h-[calc(100dvh-120px)] min-h-0 w-full flex-col overflow-hidden overscroll-none">
      {/* archived workspace */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm lg:flex-row">
        {/* date sidebar */}
        <aside className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-b border-(--color-border) bg-(--color-surface) lg:h-full lg:w-26 lg:border-r lg:border-b-0 xl:w-26">
          <div className="flex shrink-0 items-center justify-between border-b border-(--color-border) px-3 py-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-(--color-primaryDark)">Archived</p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-2">
            <div className="flex flex-col gap-2 lg:items-center">
              {loading ? (
                [1, 2, 3, 4].map((item) => <div key={item} className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-(--color-soft)" />)
              ) : archiveDates.length > 0 ? (
                archiveDates.map((date) => {
                  const active = selectedDate === date.key

                  return (
                    <button
                      key={date.key}
                      type="button"
                      onClick={() => {
                        setSelectedDate(date.key)
                        setShowMenu(null)
                      }}
                      className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border transition ${
                        active ? 'border-(--color-primary) bg-(--color-primary) text-white shadow-sm' : 'border-(--color-border) bg-(--color-bg) text-(--color-text) hover:border-(--color-primary) hover:bg-(--color-soft)'
                      }`}
                    >
                      <span className={`text-[8px] font-bold uppercase leading-none tracking-wide ${active ? 'text-white/80' : 'text-(--color-muted)'}`}>{date.weekday}</span>

                      <span className="mt-0.5 text-base font-extrabold leading-none">{date.day}</span>

                      <span className={`mt-0.5 text-[9px] font-semibold leading-none ${active ? 'text-white/80' : 'text-(--color-muted)'}`}>{date.month}</span>
                    </button>
                  )
                })
              ) : (
                <p className="w-full px-2 py-3 text-center text-[10px] text-(--color-muted)">No archived dates</p>
              )}
            </div>
          </div>
        </aside>

        {/* archived tasks */}
        <main className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-contain bg-(--color-bg) p-2 sm:p-4 lg:overflow-x-hidden lg:overflow-y-auto lg:p-5">
          <div className="h-full min-w-0 lg:h-auto">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <article key={item} className="min-w-70 animate-pulse rounded-xl border border-(--color-border) bg-(--color-surface) p-4 sm:p-5 lg:min-w-0">
                    <div className="h-4 w-48 rounded bg-(--color-soft)" />
                    <div className="mt-3 h-3 w-72 max-w-full rounded bg-(--color-soft)" />
                    <div className="mt-5 h-7 w-40 rounded-lg bg-(--color-soft)" />
                  </article>
                ))}
              </div>
            ) : filteredTodos.length > 0 ? (
              <div className="flex h-full min-w-max gap-3 lg:h-auto lg:min-w-0 lg:flex-col">
                {filteredTodos.map((todo) => {
                  const priority = priorityStyles[todo.priority] || priorityStyles.Medium

                  const busy = busyId === todo._id

                  return (
                    <article key={todo._id} className="group w-70 shrink-0 rounded-xl border border-(--color-border) bg-(--color-surface) p-3 transition hover:border-(--color-primary) hover:shadow-sm sm:w-80 sm:p-4 lg:w-full lg:p-5">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTodo(todo._id)}
                          disabled={busy}
                          aria-label={todo.completed ? 'Mark incomplete' : 'Mark completed'}
                          className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition sm:size-7 sm:rounded-lg ${
                            todo.completed ? 'border-(--color-primary) bg-(--color-primary) text-white' : 'border-(--color-border) bg-(--color-bg) text-transparent hover:border-(--color-primary) hover:bg-(--color-soft)'
                          }`}
                        >
                          <Check size={14} strokeWidth={2.5} />
                        </button>

                        <div className="min-w-0 flex-1">
                          {/* title + menu */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => handleToggleTodo(todo._id)}
                                disabled={busy}
                                className={`wrap-break-word text-left text-sm font-extrabold sm:text-base ${todo.completed ? 'text-(--color-muted) line-through' : 'text-(--color-text)'}`}
                              >
                                {todo.title}
                              </button>

                              {todo.description && <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-(--color-muted) sm:text-sm">{todo.description}</p>}
                            </div>

                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() => setShowMenu(showMenu === todo._id ? null : todo._id)}
                                disabled={busy}
                                aria-label="More options"
                                className="flex size-7 items-center justify-center rounded-lg border border-transparent text-(--color-muted) transition hover:border-(--color-border) hover:bg-(--color-bg) hover:text-(--color-text) sm:size-8"
                              >
                                <MoreHorizontal size={18} />
                              </button>

                              {showMenu === todo._id && (
                                <>
                                  <button type="button" aria-label="Close menu" onClick={() => setShowMenu(null)} className="fixed inset-0 z-10 cursor-default" />

                                  <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-lg">
                                    <button
                                      type="button"
                                      onClick={() => handleUnarchive(todo._id)}
                                      disabled={busy}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-(--color-text) transition hover:bg-(--color-soft)"
                                    >
                                      <ArchiveRestore size={15} />
                                      Unarchive
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDelete(todo._id)}
                                      disabled={busy}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-(--color-danger) transition hover:bg-(--color-dangerBg)"
                                    >
                                      <Trash2 size={15} />
                                      Delete task
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* task metadata */}
                          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-4 sm:gap-x-4 sm:gap-y-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border border-(--color-border) px-2.5 py-1.5 text-[10px] font-bold sm:gap-2 sm:px-3 sm:text-[11px] ${priority.bg} ${priority.text}`}>
                              <span className={`size-1.5 rounded-full sm:size-2 ${priority.dot}`} />
                              {todo.priority || 'Medium'}
                            </span>

                            {todo.dueDate && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-(--color-muted) sm:gap-2 sm:text-xs">
                                <CalendarDays size={13} />
                                {formatDateTime(todo.dueDate)}
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-(--color-primaryDark) sm:gap-2 sm:text-xs">
                              <Archive size={13} />
                              Archived
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-(--color-muted) sm:gap-2 sm:text-xs">
                              <Clock3 size={13} />
                              {formatDateTime(todo.archivedAt)}
                            </span>

                            <div className="ml-auto">
                              <button
                                type="button"
                                onClick={() => handleUnarchive(todo._id)}
                                disabled={busy}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) px-2.5 py-1.5 text-[10px] font-bold text-(--color-primaryDark) transition hover:border-(--color-primary) hover:bg-(--color-primary) hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-xs"
                              >
                                <ArchiveRestore size={13} />
                                {busy ? 'Working...' : 'Unarchive'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="flex h-full min-h-70 min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-(--color-border) bg-(--color-surface) px-6 text-center lg:min-h-80">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primary) sm:size-16">
                  <Archive size={25} />
                </div>

                <h3 className="mt-4 text-sm font-extrabold text-(--color-text) sm:text-base">No archived todos</h3>

                <p className="mt-1.5 max-w-sm text-xs leading-5 text-(--color-muted) sm:text-sm">Todos archived on this date will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </section>
    </div>
  )
}
