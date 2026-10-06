import React, { useMemo, useState } from 'react'
import { Eye, EyeOff, Globe2, KeyRound, MoreVertical, Pencil, Plus, Search, Trash2, UserRound, X } from 'lucide-react'
import { FaGithub, FaGoogle, FaMicrosoft, FaRegClock, FaRegCopy } from 'react-icons/fa'

const credentialCategories = ['All', 'Login', 'Website', 'Other']

export const initialCredentials = [
  {
    id: 1,
    title: 'Google Account',
    username: 'umang@gmail.com',
    password: 'Google@123456',
    website: 'google.com',
    category: 'Login',
    updatedAt: 'Today',
    icon: 'google',
  },
  {
    id: 2,
    title: 'GitHub',
    username: 'umang-dev',
    password: 'Github@987654',
    website: 'github.com',
    category: 'Login',
    updatedAt: 'Yesterday',
    icon: 'github',
  },
  {
    id: 3,
    title: 'Microsoft Account',
    username: 'umang@outlook.com',
    password: 'Microsoft@456789',
    website: 'microsoft.com',
    category: 'Login',
    updatedAt: '2 days ago',
    icon: 'microsoft',
  },
]

const getCredentialIcon = (icon) => {
  if (icon === 'google') return <FaGoogle size={16} />
  if (icon === 'github') return <FaGithub size={17} />
  if (icon === 'microsoft') return <FaMicrosoft size={17} />

  return <Globe2 size={17} />
}

