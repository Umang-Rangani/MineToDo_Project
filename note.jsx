import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Archive, ArchiveRestore, Check, MoreHorizontal, Trash2 } from 'lucide-react'
import { FaRegCalendarAlt } from 'react-icons/fa'

import { axiosInstance } from '../axiosConfig/axiosInstance'

const formatHistoryDate = (value) => {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split('-')

  if (!year || !month || !day) {
    return null
  }

  const date = new Date(`${value}T00:00:00+05:30`)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return {
    key: value,
    date,
    month: date.toLocaleDateString('en-US', {
      month: 'short',
      timeZone: 'Asia/Kolkata',
    }),
    day: Number(day),
    weekday: date.toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'Asia/Kolkata',
    }),
  }
}

const getArchiveDateKey = (value) => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  if (!year || !month || !day) {
    return null
  }

  return `${year}-${month}-${day}`
}

const formatDateTime = (value) => {
  if (!value) {
    return 'No date'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'No date'
  }

  return (
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }) +
    ' · ' +
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    })
  )
}

const formatTimeForDisplay = (time) => {
  if (!time) {
    return 'No time'
  }

  const [hours, minutes] = time.split(':')

  if (hours === undefined || minutes === undefined) {
    return time
  }

  const hourNumber = Number(hours)

  if (Number.isNaN(hourNumber)) {
    return time
  }

  const period = hourNumber >= 12 ? 'PM' : 'AM'
  const displayHour = hourNumber % 12 || 12

  return `${displayHour}:${minutes} ${period}`
}

const formatDueDateTime = (dueDate, time) => {
  if (!dueDate) {
    return 'No date'
  }

  const date = new Date(dueDate)

  if (Number.isNaN(date.getTime())) {
    return 'No date'
  }

  const dateText = date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })

  const timeText = time ? formatTimeForDisplay(time) : 'No time'

  return `${dateText} · ${timeText}`
}

const priorityStyles = {
  High: {
    dot: 'bg-(--color-primary)',
    text: 'text-(--color-primary)',
    bg: 'bg-(--color-soft)',
    label: 'High',
  },

  Medium: {
    dot: 'bg-(--color-secondary)',
    text: 'text-(--color-secondary)',
    bg: 'bg-(--color-soft)',
    label: 'Medium',
  },

  Low: {
    dot: 'bg-(--color-muted)',
    text: 'text-(--color-muted)',
    bg: 'bg-(--color-bg)',
    label: 'Low',
  },
}

