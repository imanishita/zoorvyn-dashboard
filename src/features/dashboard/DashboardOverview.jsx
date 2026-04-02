import { createElement, useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../../utils/cn';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

function SummaryCard({ title, amount, type, icon: CardIcon }) {
  const colorClass =
    type === 'balance' ? 'text-white' : type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300';
  const gradientClass =
    type === 'balance'
      ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-500/30'
      : type === 'income'
        ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-800/30'
        : 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/50 dark:to-rose-900/30';
  const sizeClass = type === 'balance' ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl';

  return (
    <div className={cn('rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl', gradientClass)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className={cn('text-sm font-semibold uppercase tracking-wide', type === 'balance' ? 'text-white/90' : 'text-slate-600 dark:text-slate-300')}>
            {title}
          </p>
          <h3 className={cn('mt-2 font-bold', sizeClass, type === 'balance' ? 'text-white' : 'text-slate-900 dark:text-white')}>
            ₹{Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className={cn('p-3 rounded-xl', type === 'balance' ? 'bg-white/20' : 'bg-white/70 dark:bg-slate-900/30')}>
          {createElement(CardIcon, { className: cn('w-6 h-6', colorClass) })}
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { transactions } = useTransactions();

  const { income, expense, balance, pieData, lineData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const categories = {};
    const timeline = {};

    transactions.forEach(t => {
      const amt = Number(t.amount);
      if (t.type === 'Income') {
        inc += amt;
      } else {
        exp += amt;
        categories[t.category] = (categories[t.category] || 0) + amt;
      }

      if (!timeline[t.date]) {
        timeline[t.date] = { date: t.date, net: 0 };
      }
      timeline[t.date].net += t.type === 'Income' ? amt : -amt;
    });

    const pieFormatted = Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    
    const lineFormatted = Object.values(timeline)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .reduce((acc, item) => {
        const prevBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
        acc.push({
          date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          balance: prevBalance + item.net
        });
        return acc;
      }, []);

    return {
      income: inc,
      expense: exp,
      balance: inc - exp,
      pieData: pieFormatted,
      lineData: lineFormatted
    };
  }, [transactions]);

  return (
    <div className="space-y-8">
      {transactions.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300">
          No transactions yet. Switch to Admin mode and add your first transaction.
        </div>
      )}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SummaryCard title="Total Balance" amount={balance} type="balance" icon={Wallet} />
        <SummaryCard title="Total Income" amount={income} type="income" icon={TrendingUp} />
        <SummaryCard title="Total Expenses" amount={expense} type="expense" icon={TrendingDown} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="glass p-5 sm:p-7 rounded-2xl lg:col-span-2 flex flex-col shadow-lg transition-all duration-200 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Balance Over Time</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass p-5 sm:p-7 rounded-2xl flex flex-col shadow-lg transition-all duration-200 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Expenses by Category</h3>
          <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center relative">
            {pieData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                   itemStyle={{ fontSize: '14px' }}
                   formatter={(value) => `₹${value}`}
                 />
               </PieChart>
             </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm">No expenses yet.</p>
            )}
            
            {/* Custom Legend */}
            <div className="mt-4 w-full space-y-2 max-h-32 overflow-y-auto pr-1 sm:pr-2 cool-scrollbar">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
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
