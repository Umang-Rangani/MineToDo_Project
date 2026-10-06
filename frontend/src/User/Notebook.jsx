import React, { useEffect, useMemo, useState } from 'react'
import { FilePlus2, NotebookPen, Plus, Save, Search, Trash2 } from 'lucide-react'
import { FaRegClock, FaRegStickyNote } from 'react-icons/fa'

const initialNotes = [
  {
    id: 1,
    title: 'Project Ideas',
    content: 'Build a clean productivity workspace with Todo, Notebook and Vault.',
    updatedAt: 'Today',
  },
  {
    id: 2,
    title: 'Shopping List',
    content: 'New keyboard, notebook, desk lamp and a comfortable office chair.',
    updatedAt: 'Yesterday',
  },
  {
    id: 3,
    title: 'Learning Plan',
    content: 'Complete React, Node.js, MongoDB and deployment concepts step by step.',
    updatedAt: '2 days ago',
  },
]

export default function Notebook() {
  const [notes, setNotes] = useState(initialNotes)
  const [selectedNoteId, setSelectedNoteId] = useState(initialNotes[0]?.id || null)

  const [title, setTitle] = useState(initialNotes[0]?.title || '')
  const [content, setContent] = useState(initialNotes[0]?.content || '')
  const [search, setSearch] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saveStatus, setSaveStatus] = useState('Saved')

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedNoteId), [notes, selectedNoteId])

  const filteredNotes = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return notes

    return notes.filter((note) => note.title.toLowerCase().includes(value) || note.content.toLowerCase().includes(value))
  }, [notes, search])

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title)
      setContent(selectedNote.content)
      setSaveStatus('Saved')
    }
  }, [selectedNoteId])

  useEffect(() => {
    if (showDeleteConfirm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [showDeleteConfirm])

  const selectNote = (note) => {
    setSelectedNoteId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setSaveStatus('Saved')
  }

  const handleNewFromEditor = () => {
    setSelectedNoteId(null)
    setTitle('')
    setContent('')
    setSaveStatus('Unsaved')
  }

  const handleSave = () => {
    const cleanTitle = title.trim() || 'Untitled Note'

    if (selectedNoteId) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              title: cleanTitle,
              content,
              updatedAt: 'Just now',
            }
          : note,
      )

      setNotes(updatedNotes)
      setTitle(cleanTitle)
      setSaveStatus('Saved')
      return
    }

    const newNote = {
      id: Date.now(),
      title: cleanTitle,
      content,
      updatedAt: 'Just now',
    }

    setNotes((prev) => [newNote, ...prev])
    setSelectedNoteId(newNote.id)
    setTitle(cleanTitle)
    setSaveStatus('Saved')
  }

  const handleDelete = () => {
    if (!selectedNoteId) return

    const remainingNotes = notes.filter((note) => note.id !== selectedNoteId)

    setNotes(remainingNotes)

    const nextNote = remainingNotes[0]

    if (nextNote) {
      setSelectedNoteId(nextNote.id)
      setTitle(nextNote.title)
      setContent(nextNote.content)
      setSaveStatus('Saved')
    } else {
      setSelectedNoteId(null)
      setTitle('')
      setContent('')
      setSaveStatus('Unsaved')
    }

    setShowDeleteConfirm(false)
  }

  const deletePreviewTitle = selectedNote?.title || 'Untitled Note'

  const deletePreviewDescription = selectedNote?.content?.trim() || 'This note has no description.'

  return (
    <div className="w-full">
      <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
          <div className="flex min-h-15 items-center justify-between gap-3 border-b border-(--color-border) px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primaryDark)">
                <NotebookPen size={18} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-(--color-text) sm:text-base">Notepad</h2>

                <p className="hidden text-xs text-(--color-muted) sm:block">Write and save your thoughts</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={handleNewFromEditor} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-(--color-soft) px-3 text-xs font-semibold text-(--color-primaryDark) transition hover:bg-(--color-border)">
                <FilePlus2 size={15} />
                <span>New Note</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) px-3 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                <Save size={15} />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg)">
              <div className="flex items-center justify-between gap-3 border-b border-(--color-border) px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <FaRegStickyNote className="shrink-0 text-(--color-primary)" size={14} />

                  <span className="truncate text-xs font-semibold text-(--color-text)">{selectedNoteId ? 'Editing Note' : 'New Note'}</span>
                </div>

                <span className="shrink-0 text-[11px] font-medium text-(--color-muted)">{saveStatus}</span>
              </div>

              <div className="p-3 sm:p-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setSaveStatus('Unsaved')
                  }}
                  placeholder="Note title"
                  className="w-full border-0 bg-transparent px-0 text-lg font-bold text-(--color-text) outline-none placeholder:text-(--color-muted) sm:text-xl"
                />

                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                    setSaveStatus('Unsaved')
                  }}
                  placeholder="Start writing your note..."
                  className="mt-3 min-h-100 w-full resize-none border-0 bg-transparent px-0 text-sm leading-7 text-(--color-text) outline-none placeholder:text-(--color-muted)"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-(--color-muted)">
              <FaRegClock size={12} />
              <span>{selectedNote?.updatedAt || 'Not saved yet'}</span>
            </div>
          </div>
        </section>

        <aside className="min-w-0 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
          <div className="flex h-15 items-center justify-between gap-3 border-b border-(--color-border) px-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primaryDark)">
                <FaRegStickyNote size={16} />
              </div>

              <div className="flex min-w-0 items-center gap-2">
                <h2 className="whitespace-nowrap text-sm font-bold text-(--color-text)">Saved Notes</h2>

                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-soft) px-1.5 text-[10px] font-bold text-(--color-primaryDark)">{notes.length}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (selectedNoteId) {
                  setShowDeleteConfirm(true)
                }
              }}
              disabled={!selectedNoteId}
              aria-label="Delete selected note"
              title={selectedNoteId ? 'Delete selected note' : 'Select a note first'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-primaryDark) disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Trash2 size={17} />
            </button>
          </div>

          <div className="p-3 sm:p-4">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-3 text-xs text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary)"
              />
            </div>

            <div className="mt-3 space-y-2">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => {
                  const isActive = note.id === selectedNoteId

                  return (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => selectNote(note)}
                      className={`w-full rounded-xl border p-3 text-left transition ${isActive ? 'border-(--color-primary) bg-(--color-soft)' : 'border-(--color-border) bg-(--color-surface) hover:bg-(--color-soft)'}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-(--color-primary) text-white' : 'bg-(--color-soft) text-(--color-primaryDark)'}`}>
                          <FaRegStickyNote size={14} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-xs font-bold text-(--color-text)">{note.title}</h3>

                          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-(--color-muted)">{note.content || 'No content'}</p>

                          <div className="mt-2 flex items-center gap-1 text-[10px] text-(--color-muted)">
                            <FaRegClock size={9} />
                            <span>{note.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="rounded-xl border border-dashed border-(--color-border) px-4 py-8 text-center">
                  <FaRegStickyNote size={22} className="mx-auto text-(--color-muted)" />

                  <p className="mt-2 text-xs font-semibold text-(--color-text)">No notes found</p>

                  <p className="mt-1 text-[11px] text-(--color-muted)">Try another search</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={handleNewFromEditor}
        aria-label="New Note"
        className="fixed bottom-5 right-5 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-br from-(--color-primary) to-(--color-primaryDark) text-white shadow-lg transition hover:scale-105 lg:hidden"
      >
        <Plus size={22} />
      </button>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-100 flex h-dvh w-full items-center justify-center overflow-hidden bg-black/35 px-4">
          <div className="w-full max-w-105 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-xl">
            <div className="border-b border-(--color-border) px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primaryDark)">
                  <Trash2 size={18} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-(--color-text)">Delete note?</h3>

                  <p className="mt-0.5 text-xs text-(--color-muted)">Please verify the note before deleting.</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                    <FaRegStickyNote size={15} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-(--color-text)">{deletePreviewTitle}</h4>

                    <p className="mt-1 line-clamp-3 text-xs leading-5 text-(--color-muted)">{deletePreviewDescription}</p>

                    <div className="mt-2 flex items-center gap-1 text-[10px] text-(--color-muted)">
                      <FaRegClock size={9} />
                      <span>{selectedNote?.updatedAt || 'Just now'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-(--color-muted)">This note will be permanently removed from your saved notes.</p>

              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setShowDeleteConfirm(false)} className="h-9 rounded-xl border border-(--color-border) px-3 text-xs font-semibold text-(--color-text) transition hover:bg-(--color-soft)">
                  Cancel
                </button>

                <button type="button" onClick={handleDelete} className="h-9 rounded-xl bg-(--color-primaryDark) px-3 text-xs font-semibold text-white transition hover:opacity-90">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
