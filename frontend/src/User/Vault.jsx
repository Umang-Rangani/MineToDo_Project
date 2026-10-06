import React, { useEffect, useState } from 'react'
import { Archive, FolderLock, KeyRound, LockKeyhole, ShieldCheck, Trash2, UnlockKeyhole, X } from 'lucide-react'

import Credentials, { initialCredentials } from './Vault/Credentials'

import PrivateFiles, { initialFiles } from './Vault/PrivateFiles'

export default function Vault() {
  const [vaultPassword, setVaultPassword] = useState('')
  const [confirmVaultPassword, setConfirmVaultPassword] = useState('')

  const [showVaultPassword, setShowVaultPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [vaultPasswordSaved, setVaultPasswordSaved] = useState(false)

  const [vaultUnlocked, setVaultUnlocked] = useState(false)
  const [vaultError, setVaultError] = useState('')

  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const [activeSection, setActiveSection] = useState('Credentials')

  const [credentials, setCredentials] = useState(initialCredentials)

  const [files, setFiles] = useState(initialFiles)

  const [selectedCredential, setSelectedCredential] = useState(null)

  const [selectedFile, setSelectedFile] = useState(null)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [deleteType, setDeleteType] = useState('credential')

  useEffect(() => {
    if (!vaultUnlocked) {
      setSelectedCredential(null)
      setSelectedFile(null)
    }
  }, [vaultUnlocked])

  const handleCreateVaultPassword = () => {
    setVaultError('')

    if (!vaultPassword.trim()) {
      setVaultError('Please enter a Vault Password.')
      return
    }

    if (vaultPassword.length < 6) {
      setVaultError('Vault Password must be at least 6 characters.')
      return
    }

    if (vaultPassword !== confirmVaultPassword) {
      setVaultError('Vault Passwords do not match.')
      return
    }

    setVaultPasswordSaved(true)
    setVaultUnlocked(true)

    setVaultPassword('')
    setConfirmVaultPassword('')
  }

  const handleUnlockVault = () => {
    setVaultError('')

    if (!vaultPassword.trim()) {
      setVaultError('Please enter your Vault Password.')
      return
    }

    if (vaultPassword === 'MineSpace@123') {
      setVaultUnlocked(true)
      setVaultPassword('')
      return
    }

    setVaultError('Incorrect Vault Password.')
  }

  const handleLockVault = () => {
    setVaultUnlocked(false)
    setSelectedCredential(null)
    setSelectedFile(null)
  }

  const openDeleteCredential = () => {
    setDeleteType('credential')
    setShowDeleteConfirm(true)
  }

  const openDeleteFile = () => {
    setDeleteType('file')
    setShowDeleteConfirm(true)
  }

  const handleDelete = () => {
    if (deleteType === 'credential' && selectedCredential) {
      setCredentials((prev) => prev.filter((item) => item.id !== selectedCredential.id))

      setSelectedCredential(null)
    }

    if (deleteType === 'file' && selectedFile) {
      setFiles((prev) => prev.filter((item) => item.id !== selectedFile.id))

      setSelectedFile(null)
    }

    setShowDeleteConfirm(false)
  }

  const switchSection = (section) => {
    setActiveSection(section)
    setSelectedCredential(null)
    setSelectedFile(null)
  }

  return (
    <div className="w-full">
      {!vaultUnlocked ? (
        <VaultLockedView
          hasPassword={vaultPasswordSaved}
          password={vaultPassword}
          confirmPassword={confirmVaultPassword}
          showPassword={showVaultPassword}
          showConfirmPassword={showConfirmPassword}
          error={vaultError}
          onPasswordChange={(value) => {
            setVaultPassword(value)
            setVaultError('')
          }}
          onConfirmPasswordChange={(value) => {
            setConfirmVaultPassword(value)
            setVaultError('')
          }}
          onTogglePassword={() => setShowVaultPassword((prev) => !prev)}
          onToggleConfirm={() => setShowConfirmPassword((prev) => !prev)}
          onCreatePassword={handleCreateVaultPassword}
          onUnlock={handleUnlockVault}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
      ) : (
        <div className="space-y-4">
          <VaultHeader activeSection={activeSection} onSwitch={switchSection} onLock={handleLockVault} />

          {activeSection === 'Credentials' && <Credentials credentials={credentials} setCredentials={setCredentials} selectedCredential={selectedCredential} setSelectedCredential={setSelectedCredential} onDelete={openDeleteCredential} />}

          {activeSection === 'Files' && <PrivateFiles files={files} setFiles={setFiles} selectedFile={selectedFile} setSelectedFile={setSelectedFile} onDelete={openDeleteFile} />}

          <VaultSecurityNote />
        </div>
      )}

      {showDeleteConfirm && <DeleteConfirmation type={deleteType} credential={selectedCredential} file={selectedFile} onCancel={() => setShowDeleteConfirm(false)} onDelete={handleDelete} />}

      {showForgotPassword && <ForgotPassword onClose={() => setShowForgotPassword(false)} />}
    </div>
  )
}

function VaultHeader({ activeSection, onSwitch, onLock }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
      <div className="flex min-h-16 items-center gap-3 px-3 py-2.5 sm:px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primaryDark)">
          <FolderLock size={20} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-bold text-(--color-text) sm:text-base">Private Vault</h1>

            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-(--color-soft) px-2 py-1 text-[9px] font-bold text-(--color-primaryDark)">
              <UnlockKeyhole size={10} />
              Unlocked
            </span>
          </div>

          <p className="hidden text-[10px] text-(--color-muted) sm:block">Credentials and private files are protected.</p>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 rounded-xl bg-(--color-soft) p-1">
          <button
            type="button"
            onClick={() => onSwitch('Credentials')}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-bold transition sm:px-3 ${
              activeSection === 'Credentials' ? 'bg-(--color-surface) text-(--color-primaryDark) shadow-sm' : 'text-(--color-muted) hover:text-(--color-text)'
            }`}
          >
            <KeyRound size={14} />
            <span className="hidden sm:inline">Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitch('Files')}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-bold transition sm:px-3 ${
              activeSection === 'Files' ? 'bg-(--color-surface) text-(--color-primaryDark) shadow-sm' : 'text-(--color-muted) hover:text-(--color-text)'
            }`}
          >
            <Archive size={14} />
            <span className="hidden sm:inline">Private Files</span>
          </button>
        </div>

        <button type="button" onClick={onLock} title="Lock Vault" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-(--color-border) text-(--color-muted) hover:bg-(--color-soft) hover:text-(--color-primaryDark)">
          <LockKeyhole size={15} />
        </button>
      </div>
    </section>
  )
}

