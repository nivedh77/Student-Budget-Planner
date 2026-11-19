import React, { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import { AppShell, type Screen } from '../shared/spendora/AppShell'
import { AddExpenseSheet } from '../shared/spendora/AddExpenseSheet'
import { ExpenseRow } from '../shared/spendora/ExpenseRow'
import { Receipt } from '../shared/spendora/Receipt'
import { CATEGORIES, EXPENSES, TODAY, totalOf, type CategoryId, type Expense } from '../shared/spendora/data'
import { dayLabel, rupees } from '../shared/spendora/format'

type Props = Partial<typeof args> & {
  expenses?: Expense[]
  onNavigate?: (screen: Screen) => void
  onAdd?: () => void
  onCloseAdd?: () => void
  onSaveExpense?: (e: Expense) => void
}

export default function Expenses(props: Props) {
  const { state, filter, onNavigate, onAdd, onCloseAdd, onSaveExpense } = { ...args, ...props }
  const all = state === 'empty' ? [] : (props.expenses ?? EXPENSES)

  const [active, setActive] = useState<'all' | CategoryId>(filter as 'all' | CategoryId)
  const [query, setQuery] = useState('')
  useEffect(() => setActive(filter as 'all' | CategoryId), [filter])

  const shown = useMemo(
    () =>
      all.filter(
        (e) =>
          (active === 'all' || e.category === active) &&
          e.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [all, active, query],
  )

  const days = useMemo(() => {
    const map = new Map<string, Expense[]>()
    for (const e of shown) map.set(e.date, [...(map.get(e.date) ?? []), e])
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [shown])

  const filtered = active !== 'all' || query.trim() !== ''

  return (
    <AppShell
      active="expenses"
      onNavigate={onNavigate}
      onAdd={onAdd}
      overlay={<AddExpenseSheet open={state === 'adding'} onClose={onCloseAdd} onSave={onSaveExpense} />}
    >
      <div className="mx-auto w-full max-w-[1080px] px-5 pb-12 pt-5 sm:px-10 md:pt-8">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 font-mono text-xs uppercase">
          <span>November 2025</span>
          <span className="tnum">
            {shown.length} {shown.length === 1 ? 'receipt' : 'receipts'}
          </span>
        </div>

        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 pt-6">
          <h1 className="font-display text-6xl uppercase leading-none sm:text-7xl">Receipts</h1>
          <p className="font-display text-5xl leading-none tnum sm:text-6xl">
            {rupees(totalOf(shown))}
            <span className="ml-2 font-sans text-sm font-medium text-muted">{filtered ? 'matching' : 'this month'}</span>
          </p>
        </header>

        <div className="sticky top-0 z-10 -mx-5 mt-6 border-b-2 border-ink bg-paper px-5 py-3 sm:-mx-10 sm:px-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative block lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a receipt"
                className="h-10 w-full rounded-[3px] border-2 border-line bg-surface pl-9 pr-3 text-sm outline-none transition-colors duration-150 ease-out placeholder:text-faint focus:border-ink"
              />
            </label>
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1">
              {[{ id: 'all' as const, name: 'Everything', color: '' }, ...CATEGORIES].map((c) => {
                const on = active === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActive(c.id)}
                    aria-pressed={on}
                    className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[3px] border-2 px-3 text-[13px] font-semibold transition-colors duration-150 ease-out ${
                      on ? 'border-ink bg-pop text-ink' : 'border-transparent text-muted hover:border-line hover:text-ink'
                    }`}
                  >
                    {c.color && <span className="size-2" style={{ background: c.color }} />}
                    {c.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {days.length === 0 ? (
          <div className="mx-auto mt-12 max-w-sm text-center">
            <p className="font-display text-3xl uppercase">
              {filtered ? 'Nothing in the pile' : 'Your pocket is empty'}
            </p>
            <p className="mt-2 text-[15px] text-muted">
              {filtered ? 'Try another category, or clear the search.' : 'Every spend you log lands here as a receipt for its day.'}
            </p>
            <button
              type="button"
              onClick={
                filtered
                  ? () => {
                      setActive('all')
                      setQuery('')
                    }
                  : onAdd
              }
              className="mt-5 h-11 rounded-[3px] border-2 border-ink bg-pop px-5 text-sm font-semibold text-ink shadow-[3px_3px_0_0_#141210] transition-transform duration-150 ease-out active:translate-x-px active:translate-y-px"
            >
              {filtered ? 'Clear filters' : 'Log a spend'}
            </button>
          </div>
        ) : (
          <div className="mt-8 columns-1 gap-8 md:columns-2 xl:columns-3">
            {days.map(([date, items]) => (
              <div key={date} className="mb-8 break-inside-avoid">
                <Receipt title={dayLabel(date, TODAY)} footer={['Day total', rupees(totalOf(items))]}>
                  <ul>
                    {items.map((e) => (
                      <li key={e.id}>
                        <ExpenseRow expense={e} showDate={false} />
                      </li>
                    ))}
                  </ul>
                </Receipt>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

export const args = {
  state: 'default',
  filter: 'all',
}

export const argTypes = {
  state: { control: 'radio', options: ['default', 'empty', 'adding'] },
  filter: { control: 'select', options: ['all', 'food', 'transport', 'shopping', 'bills', 'fun'] },
}
