import { useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { TrendingUp, AlertCircle, Award } from 'lucide-react';

export default function InsightsPanel() {
  const { transactions } = useTransactions();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    let totalIncome = 0;
    let totalExpense = 0;
    const expenseCategories = {};
    let largestExpense = null;

    transactions.forEach(t => {
      const amt = Number(t.amount);
      if (t.type === 'Income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + amt;
        
        if (!largestExpense || amt > Number(largestExpense.amount)) {
          largestExpense = t;
        }
      }
    });

    const highestCategory = Object.entries(expenseCategories).sort((a,b) => b[1] - a[1])[0];
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return { totalIncome, totalExpense, highestCategory, largestExpense, savingsRate };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="glass p-12 rounded-2xl text-center text-gray-500">
        Not enough data to generate insights yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Financial Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Savings Rate */}
        <div className="glass p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Savings Rate</h3>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              {insights.savingsRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {insights.savingsRate >= 20 
                ? "Excellent! You are saving a healthy portion of your income." 
                : insights.savingsRate > 0 
                  ? "You are saving, but there might be room for optimization." 
                  : "You are spending more than you earn. Review expenses."}
            </p>
          </div>
        </div>

        {/* Highest Category */}
        <div className="glass p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Highest Spending</h3>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              {insights.highestCategory ? insights.highestCategory[0] : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {insights.highestCategory 
                ? `Totalling ₹${insights.highestCategory[1].toLocaleString('en-IN')} this period.`
                : "No expenses recorded yet."}
            </p>
          </div>
        </div>

        {/* Largest Transaction */}
        <div className="glass p-6 rounded-2xl flex items-start gap-4 md:col-span-2">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Largest Single Expense</h3>
            {insights.largestExpense ? (
              <>
                <p className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                  ₹{Number(insights.largestExpense.amount).toLocaleString('en-IN')} - {insights.largestExpense.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Occurred on {new Date(insights.largestExpense.date).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">None</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
