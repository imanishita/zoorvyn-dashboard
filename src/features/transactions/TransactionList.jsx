import { useState, useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useRole } from '../../context/RoleContext';
import { Search, Plus, Trash2, Edit2, ArrowUpDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import TransactionModal from './TransactionModal';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const { isAdmin } = useRole();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Income, Expense
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredAndSorted = useMemo(() => {
    let result = transactions;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'All') {
      result = result.filter(t => t.type === filterType);
    }

    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      
      if (sortConfig.key === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (sortConfig.key === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, search, filterType, sortConfig]);

  const openAddModal = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h2>
        {isAdmin && (
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search descriptions or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>
        
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto">
          {['All', 'Income', 'Expense'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "flex-1 md:px-6 py-1.5 rounded-lg text-sm font-medium transition-colors",
                filterType === type 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-brand-400" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/20">
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  <button onClick={() => handleSort('date')} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  <button onClick={() => handleSort('amount')} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                    Amount <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                {isAdmin && <th className="px-6 py-4 text-sm font-semibold text-right text-gray-500 dark:text-gray-400">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map(tx => (
                  <tr key={tx.id} className="border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-300">
                      <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs">
                        {tx.category}
                      </span>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-sm font-semibold whitespace-nowrap",
                      tx.type === 'Income' ? "text-brand-500 dark:text-brand-400" : "text-slate-900 dark:text-white"
                    )}>
                      {tx.type === 'Income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(tx)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal 
          isOpen={isModalOpen}
          initialData={editingTx}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
