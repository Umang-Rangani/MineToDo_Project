import React from 'react'
import { ArrowRight, Bell, CalendarDays, Check, CheckCircle2, ChevronRight, Circle, Clock3, FileText, Flame, ListTodo, Plus, Sparkles, Target, TrendingUp } from 'lucide-react'
import { FaRegLightbulb, FaRegStickyNote, FaTasks } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { useUser } from '../context/UserContext'

const quickActions = [
  {
    title: 'New Todo',
    description: 'Plan your next task',
    icon: ListTodo,
    iconAlt: FaTasks,
    to: '/todo',
  },
  {
    title: 'New Note',
    description: 'Capture an idea',
    icon: FileText,
    iconAlt: FaRegStickyNote,
    to: '/notebook',
  },
  {
    title: 'Open Vault',
    description: 'Access saved items',
    icon: Target,
    iconAlt: FaRegLightbulb,
    to: '/vault',
  },
  {
    title: 'Dashboard',
    description: 'See your progress',
    icon: TrendingUp,
    iconAlt: TrendingUp,
    to: '/dashboard',
  },
]

const recentActivity = [
  {
    title: 'Complete project documentation',
    type: 'Todo',
    time: '20 min ago',
    completed: true,
  },
  {
    title: 'React learning notes',
    type: 'Notebook',
    time: '1 hour ago',
    completed: false,
  },
  {
    title: 'Review weekly goals',
    type: 'Todo',
    time: '3 hours ago',
    completed: true,
  },
]

const upcomingTasks = [
  {
    title: 'Finish homepage design',
    time: 'Today · 5:00 PM',
  },
  {
    title: 'Update project notes',
    time: 'Tomorrow · 10:00 AM',
  },
  {
    title: 'Review weekly progress',
    time: 'Tomorrow · 6:30 PM',
  },
]

export default function Home() {
  const { user } = useUser()

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-(--color-border) bg-linear-to-br from-(--color-surface) via-(--color-biscuit) to-(--color-soft) p-5 shadow-sm sm:p-7 lg:p-8">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-(--color-primary)/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-(--color-secondary)/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface)/70 px-3 py-1.5 text-xs font-semibold text-(--color-primaryDark)">
              <Sparkles size={14} />
              <span>Your workspace is ready</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-(--color-text) sm:text-3xl lg:text-4xl">Good morning, {firstName} 👋</h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-(--color-muted) sm:text-base">Stay focused, organize your thoughts, and make progress on what matters most today.</p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link to="/todo" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--color-primaryDark)">
                <Plus size={17} />
                Add Task
              </Link>

              <Link
                to="/notebook"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 text-sm font-bold text-(--color-text) transition hover:-translate-y-0.5 hover:bg-(--color-soft)"
              >
                <FileText size={17} />
                Write a Note
              </Link>
            </div>
          </div>

          <div className="hidden shrink-0 lg:block">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-(--color-border) bg-(--color-surface)/70 shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-(--color-biscuit)">
                <Sparkles size={38} strokeWidth={1.7} className="text-(--color-primary)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-(--color-text) sm:text-lg">Quick actions</h2>
            <p className="mt-0.5 text-xs text-(--color-muted) sm:text-sm">Jump back into your workspace</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = item.icon
            const IconAlt = item.iconAlt

            return (
              <Link key={item.title} to={item.to} className="group rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                    <Icon size={19} />
                  </div>

                  <ChevronRight size={17} className="text-(--color-muted) transition group-hover:translate-x-1 group-hover:text-(--color-primary)" />
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-(--color-text)">{item.title}</h3>

                  <p className="mt-1 text-xs leading-5 text-(--color-muted)">{item.description}</p>
                </div>

                <IconAlt size={15} className="mt-3 text-(--color-primary)/45" />
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-(--color-text)">Today's overview</h2>
              <p className="mt-0.5 text-xs text-(--color-muted)">Your productivity at a glance</p>
            </div>

            <Link to="/dashboard" className="hidden items-center gap-1 text-xs font-bold text-(--color-primary) sm:flex">
              View dashboard
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                <FaTasks size={16} />
              </div>

              <p className="mt-3 text-xl font-extrabold text-(--color-text)">12</p>

              <p className="mt-0.5 text-xs text-(--color-muted)">Total tasks</p>
            </div>

            <div className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                <CheckCircle2 size={17} />
              </div>

              <p className="mt-3 text-xl font-extrabold text-(--color-text)">8</p>

              <p className="mt-0.5 text-xs text-(--color-muted)">Completed</p>
            </div>

            <div className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                <FaRegStickyNote size={16} />
              </div>

              <p className="mt-3 text-xl font-extrabold text-(--color-text)">6</p>

              <p className="mt-0.5 text-xs text-(--color-muted)">Notes</p>
            </div>

            <div className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
                <Flame size={17} />
              </div>

              <p className="mt-3 text-xl font-extrabold text-(--color-text)">5</p>

              <p className="mt-0.5 text-xs text-(--color-muted)">Day streak</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-(--color-border) bg-(--color-bg) p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-(--color-primary)" />
                  <p className="text-sm font-bold text-(--color-text)">Daily goal</p>
                </div>

                <p className="mt-1 text-xs text-(--color-muted)">8 of 10 tasks completed</p>
              </div>

              <span className="text-sm font-extrabold text-(--color-primary)">80%</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-(--color-border)">
              <div className="h-full w-[80%] rounded-full bg-linear-to-r from-(--color-primary) to-(--color-secondary)" />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-(--color-muted)">
              <span>Keep going</span>
              <span>2 tasks remaining</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-(--color-text)">Upcoming</h2>
              <p className="mt-0.5 text-xs text-(--color-muted)">What comes next</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
              <CalendarDays size={17} />
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {upcomingTasks.map((task, index) => (
              <div key={task.title} className="group rounded-xl border border-(--color-border) bg-(--color-bg) p-3 transition hover:bg-(--color-soft)">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-biscuit) text-xs font-bold text-(--color-primary)">{index + 1}</div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-(--color-text)">{task.title}</p>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-(--color-muted)">
                      <Clock3 size={12} />
                      {task.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/todo" className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-(--color-border) text-xs font-bold text-(--color-primary) transition hover:bg-(--color-soft)">
            View all tasks
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-(--color-text)">Recent activity</h2>
              <p className="mt-0.5 text-xs text-(--color-muted)">Your latest workspace activity</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-biscuit) text-(--color-primary)">
              <Bell size={17} />
            </div>
          </div>

          <div className="mt-4 divide-y divide-(--color-border)">
            {recentActivity.map((activity) => (
              <div key={activity.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.completed ? 'bg-(--color-biscuit) text-(--color-primary)' : 'bg-(--color-soft) text-(--color-muted)'}`}>
                  {activity.completed ? <Check size={15} /> : <Circle size={14} />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-(--color-text)">{activity.title}</p>

                  <p className="mt-0.5 text-[11px] text-(--color-muted)">
                    {activity.type} · {activity.time}
                  </p>
                </div>

                <ChevronRight size={15} className="shrink-0 text-(--color-muted)" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) p-5 text-white shadow-sm sm:p-6">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/8 blur-2xl" />

          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Sparkles size={19} />
            </div>

            <h2 className="mt-5 text-lg font-extrabold">Make today count.</h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/75">Small progress every day adds up. Pick one important task and give it your full attention.</p>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/80">
              <CheckCircle2 size={15} />
              <span>You're already 80% through today's goal.</span>
            </div>

            <Link to="/todo" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-(--color-primaryDark) transition hover:-translate-y-0.5 hover:bg-white/90">
              Continue working
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
