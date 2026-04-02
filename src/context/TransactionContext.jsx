import { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { useToast } from './ToastContext';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance-dashboard-transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('finance-dashboard-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
    showToast('Transaction added', 'success');
  };

  const editTransaction = (id, updated) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    showToast('Transaction updated', 'info');
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaction deleted', 'error');
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, editTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTransactions = () => useContext(TransactionContext);
