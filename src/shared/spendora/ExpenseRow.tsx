import React from 'react'
import { Bus, Film, ShoppingBag, Smartphone, UtensilsCrossed } from 'lucide-react'

import { categoryOf, TODAY, type CategoryId, type Expense } from './data'
import { dayLabel, rupees } from './format'

/** One line of a receipt: what, dotted leader, how much. */
export function ExpenseRow({ expense, showDate = true }: { expense: Expense; showDate?: boolean }) {
  const cat = categoryOf(expense.category)
  return (
    <div className="py-2.5 font-mono text-[13px]">
      <div className="flex items-baseline gap-2">
        <span className="min-w-0 truncate text-ink">{expense.title}</span>
        <span className="min-w-4 flex-1 translate-y-[-3px] border-b-2 border-dotted border-faint/70" aria-hidden />
        <span className="shrink-0 font-bold tnum">{rupees(expense.amount)}</span>
      </div>
      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
        <span className="inline-block size-2 shrink-0" style={{ background: cat.color }} />
        {cat.name.toLowerCase()}
        {showDate ? ` · ${dayLabel(expense.date, TODAY).toLowerCase()}` : ''} · {expense.method}
      </p>
    </div>
  )
}

export const CATEGORY_ICON: Record<CategoryId, typeof Bus> = {
  food: UtensilsCrossed,
  transport: Bus,
  shopping: ShoppingBag,
  bills: Smartphone,
  fun: Film,
}
