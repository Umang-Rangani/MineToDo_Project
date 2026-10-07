import React, { useEffect, useState } from 'react'
import { CalendarDays, CheckCircle2, Pencil, Plus, Target } from 'lucide-react'
import { FaRegCalendarAlt, FaRegClock, FaRegFlag } from 'react-icons/fa'

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

const getCurrentTime = () => {
  const date = new Date()

  const hours = String(date.getHours()).padStart(2, '0')

  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

export default function CreateTask({ newTask, setNewTask, onSubmit, onCancel, loading = false, editing = false, totalCount = 0, completedCount = 0, todayTasks = [], upcomingTasks = [], formOnly = false, onNewTask }) {
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  if (formOnly) {
    return <TaskForm newTask={newTask} setNewTask={setNewTask} onSubmit={onSubmit} onCancel={onCancel} loading={loading} editing={editing} desktop={false} />
  }

  return (
    <aside className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
        <div className="border-b border-(--color-border) p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">{editing ? <Pencil size={18} /> : <Plus size={18} />}</div>

              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-(--color-text)">{editing ? 'Edit Task' : 'Create Task'}</h2>

                <p className="mt-1 text-[11px] text-(--color-muted)">{editing ? 'Update your task details.' : 'Add something you want to accomplish.'}</p>
              </div>
            </div>

            {editing && onNewTask && (
              <button
                type="button"
                onClick={onNewTask}
                disabled={loading}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-bg) px-3 text-[10px] font-bold text-(--color-text) transition hover:bg-(--color-soft) disabled:opacity-50"
              >
                <Plus size={13} />
                New
              </button>
            )}
          </div>
        </div>

        <TaskForm newTask={newTask} setNewTask={setNewTask} onSubmit={onSubmit} onCancel={onCancel} loading={loading} editing={editing} desktop />
      </div>

      <ProgressCard progress={progress} completedCount={completedCount} totalCount={totalCount} />

      <FocusCard todayTasks={todayTasks} loading={loading} />

      <UpcomingCard upcomingTasks={upcomingTasks} />
    </aside>
  )
}

function TaskForm({ newTask, setNewTask, onSubmit, onCancel, loading = false, editing = false, desktop = false }) {
  const [liveTime, setLiveTime] = useState(getCurrentTime())

  useEffect(() => {
    const updateTime = () => {
      setLiveTime(getCurrentTime())
    }

    updateTime()

    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateField = (field, value) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${desktop ? 'p-5' : 'p-4 pb-5'}`}>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Task title</label>

        <input
          autoFocus={desktop}
          type="text"
          value={newTask.title}
          onChange={(event) => updateField('title', event.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
          className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Description</label>

        <textarea
          rows="3"
          value={newTask.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Add a little context..."
          disabled={loading}
          className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 py-3 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Priority</label>

          <div className="relative">
            <FaRegFlag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

            <select
              value={newTask.priority}
              onChange={(event) => updateField('priority', event.target.value)}
              disabled={loading}
              className="h-11 w-full appearance-none rounded-xl border border-(--color-border) bg-(--color-bg) px-9 text-sm text-(--color-text) outline-none transition focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="High">High</option>

              <option value="Medium">Medium</option>

              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Due date</label>

          <div className="relative">
            <FaRegCalendarAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

            <input
              type="date"
              value={newTask.dueDate}
              onChange={(event) => updateField('dueDate', event.target.value)}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-9 text-sm text-(--color-text) outline-none transition focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Time</label>

          <div className="relative">
            <FaRegClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

            <input
              type="time"
              value={newTask.time}
              onChange={(event) => updateField('time', event.target.value)}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-9 text-sm text-(--color-text) outline-none transition focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="text-[9px] text-(--color-muted)">{newTask.time ? `Selected: ${formatTimeForDisplay(newTask.time)}` : 'Select task time'}</p>

            <span className="text-[9px] font-semibold text-(--color-primary)">Now {formatTimeForDisplay(liveTime)}</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-(--color-text)">Category</label>

          <input
            type="text"
            value={newTask.category}
            onChange={(event) => updateField('category', event.target.value)}
            placeholder="General"
            disabled={loading}
            className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary)/50 focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="flex gap-2 border-t border-(--color-border) pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-11 flex-1 rounded-xl border border-(--color-border) bg-(--color-bg) px-4 text-xs font-bold text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {editing ? 'Cancel' : 'Clear'}
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

function ProgressCard({ progress, completedCount, totalCount }) {
  return (
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
  )
}

function FocusCard({ todayTasks, loading }) {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Target size={16} className="text-(--color-primary)" />

        <h2 className="text-sm font-extrabold text-(--color-text)">Today's Focus</h2>
      </div>

      <p className="mt-1 text-[11px] text-(--color-muted)">Tasks waiting for your attention</p>

      <div className="mt-4 space-y-2">
        {todayTasks.slice(0, 4).map((task) => (
          <div key={task.id} className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
            <span className="h-3.75 w-3.75 shrink-0 rounded-full border border-(--color-muted)" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-(--color-text)">{task.title}</p>

              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-(--color-muted)">
                <FaRegClock size={9} />

                {formatTimeForDisplay(task.time)}
              </p>
            </div>
          </div>
        ))}

        {todayTasks.length === 0 && !loading && (
          <div className="rounded-xl bg-(--color-bg) p-4 text-center">
            <CheckCircle2 size={20} className="mx-auto text-(--color-primary)" />

            <p className="mt-2 text-[11px] font-semibold text-(--color-muted)">All today's tasks are complete 🎉</p>
          </div>
        )}
      </div>
    </div>
  )
}

function UpcomingCard({ upcomingTasks }) {
  return (
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
  )
}
