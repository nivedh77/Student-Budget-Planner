import React from 'react'
import { ArrowRight } from 'lucide-react'

import { AppShell, type Screen } from '../shared/spendora/AppShell'
import { AddExpenseSheet } from '../shared/spendora/AddExpenseSheet'
import { CategoryBar } from '../shared/spendora/CategoryBar'
import { ExpenseRow } from '../shared/spendora/ExpenseRow'
import { Receipt } from '../shared/spendora/Receipt'
import {
  CATEGORIES,
  DAY_OF_MONTH,
  DAYS_IN_MONTH,
  EXPENSES,
  STUDENT_NAME,
  spentBy,
  totalOf,
  type Expense,
} from '../shared/spendora/data'
import { rupees } from '../shared/spendora/format'

type Props = Partial<typeof args> & {
  expenses?: Expense[]
  onNavigate?: (screen: Screen) => void
  onAdd?: () => void
  onCloseAdd?: () => void
  onSaveExpense?: (e: Expense) => void
}

export default function Dashboard(props: Props) {
  const { state, budget, onNavigate, onAdd, onCloseAdd, onSaveExpense } = { ...args, ...props }
  const expenses = state === 'empty' ? [] : (props.expenses ?? EXPENSES)
  const isEmpty = expenses.length === 0

  const spent = totalOf(expenses)
  const left = budget - spent
  const daysLeft = DAYS_IN_MONTH - DAY_OF_MONTH + 1
  const perDay = Math.max(0, left / daysLeft)
  const timePct = DAY_OF_MONTH / DAYS_IN_MONTH
  const paceDiff = budget * timePct - spent
  const allowance = budget / DAYS_IN_MONTH

  const watch = CATEGORIES.map((c) => ({ ...c, spent: spentBy(expenses, c.id) }))
    .filter((c) => c.spent / c.allocated > timePct + 0.15)
    .sort((a, b) => b.spent / b.allocated - a.spent / a.allocated)[0]

  return (
    <AppShell
      active="dashboard"
      onNavigate={onNavigate}
      onAdd={onAdd}
      overlay={<AddExpenseSheet open={state === 'adding'} onClose={onCloseAdd} onSave={onSaveExpense} />}
    >
      <div className="mx-auto w-full max-w-[1080px] px-5 pb-12 pt-5 sm:px-10 md:pt-8">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 font-mono text-xs uppercase">
          <span>November 2025</span>
          <span className="tnum">
            Day {DAY_OF_MONTH} / {DAYS_IN_MONTH}
          </span>
        </div>

        {/* Hero: what's left */}
        <section className="grid gap-10 pt-8 lg:grid-cols-[1fr_300px] lg:items-end lg:gap-12">
          <div className="min-w-0">
            <p className="text-lg sm:text-xl">Hey {STUDENT_NAME}, you've got</p>
            <p className="mt-2 font-display text-[88px] leading-[0.85] tracking-tight tnum sm:text-[132px] lg:text-[168px]">
              {rupees(left)}
            </p>
            <p className="mt-5 max-w-xl text-xl leading-snug sm:text-2xl">
              {isEmpty ? (
                <>
                  for the whole month. That's <span className="marker">{rupees(allowance)} a day</span>.
                </>
              ) : (
                <>
                  left for the next {daysLeft} days. That's{' '}
                  <span className="marker font-semibold tnum">{rupees(perDay)} a day</span>.
                </>
              )}
            </p>
            {!isEmpty && (
              <p className="mt-3 text-[15px] text-muted tnum">
                {paceDiff >= 0
                  ? `You're ${rupees(paceDiff)} under where you'd usually be by day ${DAY_OF_MONTH}. Nice.`
                  : `You're ${rupees(-paceDiff)} ahead of where you should be by day ${DAY_OF_MONTH}. Ease off a bit.`}
              </p>
            )}
          </div>

          {isEmpty ? (
            <Sticker tone="pop">
              <p className="font-display text-[28px] uppercase leading-none">Start the ledger</p>
              <p className="mt-2 text-[15px] leading-snug">Log one spend today. Even the ₹10 chai. We'll do the maths.</p>
              <button
                type="button"
                onClick={onAdd}
                className="mt-4 h-10 w-full rounded-[3px] bg-ink text-sm font-semibold text-paper transition-transform duration-150 ease-out active:translate-y-px"
              >
                Log a spend
              </button>
            </Sticker>
          ) : watch ? (
            <Sticker tone="hot">
              <p className="font-display text-[28px] uppercase leading-none">
                {watch.name} is eating your month
              </p>
              <p className="mt-2 text-[15px] leading-snug tnum">
                {Math.round((watch.spent / watch.allocated) * 100)}% gone with {daysLeft} days to go. Keep it under{' '}
                <span className="font-semibold">
                  {rupees((watch.allocated - watch.spent) / daysLeft)}/day
                </span>{' '}
                and you'll make it.
              </p>
            </Sticker>
          ) : null}
        </section>

        {/* Day by day */}
        <section className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl uppercase">Day by day</h2>
            <p className="text-sm text-muted tnum">Dashed line = {rupees(allowance)} daily allowance</p>
          </div>
          <DayStrip expenses={expenses} allowance={allowance} />
        </section>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Categories */}
          <section className="min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl uppercase">Where it's going</h2>
              <button
                type="button"
                onClick={() => onNavigate?.('settings')}
                className="text-sm font-semibold underline decoration-2 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-pop"
              >
                Change limits
              </button>
            </div>
            <ul className="mt-5 flex flex-col gap-6">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <CategoryBar category={c} spent={spentBy(expenses, c.id)} timePct={timePct} />
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <span className="inline-block h-3 w-[2px] bg-ink" /> marks today. Fill past it and you're spending faster than the month.
            </p>
          </section>

          {/* Receipt */}
          <section className="min-w-0">
            <Receipt title="Latest receipts" footer={isEmpty ? undefined : ['Total so far', rupees(spent)]}>
              {isEmpty ? (
                <div className="py-8 text-center font-mono text-[13px] text-muted">
                  <p>— no receipts yet —</p>
                  <p className="mt-1">that chai counts.</p>
                </div>
              ) : (
                <ul>
                  {expenses.slice(0, 6).map((e) => (
                    <li key={e.id}>
                      <ExpenseRow expense={e} />
                    </li>
                  ))}
                </ul>
              )}
            </Receipt>
            {!isEmpty && (
              <button
                type="button"
                onClick={() => onNavigate?.('expenses')}
                className="mt-5 flex items-center gap-1.5 text-sm font-semibold underline decoration-2 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-pop"
              >
                All {expenses.length} receipts <ArrowRight className="size-4" />
              </button>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  )
}

export const args = {
  state: 'default',
  budget: 15000,
}

export const argTypes = {
  state: { control: 'radio', options: ['default', 'empty', 'adding'] },
  budget: { control: 'number' },
}

function Sticker({ tone, children }: { tone: 'hot' | 'pop'; children: React.ReactNode }) {
  return (
    <div
      className={`-rotate-2 border-2 border-ink p-5 text-ink shadow-[5px_5px_0_0_#141210] ${
        tone === 'hot' ? 'bg-hot' : 'bg-pop'
      }`}
    >
      {children}
    </div>
  )
}

function DayStrip({ expenses, allowance }: { expenses: Expense[]; allowance: number }) {
  const days = Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
    const day = i + 1
    const iso = `2025-11-${String(day).padStart(2, '0')}`
    return { day, total: totalOf(expenses.filter((e) => e.date === iso)) }
  })
  const cap = allowance * 3

  return (
    <div className="mt-5">
      <div className="relative grid h-32 items-end gap-[3px] sm:gap-1" style={{ gridTemplateColumns: `repeat(${DAYS_IN_MONTH}, minmax(0, 1fr))` }}>
        <div
          className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-ink/50"
          style={{ bottom: `${(allowance / cap) * 100}%` }}
          aria-hidden
        />
        {days.map((d) => {
          const future = d.day > DAY_OF_MONTH
          const today = d.day === DAY_OF_MONTH
          const over = d.total > allowance
          return (
            <div key={d.day} className="relative flex h-full items-end" title={`${d.day} Nov · ${rupees(d.total)}`}>
              {future ? (
                <div className="h-full w-full border border-dashed border-line" />
              ) : (
                <div
                  className={`w-full ${over ? 'bg-hot' : 'bg-ink'} ${today ? 'outline-2 outline-offset-2 outline-ink' : ''}`}
                  style={{ height: d.total ? `${Math.min(1, d.total / cap) * 100}%` : '3px' }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="relative mt-2 h-4 font-mono text-[11px] text-muted">
        <span className="absolute left-0">1</span>
        <span
          className="absolute -translate-x-1/2 font-bold text-ink"
          style={{ left: `${((DAY_OF_MONTH - 0.5) / DAYS_IN_MONTH) * 100}%` }}
        >
          today
        </span>
        <span className="absolute right-0">30</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 bg-ink" /> under allowance
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 bg-hot" /> big day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 border border-dashed border-faint" /> still ahead
        </span>
      </div>
    </div>
  )
}
