/**
 * Admin Dashboard - Today's View
 * Simple status board showing today's business snapshot
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SalesTrendGraph from '../../components/admin/SalesTrendGraph';

const AdminDashboard = () => {
    // TODO: Replace with API fetch
    const [stats] = useState({
        todaySales: 45600,
        productsSold: 23,
        lowStockCount: 4,
        lastUpdated: new Date()
    });

    const [lowStockProducts] = useState([
        { id: 'prod-003', name: 'Woven Sleeping Mat', stock: 5, category: 'Woven & Folding' },
        { id: 'prod-008', name: 'Steel Frame Folding Chair', stock: 8, category: 'Steel Furniture' },
        { id: 'prod-016', name: 'Oval Top Dining Set (Deluxe)', stock: 2, category: 'Dining Sets' },
        { id: 'prod-014', name: 'Oval Top Dining Set (6 Seater)', stock: 5, category: 'Dining Sets' }
    ]);

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const todayDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Today's View</h2>
                    <p className="admin-page-subtitle">{todayDate}</p>
                </div>
                <div className="admin-last-updated">
                    Last updated: {formatTime(stats.lastUpdated)}
                </div>
            </div>

            {/* Today's Summary Cards */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card stat-primary">
                    <div className="stat-icon">
                        <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Today's Sales</p>
                        <p className="stat-value">{formatCurrency(stats.todaySales)}</p>
                    </div>
                </div>

                <div className="admin-stat-card stat-success">
                    <div className="stat-icon">
                        <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Products Sold</p>
                        <p className="stat-value">{stats.productsSold}</p>
                        <p className="stat-detail">Items sold today</p>
                    </div>
                </div>

                <div className="admin-stat-card stat-warning">
                    <div className="stat-icon">
                        <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Low Stock Alert</p>
                        <p className="stat-value">{stats.lowStockCount}</p>
                        <p className="stat-detail">Need attention</p>
                    </div>
                </div>
            </div>

            {/* Sales Trend Graph */}
            <SalesTrendGraph />

            {/* Low Stock Products Section */}
            {lowStockProducts.length > 0 && (
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Products Running Low
                        </h3>
                        <Link to="/admin/products" className="btn-secondary">
                            Update Stock
                        </Link>
                    </div>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="font-semibold">{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>
                                            <span className="stock-badge stock-low">
                                                {product.stock} left
                                            </span>
                                        </td>
                                        <td>
                                            <span className="status-badge status-warning">
                                                Needs Restock
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="admin-section">
                <h3 className="admin-section-title">Quick Actions</h3>
                <div className="admin-quick-actions">
                    <Link to="/admin/sales-entry" className="quick-action-card">
                        <div className="quick-action-icon">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4>Record a Sale</h4>
                            <p>Enter today's offline sales</p>
                        </div>
                    </Link>

                    <Link to="/admin/products" className="quick-action-card">
                        <div className="quick-action-icon">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4>Manage Products</h4>
                            <p>Update stock or add new items</p>
                        </div>
                    </Link>

                    <Link to="/admin/product-health" className="quick-action-card">
                        <div className="quick-action-icon">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                        <div>
                            <h4>Product Health</h4>
                            <p>See what's selling well</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
