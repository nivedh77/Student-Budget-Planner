import React, { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

import { AppShell, type Screen } from '../shared/spendora/AppShell'
import { AddExpenseSheet } from '../shared/spendora/AddExpenseSheet'
import { CATEGORIES, type CategoryId, type Expense } from '../shared/spendora/data'
import { rupees } from '../shared/spendora/format'

type Props = Partial<typeof args> & {
  onNavigate?: (screen: Screen) => void
  onAdd?: () => void
  onCloseAdd?: () => void
  onSaveExpense?: (e: Expense) => void
  onSaveBudget?: (budget: number) => void
}

export default function BudgetSettings(props: Props) {
  const { state, budget, onNavigate, onAdd, onCloseAdd, onSaveExpense, onSaveBudget } = { ...args, ...props }

  const [draft, setDraft] = useState(String(budget))
  const [limits, setLimits] = useState<Record<CategoryId, number>>(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, c.allocated])) as Record<CategoryId, number>,
  )
  const [reminder, setReminder] = useState(true)
  const [saved, setSaved] = useState(false)
  useEffect(() => setDraft(String(budget)), [budget])

  const total = Number(draft) || 0
  const assigned = Object.values(limits).reduce((s, n) => s + n, 0)
  const unassigned = total - assigned
  const dirty = total !== budget

  return (
    <AppShell
      active="settings"
      onNavigate={onNavigate}
      onAdd={onAdd}
      overlay={<AddExpenseSheet open={state === 'adding'} onClose={onCloseAdd} onSave={onSaveExpense} />}
    >
      <div className="mx-auto w-full max-w-2xl px-5 pb-10 pt-6 sm:px-8 md:pt-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Budget &amp; settings</h1>
          <p className="mt-1 text-sm text-muted">Resets on the 1st of every month.</p>
        </header>

        {/* Monthly budget */}
        <section className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <label htmlFor="budget" className="text-sm font-medium text-muted">
            Monthly budget
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="flex min-w-0 flex-1 items-baseline gap-1 border-b-2 border-line pb-1 focus-within:border-brand">
              <span className="text-3xl font-semibold text-faint">₹</span>
              <input
                id="budget"
                inputMode="numeric"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value.replace(/[^0-9]/g, ''))
                  setSaved(false)
                }}
                className="w-full min-w-0 bg-transparent text-4xl font-semibold tracking-tight outline-none tnum"
              />
            </div>
            <button
              type="button"
              disabled={!dirty || total === 0}
              onClick={() => {
                onSaveBudget?.(total)
                setSaved(true)
              }}
              className="flex h-10 items-center gap-1.5 rounded-lg bg-brand px-5 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-brand-strong disabled:bg-sunken disabled:text-faint"
            >
              {saved && !dirty ? (
                <>
                  <Check className="size-4" /> Saved
                </>
              ) : (
                'Save budget'
              )}
            </button>
          </div>
          <p className="mt-3 text-sm text-muted tnum">
            That's about {rupees(total / 30)} a day. Most hostel students we see budget ₹12,000–₹18,000.
          </p>
        </section>

        {/* Category limits */}
        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold">Category limits</h2>
            <p className={`text-sm tnum ${unassigned < 0 ? 'font-medium text-bad' : 'text-muted'}`}>
              {unassigned >= 0
                ? `${rupees(assigned)} assigned · ${rupees(unassigned)} free`
                : `${rupees(-unassigned)} more than your budget`}
            </p>
          </div>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {CATEGORIES.map((c) => (
              <li key={c.id} className="flex items-center gap-4 py-3">
                <span className="size-2 shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</span>
                <span className="hidden w-12 text-right text-xs text-muted tnum sm:block">
                  {total ? Math.round((limits[c.id] / total) * 100) : 0}%
                </span>
                <label className="flex h-9 w-32 items-center gap-1 rounded-lg border border-line bg-surface px-3 transition-colors duration-150 ease-out focus-within:border-brand">
                  <span className="text-sm text-faint">₹</span>
                  <input
                    aria-label={`${c.name} limit`}
                    inputMode="numeric"
                    value={limits[c.id]}
                    onChange={(e) =>
                      setLimits((l) => ({ ...l, [c.id]: Number(e.target.value.replace(/[^0-9]/g, '')) || 0 }))
                    }
                    className="w-full bg-transparent text-right text-sm font-medium outline-none tnum"
                  />
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Preferences */}
        <section className="mt-10">
          <h2 className="text-base font-semibold">Preferences</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            <li className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Evening reminder</p>
                <p className="text-sm text-muted">A nudge at 9 pm if you haven't logged anything today</p>
              </div>
              <Toggle on={reminder} onChange={setReminder} label="Evening reminder" />
            </li>
            <li className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Currency</p>
                <p className="text-sm text-muted">Indian rupee, with lakh grouping</p>
              </div>
              <span className="shrink-0 text-sm font-medium tnum">₹ INR</span>
            </li>
          </ul>
        </section>
      </div>
    </AppShell>
  )
}

export const args = {
  state: 'default',
  budget: 15000,
}

export const argTypes = {
  state: { control: 'radio', options: ['default', 'adding'] },
  budget: { control: 'number' },
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-150 ease-out ${on ? 'bg-brand' : 'bg-line'}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out ${
          on ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