export default function Archived() {
  const [archivedTasks, setArchivedTasks] = useState([])

  const [archiveDates, setArchiveDates] = useState([])

  const [selectedDate, setSelectedDate] = useState(null)

  const [loading, setLoading] = useState(true)

  const [archiveDateLoading, setArchiveDateLoading] = useState(false)

  const [actionLoading, setActionLoading] = useState(false)

  const [showMenu, setShowMenu] = useState(null)

  const menuRef = useRef(null)

  /* fetch archived tasks */
  const fetchArchivedTasks = async (preferredDate = null) => {
    try {
      setArchiveDateLoading(true)
      setLoading(true)

      const response = await axiosInstance.get('/todos/archived')

      const tasks = response.data?.todos || []

      setArchivedTasks(tasks)

      const uniqueDates = [
        ...new Set(
          tasks
            .map((task) => getArchiveDateKey(task.archivedAt))
            .filter(Boolean),
        ),
      ].sort(
        (a, b) =>
          new Date(`${b}T00:00:00+05:30`) -
          new Date(`${a}T00:00:00+05:30`),
      )

      setArchiveDates(uniqueDates)

      if (uniqueDates.length === 0) {
        setSelectedDate(null)
        return
      }

      if (preferredDate && uniqueDates.includes(preferredDate)) {
        setSelectedDate(preferredDate)
        return
      }

      setSelectedDate((currentDate) => {
        if (currentDate && uniqueDates.includes(currentDate)) {
          return currentDate
        }

        return uniqueDates[0]
      })
    } catch (error) {
      console.error(
        'GET ARCHIVED TODOS ERROR:',
        error.response?.data || error.message,
      )

      setArchivedTasks([])
      setArchiveDates([])
      setSelectedDate(null)
    } finally {
      setArchiveDateLoading(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchivedTasks()
  }, [])

  /* close menu */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /* toggle completed */
  const toggleTask = async (id) => {
    if (!id || actionLoading) {
      return
    }

    try {
      setActionLoading(true)

      const response = await axiosInstance.put(`/todos/toggle/${id}`)

      const updatedTask = response.data?.todo

      if (updatedTask) {
        setArchivedTasks((prev) =>
          prev.map((task) => (task._id === id ? updatedTask : task)),
        )
      }

      setShowMenu(null)
    } catch (error) {
      console.error(
        'TOGGLE ARCHIVED TODO ERROR:',
        error.response?.data || error.message,
      )
    } finally {
      setActionLoading(false)
    }
  }

  /* unarchive */
  const handleUnarchive = async (id) => {
    if (!id || actionLoading) {
      return
    }

    try {
      setActionLoading(true)

      await axiosInstance.put(`/todos/archive/${id}`)

      const remainingTasks = archivedTasks.filter(
        (task) => task._id !== id,
      )

      setArchivedTasks(remainingTasks)

      setShowMenu(null)

      const currentDateStillExists = remainingTasks.some(
        (task) => getArchiveDateKey(task.archivedAt) === selectedDate,
      )

      if (!currentDateStillExists) {
        const remainingDates = [
          ...new Set(
            remainingTasks
              .map((task) => getArchiveDateKey(task.archivedAt))
              .filter(Boolean),
          ),
        ].sort(
          (a, b) =>
            new Date(`${b}T00:00:00+05:30`) -
            new Date(`${a}T00:00:00+05:30`),
        )

        setArchiveDates(remainingDates)
        setSelectedDate(remainingDates[0] || null)
      }
    } catch (error) {
      console.error(
        'UNARCHIVE TODO ERROR:',
        error.response?.data || error.message,
      )
    } finally {
      setActionLoading(false)
    }
  }

  /* delete */
  const deleteTask = async (id) => {
    if (!id || actionLoading) {
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this archived task?',
    )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)

      await axiosInstance.delete(`/todos/${id}`)

      const remainingTasks = archivedTasks.filter(
        (task) => task._id !== id,
      )

      setArchivedTasks(remainingTasks)

      setShowMenu(null)

      const remainingDates = [
        ...new Set(
          remainingTasks
            .map((task) => getArchiveDateKey(task.archivedAt))
            .filter(Boolean),
        ),
      ].sort(
        (a, b) =>
          new Date(`${b}T00:00:00+05:30`) -
          new Date(`${a}T00:00:00+05:30`),
      )

      setArchiveDates(remainingDates)

      if (!remainingDates.includes(selectedDate)) {
        setSelectedDate(remainingDates[0] || null)
      }
    } catch (error) {
      console.error(
        'DELETE ARCHIVED TODO ERROR:',
        error.response?.data || error.message,
      )
    } finally {
      setActionLoading(false)
    }
  }

  /* selected archive date tasks */
  const filteredTasks = useMemo(() => {
    if (!selectedDate) {
      return []
    }

    return archivedTasks
      .filter(
        (task) => getArchiveDateKey(task.archivedAt) === selectedDate,
      )
      .sort((a, b) => {
        const first = new Date(a.archivedAt || 0).getTime()
        const second = new Date(b.archivedAt || 0).getTime()

        return second - first
      })
  }, [archivedTasks, selectedDate])

  return (
    <div className="mx-auto w-full pb-20 lg:pb-0">
      <div className="w-full">
        <section className="relative min-w-0 overflow-visible rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
          {/* header */}
          <div className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5">
            {/* title */}
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <Archive
                size={20}
                className="shrink-0 text-(--color-primary)"
              />

              <h1 className="truncate text-lg font-extrabold text-(--color-text) sm:text-xl">
                Archived Tasks
              </h1>
            </div>

            {/* dates */}
            <div className="min-w-0 h-full flex-1">
              <div className="flex flex-col justify-end gap-2 overflow-y-auto overflow-x-hidden pb-0.5 no-scrollbar">
                {archiveDateLoading
                  ? [1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-(--color-soft) sm:h-13 sm:w-13"
                      />
                    ))
                  : archiveDates.map((date) => {
                      const item = formatHistoryDate(date)

                      if (!item) {
                        return null
                      }

                      const active = selectedDate === item.key

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSelectedDate(item.key)}
                          className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border transition sm:h-13 sm:w-13 ${
                            active
                              ? 'border-(--color-primary) bg-(--color-primary) text-white shadow-sm'
                              : 'border-(--color-border) bg-(--color-bg) text-(--color-text) hover:border-(--color-primary)/30 hover:bg-(--color-soft)'
                          }`}
                        >
                          <span
                            className={`text-[8px] font-bold uppercase leading-none tracking-wide sm:text-[9px] ${
                              active
                                ? 'text-white/75'
                                : 'text-(--color-muted)'
                            }`}
                          >
                            {item.weekday}
                          </span>

                          <span className="mt-0.5 text-base font-extrabold leading-none sm:text-lg">
                            {item.day}
                          </span>

                          <span
                            className={`mt-0.5 text-[8px] font-semibold leading-none sm:text-[9px] ${
                              active
                                ? 'text-white/75'
                                : 'text-(--color-muted)'
                            }`}
                          >
                            {item.month}
                          </span>
                        </button>
                      )
                    })}
              </div>
            </div>
          </div>

          {/* loading */}
          {loading ? (
            <div className="divide-y divide-(--color-border)">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse p-4 sm:p-5"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-(--color-soft)" />

                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-2/3 rounded bg-(--color-soft)" />

                      <div className="mt-2 h-3 w-full max-w-xl rounded bg-(--color-bg)" />

                      <div className="mt-4 flex gap-2">
                        <div className="h-7 w-24 rounded-lg bg-(--color-soft)" />

                        <div className="h-7 w-28 rounded-lg bg-(--color-bg)" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-(--color-border)">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const taskId = task._id

                  const priority =
                    priorityStyles[task.priority] ||
                    priorityStyles.Medium

                  return (
                    <article
                      key={taskId}
                      className={`group relative overflow-visible p-4 transition sm:p-5 ${
                        task.completed
                          ? 'bg-(--color-bg)/60'
                          : 'hover:bg-(--color-bg)'
                      }`}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleTask(taskId)}
                          disabled={actionLoading}
                          aria-label={
                            task.completed
                              ? 'Mark task incomplete'
                              : 'Mark task complete'
                          }
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                            task.completed
                              ? 'border-(--color-primary) bg-(--color-primary) text-white'
                              : 'border-(--color-border) bg-(--color-surface) text-transparent hover:border-(--color-primary)'
                          } ${
                            actionLoading
                              ? 'cursor-not-allowed opacity-50'
                              : ''
                          }`}
                        >
                          {task.completed ? (
                            <Check size={13} strokeWidth={3} />
                          ) : (
                            <span className="h-2 w-2 rounded-full" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          {/* title + menu */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3
                                  className={`text-sm font-bold sm:text-[15px] ${
                                    task.completed
                                      ? 'text-(--color-muted) line-through'
                                      : 'text-(--color-text)'
                                  }`}
                                >
                                  {task.title}
                                </h3>

                                <span className="inline-flex items-center gap-1 rounded-md bg-(--color-soft) px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-(--color-muted)">
                                  <Archive size={9} />
                                  Archived
                                </span>
                              </div>

                              <p className="mt-1 max-w-2xl text-xs leading-5 text-(--color-muted)">
                                {task.description ||
                                  'No description added for this task.'}
                              </p>
                            </div>

                            {/* menu */}
                            <div
                              ref={
                                showMenu === taskId ? menuRef : null
                              }
                              className="relative z-50 shrink-0"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setShowMenu(
                                    showMenu === taskId
                                      ? null
                                      : taskId,
                                  )
                                }
                                disabled={actionLoading}
                                aria-label="Task actions"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-(--color-muted) transition hover:border-(--color-border) hover:bg-(--color-surface) hover:text-(--color-text)"
                              >
                                <MoreHorizontal size={17} />
                              </button>

                              {showMenu === taskId && (
                                <div className="absolute right-0 top-9 z-9999 w-40 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-xl">
                                  {/* unarchive */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUnarchive(taskId)
                                    }
                                    disabled={actionLoading}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-(--color-text) transition hover:bg-(--color-soft) disabled:opacity-50"
                                  >
                                    <ArchiveRestore size={14} />
                                    Unarchive
                                  </button>

                                  {/* delete */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteTask(taskId)
                                    }
                                    disabled={actionLoading}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-(--color-primary) transition hover:bg-(--color-soft) disabled:opacity-50"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* task meta */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${priority.bg} ${priority.text}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
                              />

                              {priority.label}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-(--color-bg) px-2.5 py-1.5 text-[10px] font-semibold text-(--color-muted)">
                              <FaRegCalendarAlt size={11} />
                              {formatDueDateTime(
                                task.dueDate,
                                task.time,
                              )}
                            </span>
                          </div>

                          {/* archived info */}
                          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-(--color-border) pt-3">
                            <span className="text-[9px] font-bold uppercase tracking-wide text-(--color-muted)">
                              Archived
                            </span>

                            <span className="text-[10px] font-semibold text-(--color-text)">
                              {formatDateTime(task.archivedAt)}
                            </span>
                          </div>

                          {/* unarchive action */}
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                handleUnarchive(taskId)
                              }
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-(--color-soft) px-3 py-2 text-[10px] font-bold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <ArchiveRestore size={13} />

                              {actionLoading
                                ? 'Restoring...'
                                : 'Unarchive'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })
              ) : (
                /* empty state */
                <div className="flex min-h-120 flex-col items-center justify-center px-5 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primary)">
                    <Archive size={25} />
                  </div>

                  <h3 className="mt-4 text-sm font-extrabold text-(--color-text)">
                    No archived tasks
                  </h3>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-(--color-muted)">
                    {selectedDate
                      ? 'No tasks were archived on this date.'
                      : 'Tasks you archive will appear here.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}