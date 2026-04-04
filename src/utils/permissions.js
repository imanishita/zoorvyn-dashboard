

export const PERMISSIONS = {
    Admin: [
        'transaction:create',
        'transaction:edit',
        'transaction:delete',
        'transaction:view',
        'insights:view',
        'dashboard:view',
    ],
    Viewer: [
        'transaction:view',
        'insights:view',
        'dashboard:view',
    ],
};

/**
 * Check if a role is allowed to perform an action.
 * @param {string} role  
 * @param {string} action 
 * @returns {boolean}
 */
export function can(role, action) {
    return PERMISSIONS[role]?.includes(action) ?? false;
}


export function getPermissions(role) {
    return PERMISSIONS[role] ?? [];
}


export const ACTION_LABELS = {
    'transaction:create': 'Add transactions',
    'transaction:edit': 'Edit transactions',
    'transaction:delete': 'Delete transactions',
    'transaction:view': 'View transactions',
    'insights:view': 'View insights',
    'dashboard:view': 'View dashboard',
};