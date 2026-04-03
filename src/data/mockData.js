/**
 * Seed data — two months of transactions to enable month-over-month trend comparisons
 * on first load. March is the "previous" month, April is "current".
 */
export const INITIAL_TRANSACTIONS = [
  // March — previous month (enables trend arrows)
  { id: 'm1', date: '2026-03-01', amount: 4800, category: 'Salary',    type: 'Income',  description: 'Monthly Salary' },
  { id: 'm2', date: '2026-03-03', amount: 1400, category: 'Housing',   type: 'Expense', description: 'Rent Payment' },
  { id: 'm3', date: '2026-03-06', amount: 420,  category: 'Groceries', type: 'Expense', description: 'Groceries' },
  { id: 'm4', date: '2026-03-14', amount: 90,   category: 'Dining',    type: 'Expense', description: 'Lunch' },
  { id: 'm5', date: '2026-03-18', amount: 150,  category: 'Freelance', type: 'Income',  description: 'Side project' },

  // April — current month
  { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary',        type: 'Income',  description: 'Monthly Salary' },
  { id: '2', date: '2026-04-02', amount: 1500, category: 'Housing',       type: 'Expense', description: 'Rent Payment' },
  { id: '3', date: '2026-04-05', amount: 300,  category: 'Groceries',     type: 'Expense', description: 'Whole Foods' },
  { id: '4', date: '2026-04-08', amount: 50,   category: 'Entertainment', type: 'Expense', description: 'Movie Tickets' },
  { id: '5', date: '2026-04-10', amount: 120,  category: 'Utilities',     type: 'Expense', description: 'Electricity Bill' },
  { id: '6', date: '2026-04-12', amount: 200,  category: 'Freelance',     type: 'Income',  description: 'Web Design Project' },
  { id: '7', date: '2026-04-15', amount: 80,   category: 'Dining',        type: 'Expense', description: 'Dinner with friends' },
];

/** Available categories grouped by transaction type — used by filters and the add/edit modal. */
export const CATEGORIES = {
  Income:  ['Salary', 'Freelance', 'Investments', 'Other'],
  Expense: ['Housing', 'Groceries', 'Entertainment', 'Utilities', 'Dining', 'Transportation', 'Other'],
};
