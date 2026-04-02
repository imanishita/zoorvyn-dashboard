import { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { CATEGORIES } from '../../data/mockData';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionModal({ isOpen, initialData, onClose }) {
  const { addTransaction, editTransaction } = useTransactions();
  
  const [formData, setFormData] = useState({
    type: 'Expense',
    amount: '',
    category: CATEGORIES['Expense'][0],
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Adjust categories automatically based on type selection
  useEffect(() => {
    if (!initialData || formData.type !== initialData.type) {
      setFormData(prev => ({ 
        ...prev, 
        category: CATEGORIES[formData.type][0] 
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      editTransaction(initialData.id, formData);
    } else {
      addTransaction(formData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-xl z-10 overflow-hidden relative border border-gray-100 dark:border-slate-700"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {initialData ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-slate-700 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex gap-4 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg">
              {['Expense', 'Income'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    formData.type === type 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input 
                  type="number" 
                  required 
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input 
                type="text" 
                required 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                placeholder="What was this for?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                >
                  {CATEGORIES[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input 
                  type="date" 
                  required 
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-brand-500 text-white rounded-xl shadow-sm hover:bg-brand-600 transition-colors"
              >
                {initialData ? 'Save Changes' : 'Add Transaction'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
