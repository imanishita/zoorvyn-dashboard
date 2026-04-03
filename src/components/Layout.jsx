import { Moon, Sun, LayoutDashboard, ArrowLeftRight, PieChart, ChevronDown, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/cn';
import { ROLE, roleSwitchToastMessage } from '../utils/roleUi';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

/** Sidebar navigation items — add new pages here. */
const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',     icon: PieChart },
];

/**
 * Main layout shell — navbar + sidebar + content area + toast overlay.
 * Receives currentTab/setCurrentTab to control navigation state.
 */
export function Layout({ children, currentTab, setCurrentTab }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { role, setRole, isAdmin } = useRole();
  const { toast, showToast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** Switch role and show toast feedback. */
  const commitRole = (next) => {
    if (next === role) return;
    setRole(next);
    showToast(roleSwitchToastMessage(next), 'info');
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center gap-2">

            {/* Logo — branded Z mark with hover glow */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-white text-lg font-bold shadow-md transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-brand-500/30">
              Z
            </div>

            {/* ─── Action Bar ─── */}
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">

              {/* Role toggle — visible RBAC (Viewer = read-only, Admin = full access) */}
              <div
                className="flex items-center rounded-xl border border-gray-200/80 bg-gray-100/80 p-1 dark:border-slate-700/60 dark:bg-slate-800/80"
                role="group"
                aria-label="Switch role"
              >
                <button
                  type="button"
                  onClick={() => commitRole(ROLE.viewer)}
                  className={cn(
                    'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-3 sm:text-sm',
                    role === ROLE.viewer
                      ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5 dark:bg-slate-700 dark:text-white dark:ring-white/10'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  )}
                >
                  Viewer
                </button>
                <button
                  type="button"
                  onClick={() => commitRole(ROLE.admin)}
                  className={cn(
                    'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-3 sm:text-sm',
                    role === ROLE.admin
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                      : 'text-slate-500 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-400'
                  )}
                >
                  Admin
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => {
                  toggleTheme();
                  showToast(isDarkMode ? 'Light mode enabled' : 'Dark mode enabled');
                }}
                className="p-2 rounded-full text-gray-500 transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-dark-card dark:hover:text-brand-400"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full border border-gray-200 dark:border-slate-700/50 transition-all duration-200 hover:bg-gray-100 hover:border-brand-300/50 dark:hover:bg-slate-800 dark:hover:border-brand-500/30"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-200">
                    Manishita
                  </span>
                  <ChevronDown className="hidden sm:block w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 glass rounded-xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 py-1 z-50 origin-top-right overflow-hidden"
                    >
                      {/* Current role display */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/20">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Role</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                          {isAdmin ? '🛠 Admin' : '👁 Viewer'}
                        </p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            commitRole(isAdmin ? ROLE.viewer : ROLE.admin);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 transition-colors duration-200 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-3"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                          Switch Role
                        </button>

                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Body: Sidebar + Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow py-6 sm:py-8 flex flex-col lg:flex-row gap-6">

        {/* Sidebar — horizontal tabs on mobile/tablet, vertical sidebar on lg+ */}
        <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:w-52 flex-shrink-0">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                currentTab === item.id
                  ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-900/40 dark:text-brand-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm dark:text-gray-400 dark:hover:bg-dark-card dark:hover:text-gray-200'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* ─── Toast notification ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={cn(
              'fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] max-w-[92vw] sm:max-w-none px-4 sm:px-6 py-3 rounded-full shadow-lg border text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md transition-colors text-center',
              toast.type === 'success' && 'border-brand-200/80 bg-brand-50/90 text-brand-700 dark:border-brand-800/80 dark:bg-brand-900/70 dark:text-brand-100',
              toast.type === 'error'   && 'border-red-200/80 bg-red-50/90 text-red-700 dark:border-red-800/80 dark:bg-red-900/70 dark:text-red-100',
              toast.type === 'info'    && 'border-white/20 dark:border-white/10 bg-white/80 text-slate-900 dark:bg-slate-800/80 dark:text-white'
            )}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
