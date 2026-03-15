import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export const RequireAdminAuth = () => {
    const { isAdminAuthenticated, isCheckingAuth } = useAdminAuth();
    const location = useLocation();

    if (isCheckingAuth) {
        return null;
    }

    if (!isAdminAuthenticated) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ from: `${location.pathname}${location.search}` }}
            />
        );
    }

    return <Outlet />;
};

export const RedirectIfAdminAuthed = () => {
    const { isAdminAuthenticated, isCheckingAuth } = useAdminAuth();

    if (isCheckingAuth) {
        return null;
    }

    if (isAdminAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};
