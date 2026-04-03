import { createContext, useContext, useEffect, useState } from 'react';
import { ROLE } from '../utils/roleUi';

const RoleContext = createContext();

/**
 * RoleProvider — manages the current user role (Admin/Viewer) with localStorage persistence.
 * Admin can add/edit/delete transactions; Viewer is read-only.
 */
export function RoleProvider({ children }) {
  const [role, setRole] = useState(
    () => localStorage.getItem('finance-dashboard-role') || ROLE.viewer
  );

  useEffect(() => {
    localStorage.setItem('finance-dashboard-role', role);
  }, [role]);

  const toggleRole = () =>
    setRole((prev) => (prev === ROLE.viewer ? ROLE.admin : ROLE.viewer));

  const isAdmin = role === ROLE.admin;

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, isAdmin }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
