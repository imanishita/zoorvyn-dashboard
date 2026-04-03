import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { TransactionProvider } from './context/TransactionContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { AnimatePresence, motion } from 'framer-motion';

import DashboardOverview from './features/dashboard/DashboardOverview';
import AnimatedBackground from './components/AnimatedBackground';
import TransactionList from './features/transactions/TransactionList';
import InsightsPanel from './features/insights/InsightsPanel';

/** Main content area — switches between tabs with animated transitions. */
function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':    return <DashboardOverview />;
      case 'transactions': return <TransactionList />;
      case 'insights':     return <InsightsPanel />;
      default:             return <DashboardOverview />;
    }
  };

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

/**
 * Root component — wraps the app in context providers:
 *   Theme → Role → Toast → Transactions
 * Order matters: TransactionContext depends on Toast and Role.
 */
function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <ToastProvider>
          <TransactionProvider>
            <AnimatedBackground />
            <AppContent />
          </TransactionProvider>
        </ToastProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
