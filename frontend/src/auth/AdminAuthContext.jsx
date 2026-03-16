import { useEffect, useMemo, useState } from 'react';
import { AdminAuthContext } from './adminAuthContextObject';
const ADMIN_AUTH_TOKEN_KEY = 'admin_jwt_token';
const ADMIN_AUTH_EXPIRED_EVENT = 'admin-auth-expired';

export const AdminAuthProvider = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
            if (!token) {
                setIsAdminAuthenticated(false);
                setIsCheckingAuth(false);
                return;
            }

            try {
                const response = await fetch('https://sekar-industries-backend.onrender.com/api/auth/verify-admin', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
                    setIsAdminAuthenticated(false);
                    setIsCheckingAuth(false);
                    return;
                }

                setIsAdminAuthenticated(true);
            } catch (error) {
                console.error('Token validation error:', error);
                localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
                setIsAdminAuthenticated(false);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        validateToken();
    }, []);

    useEffect(() => {
        const handleAuthExpired = () => {
            localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
            setIsAdminAuthenticated(false);
            setIsCheckingAuth(false);
        };

        window.addEventListener(ADMIN_AUTH_EXPIRED_EVENT, handleAuthExpired);
        return () => window.removeEventListener(ADMIN_AUTH_EXPIRED_EVENT, handleAuthExpired);
    }, []);

    const login = async (email, password) => {
        if (!email?.trim() || !password?.trim()) {
            return false;
        }

        const response = await fetch('https://sekar-industries-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.trim(),
                password: password.trim()
            })
        });

        const data = await response.json();
        if (!response.ok || !data?.success || !data?.token) {
            return false;
        }

        localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, data.token);
        setIsAdminAuthenticated(true);
        return true;
    };

    const logout = () => {
        localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
        setIsAdminAuthenticated(false);
        setIsCheckingAuth(false);
    };

    const getToken = () => localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);

    const value = useMemo(() => ({
        isAdminAuthenticated,
        isCheckingAuth,
        login,
        logout,
        getToken
    }), [isAdminAuthenticated, isCheckingAuth]);

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};
