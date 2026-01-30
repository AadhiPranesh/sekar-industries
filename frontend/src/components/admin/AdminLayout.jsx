/**
 * Admin Layout Component
 * Persistent navigation and layout for shop owner's admin panel
 */
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="admin-container">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-brand">
                        <div className="admin-logo">SI</div>
                        <div className="admin-brand-text">
                            <h1>Shop Owner Panel</h1>
                            <p className="admin-date">{currentDate}</p>
                        </div>
                    </div>
                    <a href="/" className="btn-view-shop">
                        View Shop →
                    </a>
                </div>
            </header>

            {/* Admin Navigation */}
            <nav className="admin-nav">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Today's View</span>
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    <span>Manage Products</span>
                </NavLink>

                <NavLink
                    to="/admin/sales-entry"
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Record Sales</span>
                </NavLink>

                <NavLink
                    to="/admin/product-health"
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <span>Product Health</span>
                </NavLink>
            </nav>

            {/* Admin Content Area */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
