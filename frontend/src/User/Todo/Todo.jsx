import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Archive, ArchiveRestore, Check, ChevronDown, ListChecks, MoreHorizontal, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa'

import CreateTask from './CreateTask'
import { axiosInstance } from '../../axiosConfig/axiosInstance'

const filters = ['All', 'Today', 'Upcoming', 'Completed', 'Archived']

const priorityStyles = {
  High: {
    dot: 'bg-(--color-primary)',
    text: 'text-(--color-primary)',
    bg: 'bg-(--color-biscuit)',
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

const getTodayDate = () => {
  const date = new Date()

  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const getDateKey = (date) => {
  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, '0')

  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getDateCards = () => {
  const today = getTodayDate()

  return Array.from({ length: 15 }, (_, index) => {
    const date = new Date(today)

    date.setDate(today.getDate() + index)

    return {
      key: getDateKey(date),
      date,
      month: date.toLocaleDateString('en-US', {
        month: 'short',
      }),
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', {
        weekday: 'short',
      }),
    }
  })
}

const formatDateForApi = (value) => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

const formatDateInput = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

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
  if (!dueDate) {
    return 'No date'
  }

  const date = new Date(dueDate)

  if (Number.isNaN(date.getTime())) {
    return 'No date'
  }

  const today = getTodayDate()

  const tomorrow = new Date(today)

  tomorrow.setDate(tomorrow.getDate() + 1)

  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (taskDate.getTime() === today.getTime()) {
    return 'Today'
  }

  if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
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

const getDefaultTask = () => ({
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: formatDateInput(new Date()),
  time: getCurrentTime(),
  category: 'General',
})

const normalizeTask = (task, toggleHandler) => ({
  ...task,
  id: task._id || task.id,
  due: getDueLabel(task.dueDate),
  onToggle: toggleHandler,
})

export default function Todo() {
  const [tasks, setTasks] = useState([])

  const [archivedTasks, setArchivedTasks] = useState([])

  const [loading, setLoading] = useState(true)

  const [archivedLoading, setArchivedLoading] = useState(false)

  const [actionLoading, setActionLoading] = useState(false)

  const [activeFilter, setActiveFilter] = useState('All')

  const [selectedDate, setSelectedDate] = useState(getDateKey(getTodayDate()))

  const [search, setSearch] = useState('')

  const [showAddTask, setShowAddTask] = useState(false)

  const [showMenu, setShowMenu] = useState(null)

  const [editingTask, setEditingTask] = useState(null)

  const [newTask, setNewTask] = useState(getDefaultTask())

  const menuRef = useRef(null)

  const dateCards = useMemo(() => getDateCards(), [])

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (!showAddTask && !editingTask) {
      return
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showAddTask, editingTask])

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

  const mapTasks = (data) => data.map((task) => normalizeTask(task, toggleTask))

  const fetchTasks = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get('/todos')

      const data = Array.isArray(response.data) ? response.data : []

      setTasks(mapTasks(data))
    } catch (error) {
      console.error('FETCH TODO ERROR:', error)

      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const fetchArchivedTasks = async () => {
    try {
      setArchivedLoading(true)

      const response = await axiosInstance.get('/todos?archived=true')

      const data = Array.isArray(response.data) ? response.data : []

      setArchivedTasks(mapTasks(data))
    } catch (error) {
      console.error('FETCH ARCHIVED TODO ERROR:', error)

      setArchivedTasks([])
    } finally {
      setArchivedLoading(false)
    }
  }

  useEffect(() => {
    if (activeFilter === 'Archived') {
      fetchArchivedTasks()
    }
  }, [activeFilter])

  const completedCount = tasks.filter((task) => task.completed).length

  const totalCount = tasks.length

  const todayTasks = tasks.filter((task) => task.due === 'Today' && !task.completed)

  const upcomingTasks = tasks.filter((task) => task.due !== 'Today' && task.due !== 'No date' && !task.completed)

  const activeList = activeFilter === 'Archived' ? archivedTasks : tasks

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return activeList.filter((task) => {
      const matchesSearch = !normalizedSearch || task.title.toLowerCase().includes(normalizedSearch) || task.description.toLowerCase().includes(normalizedSearch) || task.category.toLowerCase().includes(normalizedSearch)

      const taskDateKey = task.dueDate ? getDateKey(new Date(task.dueDate)) : null

      let matchesDate = true

      if (activeFilter !== 'Today') {
        matchesDate = taskDateKey === selectedDate
      }

      let matchesFilter = true

      if (activeFilter === 'Today') {
        matchesFilter = task.due === 'Today' && !task.completed
      }

      if (activeFilter === 'Upcoming') {
        matchesFilter = task.due !== 'Today' && task.due !== 'No date' && !task.completed
      }

      if (activeFilter === 'Completed') {
        matchesFilter = task.completed
      }

      if (activeFilter === 'Archived') {
        matchesFilter = task.archived
      }

      return matchesSearch && matchesDate && matchesFilter
    })
  }, [activeList, activeFilter, search, selectedDate])

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
    if (actionLoading) {
      return
    }

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
      category: task.category || 'General',
    })

    setShowMenu(null)
  }

  const closeEditTask = () => {
    if (actionLoading) {
      return
    }

    setEditingTask(null)

    resetTaskForm()
  }

  const startNewTaskFromDesktop = () => {
    setEditingTask(null)

    setNewTask(getDefaultTask())

    setShowMenu(null)
  }

  const toggleTask = async (id) => {
    const currentTask = tasks.find((task) => task.id === id)

    if (!currentTask || actionLoading) {
      return
    }

    try {
      setActionLoading(true)

      const response = await axiosInstance.put(`/todos/toggle/${id}`, {
        completed: !currentTask.completed,
      })

      const data = Array.isArray(response.data) ? response.data : []

      setTasks(mapTasks(data))

      setShowMenu(null)
    } catch (error) {
      console.error('TOGGLE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const deleteTask = async (id) => {
    if (actionLoading) {
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete this task?')

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)

      await axiosInstance.delete(`/todos/${id}`)

      if (activeFilter === 'Archived') {
        await fetchArchivedTasks()
      } else {
        await fetchTasks()
      }

      setShowMenu(null)
    } catch (error) {
      console.error('DELETE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const archiveTask = async (id) => {
    if (actionLoading) {
      return
    }

    try {
      setActionLoading(true)

      await axiosInstance.put(`/todos/${id}`, {
        archived: true,
      })

      await fetchTasks()

      setShowMenu(null)
    } catch (error) {
      console.error('ARCHIVE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const restoreTask = async (id) => {
    if (actionLoading) {
      return
    }

    try {
      setActionLoading(true)

      await axiosInstance.put(`/todos/${id}`, {
        archived: false,
      })

      await fetchTasks()
      await fetchArchivedTasks()

      setShowMenu(null)

      setActiveFilter('All')
    } catch (error) {
      console.error('RESTORE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const addTask = async (event) => {
    event.preventDefault()

    if (!newTask.title.trim() || actionLoading) {
      return
    }

    try {
      setActionLoading(true)

      const response = await axiosInstance.post('/todos', {
        title: newTask.title.trim(),

        description: newTask.description.trim(),

        priority: newTask.priority,

        dueDate: formatDateForApi(newTask.dueDate),

        time: newTask.time,

        category: newTask.category.trim() || 'General',

        completed: false,

        archived: false,
      })

      const data = Array.isArray(response.data) ? response.data : []

      setTasks(mapTasks(data))

      setShowAddTask(false)

      resetTaskForm()
    } catch (error) {
      console.error('CREATE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const updateTask = async (event) => {
    event.preventDefault()

    if (!editingTask || !newTask.title.trim() || actionLoading) {
      return
    }

    try {
      setActionLoading(true)

      await axiosInstance.put(`/todos/${editingTask.id}`, {
        title: newTask.title.trim(),

        description: newTask.description.trim(),

        priority: newTask.priority,

        dueDate: formatDateForApi(newTask.dueDate),

        time: newTask.time,

        category: newTask.category.trim() || 'General',
      })

      if (editingTask.archived) {
        await fetchArchivedTasks()
      } else {
        await fetchTasks()
      }

      setEditingTask(null)

      resetTaskForm()
    } catch (error) {
      console.error('UPDATE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const isArchived = activeFilter === 'Archived'

  const visibleCount = filteredTasks.length

  const contentLoading = isArchived ? archivedLoading : loading

  return (
    <div className="mx-auto w-full pb-20 lg:pb-0">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_450px]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
          <div className="border-b border-(--color-border) p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">{isArchived ? <Archive size={19} /> : <ListChecks size={19} />}</div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-base font-extrabold text-(--color-text) sm:text-lg">{isArchived ? 'Archived Tasks' : 'Task List'}</h1>

                      {isArchived && <span className="rounded-full bg-(--color-soft) px-2 py-1 text-[9px] font-bold text-(--color-secondary)">{archivedTasks.length}</span>}
                    </div>

                    <p className="mt-0.5 text-[11px] text-(--color-muted)">
                      {visibleCount} {visibleCount === 1 ? 'task' : 'tasks'} showing
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={isArchived ? 'Search archived tasks...' : 'Search your tasks...'}
                    className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-10 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10"
                  />

                  {search && (
                    <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) hover:text-(--color-text)">
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
                    {dateCards.map((item) => {
                      const active = selectedDate === item.key

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSelectedDate(item.key)}
                          className={`flex h-17 w-14 shrink-0 flex-col items-center justify-center rounded-xl border transition sm:h-20 sm:w-16 sm:rounded-2xl ${
                            active ? 'border-(--color-primary) bg-(--color-primary) text-white shadow-md' : 'border-(--color-border) bg-(--color-bg) text-(--color-text) hover:border-(--color-primary)/30 hover:bg-(--color-soft)'
                          }`}
                        >
                          <span className={`text-[9px] font-semibold sm:text-[10px] ${active ? 'text-white/80' : 'text-(--color-muted)'}`}>{item.month}</span>

                          <span className="mt-0.5 text-lg font-extrabold leading-none sm:text-xl">{item.day}</span>

                          <span className={`mt-1 text-[9px] font-semibold sm:text-[10px] ${active ? 'text-white/85' : 'text-(--color-muted)'}`}>{item.weekday}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="relative shrink-0">
                  <select
                    value={activeFilter}
                    onChange={(event) => setActiveFilter(event.target.value)}
                    className="h-10 w-27.5 appearance-none rounded-xl border border-(--color-border) bg-(--color-surface) px-3 pr-8 text-xs font-bold text-(--color-text) outline-none transition focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 sm:h-11 sm:w-32"
                  >
                    {filters.map((filter) => (
                      <option key={filter} value={filter}>
                        {filter}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />
                </div>
              </div>
            </div>
          </div>

          {contentLoading ? (
            isArchived ? (
              <div className="p-5">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="rounded-xl bg-(--color-bg) p-4">
                      <div className="h-4 w-2/3 rounded bg-(--color-soft)" />

                      <div className="mt-2 h-3 w-full rounded bg-(--color-soft)" />

                      <div className="mt-3 h-7 w-40 rounded-lg bg-(--color-soft)" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
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
            )
          ) : (
            <div className="divide-y divide-(--color-border)">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const priority = priorityStyles[task.priority] || priorityStyles.Medium

                  return (
                    <article key={task.id} className={`group p-4 transition sm:p-5 ${task.archived ? 'bg-(--color-bg)/70' : task.completed ? 'bg-(--color-bg)/60' : 'hover:bg-(--color-bg)'}`}>
                      <div className="flex gap-3 sm:gap-4">
                        {!task.archived ? (
                          <button
                            type="button"
                            onClick={() => toggleTask(task.id)}
                            disabled={actionLoading}
                            aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                              task.completed ? 'border-(--color-primary) bg-(--color-primary) text-white' : 'border-(--color-border) bg-(--color-surface) text-transparent hover:border-(--color-primary)'
                            }`}
                          >
                            {task.completed ? <Check size={13} strokeWidth={3} /> : <span className="h-2 w-2 rounded-full" />}
                          </button>
                        ) : (
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-soft) text-(--color-muted)">
                            <Archive size={12} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className={`text-sm font-bold sm:text-[15px] ${task.completed ? 'text-(--color-muted) line-through' : 'text-(--color-text)'}`}>{task.title}</h3>

                                {task.archived && <span className="rounded-md bg-(--color-soft) px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-(--color-muted)">Archived</span>}
                              </div>

                              <p className="mt-1 max-w-2xl text-xs leading-5 text-(--color-muted)">{task.description || 'No description added for this task.'}</p>
                            </div>

                            <div ref={showMenu === task.id ? menuRef : null} className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() => setShowMenu(showMenu === task.id ? null : task.id)}
                                disabled={actionLoading}
                                aria-label="Task actions"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-(--color-muted) transition hover:border-(--color-border) hover:bg-(--color-surface) hover:text-(--color-text)"
                              >
                                <MoreHorizontal size={17} />
                              </button>

                              {showMenu === task.id && (
                                <div className="absolute right-0 top-9 z-30 w-40 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-xl">
                                  {!task.archived && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => openEditTask(task)}
                                        disabled={actionLoading}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-(--color-text) transition hover:bg-(--color-soft) disabled:opacity-50"
                                      >
                                        <Pencil size={14} />
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => archiveTask(task.id)}
                                        disabled={actionLoading}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-(--color-muted) transition hover:bg-(--color-soft) disabled:opacity-50"
                                      >
                                        <Archive size={14} />
                                        Archive
                                      </button>
                                    </>
                                  )}

                                  {task.archived && (
                                    <button
                                      type="button"
                                      onClick={() => restoreTask(task.id)}
                                      disabled={actionLoading}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-(--color-text) transition hover:bg-(--color-soft) disabled:opacity-50"
                                    >
                                      <ArchiveRestore size={14} />
                                      Restore
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => deleteTask(task.id)}
                                    disabled={actionLoading}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-(--color-primary) transition hover:bg-(--color-biscuit) disabled:opacity-50"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${priority.bg} ${priority.text}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />

                              {priority.label}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-(--color-bg) px-2.5 py-1.5 text-[10px] font-semibold text-(--color-muted)">
                              <FaRegCalendarAlt size={11} />

                              {task.due}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-(--color-bg) px-2.5 py-1.5 text-[10px] font-semibold text-(--color-muted)">
                              <FaRegClock size={11} />

                              {formatTimeForDisplay(task.time)}
                            </span>

                            <span className="hidden rounded-lg bg-(--color-bg) px-2.5 py-1.5 text-[10px] font-semibold text-(--color-muted) sm:inline-flex">{task.category || 'General'}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center px-5 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-biscuit) text-(--color-primary)">{isArchived ? <Archive size={25} /> : <ListChecks size={25} />}</div>

                  <h3 className="mt-4 text-sm font-extrabold text-(--color-text)">{isArchived ? 'No archived tasks' : 'No tasks found'}</h3>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-(--color-muted)">{isArchived ? 'Tasks you archive will appear here.' : 'Try another date, filter, or create a new task.'}</p>

                  {!isArchived && (
                    <button
                      type="button"
                      onClick={openAddTask}
                      disabled={actionLoading}
                      className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-(--color-primary) px-4 text-xs font-bold text-white transition hover:bg-(--color-primaryDark) disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Plus size={15} />
                      Create task
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <div className="hidden lg:block">
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

      <button
        type="button"
        onClick={openAddTask}
        disabled={actionLoading}
        aria-label="Add new task"
        className="fixed bottom-5 left-1/2 z-30 flex h-13 w-13 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
      >
        <Plus size={22} />
      </button>

      {(showAddTask || editingTask) && (
        <div className="fixed inset-0 z-9999 lg:hidden">
          <div className="absolute inset-0 bg-(--color-text)/45 backdrop-blur-md" aria-hidden="true" />

          <div className="absolute inset-x-0 bottom-0 flex max-h-[94dvh] flex-col overflow-hidden rounded-t-3xl border-t border-(--color-border) bg-(--color-surface) shadow-2xl">
            <div className="shrink-0 border-b border-(--color-border) px-4 py-4">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-(--color-border)" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">{editingTask ? <Pencil size={17} /> : <Plus size={17} />}</div>

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
