import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext();

/**
 * ToastProvider — global toast notification system.
 * showToast(message, type) displays a message for 2.8 seconds, then auto-dismisses.
 * Types: 'success' | 'error' | 'info'
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  }, []);

  const value = useMemo(() => ({ toast, showToast }), [toast, showToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);
