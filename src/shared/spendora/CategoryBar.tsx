import React from 'react'

import type { Category } from './data'
import { rupees } from './format'

/** One category as a jar: how full it is, against how far into the month we are. */
export function CategoryBar({ category, spent, timePct }: { category: Category; spent: number; timePct: number }) {
  const pct = spent / category.allocated
  const remaining = category.allocated - spent
  const tone = pct > 1 ? 'bad' : pct > timePct + 0.15 ? 'warn' : 'ok'

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-[15px] font-semibold">{category.name}</span>
        <span className="shrink-0 font-mono text-xs text-muted tnum">
          {rupees(spent)} <span className="text-faint">/ {rupees(category.allocated)}</span>
        </span>
      </div>
      <div className="relative mt-2 h-5 border-2 border-ink bg-surface">
        <div className="h-full" style={{ width: `${Math.min(1, pct) * 100}%`, background: category.color }} />
        {/* where "today" sits in the month */}
        <div
          className="absolute -inset-y-[5px] w-[2px] bg-ink"
          style={{ left: `${timePct * 100}%` }}
          aria-hidden
        />
      </div>
      <p className="mt-1.5 text-xs">
        {tone === 'bad' ? (
          <span className="font-semibold text-bad">Over by {rupees(-remaining)}</span>
        ) : tone === 'warn' ? (
          <span className="font-semibold text-warn">
            {rupees(remaining)} left — running ahead of the month
          </span>
        ) : (
          <span className="text-muted">{rupees(remaining)} left</span>
        )}
      </p>
    </div>
  )
}
