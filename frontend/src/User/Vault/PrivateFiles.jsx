import React, { useMemo, useState } from 'react'
import { Archive, Download, File, FileArchive, FileImage, FileText, FileVideo, FolderLock, MoreVertical, Plus, Search, Trash2, Upload, X } from 'lucide-react'

const fileCategories = ['All', 'Documents', 'Images', 'Videos', 'Other']

export const initialFiles = [
  {
    id: 1,
    name: 'Aadhaar Card.pdf',
    type: 'pdf',
    size: '1.8 MB',
    updatedAt: 'Today',
    category: 'Documents',
  },
  {
    id: 2,
    name: 'Passport.jpg',
    type: 'image',
    size: '2.4 MB',
    updatedAt: 'Yesterday',
    category: 'Images',
  },
  {
    id: 3,
    name: 'Personal Video.mp4',
    type: 'video',
    size: '24.8 MB',
    updatedAt: '3 days ago',
    category: 'Videos',
  },
  {
    id: 4,
    name: 'Important Documents.zip',
    type: 'archive',
    size: '8.2 MB',
    updatedAt: '5 days ago',
    category: 'Other',
  },
]

const getFileIcon = (type) => {
  if (type === 'pdf') return <FileText size={18} />
  if (type === 'image') return <FileImage size={18} />
  if (type === 'video') return <FileVideo size={18} />
  if (type === 'archive') return <FileArchive size={18} />

  return <File size={18} />
}

