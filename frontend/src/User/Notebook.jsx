import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Archive, ArchiveRestore, Check, ChevronLeft, ChevronRight, Clock3, FilePlus2, FileText, MoreHorizontal, NotebookPen, Plus, Search, Save, Trash2, X } from 'lucide-react'
import { FaRegClock, FaRegStickyNote } from 'react-icons/fa'

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

const getInitialNotes = () => {
  const today = new Date()
  const yesterday = new Date()
  const twoDaysAgo = new Date()

  yesterday.setDate(today.getDate() - 1)
  twoDaysAgo.setDate(today.getDate() - 2)

  return [
    {
      id: 1,
      title: 'Project Ideas',
      content: 'Build a clean productivity workspace with Todo, Notebook and Vault.',
      dateKey: getDateKey(today),
      updatedAt: 'Just now',
      archived: false,
    },
    {
      id: 2,
      title: 'Shopping List',
      content: 'New keyboard, notebook, desk lamp and a comfortable office chair.',
      dateKey: getDateKey(yesterday),
      updatedAt: 'Yesterday',
      archived: false,
    },
    {
      id: 3,
      title: 'Learning Plan',
      content: 'Complete React, Node.js, MongoDB and deployment concepts step by step.',
      dateKey: getDateKey(twoDaysAgo),
      updatedAt: '2 days ago',
      archived: false,
    },
  ]
}

const HISTORY_DAYS = 14

