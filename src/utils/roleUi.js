/**
 * Return user feedback message on role switch
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