function VaultSecurityNote() {
  return (
    <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primaryDark)">
          <ShieldCheck size={18} />
        </div>

        <div>
          <h3 className="text-xs font-bold text-(--color-text)">Your private space</h3>

          <p className="mt-1 text-[11px] leading-5 text-(--color-muted)">Credentials and private files are protected behind an additional Vault security layer.</p>
        </div>
      </div>
    </section>
  )
}

function DeleteConfirmation({ type, credential, file, onCancel, onDelete }) {
  return (
    <div className="fixed inset-0 z-110 flex h-dvh w-full items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-105 rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-xl">
        <div className="border-b border-(--color-border) px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primaryDark)">
              <Trash2 size={18} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-(--color-text)">Delete this item?</h3>

              <p className="mt-0.5 text-[11px] text-(--color-muted)">This action cannot be undone.</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-3.5">
            {type === 'credential' && credential && (
              <>
                <p className="truncate text-xs font-bold text-(--color-text)">{credential.title}</p>

                <p className="mt-1 truncate text-[10px] text-(--color-muted)">{credential.username}</p>
              </>
            )}

            {type === 'file' && file && (
              <>
                <p className="truncate text-xs font-bold text-(--color-text)">{file.name}</p>

                <p className="mt-1 text-[10px] text-(--color-muted)">
                  {file.size} • {file.category}
                </p>
              </>
            )}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="h-9 rounded-xl border border-(--color-border) px-3 text-xs font-semibold text-(--color-text) hover:bg-(--color-soft)">
              Cancel
            </button>

            <button type="button" onClick={onDelete} className="h-9 rounded-xl bg-(--color-primaryDark) px-3 text-xs font-semibold text-white hover:opacity-90">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ForgotPassword({ onClose }) {
  return (
    <div className="fixed inset-0 z-120 flex h-dvh w-full items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-105 rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-xl">
        <div className="flex items-center justify-between border-b border-(--color-border) px-5 py-4">
          <div>
            <h3 className="text-sm font-bold text-(--color-text)">Reset Vault Password</h3>

            <p className="mt-1 text-[10px] text-(--color-muted)">Login verification + email OTP will be required.</p>
          </div>

          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-(--color-muted) hover:bg-(--color-soft)">
            <X size={17} />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-xl bg-(--color-soft) p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck size={19} className="mt-0.5 shrink-0 text-(--color-primaryDark)" />

              <p className="text-[11px] leading-5 text-(--color-muted)">
                For security, your Vault Password cannot simply be revealed. After backend integration, you will verify your MineSpace login and email OTP before creating a new Vault Password.
              </p>
            </div>
          </div>

          <button type="button" onClick={onClose} className="mt-4 h-10 w-full rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) text-xs font-bold text-white hover:opacity-90">
            Continue Recovery
          </button>
        </div>
      </div>
    </div>
  )
}

function VaultLockedView({ hasPassword, password, confirmPassword, showPassword, showConfirmPassword, error, onPasswordChange, onConfirmPasswordChange, onTogglePassword, onToggleConfirm, onCreatePassword, onUnlock, onForgotPassword }) {
  return (
    <section className="w-full overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-105">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-5 shadow-sm sm:p-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-soft) text-(--color-primaryDark)">
              <LockKeyhole size={25} />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-lg font-bold text-(--color-text)">{hasPassword ? 'Vault Locked' : 'Create Vault Password'}</h1>

              <p className="mx-auto mt-1.5 max-w-80 text-xs leading-5 text-(--color-muted)">
                {hasPassword ? 'Enter your separate Vault Password to access your private credentials and files.' : 'Create a separate password for your Vault. This adds an extra security layer after login.'}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <PasswordInput
                label={hasPassword ? 'Vault Password' : 'Create Vault Password'}
                value={password}
                show={showPassword}
                onChange={onPasswordChange}
                onToggle={onTogglePassword}
                placeholder={hasPassword ? 'Enter your Vault Password' : 'Create a strong password'}
              />

              {!hasPassword && <PasswordInput label="Confirm Vault Password" value={confirmPassword} show={showConfirmPassword} onChange={onConfirmPasswordChange} onToggle={onToggleConfirm} placeholder="Re-enter your password" />}

              {error && <div className="rounded-xl border border-(--color-border) bg-(--color-soft) px-3 py-2.5 text-[11px] font-semibold text-(--color-primaryDark)">{error}</div>}

              <button
                type="button"
                onClick={hasPassword ? onUnlock : onCreatePassword}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) text-xs font-bold text-white shadow-sm hover:opacity-90"
              >
                {hasPassword ? (
                  <>
                    <UnlockKeyhole size={16} />
                    Unlock Vault
                  </>
                ) : (
                  <>
                    <LockKeyhole size={16} />
                    Create & Unlock Vault
                  </>
                )}
              </button>

              {hasPassword && (
                <button type="button" onClick={onForgotPassword} className="h-9 w-full text-[11px] font-semibold text-(--color-primaryDark) hover:underline">
                  Forgot Vault Password?
                </button>
              )}
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-(--color-soft) px-3 py-2.5">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-(--color-primaryDark)" />

              <p className="text-[10px] leading-4 text-(--color-muted)">Vault stays protected even when your MineSpace account is already logged in.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PasswordInput({ label, value, show, onChange, onToggle, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold text-(--color-muted)">{label}</label>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-3 pr-10 text-xs text-(--color-text) outline-none placeholder:text-(--color-muted) focus:border-(--color-primary)"
        />

        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) hover:text-(--color-primaryDark)">
          {show ? <UnlockKeyhole size={15} /> : <LockKeyhole size={15} />}
        </button>
      </div>
    </div>
  )
}
