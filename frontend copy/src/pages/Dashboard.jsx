/**
 * Dashboard Page
 * Admin dashboard for business overview and management
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getBusinessInfo } from '../services/businessService';
import { getLowStockProducts, getAllProducts } from '../services/productService';
import Icons from '../components/common/Icons';
import '../styles/dashboard.css';

const Dashboard = () => {
    const [businessInfo, setBusinessInfo] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for dashboard stats
    const [stats, setStats] = useState({
        todaySales: 0,
        todayOrders: 0,
        pendingInquiries: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [businessResponse, lowStockResponse, productsResponse] = await Promise.all([
                    getBusinessInfo(),
                    getLowStockProducts(),
                    getAllProducts()
                ]);

                if (businessResponse.success) {
                    setBusinessInfo(businessResponse.data);
                }

                if (lowStockResponse.success) {
                    setLowStockProducts(lowStockResponse.data);
                }

                if (productsResponse.success) {
                    setAllProducts(productsResponse.data);
                }

                // Mock stats generation
                setStats({
                    todaySales: Math.floor(Math.random() * 50000) + 25000,
                    todayOrders: Math.floor(Math.random() * 20) + 5,
                    pendingInquiries: Math.floor(Math.random() * 15) + 3,
                    totalRevenue: Math.floor(Math.random() * 500000) + 250000
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="page dashboard-page">
                <Header />
                <main className="dashboard-main">
                    <LoadingSpinner />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page dashboard-page">
            <Header />

            <main className="dashboard-main">
                {/* Dashboard Header */}
                <section className="dashboard-header">
                    <div className="container">
                        <div className="dashboard-header-content">
                            <div>
                                <h1 className="dashboard-title">Admin Dashboard</h1>
                                <p className="dashboard-subtitle">
                                    Welcome back! Here's what's happening with {businessInfo?.name || 'your business'} today.
                                </p>
                            </div>
                            <div className="dashboard-date">
                                <span className="date-label">Today</span>
                                <span className="date-value">{new Date().toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Overview */}
                <section className="dashboard-stats">
                    <div className="container">
                        <div className="stats-grid">
                            <div className="stat-card stat-card-primary">
                                <div className="stat-icon"><Icons.Sales /></div>
                                <div className="stat-content">
                                    <h3 className="stat-label">Today's Sales</h3>
                                    <p className="stat-value">{formatCurrency(stats.todaySales)}</p>
                                    <span className="stat-change positive">+12.5% from yesterday</span>
                                </div>
                            </div>

                            <div className="stat-card stat-card-success">
                                <div className="stat-icon"><Icons.Orders /></div>
                                <div className="stat-content">
                                    <h3 className="stat-label">Today's Orders</h3>
                                    <p className="stat-value">{stats.todayOrders}</p>
                                    <span className="stat-change positive">+8 new orders</span>
                                </div>
                            </div>

                            <div className="stat-card stat-card-warning">
                                <div className="stat-icon"><Icons.Inquiries /></div>
                                <div className="stat-content">
                                    <h3 className="stat-label">Pending Inquiries</h3>
                                    <p className="stat-value">{stats.pendingInquiries}</p>
                                    <span className="stat-change neutral">Requires attention</span>
                                </div>
                            </div>

                            <div className="stat-card stat-card-info">
                                <div className="stat-icon"><Icons.Revenue /></div>
                                <div className="stat-content">
                                    <h3 className="stat-label">Monthly Revenue</h3>
                                    <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
                                    <span className="stat-change positive">+15.3% this month</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="dashboard-actions">
                    <div className="container">
                        <h2 className="section-title">Quick Actions</h2>
                        <div className="actions-grid">
                            <Link to="/products" className="action-card">
                                <div className="action-icon"><Icons.ManageProducts /></div>
                                <h3 className="action-title">Manage Products</h3>
                                <p className="action-description">Add, edit, or remove products from catalog</p>
                            </Link>

                            <div className="action-card">
                                <div className="action-icon"><Icons.ViewOrders /></div>
                                <h3 className="action-title">View Orders</h3>
                                <p className="action-description">Check and process customer orders</p>
                            </div>

                            <div className="action-card">
                                <div className="action-icon"><Icons.Customers /></div>
                                <h3 className="action-title">Customer Inquiries</h3>
                                <p className="action-description">Respond to customer questions</p>
                            </div>

                            <div className="action-card">
                                <div className="action-icon"><Icons.Analytics /></div>
                                <h3 className="action-title">Analytics</h3>
                                <p className="action-description">View detailed business reports</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <section className="dashboard-alerts">
                        <div className="container">
                            <div className="alert-header">
                                <h2 className="section-title">
                                    <span className="alert-icon"><Icons.Warning /></span>
                                    Low Stock Alert
                                </h2>
                                <span className="alert-badge">{lowStockProducts.length} items</span>
                            </div>
                            <div className="alert-content">
                                <p className="alert-description">
                                    The following products are running low on stock and need restocking:
                                </p>
                                <div className="low-stock-grid">
                                    {lowStockProducts.slice(0, 6).map(product => (
                                        <div key={product.id} className="low-stock-card">
                                            <div className="low-stock-info">
                                                <h4 className="product-name">{product.name}</h4>
                                                <p className="product-category">{product.category}</p>
                                            </div>
                                            <div className="stock-info">
                                                <span className="stock-label">Stock:</span>
                                                <span className="stock-value stock-low">{product.stock} units</span>
                                            </div>
                                            <button className="restock-btn">Restock</button>
                                        </div>
                                    ))}
                                </div>
                                {lowStockProducts.length > 6 && (
                                    <div className="alert-footer">
                                        <Link to="/products" className="view-all-link">
                                            View all {lowStockProducts.length} low stock items →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Business Overview */}
                <section className="dashboard-overview">
                    <div className="container">
                        <div className="overview-grid">
                            {/* Inventory Summary */}
                            <div className="overview-card">
                                <h3 className="overview-title">
                                    <span className="overview-icon"><Icons.Orders /></span>
                                    Inventory Summary
                                </h3>
                                <div className="overview-content">
                                    <div className="overview-stat">
                                        <span className="overview-label">Total Products</span>
                                        <span className="overview-value">{allProducts.length}</span>
                                    </div>
                                    <div className="overview-stat">
                                        <span className="overview-label">In Stock</span>
                                        <span className="overview-value overview-value-success">
                                            {allProducts.filter(p => p.stock > 10).length}
                                        </span>
                                    </div>
                                    <div className="overview-stat">
                                        <span className="overview-label">Low Stock</span>
                                        <span className="overview-value overview-value-warning">
                                            {allProducts.filter(p => p.stock > 0 && p.stock <= 10).length}
                                        </span>
                                    </div>
                                    <div className="overview-stat">
                                        <span className="overview-label">Out of Stock</span>
                                        <span className="overview-value overview-value-danger">
                                            {allProducts.filter(p => p.stock === 0).length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="overview-card">
                                <h3 className="overview-title">
                                    <span className="overview-icon"><Icons.Bell /></span>
                                    Recent Activity
                                </h3>
                                <div className="overview-content">
                                    <div className="activity-list">
                                        <div className="activity-item">
                                            <div className="activity-dot activity-dot-success"></div>
                                            <div className="activity-content">
                                                <p className="activity-text">New order received - ₹8,450</p>
                                                <span className="activity-time">5 minutes ago</span>
                                            </div>
                                        </div>
                                        <div className="activity-item">
                                            <div className="activity-dot activity-dot-info"></div>
                                            <div className="activity-content">
                                                <p className="activity-text">Customer inquiry about MCB switches</p>
                                                <span className="activity-time">23 minutes ago</span>
                                            </div>
                                        </div>
                                        <div className="activity-item">
                                            <div className="activity-dot activity-dot-warning"></div>
                                            <div className="activity-content">
                                                <p className="activity-text">Low stock alert: PVC Pipes</p>
                                                <span className="activity-time">1 hour ago</span>
                                            </div>
                                        </div>
                                        <div className="activity-item">
                                            <div className="activity-dot activity-dot-success"></div>
                                            <div className="activity-content">
                                                <p className="activity-text">Order #1234 delivered successfully</p>
                                                <span className="activity-time">2 hours ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Info */}
                            <div className="overview-card overview-card-full">
                                <h3 className="overview-title">
                                    <span className="overview-icon"><Icons.Business /></span>
                                    Business Information
                                </h3>
                                <div className="overview-content">
                                    <div className="business-info-grid">
                                        <div className="business-info-item">
                                            <span className="business-info-icon"><Icons.Location /></span>
                                            <div className="business-info-content">
                                                <span className="business-info-label">Address</span>
                                                <span className="business-info-value">{businessInfo?.contact?.address}</span>
                                            </div>
                                        </div>
                                        <div className="business-info-item">
                                            <span className="business-info-icon"><Icons.Phone /></span>
                                            <div className="business-info-content">
                                                <span className="business-info-label">Phone</span>
                                                <span className="business-info-value">{businessInfo?.contact?.phone}</span>
                                            </div>
                                        </div>
                                        <div className="business-info-item">
                                            <span className="business-info-icon"><Icons.Email /></span>
                                            <div className="business-info-content">
                                                <span className="business-info-label">Email</span>
                                                <span className="business-info-value">{businessInfo?.contact?.email}</span>
                                            </div>
                                        </div>
                                        <div className="business-info-item">
                                            <span className="business-info-icon"><Icons.Clock /></span>
                                            <div className="business-info-content">
                                                <span className="business-info-label">Today's Hours</span>
                                                <span className="business-info-value">
                                                    {businessInfo?.timings?.weekdays}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
