/**
 * Admin Layout Component
 * Persistent navigation and layout for shop owner's admin panel
 */
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../auth/AdminAuthContext';

const AdminLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAdminAuth();

    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const navItems = [
        {
            to: '/admin',
            end: true,
            label: "Today's View",
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            )
        },
        {
            to: '/admin/products',
            label: 'Manage Products',
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            to: '/admin/sales-entry',
            label: 'Record Sales',
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            to: '/admin/product-health',
            label: 'Product Health',
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            )
        },
        {
            to: '/admin/prediction',
            label: 'Sales Prediction',
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            to: '/admin/requests',
            label: 'Product Requests',
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h6a1 1 0 100-2H7zm0 3a1 1 0 100 2h6a1 1 0 100-2H7zm0 3a1 1 0 100 2h3a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            to: '/admin/notifications',
            label: 'Notifications',
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6z" />
                    <path d="M10 18a3 3 0 003-3H7a3 3 0 003 3z" />
                </svg>
            )
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className={`admin-container ${isMenuOpen ? 'sidebar-open' : ''}`}>
            {/* Admin Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-brand">
                        <button
                            type="button"
                            className="admin-hamburger-btn"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            aria-label="Open admin menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className="admin-logo">SI</div>
                        <div className="admin-brand-text">
                            <h1>Shop Owner Panel</h1>
                            <p className="admin-date">{currentDate}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <a href="/" className="btn-view-shop">
                            View Shop →
                        </a>
                        <button type="button" className="btn-secondary" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Hamburger Navigation Drawer */}
            <aside className={`admin-sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <h3>Owner Panel</h3>
                    <button
                        type="button"
                        className="admin-sidebar-close"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close admin menu"
                    >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <nav className="admin-sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="admin-sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Admin Content Area */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
