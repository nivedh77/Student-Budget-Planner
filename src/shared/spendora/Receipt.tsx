import React from 'react'

/** A strip of till paper: mono header, lines, a dashed total, a torn bottom edge. */
export function Receipt({
  title,
  footer,
  children,
}: {
  title: string
  footer?: [string, string]
  children: React.ReactNode
}) {
  return (
    <div className="rotate-[0.6deg]">
      <div className="bg-surface px-5 pb-4 pt-5 shadow-[0_1px_0_0_rgba(20,18,16,0.08)]">
        <div className="border-b-2 border-dashed border-faint pb-3 text-center font-mono">
          <p className="text-[13px] font-bold uppercase tracking-[0.2em]">{title}</p>
          <p className="mt-0.5 text-[11px] text-muted">spendora · nov 2025</p>
        </div>
        <div className="pt-1">{children}</div>
        {footer && (
          <div className="mt-2 flex items-baseline justify-between border-t-2 border-dashed border-faint pt-3 font-mono">
            <span className="text-[13px] uppercase">{footer[0]}</span>
            <span className="text-lg font-bold tnum">{footer[1]}</span>
          </div>
        )}
      </div>
      <svg className="block h-2.5 w-full text-surface" viewBox="0 0 240 10" preserveAspectRatio="none" aria-hidden>
        <polygon
          fill="currentColor"
          points={
            '0,0 ' +
            Array.from({ length: 24 }, (_, i) => `${i * 10 + 5},10 ${(i + 1) * 10},0`).join(' ') +
            ' 240,0'
          }
        />
      </svg>
    </div>
  )
}