export default function Notebook() {
  const [notes, setNotes] = useState(getInitialNotes)
  const [selectedNoteId, setSelectedNoteId] = useState(1)

  const [title, setTitle] = useState('Project Ideas')
  const [content, setContent] = useState('Build a clean productivity workspace with Todo, Notebook and Vault.')

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
      .sort((a, b) => b.id - a.id)
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
    if (!showDeleteConfirm) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showDeleteConfirm])

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

  const handleSave = () => {
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle && !trimmedContent) return

    const noteTitle = trimmedTitle || 'Untitled Note'
    const now = new Date()
    const dateKey = getDateKey(now)

    if (selectedNoteId !== null && !isNewNote) {
      setNotes((previousNotes) =>
        previousNotes.map((note) =>
          note.id === selectedNoteId
            ? {
                ...note,
                title: noteTitle,
                content: trimmedContent,
                dateKey,
                updatedAt: 'Just now',
              }
            : note,
        ),
      )
    } else {
      const newNote = {
        id: Date.now(),
        title: noteTitle,
        content: trimmedContent,
        dateKey,
        updatedAt: 'Just now',
        archived: false,
      }

      setNotes((previousNotes) => [newNote, ...previousNotes])
      setSelectedNoteId(newNote.id)
    }

    setTitle(noteTitle)
    setContent(trimmedContent)
    setSelectedDate(dateKey)
    setShowArchived(false)
    setIsNewNote(false)
    setSaveStatus('saved')
  }

  const handleDelete = () => {
    if (deleteTargetId === null) return

    const remainingNotes = notes.filter((note) => note.id !== deleteTargetId)

    setNotes(remainingNotes)

    if (selectedNoteId === deleteTargetId) {
      const nextNote = remainingNotes.find((note) => Boolean(note.archived) === showArchived && note.dateKey === selectedDate)

      if (nextNote) {
        setSelectedNoteId(nextNote.id)
        setTitle(nextNote.title)
        setContent(nextNote.content)
        setIsNewNote(false)
      } else {
        setSelectedNoteId(null)
        setTitle('')
        setContent('')
        setIsNewNote(true)
      }
    }

    setShowDeleteConfirm(false)
    setDeleteTargetId(null)
    setOpenMenuId(null)
    setSaveStatus('saved')
  }

  const handleArchive = (note) => {
    const nextArchivedState = !note.archived

    setNotes((previousNotes) => previousNotes.map((item) => (item.id === note.id ? { ...item, archived: nextArchivedState } : item)))

    if (selectedNoteId === note.id) {
      setSelectedNoteId(null)
      setTitle('')
      setContent('')
      setIsNewNote(true)
    }

    setOpenMenuId(null)
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
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
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
                <span className="hidden sm:inline">New Note</span>
                <span className="sm:hidden">New</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!title.trim() && !content.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-(--color-primary) px-3 py-2 text-sm font-semibold text-white transition hover:bg-(--color-primaryDark) disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
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
                    <span className="text-(--color-muted)">Unsaved changes</span>
                  </>
                )}
              </div>
            </div>

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

            <div className="mt-4 flex shrink-0 items-center justify-between gap-3 border-t border-(--color-border) pt-3">
              <p className="text-xs text-(--color-muted)">{content.length} characters</p>

              <button type="button" onClick={() => setShowNotesPanel((previous) => !previous)} className="rounded-xl border border-(--color-border) px-3 py-2 text-xs font-semibold transition hover:bg-(--color-soft) lg:hidden">
                {showNotesPanel ? 'Hide Notes' : 'Show Notes'}
              </button>
            </div>
          </div>
        </section>

        <aside className={`${showNotesPanel ? 'flex' : 'hidden'} min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm lg:flex lg:w-90 lg:shrink-0`}>
          <header className="shrink-0 border-b border-(--color-border)">
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
                  onClick={handleSearchToggle}
                  title={showSearch ? 'Close search' : 'Search notes'}
                  aria-label={showSearch ? 'Close search' : 'Search notes'}
                  className={`flex size-9 items-center justify-center rounded-xl transition ${showSearch ? 'bg-(--color-soft) text-(--color-primary)' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)'}`}
                >
                  {showSearch ? <X size={17} /> : <Search size={17} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowArchived((previous) => !previous)
                    setSelectedDate(getDateKey())
                    setSearch('')
                    setOpenMenuId(null)
                  }}
                  title={showArchived ? 'Show saved notes' : 'Show archived notes'}
                  aria-label={showArchived ? 'Show saved notes' : 'Show archived notes'}
                  className={`flex size-9 items-center justify-center rounded-xl transition ${showArchived ? 'bg-(--color-soft) text-(--color-primary)' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)'}`}
                >
                  {showArchived ? <ArchiveRestore size={17} /> : <Archive size={17} />}
                </button>

                <button type="button" onClick={handleNewNote} title="Create note" aria-label="Create note" className="flex size-9 items-center justify-center rounded-xl bg-(--color-primary) text-white transition hover:bg-(--color-primaryDark)">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {showSearch && (
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg) px-3">
                  <Search size={16} className="shrink-0 text-(--color-muted)" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search notes..."
                    className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-(--color-muted)/70"
                  />
                  {search && (
                    <button type="button" onClick={() => setSearch('')} aria-label="Clear search" className="flex size-7 shrink-0 items-center justify-center rounded-lg text-(--color-muted) hover:bg-(--color-soft)">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 border-t border-(--color-border) px-3 py-3">
              <button
                type="button"
                onClick={handleOlderDates}
                disabled={historyOffset === 0}
                title="Newer dates"
                aria-label="Newer dates"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-(--color-muted) transition hover:bg-(--color-soft) disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={17} />
              </button>

              <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto overscroll-contain no-scrollbar">
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
                        className={`relative flex min-w-11 shrink-0 flex-col items-center justify-center rounded-xl px-2 py-2 transition ${
                          isSelected ? 'bg-(--color-primary) text-white' : 'text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-text)'
                        }`}
                        title={formatDate(key)}
                      >
                        <span className="text-[10px] font-medium">
                          {date.toLocaleDateString('en-IN', {
                            weekday: 'short',
                          })}
                        </span>
                        <span className="mt-0.5 text-sm font-bold">{date.getDate()}</span>
                        {count > 0 && <span className={`mt-1 size-1 rounded-full ${isSelected ? 'bg-white' : 'bg-(--color-primary)'}`} />}
                      </button>
                    )
                  })}
              </div>

              <button
                type="button"
                onClick={handleNewerDates}
                disabled={historyOffset === 0}
                title="Newer dates"
                aria-label="Newer dates"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-(--color-muted) transition hover:bg-(--color-soft) disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 px-4 pb-3">
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
                          <div className="absolute right-0 top-9 z-30 w-44 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 shadow-lg">
                            <button type="button" onClick={() => handleEdit(note)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-(--color-soft)">
                              <NotebookPen size={15} className="text-(--color-muted)" />
                              Edit
                            </button>

                            <button type="button" onClick={() => handleArchive(note)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-(--color-soft)">
                              {note.archived ? <ArchiveRestore size={15} className="text-(--color-muted)" /> : <Archive size={15} className="text-(--color-muted)" />}
                              {note.archived ? 'Unarchive' : 'Archive'}
                            </button>

                            <div className="my-1 border-t border-(--color-border)" />

                            <button type="button" onClick={() => requestDelete(note)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-(--color-danger) transition hover:bg-(--color-dangerBg)">
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

                <h3 className="text-sm font-semibold">{search ? 'No notes found' : showArchived ? 'No archived notes' : 'No notes for this date'}</h3>

                <p className="mt-1 max-w-52 text-xs leading-5 text-(--color-muted)">{search ? 'Try another keyword to find your note.' : showArchived ? 'Archived notes will appear here.' : 'Create a note to keep your thoughts organized.'}</p>

                {!showArchived && !search && (
                  <button type="button" onClick={handleNewNote} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-(--color-primary) px-3 py-2 text-xs font-semibold text-white transition hover:bg-(--color-primaryDark)">
                    <Plus size={14} />
                    Create Note
                  </button>
                )}
              </div>
            )}
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-(--color-border) px-4 py-3">
            <span className="text-xs text-(--color-muted)">
              {notes.filter((note) => Boolean(note.archived) === showArchived).length} total {showArchived ? 'archived' : 'saved'}
            </span>

            <button type="button" onClick={handleNewNote} className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--color-primary) hover:underline">
              <Plus size={14} />
              New note
            </button>
          </footer>
        </aside>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
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
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteTargetId(null)
                }}
                className="rounded-xl border border-(--color-border) px-4 py-2.5 text-sm font-semibold transition hover:bg-(--color-soft)"
              >
                Cancel
              </button>

              <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl bg-(--color-danger) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
