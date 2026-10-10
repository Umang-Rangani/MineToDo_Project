import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Archive, ArchiveRestore, Check, Clock3, FilePlus2, FileText, MoreHorizontal, NotebookPen, Plus, Search, Save, Trash2, X } from 'lucide-react'
import { FaRegClock, FaRegStickyNote } from 'react-icons/fa'
import { axiosInstance } from '../axiosConfig/axiosInstance'

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getRelativeDate = (dateKey) => {
  const today = new Date()
  const yesterday = new Date()
  const target = new Date(`${dateKey}T00:00:00`)

  today.setHours(0, 0, 0, 0)
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  if (target.getTime() === today.getTime()) return 'Today'
  if (target.getTime() === yesterday.getTime()) return 'Yesterday'

  return target.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

const formatDate = (dateKey) => {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

const HISTORY_DAYS = 14

const normalizeNote = (note) => ({
  ...note,
  id: note._id || note.id,
  title: note.title || 'Untitled Note',
  content: note.content || '',
  archived: Boolean(note.archived),
  updatedAt: note.updatedAt
    ? new Date(note.updatedAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Just now',
})

export default function Notebook() {
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [selectedDate, setSelectedDate] = useState(getDateKey())
  const [historyOffset, setHistoryOffset] = useState(0)

  const [openMenuId, setOpenMenuId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const [saveStatus, setSaveStatus] = useState('saved')
  const [showNotesPanel, setShowNotesPanel] = useState(false)
  const [isNewNote, setIsNewNote] = useState(false)

  const [loadingNotes, setLoadingNotes] = useState(true)
  const [apiError, setApiError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const menuRef = useRef(null)
  const searchRef = useRef(null)
  const titleRef = useRef(null)

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedNoteId) || null, [notes, selectedNoteId])

  const historyDates = useMemo(() => {
    return Array.from({ length: HISTORY_DAYS }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index - historyOffset)

      return {
        key: getDateKey(date),
        date,
      }
    })
  }, [historyOffset])

  const visibleNotes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return notes
      .filter((note) => Boolean(note.archived) === showArchived)
      .filter((note) => note.dateKey === selectedDate)
      .filter((note) => {
        if (!normalizedSearch) return true

        return note.title.toLowerCase().includes(normalizedSearch) || note.content.toLowerCase().includes(normalizedSearch)
      })
      .sort((a, b) => {
        return new Date(b.updatedAtRaw || b.updatedAt) - new Date(a.updatedAtRaw || a.updatedAt)
      })
  }, [notes, search, selectedDate, showArchived])

  const dateNoteCounts = useMemo(() => {
    return notes.reduce((counts, note) => {
      if (Boolean(note.archived) === showArchived) {
        counts[note.dateKey] = (counts[note.dateKey] || 0) + 1
      }

      return counts
    }, {})
  }, [notes, showArchived])

  const deleteTarget = useMemo(() => notes.find((note) => note.id === deleteTargetId) || null, [notes, deleteTargetId])

  const fetchNotes = async () => {
    setLoadingNotes(true)
    setApiError('')

    try {
      const response = await axiosInstance.get('/notebook')
      const fetchedNotes = (response.data.notes || []).map((note) => ({
        ...normalizeNote(note),
        updatedAtRaw: note.updatedAt || note.createdAt || new Date().toISOString(),
      }))

      setNotes(fetchedNotes)

      setSelectedNoteId((currentId) => {
        if (currentId && fetchedNotes.some((note) => note.id === currentId)) {
          return currentId
        }

        const todayNote = fetchedNotes.find((note) => note.dateKey === getDateKey())

        return todayNote?.id ?? null
      })
    } catch (error) {
      console.error('Fetch notes error:', error)
      setApiError(error.response?.data?.message || 'Failed to load notes. Please try again.')
    } finally {
      setLoadingNotes(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    if (isNewNote) return

    if (selectedNote) {
      setTitle(selectedNote.title)
      setContent(selectedNote.content)
      setSaveStatus('saved')
    } else {
      setTitle('')
      setContent('')
      setSaveStatus('saved')
    }
  }, [selectedNoteId, selectedNote, isNewNote])

  useEffect(() => {
    if (showSearch) {
      searchRef.current?.focus()
    }
  }, [showSearch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null)
        setShowDeleteConfirm(false)
        setDeleteTargetId(null)
        setShowNotesPanel(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (!showDeleteConfirm && !showNotesPanel) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showDeleteConfirm, showNotesPanel])

  const closeNotesPanel = () => {
    setShowNotesPanel(false)
    setOpenMenuId(null)
  }

  const selectNote = (note) => {
    setSelectedNoteId(note.id)
    setSelectedDate(note.dateKey)
    setTitle(note.title)
    setContent(note.content)
    setIsNewNote(false)
    setSaveStatus('saved')
    setShowNotesPanel(false)
    setOpenMenuId(null)
  }

  const handleNewNote = () => {
    setSelectedNoteId(null)
    setTitle('')
    setContent('')
    setSelectedDate(getDateKey())
    setIsNewNote(true)
    setSaveStatus('unsaved')
    setShowNotesPanel(false)
    setOpenMenuId(null)

    setTimeout(() => titleRef.current?.focus(), 0)
  }

  const handleSave = async () => {
    if (actionLoading) return

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle && !trimmedContent) return

    const noteTitle = trimmedTitle || 'Untitled Note'
    const dateKey = selectedNote?.dateKey || selectedDate || getDateKey()

    setActionLoading(true)
    setSaveStatus('saving')
    setApiError('')

    try {
      let response

      if (selectedNoteId && !isNewNote) {
        response = await axiosInstance.put(`/notebook/${selectedNoteId}`, {
          title: noteTitle,
          content: trimmedContent,
          dateKey,
        })
      } else {
        response = await axiosInstance.post('/notebook', {
          title: noteTitle,
          content: trimmedContent,
          dateKey,
        })
      }

      const savedNote = {
        ...normalizeNote(response.data.note),
        updatedAtRaw: response.data.note.updatedAt || response.data.note.createdAt || new Date().toISOString(),
      }

      setNotes((previous) => {
        const exists = previous.some((note) => note.id === savedNote.id)

        if (exists) {
          return previous.map((note) => (note.id === savedNote.id ? savedNote : note))
        }

        return [savedNote, ...previous]
      })

      setSelectedNoteId(savedNote.id)
      setSelectedDate(savedNote.dateKey)
      setTitle(savedNote.title)
      setContent(savedNote.content)
      setShowArchived(false)
      setIsNewNote(false)
      setSaveStatus('saved')
    } catch (error) {
      console.error('Save note error:', error)
      setApiError(error.response?.data?.message || 'Failed to save note. Please try again.')
      setSaveStatus('unsaved')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteTargetId === null || actionLoading) return

    setActionLoading(true)
    setApiError('')

    try {
      await axiosInstance.delete(`/notebook/${deleteTargetId}`)

      const remainingNotes = notes.filter((note) => note.id !== deleteTargetId)

      setNotes(remainingNotes)

      if (selectedNoteId === deleteTargetId) {
        const nextNote = remainingNotes.find((note) => Boolean(note.archived) === showArchived && note.dateKey === selectedDate)

        setSelectedNoteId(nextNote?.id ?? null)
        setTitle(nextNote?.title || '')
        setContent(nextNote?.content || '')
        setIsNewNote(!nextNote)
      }

      setShowDeleteConfirm(false)
      setDeleteTargetId(null)
      setOpenMenuId(null)
      setSaveStatus('saved')
    } catch (error) {
      console.error('Delete note error:', error)
      setApiError(error.response?.data?.message || 'Failed to delete note. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleArchive = async (note) => {
    if (actionLoading) return

    setActionLoading(true)
    setApiError('')

    try {
      const endpoint = note.archived ? `/notebook/${note.id}/unarchive` : `/notebook/${note.id}/archive`

      await axiosInstance.put(endpoint)

      setNotes((previous) => previous.filter((item) => item.id !== note.id))

      if (selectedNoteId === note.id) {
        setSelectedNoteId(null)
        setTitle('')
        setContent('')
        setIsNewNote(true)
        setSaveStatus('saved')
      }

      setOpenMenuId(null)
    } catch (error) {
      console.error('Archive note error:', error)
      setApiError(error.response?.data?.message || 'Failed to update archive. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (note) => {
    selectNote(note)
    setShowArchived(Boolean(note.archived))
  }

  const handleSearchToggle = () => {
    setShowSearch((previous) => {
      if (previous) setSearch('')
      return !previous
    })
  }

  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey)
    setOpenMenuId(null)

    const matchingNote = notes.find((note) => note.dateKey === dateKey && Boolean(note.archived) === showArchived)

    if (matchingNote) {
      selectNote(matchingNote)
    } else {
      setSelectedNoteId(null)
      setTitle('')
      setContent('')
      setIsNewNote(true)
      setSaveStatus('saved')
    }
  }

  const handleOlderDates = () => {
    setHistoryOffset((previous) => previous + HISTORY_DAYS)
  }

  const handleNewerDates = () => {
    setHistoryOffset((previous) => Math.max(0, previous - HISTORY_DAYS))
  }

  const requestDelete = (note) => {
    setDeleteTargetId(note.id)
    setShowDeleteConfirm(true)
    setOpenMenuId(null)
  }

  const handleEditorChange = (setter, value) => {
    setter(value)
    setSaveStatus('unsaved')
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 text-(--color-text)">
      <div className="relative flex min-h-0 flex-1 flex-col gap-4 pb-18 lg:flex-row lg:pb-0">
        <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-(--color-border) px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primary)">
                <NotebookPen size={20} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-base font-bold sm:text-lg">Notebook</h1>
                <p className="truncate text-xs text-(--color-muted) sm:text-sm">Your thoughts, organized.</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={handleNewNote} className="inline-flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm font-semibold transition hover:bg-(--color-soft)">
                <FilePlus2 size={16} />
                <span className="hidden sm:inline">Clear</span>
                <span className="sm:hidden">Clear</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={actionLoading || (!title.trim() && !content.trim())}
                className="inline-flex items-center gap-2 rounded-xl bg-(--color-primary) px-3 py-2 text-sm font-semibold text-white transition hover:bg-(--color-primaryDark) disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </header>

          <div className="relative flex min-h-0 flex-1 flex-col p-4 sm:p-6">
            <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 text-xs text-(--color-muted)">
                <FaRegClock className="shrink-0" />
                <span className="truncate">{selectedNote ? `Last updated ${selectedNote.updatedAt}` : 'New note'}</span>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 text-xs">
                {saveStatus === 'saved' ? (
                  <>
                    <Check size={14} className="text-(--color-primary)" />
                    <span className="text-(--color-muted)">Saved</span>
                  </>
                ) : (
                  <>
                    <Clock3 size={14} className="text-(--color-muted)" />
                    <span className="text-(--color-muted)">{saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}</span>
                  </>
                )}
              </div>
            </div>


            {loadingNotes && <p className="mb-3 text-sm text-(--color-muted)">Loading notes...</p>}

            <div className="flex min-h-0 flex-1 flex-col">
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(event) => handleEditorChange(setTitle, event.target.value)}
                placeholder="Give your note a title..."
                className="w-full shrink-0 border-0 bg-transparent px-0 py-2 text-xl font-bold outline-none placeholder:text-(--color-muted)/60 focus:ring-0 sm:text-2xl"
              />

              <div className="my-2 shrink-0 border-t border-(--color-border)" />

              <textarea
                value={content}
                onChange={(event) => handleEditorChange(setContent, event.target.value)}
                placeholder="Start writing your thoughts..."
                className="min-h-48 flex-1 resize-none border-0 bg-transparent px-0 py-2 text-sm leading-7 outline-none placeholder:text-(--color-muted)/60 focus:ring-0 sm:text-base"
              />
            </div>
          </div>
        </section>

        {/* mobile add button section */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 h-20 lg:hidden z-51">
          <div className="absolute inset-0 bg-(--color-bg)/65 backdrop-blur-sm" />

          <button
            type="button"
            onClick={() => setShowNotesPanel((previous) => !previous)}
            aria-label="Add new task"
            className="pointer-events-auto absolute bottom-5 left-1/2 flex h-13 w-13 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={22} />
          </button>
        </div>

        {showNotesPanel && <button type="button" aria-label="Close notes list" onClick={closeNotesPanel} className="fixed inset-0 z-40 bg-(--color-text)/45 backdrop-blur-md lg:hidden" />}

        <aside
          className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[84dvh] max-sm:pb-21 min-h-0 flex-col overflow-hidden rounded-t-3xl border-t border-(--color-border) bg-(--color-surface) shadow-2xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:max-h-none lg:w-90 lg:shrink-0 lg:translate-y-0 lg:rounded-2xl lg:border lg:shadow-sm ${
            showNotesPanel ? 'translate-y-0' : 'pointer-events-none translate-y-full lg:pointer-events-auto'
          }`}
        >
          <header className="shrink-0 border-b border-(--color-border)">
            <div className="px-4 pt-3 lg:hidden">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-(--color-border)" />
            </div>

            <div className="flex min-h-16 items-center justify-between gap-2 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primary)">
                  <FaRegStickyNote size={16} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold">{showArchived ? 'Archived Notes' : 'Saved Notes'}</h2>
                  <p className="text-xs text-(--color-muted)">
                    {visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={closeNotesPanel}
                  title="Close notes"
                  aria-label="Close notes"
                  className="flex size-9 items-center justify-center rounded-xl text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) lg:hidden"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* history date */}
            <div className="border-t border-(--color-border) px-3 py-3">
              <div className="no-scrollbar flex items-stretch gap-2 overflow-x-auto overscroll-x-contain">
                {historyDates
                  .slice()
                  .reverse()
                  .map(({ key, date }) => {
                    const isSelected = selectedDate === key
                    const count = dateNoteCounts[key] || 0

                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => handleDateSelect(key)}
                        title={formatDate(key)}
                        className={`relative flex min-w-15 shrink-0 flex-col items-center justify-center rounded-xl px-3 py-2.5 transition ${
                          isSelected ? 'bg-(--color-primary) text-white shadow-sm' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)'
                        }`}
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-wide">{date.toLocaleDateString('en-IN', { weekday: 'short' })}</span>

                        <span className="my-1 text-lg font-bold leading-none">{date.getDate()}</span>

                        <span className="text-[10px] font-medium">{date.toLocaleDateString('en-IN', { month: 'short' })}</span>

                        {count > 0 && <span className={`mt-1.5 size-1 rounded-full ${isSelected ? 'bg-white' : 'bg-(--color-primary)'}`} />}
                      </button>
                    )
                  })}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="truncate text-xs font-semibold text-(--color-muted)">{formatDate(selectedDate)}</p>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(getDateKey())
                    setHistoryOffset(0)
                  }}
                  className="shrink-0 text-xs font-semibold text-(--color-primary) hover:underline"
                >
                  Today
                </button>
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-3">
            {visibleNotes.length > 0 ? (
              <div className="flex flex-col gap-2">
                {visibleNotes.map((note) => {
                  const isSelected = selectedNoteId === note.id

                  return (
                    <div key={note.id} className={`group relative rounded-xl border transition ${isSelected ? 'border-(--color-primary)/40 bg-(--color-soft)' : 'border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg)'}`}>
                      <button type="button" onClick={() => selectNote(note)} className="block w-full min-w-0 px-3 py-3 pr-11 text-left">
                        <div className="mb-1.5 flex min-w-0 items-center gap-2">
                          <FileText size={15} className="shrink-0 text-(--color-primary)" />
                          <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{note.title || 'Untitled Note'}</h3>
                        </div>

                        <p className="line-clamp-2 wrap-break-word text-xs leading-5 text-(--color-muted)">{note.content || 'No additional content'}</p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="flex min-w-0 items-center gap-1 text-[10px] text-(--color-muted)">
                            <FaRegClock size={10} />
                            <span className="truncate">{note.updatedAt}</span>
                          </span>

                          {note.archived && <span className="shrink-0 rounded-md bg-(--color-soft) px-1.5 py-0.5 text-[10px] font-medium text-(--color-muted)">Archived</span>}
                        </div>
                      </button>

                      <div className="absolute right-2 top-2" ref={openMenuId === note.id ? menuRef : null}>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setOpenMenuId((previous) => (previous === note.id ? null : note.id))
                          }}
                          aria-label="Note options"
                          title="Note options"
                          className={`flex size-8 items-center justify-center rounded-lg transition ${openMenuId === note.id ? 'bg-(--color-soft) text-(--color-text)' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)'}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenuId === note.id && (
                          <div className="absolute right-8 top-2 z-30 w-44 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-lg">
                            <button type="button" onClick={() => handleEdit(note)} className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition hover:bg-(--color-soft)">
                              <NotebookPen size={15} className="text-(--color-muted)" />
                              Edit
                            </button>

                            <button type="button" onClick={() => handleArchive(note)} disabled={actionLoading} className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition hover:bg-(--color-soft) disabled:opacity-50">
                              {note.archived ? <ArchiveRestore size={15} className="text-(--color-muted)" /> : <Archive size={15} className="text-(--color-muted)" />}
                              {note.archived ? 'Unarchive' : 'Archive'}
                            </button>

                            <button type="button" onClick={() => requestDelete(note)} className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm text-(--color-danger) transition hover:bg-(--color-dangerBg)">
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center px-4 py-8 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primary)">{search ? <Search size={21} /> : <FaRegStickyNote size={21} />}</div>

                <h3 className="text-sm font-semibold">{loadingNotes ? 'Loading notes...' : apiError ? 'Unable to load notes' : search ? 'No notes found' : showArchived ? 'No archived notes' : 'No notes for this date'}</h3>

                <p className="mt-1 max-w-52 text-xs leading-5 text-(--color-muted)">{search ? 'Try another keyword to find your note.' : showArchived ? 'Archived notes will appear here.' : 'Create a note to keep your thoughts organized.'}</p>

              
              </div>
            )}
          </div>
        </aside>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !actionLoading) {
              setShowDeleteConfirm(false)
              setDeleteTargetId(null)
            }
          }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="delete-note-title" className="w-full max-w-sm rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--color-dangerBg) text-(--color-danger)">
                <Trash2 size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 id="delete-note-title" className="text-base font-bold">
                  Delete note?
                </h2>
                <p className="mt-1 text-sm leading-6 text-(--color-muted)">
                  Are you sure you want to delete <span className="font-semibold text-(--color-text)">{deleteTarget?.title || 'this note'}</span>? This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (actionLoading) return
                  setShowDeleteConfirm(false)
                  setDeleteTargetId(null)
                }}
                aria-label="Close confirmation"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-(--color-muted) transition hover:bg-(--color-soft)"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteTargetId(null)
                }}
                className="rounded-xl border border-(--color-border) px-4 py-2.5 text-sm font-semibold transition hover:bg-(--color-soft) disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-(--color-danger) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                <Trash2 size={15} />
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
