import React, { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed right-4 top-4 z-9999 w-[calc(100%-2rem)] max-w-sm">
      <div className="flex items-start gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) p-4 shadow-xl">
        {type === 'success' ? <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-(--color-primary)" /> : <XCircle size={20} className="mt-0.5 shrink-0 text-[#B24F43]" />}

        <p className="flex-1 text-sm font-medium text-(--color-text)">{message}</p>

        <button type="button" onClick={onClose} className="rounded-lg p-1 text-(--color-muted) hover:bg-(--color-soft)">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
