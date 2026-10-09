import React, { useEffect, useRef, useState } from 'react'
import { Archive, ArchiveRestore, Check, ListChecks, MoreHorizontal, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa'

import CreateTask from './CreateTask'
import { axiosInstance } from '../../axiosConfig/axiosInstance'

const getTodayDate = () => {
  const date = new Date()

  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const formatDateForApi = (value) => {
  if (!value) return null

  const [year, month, day] = value.split('-')

  if (!year || !month || !day) return null

  return `${year}-${month}-${day}T00:00:00+05:30`
}

const formatDateInput = (value) => {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getCurrentTime = () => {
  const date = new Date()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

const getDueLabel = (dueDate) => {
  if (!dueDate) return 'No date'

  const date = new Date(dueDate)

  if (Number.isNaN(date.getTime())) return 'No date'

  const today = getTodayDate()

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (taskDate.getTime() === today.getTime()) return 'Today'
  if (taskDate.getTime() === tomorrow.getTime()) return 'Tomorrow'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const formatTimeForDisplay = (time) => {
  if (!time) return 'No time'

  const [hours, minutes] = time.split(':')

  if (hours === undefined || minutes === undefined) return time

  const hourNumber = Number(hours)

  if (Number.isNaN(hourNumber)) return time

  const period = hourNumber >= 12 ? 'PM' : 'AM'
  const displayHour = hourNumber % 12 || 12

  return `${displayHour}:${minutes} ${period}`
}

const formatHistoryDate = (value) => {
  if (!value) return null

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return null

  return {
    key: value,
    date,
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    day: date.getDate(),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
  }
}

const getDefaultTask = () => ({
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: formatDateInput(new Date()),
  time: getCurrentTime(),
})

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

export default function Todo() {
  const [tasks, setTasks] = useState([])
  const [historyDates, setHistoryDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const [showAddTask, setShowAddTask] = useState(false)
  const [showMenu, setShowMenu] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState(getDefaultTask())

  const menuRef = useRef(null)

  /* fetch history dates */
  const fetchHistoryDates = async (preferredDate = null) => {
    try {
      setHistoryLoading(true)
      setLoading(true)

      const response = await axiosInstance.get('/todos/history/dates')
      const dates = response.data?.dates || []

      setHistoryDates(dates)

      if (dates.length === 0) {
        setSelectedDate(null)
        setTasks([])
        return
      }

      if (preferredDate && dates.includes(preferredDate)) {
        setSelectedDate(preferredDate)
        return
      }

      setSelectedDate((currentDate) => {
        if (currentDate && dates.includes(currentDate)) return currentDate
        return dates[0]
      })
    } catch (error) {
      console.error('FETCH TODO HISTORY DATES ERROR:', error.response?.data || error.message)

      setHistoryDates([])
      setSelectedDate(null)
      setTasks([])
    } finally {
      setHistoryLoading(false)
      setLoading(false)
    }
  }

  /* fetch todos by due date */
  const fetchHistoryTasks = async (date) => {
    if (!date) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const response = await axiosInstance.get('/todos/history', {
        params: { date },
      })

      const data = Array.isArray(response.data) ? response.data : response.data?.todos || []

      setTasks(data)
    } catch (error) {
      console.error('FETCH TODO HISTORY ERROR:', error.response?.data || error.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  /* initial load */
  useEffect(() => {
    fetchHistoryDates()
  }, [])

  /* fetch selected due date */
  useEffect(() => {
    if (!selectedDate) return
    fetchHistoryTasks(selectedDate)
  }, [selectedDate])

  /* close menus */
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

  /* lock page when mobile form is open */
  useEffect(() => {
    if (!showAddTask && !editingTask) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showAddTask, editingTask])

  /* counts */
  const completedCount = tasks.filter((task) => task.completed && !task.archived).length
  const totalCount = tasks.filter((task) => !task.archived).length

  const todayTasks = tasks.filter((task) => getDueLabel(task.dueDate) === 'Today' && !task.completed && !task.archived)

  const upcomingTasks = tasks.filter((task) => getDueLabel(task.dueDate) !== 'Today' && getDueLabel(task.dueDate) !== 'No date' && !task.completed && !task.archived)

  /* filtered tasks */
  const filteredTasks = tasks.filter((task) => {
    const normalizedSearch = search.toLowerCase().trim()
    const title = task.title?.toLowerCase() || ''
    const description = task.description?.toLowerCase() || ''

    const matchesSearch = !normalizedSearch || title.includes(normalizedSearch) || description.includes(normalizedSearch)

    let matchesFilter = true

    if (activeFilter === 'Today') {
      matchesFilter = getDueLabel(task.dueDate) === 'Today' && !task.completed
    }

    if (activeFilter === 'Upcoming') {
      matchesFilter = getDueLabel(task.dueDate) !== 'Today' && getDueLabel(task.dueDate) !== 'No date' && !task.completed
    }

    if (activeFilter === 'Completed') {
      matchesFilter = task.completed
    }

    return matchesSearch && matchesFilter
  })

  /* task form */
  const resetTaskForm = () => {
    setNewTask(getDefaultTask())
  }

  const openAddTask = () => {
    setEditingTask(null)
    setNewTask(getDefaultTask())
    setShowAddTask(true)
    setShowMenu(null)
  }

  const closeTaskForm = () => {
    if (actionLoading) return

    setShowAddTask(false)
    setEditingTask(null)
    resetTaskForm()
  }

  const openEditTask = (task) => {
    setEditingTask(task)
    setShowAddTask(false)

    setNewTask({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'Medium',
      dueDate: formatDateInput(task.dueDate) || formatDateInput(getTodayDate()),
      time: task.time || getCurrentTime(),
    })

    setShowMenu(null)
  }

  const closeEditTask = () => {
    if (actionLoading) return

    setEditingTask(null)
    resetTaskForm()
  }

  const startNewTaskFromDesktop = () => {
    setEditingTask(null)
    setNewTask(getDefaultTask())
    setShowMenu(null)
  }

  /* create task */
  const addTask = async (event) => {
    event.preventDefault()

    if (!newTask.title.trim() || actionLoading) return

    try {
      setActionLoading(true)

      await axiosInstance.post('/todos', {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
        dueDate: formatDateForApi(newTask.dueDate),
        time: newTask.time,
      })

      await fetchHistoryDates(newTask.dueDate)
      await fetchHistoryTasks(newTask.dueDate)

      setSelectedDate(newTask.dueDate)
      setShowAddTask(false)
      resetTaskForm()
    } catch (error) {
      console.error('CREATE TODO ERROR:', error.response?.data || error.message)
    } finally {
      setActionLoading(false)
    }
  }

  /* update task */
  const updateTask = async (event) => {
    event.preventDefault()

    if (!editingTask || !newTask.title.trim() || actionLoading) return

    const taskId = editingTask._id

    if (!taskId) return

    try {
      setActionLoading(true)

      await axiosInstance.put(`/todos/${taskId}`, {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
        dueDate: formatDateForApi(newTask.dueDate),
        time: newTask.time,
      })

      await fetchHistoryDates(newTask.dueDate)
      await fetchHistoryTasks(newTask.dueDate)

      setSelectedDate(newTask.dueDate)
      setEditingTask(null)
      resetTaskForm()
    } catch (error) {
      console.error('UPDATE TODO ERROR:', error.response?.data || error.message)
    } finally {
      setActionLoading(false)
    }
  }

  /* toggle completed */
  const toggleTask = async (id) => {
    if (actionLoading) return

    const currentTask = tasks.find((task) => task._id === id)
    if (!currentTask) return

    try {
      setActionLoading(true)

      await axiosInstance.put(`/todos/toggle/${id}`)
      await fetchHistoryTasks(selectedDate)

      setShowMenu(null)
    } catch (error) {
      console.error('TOGGLE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  /* toggle archived */
  const toggleArchive = async (id) => {
    if (actionLoading) return

    const currentTask = tasks.find((task) => task._id === id)
    if (!currentTask) return

    try {
      setActionLoading(true)

      await axiosInstance.put(`/todos/archive/${id}`)
      await fetchHistoryTasks(selectedDate)

      setShowMenu(null)
    } catch (error) {
      console.error('TOGGLE ARCHIVE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  /* delete task */
  const deleteTask = async (id) => {
    if (actionLoading) return

    const confirmed = window.confirm('Are you sure you want to delete this task?')
    if (!confirmed) return

    try {
      setActionLoading(true)

      await axiosInstance.delete(`/todos/${id}`)
      await fetchHistoryDates(selectedDate)

      setShowMenu(null)
    } catch (error) {
      console.error('DELETE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  /* search controls */
  const openSearch = () => {
    setSearchOpen(true)
  }

  const closeSearch = () => {
    setSearch('')
    setSearchOpen(false)
  }

  return (
    <div className="relative  mx-auto flex h-full min-h-0 w-full flex-col overflow-hidden pb-0">
      <div className="grid h-full min-h-0 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_450px]">
        <section className="relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
          {/* fixed header */}
          <div className="shrink-0 border-b border-(--color-border) p-3 sm:p-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              {/* title */}
              <div className="flex min-w-0 shrink-0 items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primary) sm:h-10 sm:w-10">
                  <ListChecks size={19} />
                </div>

                <h1 className="truncate text-sm font-extrabold text-(--color-text) sm:text-base">Task List</h1>
              </div>

              {/* history dates */}
              <div className="flex min-w-0 flex-1 items-center justify-end">
                <div className="flex min-w-0 max-w-full items-center gap-2 overflow-x-auto overflow-y-hidden pb-0.5 no-scrollbar">
                  {historyLoading ? (
                    [1, 2, 3, 4, 5].map((item) => <div key={item} className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-(--color-soft) sm:h-13 sm:w-13" />)
                  ) : historyDates.length > 0 ? (
                    historyDates.map((date) => {
                      const item = formatHistoryDate(date)

                      if (!item) return null

                      const active = selectedDate === item.key

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSelectedDate(item.key)}
                          aria-label={`${item.weekday}, ${item.month} ${item.day}`}
                          className={`flex h-13 w-13 shrink-0 flex-col items-center justify-center rounded-xl border transition ${
                            active ? 'border-(--color-primary) bg-(--color-primary) text-white shadow-sm' : 'border-(--color-border) bg-(--color-bg) text-(--color-text) hover:border-(--color-primary)/30 hover:bg-(--color-soft)'
                          }`}
                        >
                          <span className={`text-[9px] font-bold uppercase leading-none tracking-wide ${active ? 'text-white/75' : 'text-(--color-muted)'}`}>{item.weekday}</span>

                          <span className="mt-0.5 text-lg font-extrabold leading-none">{item.day}</span>

                          <span className={`mt-0.5 text-[9px] font-semibold leading-none ${active ? 'text-white/75' : 'text-(--color-muted)'}`}>{item.month}</span>
                        </button>
                      )
                    })
                  ) : (
                    <div className="whitespace-nowrap px-1 text-[10px] text-(--color-muted) sm:text-xs">No history</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* scrollable task list */}
          <div className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain max-sm:pb-20">
            {loading ? (
              <div className="divide-y divide-(--color-border)">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="animate-pulse p-4 sm:p-5">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="h-6 w-6 shrink-0 rounded-full bg-(--color-soft)" />

                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-2/3 rounded bg-(--color-soft)" />
                        <div className="mt-2 h-3 w-full max-w-xl rounded bg-(--color-bg)" />

                        <div className="mt-4 flex gap-2">
                          <div className="h-7 w-24 rounded-lg bg-(--color-soft)" />
                          <div className="h-7 w-20 rounded-lg bg-(--color-bg)" />
                          <div className="h-7 w-20 rounded-lg bg-(--color-bg)" />
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
                    const priority = priorityStyles[task.priority] || priorityStyles.Medium

                    return (
                      <article key={taskId} className={`group relative overflow-visible p-4 transition sm:p-5 ${task.archived ? 'bg-(--color-soft)/40' : task.completed ? 'bg-(--color-bg)/60' : 'hover:bg-(--color-bg)'}`}>
                        <div className="flex gap-3 sm:gap-4">
                          {/* checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleTask(taskId)}
                            disabled={actionLoading || task.archived}
                            aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                              task.completed ? 'border-(--color-primary) bg-(--color-primary) text-white' : 'border-(--color-border) bg-(--color-surface) text-transparent hover:border-(--color-primary)'
                            } ${task.archived ? 'cursor-not-allowed opacity-50' : ''}`}
                          >
                            {task.completed ? <Check size={13} strokeWidth={3} /> : <span className="h-2 w-2 rounded-full" />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className={`text-sm font-bold sm:text-[15px] ${task.completed ? 'text-(--color-muted) line-through' : 'text-(--color-text)'}`}>{task.title}</h3>

                                  {task.archived && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-(--color-soft) px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-(--color-muted)">
                                      <Archive size={9} />
                                      Archived
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 max-w-2xl text-xs leading-5 text-(--color-muted)">{task.description || 'No description added for this task.'}</p>
                              </div>

                              {/* task menu */}
                              <div ref={showMenu === taskId ? menuRef : null} className="relative z-50 shrink-0">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    const buttonRect = event.currentTarget.getBoundingClientRect()
                                    const blurTop = window.innerHeight - 96

                                    if (buttonRect.bottom > blurTop) {
                                      setShowMenu(null)
                                      return
                                    }

                                    setShowMenu(showMenu === taskId ? null : taskId)
                                  }}
                                  disabled={actionLoading}
                                  aria-label="Task actions"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-(--color-muted) transition hover:border-(--color-border) hover:bg-(--color-surface) hover:text-(--color-text)"
                                >
                                  <MoreHorizontal size={17} />
                                </button>

                                {showMenu === taskId && (
                                  <div className="absolute right-10 -top-2 z-9999 w-40 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-xl">
                                    <button
                                      type="button"
                                      onClick={() => openEditTask(task)}
                                      disabled={actionLoading}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-semibold text-(--color-text) transition hover:bg-(--color-soft) disabled:opacity-50"
                                    >
                                      <Pencil size={14} />
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => toggleArchive(taskId)}
                                      disabled={actionLoading}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-semibold text-(--color-muted) transition hover:bg-(--color-soft) disabled:opacity-50"
                                    >
                                      {task.archived ? (
                                        <>
                                          <ArchiveRestore size={14} />
                                          Unarchive
                                        </>
                                      ) : (
                                        <>
                                          <Archive size={14} />
                                          Archive
                                        </>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => deleteTask(taskId)}
                                      disabled={actionLoading}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-semibold text-(--color-primary) transition hover:bg-(--color-soft) disabled:opacity-50"
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
                              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${priority.bg} ${priority.text}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                                {priority.label}
                              </span>

                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-(--color-bg) px-2.5 py-1.5 text-[10px] font-semibold text-(--color-muted)">
                                <FaRegCalendarAlt size={11} />
                                {getDueLabel(task.dueDate)}
                              </span>

                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-(--color-bg) px-2.5 py-1.5 text-[10px] font-semibold text-(--color-muted)">
                                <FaRegClock size={11} />
                                {formatTimeForDisplay(task.time)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })
                ) : (
                  <div className="flex min-h-120 flex-col items-center justify-center px-5 py-10 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primary)">
                      <ListChecks size={25} />
                    </div>

                    <h3 className="mt-4 text-sm font-extrabold text-(--color-text)">No tasks found</h3>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-(--color-muted)">{selectedDate ? 'No tasks were found for this date.' : 'Create a new task to start your todo history.'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* desktop create task */}
        <div className="hidden min-h-0 lg:block">
          <CreateTask
            newTask={newTask}
            setNewTask={setNewTask}
            onSubmit={editingTask ? updateTask : addTask}
            onCancel={editingTask ? closeEditTask : resetTaskForm}
            loading={actionLoading}
            editing={Boolean(editingTask)}
            totalCount={totalCount}
            completedCount={completedCount}
            todayTasks={todayTasks}
            upcomingTasks={upcomingTasks}
            onNewTask={startNewTaskFromDesktop}
          />
        </div>
      </div>

      {/* mobile add button section */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0  h-24 lg:hidden z-51">
        <div className="absolute inset-0 bg-(--color-bg)/65 backdrop-blur-sm" />

        <button
          type="button"
          onClick={openAddTask}
          disabled={actionLoading}
          aria-label="Add new task"
          className="pointer-events-auto absolute bottom-5 left-1/2 flex h-13 w-13 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* mobile task form */}
      {(showAddTask || editingTask) && (
        <div className="fixed inset-0 z-9999 lg:hidden">
          <div className="absolute inset-0 bg-(--color-text)/45 backdrop-blur-md" aria-hidden="true" />

          <div className="absolute inset-x-0 bottom-0 flex max-h-[94dvh] flex-col overflow-hidden rounded-t-3xl border-t border-(--color-border) bg-(--color-surface) shadow-2xl">
            <div className="shrink-0 border-b border-(--color-border) px-4 py-4">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-(--color-border)" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primary)">{editingTask ? <Pencil size={17} /> : <Plus size={17} />}</div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-extrabold text-(--color-text)">{editingTask ? 'Edit task' : 'Create a new task'}</h2>

                    <p className="mt-0.5 text-[10px] text-(--color-muted)">{editingTask ? 'Update your task details.' : 'Add something you want to accomplish.'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={editingTask ? closeEditTask : closeTaskForm}
                  disabled={actionLoading}
                  aria-label="Close task form"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto">
              <CreateTask newTask={newTask} setNewTask={setNewTask} onSubmit={editingTask ? updateTask : addTask} onCancel={editingTask ? closeEditTask : closeTaskForm} loading={actionLoading} editing={Boolean(editingTask)} formOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
