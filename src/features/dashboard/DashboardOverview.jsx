import { createElement, useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { cn } from '../../utils/cn';


const COLORS = ['#3b82f6', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];


const TOOLTIP_STYLE = {
  backgroundColor: '#0f172a',
  border: 'none',
  borderRadius: '8px',
  color: '#f8fafc',
};


// SummaryCard 

function SummaryCard({ title, amount, type, trend, fallbackHint, icon: CardIcon }) {
  // Icon color per card type
  const iconColor =
    type === 'balance' ? 'text-white'
      : type === 'income' ? 'text-blue-700 dark:text-blue-200'
        : 'text-red-700 dark:text-red-200';

  // Card background 
  const gradient =
    type === 'balance'
      ? 'bg-gradient-to-br from-brand-500 via-indigo-500 to-cyan-500 text-white shadow-brand-500/30'
      : type === 'income'
        ? 'bg-gradient-to-br from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-600/90 dark:via-indigo-700/80 dark:to-cyan-900/70 dark:text-white'
        : 'bg-gradient-to-br from-rose-100 via-red-50 to-orange-100 dark:from-rose-700/85 dark:via-red-800/75 dark:to-orange-900/65 dark:text-white';

  // Balance card 
  const amountSize = type === 'balance' ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl lg:text-3xl';

  // ── Trend logic ──
  const hasTrend = typeof trend === 'number' && Number.isFinite(trend);
  const isUp = hasTrend && trend >= 0;
  const TrendIcon = !hasTrend ? Sparkles : isUp ? ArrowUpRight : ArrowDownRight;
  const pct = hasTrend ? Math.abs(trend).toFixed(0) : null;

  let trendText = fallbackHint ?? 'Add last month\'s data to unlock comparisons';
  if (hasTrend && type === 'expense') {
    trendText = isUp ? `You spent ${pct}% more than last month` : `You spent ${pct}% less than last month`;
  } else if (hasTrend && type === 'income') {
    trendText = isUp ? `Income up ${pct}% vs last month` : `Income down ${pct}% vs last month`;
  } else if (hasTrend) {
    trendText = `Net balance ${isUp ? 'up' : 'down'} ${pct}% vs last month`;
  }


  const trendIsGood = type === 'expense' ? !isUp : isUp;

  return (
    <div
      className={cn(
        'rounded-2xl p-5 sm:p-6 overflow-hidden min-w-0',
        'shadow-lg shadow-slate-900/10 ring-1 ring-black/5',
        'dark:shadow-lg dark:shadow-black/40 dark:ring-white/15',
        'transition-all duration-300 ease-out hover:z-[1] hover:scale-[1.02] hover:shadow-xl dark:hover:ring-white/25',
        gradient,
      )}
    >
      {/* Header — title + icon */}
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0 flex-1 mr-3">
          <p className={cn(
            'text-sm font-semibold uppercase tracking-wide',
            type === 'balance' ? 'text-white/90' : 'text-slate-800/90 dark:text-white/85',
          )}>
            {title}
          </p>
          <h3 className={cn(
            'mt-2 font-bold break-all',
            amountSize,
            type === 'balance' ? 'text-white' : 'text-slate-900 dark:text-white',
          )}>
            ₹{Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className={cn(
          'rounded-xl p-3 shadow-inner backdrop-blur-sm shrink-0',
          type === 'balance'
            ? 'bg-white/25'
            : 'bg-white/90 shadow-sm dark:bg-black/25 dark:ring-1 dark:ring-white/15',
        )}>
          {createElement(CardIcon, { className: cn('h-6 w-6 sm:h-7 sm:w-7', iconColor) })}
        </div>
      </div>

      {/* Trend badge */}
      <div className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold',
        !hasTrend && 'bg-white/70 text-slate-700 ring-1 ring-black/5 dark:bg-black/30 dark:text-slate-100 dark:ring-white/20',
        hasTrend && trendIsGood && 'bg-brand-100/90 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
        hasTrend && !trendIsGood && 'bg-red-100/90 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      )}>
        <TrendIcon className="h-3.5 w-3.5 shrink-0" />
        <span className="line-clamp-2 leading-tight">{trendText}</span>
      </div>
    </div>
  );
}

//Dashboard overview page.

export default function DashboardOverview() {
  const { transactions } = useTransactions();

  const { income, expense, balance, pieData, lineData, trends, fallbackHints } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const categories = {};
    const timeline = {};
    const monthBuckets = {};

    transactions.forEach((t) => {
      const amt = Number(t.amount);

      if (t.type === 'Income') {
        inc += amt;
      } else {
        exp += amt;
        categories[t.category] = (categories[t.category] || 0) + amt;
      }

      // Aggregate net change per day for line chart
      if (!timeline[t.date]) {
        timeline[t.date] = { date: t.date, net: 0 };
      }
      timeline[t.date].net += t.type === 'Income' ? amt : -amt;

      // Aggregate per month for trend comparison
      const monthKey = new Date(t.date).toISOString().slice(0, 7);
      if (!monthBuckets[monthKey]) {
        monthBuckets[monthKey] = { income: 0, expense: 0 };
      }
      if (t.type === 'Income') {
        monthBuckets[monthKey].income += amt;
      } else {
        monthBuckets[monthKey].expense += amt;
      }
    });

    // Pie chart data — sorted by value descending
    const pieFormatted = Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Line chart data — cumulative balance over time
    const lineFormatted = Object.values(timeline)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .reduce((acc, item) => {
        const prevBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
        acc.push({
          date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          balance: prevBalance + item.net,
        });
        return acc;
      }, []);

    // Month-over-month trend percentages
    const months = Object.keys(monthBuckets).sort();
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    const current = currentMonth ? monthBuckets[currentMonth] : { income: 0, expense: 0 };
    const previous = previousMonth ? monthBuckets[previousMonth] : { income: 0, expense: 0 };
    const trendOf = (curr, prev) => (prev > 0 ? ((curr - prev) / prev) * 100 : null);

    // Fallback hints shown when only one month of data exists
    const spendShare = inc > 0 ? Math.min(100, (exp / inc) * 100) : 0;
    const keepShare = inc > 0 ? ((inc - exp) / inc) * 100 : 0;

    const hints = {
      expense: inc > 0
        ? `${spendShare.toFixed(0)}% of income went to expenses`
        : 'Add income to see spend vs earnings',
      income: exp > 0 && inc > 0
        ? `${(inc / exp).toFixed(1)}× income vs expenses`
        : 'Income across your full history',
      balance: inc > 0
        ? `${keepShare.toFixed(0)}% of income kept after expenses`
        : 'Net after income and expenses',
    };

    return {
      income: inc,
      expense: exp,
      balance: inc - exp,
      pieData: pieFormatted,
      lineData: lineFormatted,
      trends: {
        income: trendOf(current.income, previous.income),
        expense: trendOf(current.expense, previous.expense),
        balance: trendOf(current.income - current.expense, previous.income - previous.expense),
      },
      fallbackHints: hints,
    };
  }, [transactions]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Empty state */}
      {transactions.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300">
          No transactions yet. Switch to Admin mode and add your first transaction.
        </div>
      )}

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        <SummaryCard title="Total Balance" amount={balance} type="balance" trend={trends.balance} fallbackHint={fallbackHints.balance} icon={Wallet} />
        <SummaryCard title="Total Income" amount={income} type="income" trend={trends.income} fallbackHint={fallbackHints.income} icon={TrendingUp} />
        <SummaryCard title="Total Expenses" amount={expense} type="expense" trend={trends.expense} fallbackHint={fallbackHints.expense} icon={TrendingDown} />
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">

        {/* Line Chart — cumulative balance over time */}
        <div className="glass flex flex-col rounded-2xl p-4 sm:p-6 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl dark:ring-white/10 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Balance Over Time</h3>
          <div className="min-h-[220px] flex-1 sm:min-h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `₹${v}`} width={55} />
                <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ fontSize: '13px' }} />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart — expense category breakdown */}
        <div className="glass flex flex-col rounded-2xl p-4 sm:p-6 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl dark:ring-white/10">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Expenses by Category</h3>
          <div className="relative flex min-h-[220px] flex-1 flex-col items-center justify-center sm:min-h-[280px] w-full min-w-0">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius="42%" outerRadius="72%" paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ fontSize: '13px' }} formatter={(value) => `₹${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm">No expenses yet.</p>
            )}

            {/* Custom legend */}
            <div className="mt-3 max-h-40 w-full space-y-1.5 overflow-y-auto pr-1 sm:max-h-56 lg:max-h-none lg:overflow-visible cool-scrollbar">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-700 dark:text-gray-300 truncate">{entry.name}</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">₹{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
