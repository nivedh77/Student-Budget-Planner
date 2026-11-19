export type CategoryId = 'food' | 'transport' | 'shopping' | 'bills' | 'fun'

export type Category = {
  id: CategoryId
  name: string
  allocated: number
  color: string
}

export type Expense = {
  id: string
  title: string
  category: CategoryId
  amount: number
  /** ISO date, yyyy-mm-dd */
  date: string
  method: 'UPI' | 'Card' | 'Cash'
}

export const MONTH_LABEL = 'November 2025'
export const TODAY = '2025-11-19'
export const DAYS_IN_MONTH = 30
export const DAY_OF_MONTH = 19
export const STUDENT_NAME = 'Aarav'

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', allocated: 4500, color: '#ff5a36' },
  { id: 'transport', name: 'Transport', allocated: 3000, color: '#2e5bff' },
  { id: 'shopping', name: 'Shopping', allocated: 3000, color: '#f0b400' },
  { id: 'bills', name: 'Bills & recharge', allocated: 1500, color: '#141210' },
  { id: 'fun', name: 'Fun', allocated: 1500, color: '#e05aa8' },
]

export const EXPENSES: Expense[] = [
  { id: 'e1', title: 'Canteen thali', category: 'food', amount: 90, date: '2025-11-19', method: 'UPI' },
  { id: 'e2', title: 'Metro card top-up', category: 'transport', amount: 200, date: '2025-11-19', method: 'UPI' },
  { id: 'e3', title: 'Swiggy — biryani', category: 'food', amount: 289, date: '2025-11-18', method: 'UPI' },
  { id: 'e4', title: 'Notebook & pens', category: 'shopping', amount: 340, date: '2025-11-18', method: 'Cash' },
  { id: 'e5', title: 'Movie with hostel friends', category: 'fun', amount: 260, date: '2025-11-17', method: 'Card' },
  { id: 'e6', title: 'Rapido to station', category: 'transport', amount: 140, date: '2025-11-16', method: 'UPI' },
  { id: 'e7', title: 'Weekly groceries', category: 'food', amount: 1120, date: '2025-11-15', method: 'UPI' },
  { id: 'e8', title: 'Jio recharge', category: 'bills', amount: 349, date: '2025-11-14', method: 'UPI' },
  { id: 'e9', title: 'Hoodie (sale)', category: 'shopping', amount: 1199, date: '2025-11-12', method: 'Card' },
  { id: 'e10', title: 'Mess fee top-up', category: 'food', amount: 1800, date: '2025-11-10', method: 'UPI' },
  { id: 'e11', title: 'Bus pass', category: 'transport', amount: 840, date: '2025-11-05', method: 'Cash' },
  { id: 'e12', title: 'Wi-Fi share', category: 'bills', amount: 550, date: '2025-11-04', method: 'UPI' },
  { id: 'e13', title: 'Chai & snacks', category: 'food', amount: 621, date: '2025-11-03', method: 'Cash' },
  { id: 'e14', title: 'Stationery refill', category: 'shopping', amount: 601, date: '2025-11-02', method: 'Cash' },
  { id: 'e15', title: 'Board-game café', category: 'fun', amount: 241, date: '2025-11-01', method: 'UPI' },
]

/** What last month looked like, per category, for Reports. */
export const LAST_MONTH: Record<CategoryId, number> = {
  food: 5120,
  transport: 2210,
  shopping: 1890,
  bills: 1499,
  fun: 1340,
}

export function categoryOf(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}

export function spentBy(expenses: Expense[], id: CategoryId): number {
  return expenses.filter((e) => e.category === id).reduce((s, e) => s + e.amount, 0)
}

export function totalOf(expenses: Expense[]): number {
  return expenses.reduce((s, e) => s + e.amount, 0)
}
