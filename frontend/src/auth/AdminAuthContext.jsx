import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AdminAuthContext = createContext(null);
const ADMIN_AUTH_TOKEN_KEY = 'admin_jwt_token';

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
                const response = await fetch('http://localhost:5000/api/auth/verify-admin', {
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

    const login = async (email, password) => {
        if (!email?.trim() || !password?.trim()) {
            return false;
        }

        const response = await fetch('http://localhost:5000/api/auth/login', {
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

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used inside AdminAuthProvider');
    }
    return context;
};