export default function PrivateFiles({ files, setFiles, selectedFile, setSelectedFile, onDelete }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [isAdding, setIsAdding] = useState(false)

  const filteredFiles = useMemo(() => {
    const value = search.trim().toLowerCase()

    return files.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category

      const matchesSearch = !value || item.name.toLowerCase().includes(value) || item.category.toLowerCase().includes(value)

      return matchesCategory && matchesSearch
    })
  }, [files, search, category])

  const openForm = () => {
    setSelectedFile(null)
    setIsAdding(true)
  }

  const closeForm = () => {
    setIsAdding(false)
  }

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || [])

    if (!selectedFiles.length) return

    const newFiles = selectedFiles.map((file, index) => {
      const extension = file.name.split('.').pop()?.toLowerCase()

      let type = 'file'
      let fileCategory = 'Other'

      if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
        type = 'image'
        fileCategory = 'Images'
      } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
        type = 'video'
        fileCategory = 'Videos'
      } else if (extension === 'pdf') {
        type = 'pdf'
        fileCategory = 'Documents'
      } else if (['zip', 'rar', '7z'].includes(extension)) {
        type = 'archive'
        fileCategory = 'Other'
      } else if (['doc', 'docx', 'xls', 'xlsx', 'txt'].includes(extension)) {
        type = 'file'
        fileCategory = 'Documents'
      }

      const sizeInMb = file.size / (1024 * 1024)

      return {
        id: Date.now() + index,
        name: file.name,
        type,
        size: sizeInMb < 1 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${sizeInMb.toFixed(1)} MB`,
        updatedAt: 'Just now',
        category: fileCategory,
      }
    })

    setFiles((prev) => [...newFiles, ...prev])
    setSelectedFile(newFiles[0] || null)
    setIsAdding(false)

    event.target.value = ''
  }

  const handleSelect = (item) => {
    setSelectedFile(item)
    setIsAdding(false)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.45fr)]">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
        <div className="border-b border-(--color-border) p-3 sm:p-4">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search private files..."
                className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-3 text-xs text-(--color-text) outline-none placeholder:text-(--color-muted) focus:border-(--color-primary)"
              />
            </div>

            <button
              type="button"
              onClick={openForm}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) px-3 text-[10px] font-bold text-white shadow-sm hover:opacity-90 sm:px-4"
            >
              <Plus size={14} />

              <span className="hidden sm:inline">Add File</span>

              <span className="sm:hidden">Add</span>
            </button>
          </div>

          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
            {fileCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`h-8 shrink-0 rounded-lg px-3 text-[10px] font-bold transition ${category === item ? 'bg-(--color-primaryDark) text-white' : 'bg-(--color-soft) text-(--color-muted) hover:text-(--color-text)'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-4">
          {filteredFiles.length > 0 ? (
            <div className="grid gap-2.5">
              {filteredFiles.map((item) => {
                const isSelected = selectedFile?.id === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full rounded-xl border p-3 text-left transition ${isSelected ? 'border-(--color-primary) bg-(--color-soft)' : 'border-(--color-border) bg-(--color-surface) hover:bg-(--color-soft)'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-(--color-primary) text-white' : 'bg-(--color-soft) text-(--color-primaryDark)'}`}>{getFileIcon(item.type)}</div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-xs font-bold text-(--color-text)">{item.name}</h3>

                          <MoreVertical size={15} className="shrink-0 text-(--color-muted)" />
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] text-(--color-muted)">{item.size}</span>

                          <span className="h-1 w-1 rounded-full bg-(--color-muted)" />

                          <span className="text-[10px] text-(--color-muted)">{item.updatedAt}</span>
                        </div>

                        <span className="mt-2 inline-flex rounded-md bg-(--color-bg) px-2 py-1 text-[9px] font-semibold text-(--color-muted)">{item.category}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <EmptyFileState onClick={openForm} />
          )}
        </div>
      </section>

      <aside className="min-w-0 rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
        {isAdding ? <FileForm onChange={handleFileSelect} onCancel={closeForm} /> : selectedFile ? <FileDetails file={selectedFile} onDelete={onDelete} /> : <EmptyDetails onClick={openForm} />}
      </aside>
    </div>
  )
}

function FileForm({ onChange, onCancel }) {
  return (
    <div>
      <PanelHeader icon={<Upload size={16} />} title="Add Private File" description="Store a private document or media file" onClose={onCancel} />

      <div className="p-4 sm:p-5">
        <label className="flex min-h-65 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-(--color-border) bg-(--color-bg) px-5 text-center transition hover:bg-(--color-soft)">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primaryDark)">
            <Upload size={22} />
          </div>

          <p className="mt-4 text-sm font-bold text-(--color-text)">Choose files to upload</p>

          <p className="mt-1 max-w-80 text-[10px] leading-5 text-(--color-muted)">PDF, documents, images, videos, ZIP and other files</p>

          <span className="mt-4 rounded-lg bg-(--color-primaryDark) px-4 py-2 text-[10px] font-bold text-white">Browse Files</span>

          <input type="file" multiple className="hidden" onChange={onChange} />
        </label>
      </div>
    </div>
  )
}

function FileDetails({ file, onDelete }) {
  return (
    <div>
      <PanelHeader
        icon={getFileIcon(file.type)}
        title={file.name}
        description={file.category}
        action={
          <button type="button" onClick={onDelete} className="flex h-8 w-8 items-center justify-center rounded-lg text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-primaryDark)">
            <Trash2 size={15} />
          </button>
        }
      />

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex h-48 items-center justify-center rounded-2xl bg-(--color-soft)">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-surface) text-(--color-primaryDark) shadow-sm">{getFileIcon(file.type)}</div>
        </div>

        <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
          <p className="truncate text-xs font-bold text-(--color-text)">{file.name}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-(--color-muted)">File size</span>

            <span className="text-[10px] font-semibold text-(--color-text)">{file.size}</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-(--color-muted)">Added</span>

            <span className="text-[10px] font-semibold text-(--color-text)">{file.updatedAt}</span>
          </div>
        </div>

        <button type="button" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) text-xs font-bold text-white hover:opacity-90">
          <Download size={15} />
          Download File
        </button>
      </div>
    </div>
  )
}

function PanelHeader({ icon, title, description, onClose, action }) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-(--color-border) px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">{icon}</div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-(--color-text)">{title}</h2>

          <p className="text-[10px] text-(--color-muted)">{description}</p>
        </div>
      </div>

      {action || (
        <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-(--color-muted) hover:bg-(--color-soft)">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

function EmptyFileState({ onClick }) {
  return (
    <div className="rounded-xl border border-dashed border-(--color-border) px-4 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primaryDark)">
        <FolderLock size={24} />
      </div>

      <p className="mt-3 text-xs font-bold text-(--color-text)">No private files found</p>

      <p className="mx-auto mt-1 max-w-65 text-[11px] leading-5 text-(--color-muted)">Upload documents, images, videos or other private files.</p>

      <button type="button" onClick={onClick} className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-(--color-primaryDark) px-3 text-xs font-bold text-white hover:opacity-90">
        <Plus size={14} />
        Add File
      </button>
    </div>
  )
}

function EmptyDetails({ onClick }) {
  return (
    <div className="flex min-h-90 flex-col items-center justify-center px-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primaryDark)">
        <FolderLock size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-(--color-text)">Select a private file</h3>

      <p className="mt-1 max-w-65 text-[11px] leading-5 text-(--color-muted)">Choose a file to view its details and download it.</p>

      <button type="button" onClick={onClick} className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-(--color-primaryDark) px-3 text-xs font-bold text-white hover:opacity-90">
        <Plus size={14} />
        Add File
      </button>
    </div>
  )
}
