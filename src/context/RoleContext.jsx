import { createContext, useContext, useEffect, useState } from 'react';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('finance-dashboard-role') || 'Viewer');

  useEffect(() => {
    localStorage.setItem('finance-dashboard-role', role);
  }, [role]);

  const toggleRole = () => setRole((prev) => (prev === 'Viewer' ? 'Admin' : 'Viewer'));

  const isAdmin = role === 'Admin';

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, isAdmin }}>
      {children}
    </RoleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRole = () => useContext(RoleContext);
