import React from 'react'
import { Plus } from 'lucide-react'

import { STUDENT_NAME } from './data'

export type Screen = 'dashboard' | 'expenses' | 'reports' | 'settings'

type Props = {
  active: Screen
  onNavigate?: (screen: Screen) => void
  onAdd?: () => void
  children: React.ReactNode
  overlay?: React.ReactNode
}

export function AppShell({ active, onNavigate, onAdd, children, overlay }: Props) {
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-paper font-sans text-ink">
      {/* Sidebar — tablet and up */}
      <aside className="hidden w-56 shrink-0 flex-col bg-ink px-5 py-7 text-paper md:flex">
        <p className="font-display text-[28px] uppercase leading-none tracking-wide">
          Spend<span className="text-pop">ora</span>
        </p>
        <p className="mt-1.5 font-mono text-[11px] text-paper/60">pocket ledger · est. sem 3</p>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((item) => {
            const isActive = item.id === active
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate?.(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-10 items-center justify-between rounded-[3px] px-3 text-left text-[15px] transition-colors duration-150 ease-out ${
                  isActive ? 'bg-pop font-semibold text-ink' : 'font-medium text-paper/70 hover:bg-paper/10 hover:text-paper'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={onAdd}
          className="mt-8 flex h-12 items-center justify-center gap-2 rounded-[3px] bg-pop text-[15px] font-semibold text-ink transition-transform duration-150 ease-out active:translate-y-px"
        >
          <Plus className="size-4" strokeWidth={3} />
          Log a spend
        </button>

        <div className="mt-auto border-t border-paper/15 pt-4">
          <p className="text-sm font-medium">{STUDENT_NAME} Mehta</p>
          <p className="font-mono text-[11px] text-paper/50">BITS Pilani · Bhagirath Bhawan</p>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1 overflow-y-auto pb-24 md:pb-0">{children}</main>

      {/* Tab bar — phones */}
      <nav className="absolute inset-x-3 bottom-3 z-20 grid grid-cols-5 items-center rounded-md bg-ink px-1 py-1.5 text-paper md:hidden">
        {NAV.slice(0, 2).map((item) => (
          <TabItem key={item.id} item={item} active={active} onNavigate={onNavigate} />
        ))}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onAdd}
            aria-label="Log a spend"
            className="grid size-11 place-items-center rounded-[4px] bg-pop text-ink transition-transform duration-150 ease-out active:scale-95"
          >
            <Plus className="size-5" strokeWidth={3} />
          </button>
        </div>
        {NAV.slice(2).map((item) => (
          <TabItem key={item.id} item={item} active={active} onNavigate={onNavigate} />
        ))}
      </nav>

      {overlay}
    </div>
  )
}

function TabItem({
  item,
  active,
  onNavigate,
}: {
  item: (typeof NAV)[number]
  active: Screen
  onNavigate?: (s: Screen) => void
}) {
  const isActive = item.id === active
  return (
    <button
      type="button"
      onClick={() => onNavigate?.(item.id)}
      className={`mx-0.5 rounded-[3px] py-2 text-[12px] ${
        isActive ? 'bg-pop font-semibold text-ink' : 'font-medium text-paper/70'
      }`}
    >
      {item.short}
    </button>
  )
}

const NAV = [
  { id: 'dashboard' as const, label: 'This month', short: 'Month' },
  { id: 'expenses' as const, label: 'Receipts', short: 'Receipts' },
  { id: 'reports' as const, label: 'Patterns', short: 'Patterns' },
  { id: 'settings' as const, label: 'Budget', short: 'Budget' },
]
