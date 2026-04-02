import { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState('Viewer'); // 'Viewer' | 'Admin'
  const [toastMessage, setToastMessage] = useState(null);

  const toggleRole = () => {
    setRole(prev => {
      const newRole = prev === 'Viewer' ? 'Admin' : 'Viewer';
      
      const msg = newRole === 'Admin' ? 'Switched to Admin Mode' : 'Viewer mode enabled';
      setToastMessage(msg);
      setTimeout(() => setToastMessage((current) => current === msg ? null : current), 3000);
      
      return newRole;
    });
  };

  const isAdmin = role === 'Admin';

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, isAdmin, toastMessage }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
