import React from 'react'

import { AppShell, type Screen } from '../shared/spendora/AppShell'
import { AddExpenseSheet } from '../shared/spendora/AddExpenseSheet'
import {
  CATEGORIES,
  DAY_OF_MONTH,
  DAYS_IN_MONTH,
  EXPENSES,
  LAST_MONTH,
  MONTH_LABEL,
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

export default function Reports(props: Props) {
  const { state, budget, onNavigate, onAdd, onCloseAdd, onSaveExpense } = { ...args, ...props }
  const expenses = state === 'empty' ? [] : (props.expenses ?? EXPENSES)

  const spent = totalOf(expenses)
  const projected = Math.round((spent / DAY_OF_MONTH) * DAYS_IN_MONTH)
  const lastTotal = Object.values(LAST_MONTH).reduce((s, n) => s + n, 0)
  const dailyBudget = budget / DAYS_IN_MONTH

  const daily = Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
    const day = i + 1
    const iso = `2025-11-${String(day).padStart(2, '0')}`
    return { day, total: totalOf(expenses.filter((e) => e.date === iso)), future: day > DAY_OF_MONTH }
  })
  const max = Math.max(dailyBudget * 1.5, ...daily.map((d) => d.total))

  const rows = CATEGORIES.map((c) => {
    const now = spentBy(expenses, c.id)
    return { ...c, now, last: LAST_MONTH[c.id], share: spent ? now / spent : 0 }
  }).sort((a, b) => b.now - a.now)

  const willFit = projected <= budget

  return (
    <AppShell
      active="reports"
      onNavigate={onNavigate}
      onAdd={onAdd}
      overlay={<AddExpenseSheet open={state === 'adding'} onClose={onCloseAdd} onSave={onSaveExpense} />}
    >
      <div className="mx-auto w-full max-w-5xl px-5 pb-10 pt-6 sm:px-8 md:pt-10">
        <header>
          <p className="text-sm text-muted">{MONTH_LABEL}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Reports</h1>
        </header>

        {state === 'empty' ? (
          <div className="mt-8 rounded-xl border border-dashed border-line px-6 py-16 text-center">
            <p className="text-sm font-medium">Reports appear after a few days of logging</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              Log what you spend for a week and you'll see where it goes and how this month compares.
            </p>
          </div>
        ) : (
          <>
            {/* Headline: will I finish the month in budget? */}
            <section className="mt-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-md">
                  <p className="text-sm font-medium text-muted">At this rate you'll spend</p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight tnum sm:text-5xl">{rupees(projected)}</p>
                  <p className="mt-2 text-sm">
                    <span className={`font-semibold ${willFit ? 'text-good' : 'text-bad'}`}>
                      {willFit ? `${rupees(budget - projected)} under` : `${rupees(projected - budget)} over`} your budget
                    </span>
                    <span className="text-muted"> · last month you spent {rupees(lastTotal)}</span>
                  </p>
                </div>
                <dl className="flex gap-8 text-sm">
                  <div>
                    <dt className="text-muted">Spent so far</dt>
                    <dd className="mt-1 text-lg font-semibold tnum">{rupees(spent)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Daily average</dt>
                    <dd className="mt-1 text-lg font-semibold tnum">{rupees(spent / DAY_OF_MONTH)}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8">
                <div className="relative flex h-40 items-end gap-[3px] sm:gap-1">
                  <div
                    className="pointer-events-none absolute inset-x-0 border-t border-dashed border-faint"
                    style={{ bottom: `${(dailyBudget / max) * 100}%` }}
                  >
                    <span className="absolute -top-5 right-0 bg-surface pl-1 text-[11px] text-muted tnum">
                      {rupees(dailyBudget)}/day budget
                    </span>
                  </div>
                  {daily.map((d) => (
                    <div key={d.day} className="group relative flex h-full flex-1 items-end">
                      <div
                        className={`w-full rounded-t-[3px] ${
                          d.future ? 'bg-sunken' : d.total > dailyBudget ? 'bg-ink' : 'bg-brand'
                        }`}
                        style={{ height: d.future ? '4px' : `${Math.max(2, (d.total / max) * 100)}%` }}
                        title={`${d.day} Nov · ${rupees(d.total)}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-muted tnum">
                  <span>1 Nov</span>
                  <span>15 Nov</span>
                  <span>30 Nov</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-sm bg-brand" /> Within daily budget
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-sm bg-ink" /> Bigger day (mess fee, groceries)
                  </span>
                </div>
              </div>
            </section>

            {/* Category breakdown */}
            <section className="mt-10">
              <h2 className="text-base font-semibold">By category</h2>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-sunken">
                {rows.map((r) => (
                  <div key={r.id} style={{ width: `${r.share * 100}%`, background: r.color }} title={r.name} />
                ))}
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs text-muted">
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 text-right font-medium">Share</th>
                      <th className="pb-2 text-right font-medium">This month</th>
                      <th className="pb-2 text-right font-medium">Last month</th>
                      <th className="pb-2 text-right font-medium">Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3">
                          <span className="flex items-center gap-2 font-medium">
                            <span className="size-2 rounded-full" style={{ background: r.color }} />
                            {r.name}
                          </span>
                        </td>
                        <td className="py-3 text-right text-muted tnum">{Math.round(r.share * 100)}%</td>
                        <td className="py-3 text-right font-semibold tnum">{rupees(r.now)}</td>
                        <td className="py-3 text-right text-muted tnum">{rupees(r.last)}</td>
                        <td className="py-3 text-right tnum">
                          <span className={r.now > r.allocated * 0.8 ? 'font-medium text-warn' : 'text-muted'}>
                            {Math.round((r.now / r.allocated) * 100)}% of {rupees(r.allocated)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
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
