import React, { useEffect, useState } from 'react'

import Dashboard from '../b6GLp2wvJiZN8VE7NYFCmm.frame'
import Expenses from '../jWyP9Tm4zdTiM5vgc8TRsh.frame'
import Reports from '../jFEyTgwyF728TxpriXRT4C.frame'
import BudgetSettings from '../cB9XCWnStxXDMhvt6auKGi.frame'

import type { Screen } from '../shared/spendora/AppShell'
import { EXPENSES, type Expense } from '../shared/spendora/data'

const DASHBOARD = 'b6GLp2wvJiZN8VE7NYFCmm'
const EXPENSES_ID = 'jWyP9Tm4zdTiM5vgc8TRsh'
const REPORTS = 'jFEyTgwyF728TxpriXRT4C'
const SETTINGS = 'cB9XCWnStxXDMhvt6auKGi'

const SCREEN_TO_ID: Record<Screen, string> = {
  dashboard: DASHBOARD,
  expenses: EXPENSES_ID,
  reports: REPORTS,
  settings: SETTINGS,
}

/** The size every frame draws at, unless one exports its own. */
export const viewport = 'web'

export const args = {
  account: 'mid-month',
  budget: 15000,
}

export const argTypes = {
  account: { control: 'radio', options: ['mid-month', 'brand new'] },
  budget: { control: 'number' },
}

type Props = Partial<typeof args> & { start?: string }

export default function Spendora(props: Props) {
  const { account, budget: startBudget, start } = { ...args, ...props }
  const [screen, setScreen] = useState(() => start ?? DASHBOARD)
  const [adding, setAdding] = useState(false)
  const [budget, setBudget] = useState(startBudget)
  const [expenses, setExpenses] = useState<Expense[]>(() => (account === 'brand new' ? [] : EXPENSES))

  useEffect(() => setBudget(startBudget), [startBudget])
  useEffect(() => setExpenses(account === 'brand new' ? [] : EXPENSES), [account])

  const state = adding ? 'adding' : 'default'
  const shared = {
    expenses,
    onNavigate: (s: Screen) => {
      setAdding(false)
      setScreen(SCREEN_TO_ID[s])
    },
    onAdd: () => setAdding(true),
    onCloseAdd: () => setAdding(false),
    onSaveExpense: (e: Expense) => {
      setExpenses((list) => [e, ...list])
      setAdding(false)
    },
  }

  if (screen === EXPENSES_ID) return <Expenses {...shared} state={state} />
  if (screen === REPORTS) {
    return <Reports {...shared} budget={budget} state={adding ? 'adding' : expenses.length === 0 ? 'empty' : 'default'} />
  }
  if (screen === SETTINGS) {
    return <BudgetSettings {...shared} state={state} budget={budget} onSaveBudget={setBudget} />
  }
  return <Dashboard {...shared} state={state} budget={budget} />
}
