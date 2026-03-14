import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const statusClassMap = {
    new: 'status-warning',
    in_review: 'status-warning',
    quoted: 'status-success',
    closed: 'status-success',
    rejected: 'status-danger'
};

const MyRequests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [summary, setSummary] = useState({ total: 0, open: 0, closed: 0 });
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    }, []);

    const loadRequests = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const [summaryResponse, requestsResponse] = await Promise.all([
                fetch('http://localhost:5000/api/requests/my/summary', {
                    credentials: 'include'
                }),
                fetch(`http://localhost:5000/api/requests/my?status=${encodeURIComponent(statusFilter)}`, {
                    credentials: 'include'
                })
            ]);

            const summaryData = await summaryResponse.json().catch(() => ({}));
            const requestsData = await requestsResponse.json().catch(() => ({}));

            if (summaryResponse.status === 401 || requestsResponse.status === 401) {
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            if (!summaryResponse.ok || !summaryData.success) {
                throw new Error(summaryData.message || 'Failed to load summary');
            }

            if (!requestsResponse.ok || !requestsData.success) {
                throw new Error(requestsData.message || 'Failed to load requests');
            }

            setSummary(summaryData.summary || { total: 0, open: 0, closed: 0 });
            setRequests(requestsData.requests || []);
        } catch (loadError) {
            setError(loadError.message || 'Failed to load your requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return '-';
        }

        return new Date(dateValue).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="page">
            <Header />

            <main>
                <section className="section">
                    <div className="container">
                        <div className="admin-page" style={{ gap: '1.25rem' }}>
                            <div className="admin-page-header">
                                <div>
                                    <h1 className="admin-page-title" style={{ fontSize: '2rem' }}>My Product Requests</h1>
                                    <p className="admin-page-subtitle">Track all requests you submitted to the owner</p>
                                </div>
                                <Link to="/products" className="btn-secondary btn-sm">Request Another Product</Link>
                            </div>

                            <div className="admin-stats-grid">
                                <div className="admin-stat-card stat-primary">
                                    <div className="stat-content">
                                        <p className="stat-label">Total Sent</p>
                                        <p className="stat-value">{summary.total}</p>
                                    </div>
                                </div>
                                <div className="admin-stat-card stat-warning">
                                    <div className="stat-content">
                                        <p className="stat-label">Open</p>
                                        <p className="stat-value">{summary.open}</p>
                                    </div>
                                </div>
                                <div className="admin-stat-card stat-success">
                                    <div className="stat-content">
                                        <p className="stat-label">Closed</p>
                                        <p className="stat-value">{summary.closed}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-section">
                                <div className="admin-filter-tabs" style={{ marginBottom: '1rem' }}>
                                    <button type="button" className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
                                    <button type="button" className={`filter-tab ${statusFilter === 'new' ? 'active' : ''}`} onClick={() => setStatusFilter('new')}>New</button>
                                    <button type="button" className={`filter-tab ${statusFilter === 'in_review' ? 'active' : ''}`} onClick={() => setStatusFilter('in_review')}>In Review</button>
                                    <button type="button" className={`filter-tab ${statusFilter === 'quoted' ? 'active' : ''}`} onClick={() => setStatusFilter('quoted')}>Quoted</button>
                                    <button type="button" className={`filter-tab ${statusFilter === 'closed' ? 'active' : ''}`} onClick={() => setStatusFilter('closed')}>Closed</button>
                                    <button type="button" className={`filter-tab ${statusFilter === 'rejected' ? 'active' : ''}`} onClick={() => setStatusFilter('rejected')}>Rejected</button>
                                </div>

                                {error && (
                                    <div className="error-message-banner" style={{ marginBottom: '1rem' }}>
                                        {error}
                                    </div>
                                )}

                                {loading ? (
                                    <p className="admin-page-subtitle">Loading your requests...</p>
                                ) : (
                                    <div className="admin-table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th>Status</th>
                                                    <th>Message</th>
                                                    <th>Sent At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requests.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-text-light)' }}>
                                                            No requests found for this filter.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    requests.map((requestItem) => (
                                                        <tr key={requestItem._id}>
                                                            <td>
                                                                <p className="font-semibold" style={{ margin: 0 }}>{requestItem.product?.productName || '-'}</p>
                                                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--admin-text-light)' }}>
                                                                    {requestItem.product?.productPrice || '-'}
                                                                </p>
                                                            </td>
                                                            <td>{requestItem.request?.quantity || '-'} ({requestItem.request?.purchaseType || '-'})</td>
                                                            <td>
                                                                <span className={`status-badge ${statusClassMap[requestItem.status] || 'status-warning'}`}>
                                                                    {String(requestItem.status || 'new').replace('_', ' ')}
                                                                </span>
                                                            </td>
                                                            <td style={{ maxWidth: '320px' }}>{requestItem.request?.message || '-'}</td>
                                                            <td>{formatDate(requestItem.createdAt)}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default MyRequests;
