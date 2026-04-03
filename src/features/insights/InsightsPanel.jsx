import { useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { TrendingUp, AlertCircle, Award, CalendarClock } from 'lucide-react';

/**
 * Insights panel — derived financial analytics computed from raw transactions.
 * All metrics are memoized and recalculated only when transactions change.
 */
export default function InsightsPanel() {
  const { transactions } = useTransactions();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    let totalIncome = 0;
    let totalExpense = 0;
    const expenseCategories = {};
    let largestExpense = null;
    const monthTotals = {};

    transactions.forEach((t) => {
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

      const monthKey = new Date(t.date).toISOString().slice(0, 7);
      if (!monthTotals[monthKey]) {
        monthTotals[monthKey] = { income: 0, expense: 0 };
      }
      if (t.type === 'Income') {
        monthTotals[monthKey].income += amt;
      } else {
        monthTotals[monthKey].expense += amt;
      }
    });

    const highestCategory = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1])[0];
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Month-over-month comparison
    const months = Object.keys(monthTotals).sort();
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    const currentExpense = currentMonth ? monthTotals[currentMonth].expense : 0;
    const previousExpense = previousMonth ? monthTotals[previousMonth].expense : 0;
    const monthlyComparison =
      previousExpense > 0 ? ((currentExpense - previousExpense) / previousExpense) * 100 : 0;

    const topCategoryShare =
      highestCategory && totalExpense > 0 ? (highestCategory[1] / totalExpense) * 100 : 0;

    // Headline text generation
    const headlineSpend =
      previousExpense > 0
        ? monthlyComparison >= 0
          ? `You spent ${Math.abs(monthlyComparison).toFixed(0)}% more than last month.`
          : `You spent ${Math.abs(monthlyComparison).toFixed(0)}% less than last month.`
        : 'Add another month of expenses to compare against last month.';

    const topCategoryHeadline = highestCategory
      ? `Top category: ${highestCategory[0]}`
      : 'Top category: —';

    let detailInsight = 'Track a second month to unlock a month-over-month story for your spending.';
    if (highestCategory && previousExpense > 0) {
      detailInsight = `${highestCategory[0]} represents ${topCategoryShare.toFixed(0)}% of all spending so far — worth watching if you need to cut back.`;
    } else if (highestCategory) {
      detailInsight = `${highestCategory[0]} is your biggest expense bucket (${topCategoryShare.toFixed(0)}% of expenses).`;
    }

    return {
      totalIncome,
      totalExpense,
      highestCategory,
      largestExpense,
      savingsRate,
      monthlyComparison,
      detailInsight,
      topCategoryShare,
      headlineSpend,
      topCategoryHeadline,
    };
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
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white sm:mb-6 sm:text-2xl">Financial Insights</h2>

      {/* Headline insight card */}
      <div className="glass space-y-3 rounded-2xl p-5 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl dark:ring-white/10 sm:p-6">
        <p className="text-lg font-bold leading-snug text-slate-900 dark:text-white sm:text-xl">
          {insights.headlineSpend}
        </p>
        <p className="text-base font-semibold text-brand-600 dark:text-brand-400">{insights.topCategoryHeadline}</p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{insights.detailInsight}</p>
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">

        {/* Savings Rate */}
        <div className="glass flex items-start gap-3 rounded-2xl p-5 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl dark:ring-white/10 sm:gap-4 sm:p-6">
          <div className="p-3 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Savings Rate</h3>
            <p className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              {insights.savingsRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {insights.savingsRate >= 20
                ? 'Excellent! You are saving a healthy portion of your income.'
                : insights.savingsRate > 0
                  ? 'You are saving, but there might be room for optimization.'
                  : 'You are spending more than you earn. Review expenses.'}
            </p>
          </div>
        </div>

        {/* Highest Spending Category */}
        <div className="glass flex items-start gap-3 rounded-2xl p-5 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl dark:ring-white/10 sm:gap-4 sm:p-6">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Highest Spending</h3>
            <p className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white break-words">
              {insights.highestCategory ? insights.highestCategory[0] : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {insights.highestCategory
                ? `Totalling ₹${insights.highestCategory[1].toLocaleString('en-IN')} this period.`
                : 'No expenses recorded yet.'}
            </p>
          </div>
        </div>

        {/* Largest Single Expense */}
        <div className="glass flex items-start gap-3 rounded-2xl p-5 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl dark:ring-white/10 sm:gap-4 sm:p-6 md:col-span-2">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Largest Single Expense</h3>
            {insights.largestExpense ? (
              <>
                <p className="text-lg sm:text-xl font-bold mt-1 text-slate-900 dark:text-white break-words">
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

        {/* Monthly Comparison */}
        <div className="glass flex items-start gap-3 rounded-2xl p-5 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl dark:ring-white/10 sm:gap-4 sm:p-6 md:col-span-2">
          <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl flex-shrink-0">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Monthly Comparison</h3>
            <p className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              {insights.monthlyComparison >= 0 ? '+' : ''}
              {insights.monthlyComparison.toFixed(1)}%
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{insights.detailInsight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
