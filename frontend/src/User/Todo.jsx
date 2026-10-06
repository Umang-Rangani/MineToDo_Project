import React, { useEffect, useMemo, useState } from 'react'
import { Check, CheckCircle2, Circle, Edit3, ListTodo, Plus, Trash2, X } from 'lucide-react'
import { axiosInstance } from '../axiosConfig/axiosInstance'
import { useUser } from '../context/UserContext'

export default function Todo() {
  const { user } = useUser()

  const [todo, setTodo] = useState([])
  const [obj, setObj] = useState({
    title: '',
    isCompleted: false,
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchTodo = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/todos')

      setTodo(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodo()
  }, [])

  const submitHandle = async (e) => {
    e.preventDefault()

    if (!obj.title.trim()) return

    try {
      setActionLoading(true)

      if (isEditMode) {
        const res = await axiosInstance.put(`/todos/${obj._id}`, {
          title: obj.title.trim(),
          isCompleted: obj.isCompleted,
        })

        setTodo(res.data)
      } else {
        const res = await axiosInstance.post('/todos', {
          title: obj.title.trim(),
          isCompleted: false,
        })

        setTodo(res.data)
      }

      setObj({
        title: '',
        isCompleted: false,
      })

      setIsEditMode(false)
    } catch (error) {
      console.log(error)
    } finally {
      setActionLoading(false)
    }
  }

  const fetchTodoid = (val) => {
    setIsEditMode(true)

    setObj({
      _id: val._id,
      title: val.title,
      isCompleted: val.isCompleted,
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const cancelEdit = () => {
    setIsEditMode(false)

    setObj({
      title: '',
      isCompleted: false,
    })
  }

  const deleteHandle = async (id) => {
    try {
      setActionLoading(true)

      const res = await axiosInstance.delete(`/todos/${id}`)

      setTodo(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setActionLoading(false)
    }
  }

  const toggleComplete = async (val) => {
    try {
      setActionLoading(true)

      const res = await axiosInstance.put(`/todos/toggle/${val._id}`, {
        isCompleted: !val.isCompleted,
      })

      setTodo(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setActionLoading(false)
    }
  }

  const completedCount = useMemo(() => {
    return todo.filter((item) => item.isCompleted).length
  }, [todo])

  const pendingCount = todo.length - completedCount

  const getFormattedDate = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-3 py-4 sm:px-5 sm:py-5 md:px-7">
      <div className="mx-auto w-full max-w-4xl">
        {/* Page Header */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ListTodo size={19} />
              </div>

              <div>
                <h1 className="text-lg font-black tracking-tight text-gray-800 sm:text-xl">My Tasks</h1>

                <p className="text-[11px] text-gray-400 sm:text-xs">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-center">
              <p className="text-base font-black text-gray-800">{todo.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Total</p>
            </div>

            <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-center">
              <p className="text-base font-black text-green-600">{completedCount}</p>
              <p className="text-[9px] font-bold uppercase tracking-wide text-green-500">Done</p>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-center">
              <p className="text-base font-black text-orange-500">{pendingCount}</p>
              <p className="text-[9px] font-bold uppercase tracking-wide text-orange-500">Pending</p>
            </div>
          </div>
        </div>

        {/* Add / Edit Task */}
        <section className="mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-800 sm:text-base">{isEditMode ? 'Edit Task' : 'Add Task'}</h2>

              <p className="text-[10px] text-gray-400 sm:text-xs">{isEditMode ? 'Update your task details' : 'Add something to your task list'}</p>
            </div>

            {isEditMode && (
              <button type="button" onClick={cancelEdit} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                <X size={14} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={submitHandle} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="title"
              value={obj.title}
              onChange={(e) =>
                setObj((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter task..."
              required
              autoComplete="off"
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm font-medium text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:flex-1"
            />

            <button
              type="submit"
              disabled={actionLoading}
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-5 text-sm font-bold text-white shadow-md shadow-blue-500/15 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEditMode ? (
                <>
                  <Check size={16} />
                  Update
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add Task
                </>
              )}
            </button>
          </form>
        </section>

        {/* Todo List */}
        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-black text-gray-800">Task List</h2>

              <p className="text-[10px] text-gray-400 sm:text-xs">{todo.length === 0 ? 'No tasks available' : `${todo.length} task${todo.length > 1 ? 's' : ''}`}</p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-3 text-xs font-medium text-gray-400">Loading tasks...</p>
            </div>
          ) : todo.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <ListTodo size={23} />
              </div>

              <h3 className="mt-3 text-sm font-black text-gray-700">No tasks yet</h3>

              <p className="mt-1 text-xs text-gray-400">Add your first task above.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todo.map((val) => (
                <div key={val._id} className={`group rounded-2xl border bg-white px-3.5 py-3 shadow-sm transition-all hover:shadow-md sm:px-4 ${val.isCompleted ? 'border-green-100' : 'border-gray-200 hover:border-blue-200'}`}>
                  <div className="flex items-center gap-3">
                    {/* Complete */}
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => toggleComplete(val)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${val.isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 text-transparent hover:border-blue-500'}`}
                    >
                      <Check size={13} strokeWidth={3} />
                    </button>

                    {/* Task */}
                    <div className="min-w-0 flex-1">
                      <p className={`wrap-break-word text-sm font-bold ${val.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {val.title
                          .split(' ')
                          .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
                          .join(' ')}
                      </p>

                      <p className="mt-0.5 text-[9px] font-medium text-gray-400 sm:text-[10px]">{getFormattedDate(val.updatedAt)}</p>
                    </div>

                    {/* Status */}
                    <span className={`hidden rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide sm:inline-flex ${val.isCompleted ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                      {val.isCompleted ? 'Completed' : 'Pending'}
                    </span>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => fetchTodoid(val)}
                        title="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-500 hover:text-white disabled:opacity-50"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => deleteHandle(val._id)}
                        title="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile status */}
                  <div className="mt-2 pl-9 sm:hidden">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${val.isCompleted ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                      {val.isCompleted ? <CheckCircle2 size={10} /> : <Circle size={10} />}

                      {val.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
