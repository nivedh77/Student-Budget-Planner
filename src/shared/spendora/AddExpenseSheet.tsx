import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

import { CATEGORIES, TODAY, type CategoryId, type Expense } from './data'
import { CATEGORY_ICON } from './ExpenseRow'

type Props = {
  open: boolean
  onClose?: () => void
  onSave?: (e: Expense) => void
}

export function AddExpenseSheet({ open, onClose, onSave }: Props) {
  const reduce = useReducedMotion()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<CategoryId | null>(null)
  const [title, setTitle] = useState('')
  const [when, setWhen] = useState<'today' | 'yesterday'>('today')
  const [method, setMethod] = useState<Expense['method']>('UPI')

  useEffect(() => {
    if (open) {
      setAmount('')
      setCategory(null)
      setTitle('')
      setWhen('today')
      setMethod('UPI')
    }
  }, [open])

  const value = Number(amount)
  const canSave = value > 0 && category !== null

  function save() {
    if (!canSave || !category) return
    const name = CATEGORIES.find((c) => c.id === category)?.name ?? 'Expense'
    onSave?.({
      id: `new-${Date.now()}`,
      title: title.trim() || name,
      category,
      amount: value,
      date: when === 'today' ? TODAY : '2025-11-18',
      method,
    })
  }

  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-40 flex items-end justify-center md:items-stretch md:justify-end">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
          />
          <motion.div
            role="dialog"
            aria-label="Add expense"
            className="relative flex max-h-[92%] w-full flex-col rounded-t-md border-t-2 border-ink bg-paper md:max-h-none md:w-[420px] md:rounded-none md:border-l-2 md:border-t-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.24, ease }}
          >
            <div className="flex items-center justify-between px-6 pb-2 pt-5">
              <h2 className="font-display text-2xl uppercase">Log a spend</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-lg text-muted transition-colors duration-150 ease-out hover:bg-sunken hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <label className="mt-4 block">
                <span className="sr-only">Amount</span>
                <div className="flex items-baseline gap-1 border-b-2 border-ink pb-2">
                  <span className="font-display text-5xl text-faint">₹</span>
                  <input
                    autoFocus
                    inputMode="numeric"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-transparent font-display text-6xl outline-none tnum placeholder:text-faint"
                  />
                </div>
              </label>

              <fieldset className="mt-6">
                <legend className="text-sm font-medium">Category</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {CATEGORIES.map((c) => {
                    const Icon = CATEGORY_ICON[c.id]
                    const selected = category === c.id
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        aria-pressed={selected}
                        className={`flex flex-col items-center gap-1.5 rounded-[3px] border-2 px-2 py-3 text-xs font-semibold transition-colors duration-150 ease-out ${
                          selected
                            ? 'border-ink bg-pop text-ink'
                            : 'border-line bg-surface text-muted hover:border-ink hover:text-ink'
                        }`}
                      >
                        <Icon className="size-4" style={{ color: selected ? undefined : c.color }} />
                        <span className="truncate">{c.name.split(' ')[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <label className="mt-6 block">
                <span className="text-sm font-medium">What was it?</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Maggi at the night canteen"
                  className="mt-2 h-11 w-full rounded-[3px] border-2 border-line bg-surface px-3 text-sm outline-none transition-colors duration-150 ease-out placeholder:text-faint focus:border-ink"
                />
              </label>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Segmented
                  label="When"
                  value={when}
                  onChange={(v) => setWhen(v as 'today' | 'yesterday')}
                  options={[
                    ['today', 'Today'],
                    ['yesterday', 'Yesterday'],
                  ]}
                />
                <Segmented
                  label="Paid with"
                  value={method}
                  onChange={(v) => setMethod(v as Expense['method'])}
                  options={[
                    ['UPI', 'UPI'],
                    ['Card', 'Card'],
                    ['Cash', 'Cash'],
                  ]}
                />
              </div>
            </div>

            <div className="border-t border-line px-6 py-4">
              <button
                type="button"
                disabled={!canSave}
                onClick={save}
                className="h-12 w-full rounded-[3px] bg-ink text-[15px] font-semibold text-paper transition-colors duration-150 ease-out disabled:bg-sunken disabled:text-muted"
              >
                {canSave ? `Save ₹${value.toLocaleString('en-IN')}` : 'Enter an amount and category'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-2 flex rounded-[3px] border-2 border-line bg-surface p-0.5">
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`h-8 flex-1 rounded-[2px] text-xs font-semibold transition-colors duration-150 ease-out ${
              value === v ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}
