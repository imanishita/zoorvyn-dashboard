import { useRole } from '../context/RoleContext';
import { getPermissions, ACTION_LABELS } from '../utils/permissions';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * RoleBadge — displays the current role and a compact summary of what
 */
export default function RoleBadge() {
    const { role, isAdmin } = useRole();
    const allowed = getPermissions(role);

    // Only show mutation-related permissions — view perms aren't interesting here
    const mutationActions = ['transaction:create', 'transaction:edit', 'transaction:delete'];

    return (
        <div
            className={cn(
                'flex flex-wrap items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors duration-300',
                isAdmin
                    ? 'border-brand-200/60 bg-brand-50/60 dark:border-brand-800/40 dark:bg-brand-900/20'
                    : 'border-amber-200/60 bg-amber-50/60 dark:border-amber-800/40 dark:bg-amber-900/20'
            )}
        >
            {/* Icon + role label */}
            <div className="flex items-center gap-2 shrink-0">
                {isAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                ) : (
                    <ShieldOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span
                    className={cn(
                        'font-semibold',
                        isAdmin
                            ? 'text-brand-700 dark:text-brand-300'
                            : 'text-amber-700 dark:text-amber-300'
                    )}
                >
                    {role} mode
                </span>
            </div>

            {/* Divider */}
            <span className="hidden sm:block text-gray-300 dark:text-gray-600 select-none">|</span>

            {/* Permission pills */}
            <div className="flex flex-wrap gap-1.5">
                {mutationActions.map((action) => {
                    const permitted = allowed.includes(action);
                    return (
                        <span
                            key={action}
                            className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                permitted
                                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                                    : 'bg-gray-100 text-gray-400 line-through dark:bg-slate-800 dark:text-gray-500'
                            )}
                        >
                            {permitted ? '✓' : '✕'} {ACTION_LABELS[action]}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}