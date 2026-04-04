import { useRole } from '../context/RoleContext';
import { can } from '../utils/permissions';

export default function ProtectedAction({ action, children, fallback = null }) {
    const { role } = useRole();

    if (!can(role, action)) {
        return fallback;
    }

    return children;
}