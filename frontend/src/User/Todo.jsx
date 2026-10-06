import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Archive, CalendarDays, Check, CheckCircle2, Circle, ListChecks, MoreHorizontal, Pencil, Plus, Search, Target, Trash2, X } from 'lucide-react'
import { FaRegCalendarAlt, FaRegClock, FaRegFlag } from 'react-icons/fa'
import { axiosInstance } from '../axiosConfig/axiosInstance'

const filters = ['All', 'Today', 'Upcoming', 'Completed']

const priorityStyles = {
  High: {
    dot: 'bg-(--color-primary)',
    text: 'text-(--color-primary)',
    bg: 'bg-(--color-biscuit)',
    label: 'High priority',
  },
  Medium: {
    dot: 'bg-(--color-secondary)',
    text: 'text-(--color-secondary)',
    bg: 'bg-(--color-soft)',
    label: 'Medium priority',
  },
  Low: {
    dot: 'bg-(--color-muted)',
    text: 'text-(--color-muted)',
    bg: 'bg-(--color-bg)',
    label: 'Low priority',
  },
}

const getTodayDate = () => {
  const date = new Date()

  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const getTomorrowDate = () => {
  const date = getTodayDate()

  date.setDate(date.getDate() + 1)

  return date
}

const formatDateForApi = (value) => {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

const formatDateInput = (value) => {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
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
  const tomorrow = getTomorrowDate()

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

const normalizeTask = (task) => {
  return {
    ...task,
    id: task._id || task.id,
    due: getDueLabel(task.dueDate),
  }
}

const getDefaultTask = () => {
  return {
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: formatDateInput(getTodayDate()),
    time: '18:00',
    category: 'General',
  }
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

export default function Todo() {
  const [tasks, setTasks] = useState([])

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const [showAddTask, setShowAddTask] = useState(false)
  const [showMenu, setShowMenu] = useState(null)

  const [editingTask, setEditingTask] = useState(null)

  const menuRef = useRef(null)

  const [newTask, setNewTask] = useState(getDefaultTask())

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

  const fetchTasks = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get('/todos')

      const data = Array.isArray(response.data) ? response.data : []

      setTasks(data.map(normalizeTask))
    } catch (error) {
      console.error('FETCH TODO ERROR:', error)

      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length

  const totalCount = tasks.length

  const todayTasks = tasks.filter((task) => task.due === 'Today' && !task.completed)

  const upcomingTasks = tasks.filter((task) => task.due !== 'Today' && !task.completed)

  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return tasks.filter((task) => {
      const matchesSearch = !normalizedSearch || task.title.toLowerCase().includes(normalizedSearch) || task.description.toLowerCase().includes(normalizedSearch) || task.category.toLowerCase().includes(normalizedSearch)

      let matchesFilter = true

      if (activeFilter === 'Today') {
        matchesFilter = task.due === 'Today' && !task.completed
      }

      if (activeFilter === 'Upcoming') {
        matchesFilter = task.due !== 'Today' && !task.completed
      }

      if (activeFilter === 'Completed') {
        matchesFilter = task.completed
      }

      return matchesSearch && matchesFilter
    })
  }, [tasks, activeFilter, search])

  const resetTaskForm = () => {
    setNewTask(getDefaultTask())
  }

  const openAddTask = () => {
    setEditingTask(null)
    resetTaskForm()
    setShowAddTask(true)
    setShowMenu(null)
  }

  const closeTaskForm = () => {
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
      time: task.time || '18:00',
      category: task.category || 'General',
    })

    setShowMenu(null)
  }

  const closeEditTask = () => {
    setEditingTask(null)
    resetTaskForm()
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

      setTasks(data.map(normalizeTask))
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

      const response = await axiosInstance.delete(`/todos/${id}`)

      const data = Array.isArray(response.data) ? response.data : []

      setTasks(data.map(normalizeTask))
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

      const response = await axiosInstance.put(`/todos/${id}`, {
        archived: true,
      })

      const data = Array.isArray(response.data) ? response.data : []

      setTasks(data.map(normalizeTask))
      setShowMenu(null)
    } catch (error) {
      console.error('ARCHIVE TODO ERROR:', error)
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

      setTasks(data.map(normalizeTask))

      resetTaskForm()
      setShowAddTask(false)
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

      const response = await axiosInstance.put(`/todos/${editingTask.id}`, {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
        dueDate: formatDateForApi(newTask.dueDate),
        time: newTask.time,
        category: newTask.category.trim() || 'General',
      })

      const data = Array.isArray(response.data) ? response.data : []

      setTasks(data.map(normalizeTask))

      closeEditTask()
    } catch (error) {
      console.error('UPDATE TODO ERROR:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const submitTask = editingTask ? updateTask : addTask

  return (
    <div className="mx-auto w-full pb-20 lg:pb-0">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_450px]">
        {/* Task List */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
          {/* Header */}
          <div className="border-b border-(--color-border) p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                    <ListChecks size={19} />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-base font-extrabold text-(--color-text) sm:text-lg">Task List</h1>

                    <p className="mt-0.5 text-[11px] text-(--color-muted)">{filteredTasks.length} tasks showing</p>
                  </div>
                </div>

                {/* Desktop Add */}
                <button
                  type="button"
                  onClick={openAddTask}
                  disabled={actionLoading}
                  className="hidden h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-4 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--color-primaryDark) disabled:cursor-not-allowed disabled:opacity-60 lg:inline-flex"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your tasks..."
                  className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-10 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10"
                />

                {search && (
                  <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) hover:text-(--color-text)">
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Filters - unchanged */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {filters.map((filter) => {
                  const active = activeFilter === filter

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition ${active ? 'bg-(--color-primary) text-white shadow-sm' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)'}`}
                    >
                      {filter}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Loading */}
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
                  const priority = priorityStyles[task.priority] || priorityStyles.Medium

                  return (
                    <article key={task.id} className={`group p-4 transition sm:p-5 ${task.completed ? 'bg-(--color-bg)/60' : 'hover:bg-(--color-bg)'}`}>
                      <div className="flex gap-3 sm:gap-4">
                        {/* Complete */}
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          disabled={actionLoading}
                          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                            task.completed ? 'border-(--color-primary) bg-(--color-primary) text-white' : 'border-(--color-border) bg-(--color-surface) text-transparent hover:border-(--color-primary)'
                          }`}
                        >
                          {task.completed ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className={`text-sm font-bold sm:text-[15px] ${task.completed ? 'text-(--color-muted) line-through' : 'text-(--color-text)'}`}>{task.title}</h3>

                              <p className="mt-1 max-w-2xl text-xs leading-5 text-(--color-muted)">{task.description || 'No description added for this task.'}</p>
                            </div>

                            {/* Menu */}
                            <div ref={showMenu === task.id ? menuRef : null} className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() => setShowMenu(showMenu === task.id ? null : task.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text)"
                              >
                                <MoreHorizontal size={17} />
                              </button>

                              {showMenu === task.id && (
                                <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-lg">
                                  <button
                                    type="button"
                                    onClick={() => openEditTask(task)}
                                    disabled={actionLoading}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-(--color-text) hover:bg-(--color-soft) disabled:opacity-50"
                                  >
                                    <Pencil size={14} />
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => deleteTask(task.id)}
                                    disabled={actionLoading}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-(--color-primary) hover:bg-(--color-biscuit) disabled:opacity-50"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => archiveTask(task.id)}
                                    disabled={actionLoading}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-(--color-muted) hover:bg-(--color-soft) disabled:opacity-50"
                                  >
                                    <Archive size={14} />
                                    Archive
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Meta */}
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
                <div className="flex min-h-80 flex-col items-center justify-center px-5 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-biscuit) text-(--color-primary)">
                    <ListChecks size={25} />
                  </div>

                  <h3 className="mt-4 text-sm font-extrabold text-(--color-text)">No tasks found</h3>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-(--color-muted)">Try another search or create a new task.</p>

                  <button type="button" onClick={openAddTask} className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-(--color-primary) px-4 text-xs font-bold text-white hover:bg-(--color-primaryDark)">
                    <Plus size={15} />
                    Create task
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Desktop Sidebar */}
        <aside className="hidden space-y-5 lg:block">
          {/* Create Task */}
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
            <div className="border-b border-(--color-border) p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                  <Plus size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-(--color-text)">Create Task</h2>

                  <p className="mt-1 text-[11px] text-(--color-muted)">Add something you want to accomplish.</p>
                </div>
              </div>
            </div>

            <TaskForm newTask={newTask} setNewTask={setNewTask} onSubmit={addTask} onCancel={resetTaskForm} desktop loading={actionLoading} />
          </div>

          {/* Progress */}
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-(--color-text)">Task Progress</h2>

                <p className="mt-1 text-[11px] text-(--color-muted)">Your current completion</p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                <CheckCircle2 size={17} />
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <span className="text-3xl font-extrabold text-(--color-text)">{progress}%</span>

                <p className="mt-1 text-[11px] text-(--color-muted)">completed</p>
              </div>

              <span className="text-xs font-bold text-(--color-primary)">
                {completedCount}/{totalCount}
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-(--color-border)">
              <div
                className="h-full rounded-full bg-linear-to-r from-(--color-primary) to-(--color-secondary) transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* Today's Focus */}
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-(--color-primary)" />

              <h2 className="text-sm font-extrabold text-(--color-text)">Today's Focus</h2>
            </div>

            <p className="mt-1 text-[11px] text-(--color-muted)">Tasks waiting for your attention</p>

            <div className="mt-4 space-y-2">
              {todayTasks.slice(0, 4).map((task) => (
                <button key={task.id} type="button" onClick={() => toggleTask(task.id)} className="flex w-full items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3 text-left transition hover:bg-(--color-soft)">
                  <Circle size={15} className="shrink-0 text-(--color-muted)" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-(--color-text)">{task.title}</p>

                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-(--color-muted)">
                      <FaRegClock size={9} />
                      {formatTimeForDisplay(task.time)}
                    </p>
                  </div>
                </button>
              ))}

              {todayTasks.length === 0 && (
                <div className="rounded-xl bg-(--color-bg) p-4 text-center">
                  <CheckCircle2 size={20} className="mx-auto text-(--color-primary)" />

                  <p className="mt-2 text-[11px] font-semibold text-(--color-muted)">All today's tasks are complete 🎉</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming */}
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-(--color-primary)" />

              <h2 className="text-sm font-extrabold text-(--color-text)">Upcoming</h2>
            </div>

            <p className="mt-1 text-[11px] text-(--color-muted)">What's coming next</p>

            <div className="mt-4 space-y-2">
              {upcomingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
                  <div className="flex items-start gap-2">
                    <CalendarDays size={14} className="mt-0.5 shrink-0 text-(--color-primary)" />

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-(--color-text)">{task.title}</p>

                      <p className="mt-1 flex items-center gap-1 text-[10px] text-(--color-muted)">
                        <FaRegClock size={9} />
                        {task.due} · {formatTimeForDisplay(task.time)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {upcomingTasks.length === 0 && <div className="rounded-xl bg-(--color-bg) p-3 text-center text-[11px] text-(--color-muted)">No upcoming tasks.</div>}
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Add Button */}
      <button
        type="button"
        onClick={openAddTask}
        disabled={actionLoading}
        aria-label="Add new task"
        className="fixed bottom-5 left-1/2 z-30 flex h-13 w-13 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
      >
        <Plus size={22} />
      </button>

      {/* Add / Edit Mobile Sheet */}
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
                  aria-label="Close task form"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto">
              <TaskForm newTask={newTask} setNewTask={setNewTask} onSubmit={submitTask} onCancel={editingTask ? closeEditTask : closeTaskForm} loading={actionLoading} editing={Boolean(editingTask)} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Edit Sheet */}
      {editingTask && (
        <div className="fixed inset-0 z-9999 hidden items-center justify-center p-5 lg:flex">
          <div className="absolute inset-0 bg-(--color-text)/45 backdrop-blur-md" aria-hidden="true" />

          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-2xl">
            <div className="border-b border-(--color-border) p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                    <Pencil size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-(--color-text)">Edit Task</h2>

                    <p className="mt-1 text-[11px] text-(--color-muted)">Update your task details.</p>
                  </div>
                </div>

                <button type="button" onClick={closeEditTask} className="flex h-9 w-9 items-center justify-center rounded-xl text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)">
                  <X size={18} />
                </button>
              </div>
            </div>

            <TaskForm newTask={newTask} setNewTask={setNewTask} onSubmit={updateTask} onCancel={closeEditTask} desktop editing loading={actionLoading} />
          </div>
        </div>
      )}
    </div>
  )
}

function TaskForm({ newTask, setNewTask, onSubmit, onCancel, desktop = false, editing = false, loading = false }) {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${desktop ? 'p-5' : 'p-4 pb-5'}`}>
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Task title</label>

        <input
          autoFocus={desktop}
          type="text"
          value={newTask.title}
          onChange={(event) =>
            setNewTask((prev) => ({
              ...prev,
              title: event.target.value,
            }))
          }
          placeholder="What needs to be done?"
          disabled={loading}
          className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:opacity-60"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Description</label>

        <textarea
          rows="3"
          value={newTask.description}
          onChange={(event) =>
            setNewTask((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          placeholder="Add a little context..."
          disabled={loading}
          className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 py-3 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:opacity-60"
        />
      </div>

      {/* Options */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Priority */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Priority</label>

          <div className="relative">
            <FaRegFlag className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

            <select
              value={newTask.priority}
              onChange={(event) =>
                setNewTask((prev) => ({
                  ...prev,
                  priority: event.target.value,
                }))
              }
              disabled={loading}
              className="h-11 w-full appearance-none rounded-xl border border-(--color-border) bg-(--color-bg) px-9 text-sm text-(--color-text) outline-none focus:border-(--color-primary)/50 disabled:opacity-60"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Due date</label>

          <div className="relative">
            <FaRegCalendarAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

            <input
              type="date"
              value={newTask.dueDate}
              onChange={(event) =>
                setNewTask((prev) => ({
                  ...prev,
                  dueDate: event.target.value,
                }))
              }
              disabled={loading}
              className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-9 text-sm text-(--color-text) outline-none focus:border-(--color-primary)/50 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Time</label>

          <div className="relative">
            <FaRegClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

            <input
              type="time"
              value={newTask.time}
              onChange={(event) =>
                setNewTask((prev) => ({
                  ...prev,
                  time: event.target.value,
                }))
              }
              disabled={loading}
              className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-9 text-sm text-(--color-text) outline-none transition focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Category</label>

          <input
            type="text"
            value={newTask.category}
            onChange={(event) =>
              setNewTask((prev) => ({
                ...prev,
                category: event.target.value,
              }))
            }
            placeholder="General"
            disabled={loading}
            className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:opacity-60"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className={`flex gap-2 border-t border-(--color-border) pt-4 ${desktop ? 'flex-row-reverse justify-start border-0 pt-1' : 'flex-row'}`}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-11 flex-1 rounded-xl border border-(--color-border) bg-(--color-bg) px-4 text-xs font-bold text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {editing ? 'Cancel' : desktop ? 'Clear' : 'Cancel'}
        </button>

        <button
          type="submit"
          disabled={loading || !newTask.title.trim()}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-4 text-xs font-bold text-white shadow-sm transition hover:bg-(--color-primaryDark) active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              {editing ? <Pencil size={15} /> : <Plus size={15} />}

              {editing ? 'Update Task' : 'Create Task'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
