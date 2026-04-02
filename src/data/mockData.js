export const INITIAL_TRANSACTIONS = [
  { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary', type: 'Income', description: 'Monthly Salary' },
  { id: '2', date: '2026-04-02', amount: 1500, category: 'Housing', type: 'Expense', description: 'Rent Payment' },
  { id: '3', date: '2026-04-05', amount: 300, category: 'Groceries', type: 'Expense', description: 'Whole Foods' },
  { id: '4', date: '2026-04-08', amount: 50, category: 'Entertainment', type: 'Expense', description: 'Movie Tickets' },
  { id: '5', date: '2026-04-10', amount: 120, category: 'Utilities', type: 'Expense', description: 'Electricity Bill' },
  { id: '6', date: '2026-04-12', amount: 200, category: 'Freelance', type: 'Income', description: 'Web Design Project' },
  { id: '7', date: '2026-04-15', amount: 80, category: 'Dining', type: 'Expense', description: 'Dinner with friends' },
];

export const CATEGORIES = {
  Income: ['Salary', 'Freelance', 'Investments', 'Other'],
  Expense: ['Housing', 'Groceries', 'Entertainment', 'Utilities', 'Dining', 'Transportation', 'Other']
};
