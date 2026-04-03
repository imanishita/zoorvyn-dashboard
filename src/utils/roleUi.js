/**
 * Role constants and helpers — single source of truth for RBAC labels.
 * Used by Layout (role toggle, dropdown) and TransactionContext (mutation guards).
 */
export const ROLE = {
  viewer: 'Viewer',
  admin: 'Admin',
};

/** Returns the toast message shown when switching roles. */
export function roleSwitchToastMessage(nextRole) {
  return nextRole === ROLE.admin
    ? 'Admin mode — full access'
    : 'Viewer mode — read only';
}
