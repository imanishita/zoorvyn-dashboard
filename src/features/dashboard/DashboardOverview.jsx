import { useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../../utils/cn';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

function SummaryCard({ title, amount, type, icon: Icon }) {
  const isPositive = type === 'income' || (type === 'balance' && amount >= 0);
  const colorClass = type === 'balance' 
    ? 'text-brand-500' 
    : type === 'income' 
      ? 'text-blue-500' 
      : 'text-red-500';

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
            ₹{Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className={cn("p-3 rounded-xl bg-opacity-10 dark:bg-opacity-20", colorClass.replace('text-', 'bg-'))}>
          <Icon className={cn("w-6 h-6", colorClass)} />
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

      // Group by date for line chart
      if (!timeline[t.date]) {
        timeline[t.date] = { date: t.date, Income: 0, Expense: 0 };
      }
      timeline[t.date][t.type] += amt;
    });

    const pieFormatted = Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    
    // Sort timeline by date
    const lineFormatted = Object.values(timeline).sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      income: inc,
      expense: exp,
      balance: inc - exp,
      pieData: pieFormatted,
      lineData: lineFormatted
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Balance" amount={balance} type="balance" icon={Wallet} />
        <SummaryCard title="Total Income" amount={income} type="income" icon={TrendingUp} />
        <SummaryCard title="Total Expenses" amount={expense} type="expense" icon={TrendingDown} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="glass p-6 rounded-2xl lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Cash Flow Trend</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="Income" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass p-6 rounded-2xl flex flex-col">
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
            <div className="mt-4 w-full space-y-2 max-h-32 overflow-y-auto pr-2 no-scrollbar">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-700 dark:text-gray-300">{entry.name}</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">₹{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
