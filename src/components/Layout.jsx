import { Moon, Sun, LayoutDashboard, ArrowLeftRight, PieChart, ChevronDown, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRole } from '../context/RoleContext';
import { cn } from '../utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export function Layout({ children, currentTab, setCurrentTab }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { role, toggleRole, isAdmin, toastMessage } = useRole();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">Zoorvyn</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-card transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 dark:border-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Manishita</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
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
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/20">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Role</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                          {isAdmin ? "🛠 Admin" : "👁 Viewer"}
                        </p>
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={() => {
                            toggleRole();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-3"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                          Switch Role
                        </button>
                        
                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:w-64 flex-shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                currentTab === item.id 
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" 
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-card dark:hover:text-gray-200"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-lg border text-sm font-semibold tracking-wide backdrop-blur-md transition-colors border-white/20 dark:border-white/10 bg-white/80 text-slate-900 dark:bg-slate-800/80 dark:text-white"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