export default function Credentials({ credentials, setCredentials, selectedCredential, setSelectedCredential, onDelete }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [isAdding, setIsAdding] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState('')

  const [form, setForm] = useState({
    title: '',
    username: '',
    password: '',
    website: '',
    category: 'Login',
  })

  const filteredCredentials = useMemo(() => {
    const value = search.trim().toLowerCase()

    return credentials.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category

      const matchesSearch = !value || item.title.toLowerCase().includes(value) || item.username.toLowerCase().includes(value) || item.website.toLowerCase().includes(value)

      return matchesCategory && matchesSearch
    })
  }, [credentials, search, category])

  const resetForm = () => {
    setForm({
      title: '',
      username: '',
      password: '',
      website: '',
      category: 'Login',
    })

    setShowPassword(false)
  }

  const openForm = () => {
    setSelectedCredential(null)
    resetForm()
    setIsAdding(true)
  }

  const closeForm = () => {
    setIsAdding(false)
    resetForm()
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    const newCredential = {
      id: Date.now(),
      title: form.title.trim() || 'Untitled Credential',
      username: form.username.trim(),
      password: form.password,
      website: form.website.trim(),
      category: form.category,
      updatedAt: 'Just now',
      icon: 'website',
    }

    setCredentials((prev) => [newCredential, ...prev])
    setSelectedCredential(newCredential)
    setIsAdding(false)
    resetForm()
  }

  const handleCopy = async (value, field) => {
    if (!value) return

    try {
      await navigator.clipboard.writeText(value)

      setCopiedField(field)

      setTimeout(() => {
        setCopiedField('')
      }, 1200)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelect = (item) => {
    setSelectedCredential(item)
    setIsAdding(false)
    setShowPassword(false)
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
                placeholder="Search credentials..."
                className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-3 text-xs text-(--color-text) outline-none placeholder:text-(--color-muted) focus:border-(--color-primary)"
              />
            </div>

            <button
              type="button"
              onClick={openForm}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) px-3 text-[10px] font-bold text-white shadow-sm transition hover:opacity-90 sm:px-4"
            >
              <Plus size={14} />

              <span className="hidden sm:inline">Add Credential</span>

              <span className="sm:hidden">Add</span>
            </button>
          </div>

          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
            {credentialCategories.map((item) => (
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
          {filteredCredentials.length > 0 ? (
            <div className="grid gap-2.5">
              {filteredCredentials.map((item) => {
                const isSelected = selectedCredential?.id === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full rounded-xl border p-3 text-left transition ${isSelected ? 'border-(--color-primary) bg-(--color-soft)' : 'border-(--color-border) bg-(--color-surface) hover:bg-(--color-soft)'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-(--color-primary) text-white' : 'bg-(--color-soft) text-(--color-primaryDark)'}`}>{getCredentialIcon(item.icon)}</div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-xs font-bold text-(--color-text)">{item.title}</h3>

                          <MoreVertical size={15} className="shrink-0 text-(--color-muted)" />
                        </div>

                        <p className="mt-1 truncate text-[11px] text-(--color-muted)">{item.username || 'No username'}</p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="rounded-md bg-(--color-bg) px-2 py-1 text-[9px] font-semibold text-(--color-muted)">{item.category}</span>

                          <span className="text-[9px] text-(--color-muted)">{item.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <EmptyCredentialState onClick={openForm} />
          )}
        </div>
      </section>

      <aside className="min-w-0 rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
        {isAdding ? (
          <CredentialForm form={form} showPassword={showPassword} onChange={handleChange} onTogglePassword={() => setShowPassword((prev) => !prev)} onCancel={closeForm} onSave={handleSave} />
        ) : selectedCredential ? (
          <CredentialDetails credential={selectedCredential} showPassword={showPassword} copiedField={copiedField} onTogglePassword={() => setShowPassword((prev) => !prev)} onCopy={handleCopy} onDelete={onDelete} />
        ) : (
          <EmptyDetails onClick={openForm} />
        )}
      </aside>
    </div>
  )
}

function CredentialForm({ form, showPassword, onChange, onTogglePassword, onCancel, onSave }) {
  return (
    <div>
      <PanelHeader icon={<KeyRound size={16} />} title="Add Credential" description="Save a login securely" onClose={onCancel} />

      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Title" value={form.title} onChange={(value) => onChange('title', value)} placeholder="e.g. Google Account" />

          <FormInput label="Username / Email" value={form.username} onChange={(value) => onChange('username', value)} placeholder="Enter username or email" />

          <FormInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(value) => onChange('password', value)}
            placeholder="Enter password"
            rightAction={
              <button type="button" onClick={onTogglePassword} className="text-(--color-muted) hover:text-(--color-primaryDark)">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <FormInput label="Website" value={form.website} onChange={(value) => onChange('website', value)} placeholder="e.g. google.com" />
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-semibold text-(--color-muted)">Category</label>

          <select
            value={form.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-3 text-xs text-(--color-text) outline-none focus:border-(--color-primary)"
          >
            <option value="Login">Login</option>
            <option value="Website">Website</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onCancel} className="h-10 flex-1 rounded-xl border border-(--color-border) text-xs font-semibold text-(--color-text) hover:bg-(--color-soft)">
            Cancel
          </button>

          <button type="button" onClick={onSave} className="h-10 flex-1 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) text-xs font-bold text-white hover:opacity-90">
            Save Credential
          </button>
        </div>
      </div>
    </div>
  )
}

function CredentialDetails({ credential, showPassword, copiedField, onTogglePassword, onCopy, onDelete }) {
  return (
    <div>
      <PanelHeader
        icon={getCredentialIcon(credential.icon)}
        title={credential.title}
        description={credential.category}
        action={
          <button type="button" onClick={onDelete} className="flex h-8 w-8 items-center justify-center rounded-lg text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-primaryDark)">
            <Trash2 size={15} />
          </button>
        }
      />

      <div className="space-y-4 p-4 sm:p-5">
        <DetailField label="Username" icon={<UserRound size={14} />} value={credential.username || 'No username'} copied={copiedField === 'username'} onCopy={() => onCopy(credential.username, 'username')} />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-(--color-muted)">Password</span>

            <button type="button" onClick={() => onCopy(credential.password, 'password')} className="text-(--color-muted) hover:text-(--color-primaryDark)">
              {copiedField === 'password' ? <span className="text-[10px] font-semibold">Copied</span> : <FaRegCopy size={13} />}
            </button>
          </div>

          <div className="flex min-h-10 items-center rounded-xl border border-(--color-border) bg-(--color-bg) px-3">
            <KeyRound size={14} className="mr-2 shrink-0 text-(--color-muted)" />

            <span className="min-w-0 flex-1 truncate text-xs font-medium tracking-wide text-(--color-text)">{showPassword ? credential.password : '••••••••••••'}</span>

            <button type="button" onClick={onTogglePassword} className="ml-2 text-(--color-muted)">
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <DetailField label="Website" icon={<Globe2 size={14} />} value={credential.website || 'No website'} />

        <div className="flex items-center justify-between rounded-xl bg-(--color-soft) px-3 py-2.5">
          <div className="flex items-center gap-2">
            <FaRegClock size={11} className="text-(--color-primaryDark)" />

            <span className="text-[10px] text-(--color-muted)">Last updated</span>
          </div>

          <span className="text-[10px] font-semibold text-(--color-text)">{credential.updatedAt}</span>
        </div>

        <button type="button" className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-(--color-border) text-xs font-semibold text-(--color-text) hover:bg-(--color-soft)">
          <Pencil size={14} />
          Edit Credential
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

function FormInput({ label, type = 'text', value, onChange, placeholder, rightAction }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold text-(--color-muted)">{label}</label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-3 ${rightAction ? 'pr-10' : ''} text-xs text-(--color-text) outline-none placeholder:text-(--color-muted) focus:border-(--color-primary)`}
        />

        {rightAction && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightAction}</div>}
      </div>
    </div>
  )
}

function DetailField({ label, icon, value, copied, onCopy }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-(--color-muted)">{label}</span>

        {onCopy && (
          <button type="button" onClick={onCopy} className="text-(--color-muted) hover:text-(--color-primaryDark)">
            {copied ? <span className="text-[10px] font-semibold">Copied</span> : <FaRegCopy size={13} />}
          </button>
        )}
      </div>

      <div className="flex min-h-10 items-center rounded-xl border border-(--color-border) bg-(--color-bg) px-3">
        <span className="mr-2 shrink-0 text-(--color-muted)">{icon}</span>

        <span className="min-w-0 flex-1 truncate text-xs font-medium text-(--color-text)">{value}</span>
      </div>
    </div>
  )
}

function EmptyCredentialState({ onClick }) {
  return (
    <div className="rounded-xl border border-dashed border-(--color-border) px-4 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primaryDark)">
        <KeyRound size={24} />
      </div>

      <p className="mt-3 text-xs font-bold text-(--color-text)">No credentials found</p>

      <p className="mx-auto mt-1 max-w-65 text-[11px] leading-5 text-(--color-muted)">Add your first login credential to your vault.</p>

      <button type="button" onClick={onClick} className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-(--color-primaryDark) px-3 text-xs font-bold text-white hover:opacity-90">
        <Plus size={14} />
        Add Credential
      </button>
    </div>
  )
}

function EmptyDetails({ onClick }) {
  return (
    <div className="flex min-h-90 flex-col items-center justify-center px-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primaryDark)">
        <KeyRound size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-(--color-text)">Select a credential</h3>

      <p className="mt-1 max-w-65 text-[11px] leading-5 text-(--color-muted)">Choose a saved credential to view its details.</p>

      <button type="button" onClick={onClick} className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-(--color-primaryDark) px-3 text-xs font-bold text-white hover:opacity-90">
        <Plus size={14} />
        Add Credential
      </button>
    </div>
  )
}
