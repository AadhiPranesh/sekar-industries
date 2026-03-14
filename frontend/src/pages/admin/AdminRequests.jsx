import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'in_review', label: 'In Review' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'closed', label: 'Closed' },
    { value: 'rejected', label: 'Rejected' }
];

const statusClassMap = {
    new: 'status-warning',
    in_review: 'status-warning',
    quoted: 'status-success',
    closed: 'status-success',
    rejected: 'status-danger'
};

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState('');

    const fetchRequests = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await adminApi.getProductRequests({
                status: statusFilter,
                priority: priorityFilter,
                search
            });
            setRequests(response.requests || []);
        } catch (fetchError) {
            setError(fetchError.message || 'Failed to load requests.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, priorityFilter]);

    const counts = useMemo(() => {
        const total = requests.length;
        const highPriority = requests.filter((item) => item.priority === 'high').length;
        const open = requests.filter((item) => !['closed', 'rejected'].includes(item.status)).length;
        return { total, highPriority, open };
    }, [requests]);

    const handleStatusChange = async (requestId, status) => {
        setUpdatingId(requestId);
        setError('');

        try {
            await adminApi.updateProductRequestStatus(requestId, status);
            await fetchRequests();
        } catch (updateError) {
            setError(updateError.message || 'Failed to update status.');
        } finally {
            setUpdatingId('');
        }
    };

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
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Product Requests</h2>
                    <p className="admin-page-subtitle">Track customer quote requests and update progress</p>
                </div>
                <span className="notification-count-pill">{counts.open} open</span>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card stat-primary">
                    <div className="stat-content">
                        <p className="stat-label">Total Requests</p>
                        <p className="stat-value">{counts.total}</p>
                    </div>
                </div>
                <div className="admin-stat-card stat-warning">
                    <div className="stat-content">
                        <p className="stat-label">High Priority</p>
                        <p className="stat-value">{counts.highPriority}</p>
                    </div>
                </div>
                <div className="admin-stat-card stat-success">
                    <div className="stat-content">
                        <p className="stat-label">Open Requests</p>
                        <p className="stat-value">{counts.open}</p>
                    </div>
                </div>
            </div>

            <div className="admin-section">
                <div className="admin-section-header" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div className="admin-filter-tabs">
                        <button type="button" className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
                        <button type="button" className={`filter-tab ${statusFilter === 'new' ? 'active' : ''}`} onClick={() => setStatusFilter('new')}>New</button>
                        <button type="button" className={`filter-tab ${statusFilter === 'in_review' ? 'active' : ''}`} onClick={() => setStatusFilter('in_review')}>In Review</button>
                        <button type="button" className={`filter-tab ${statusFilter === 'quoted' ? 'active' : ''}`} onClick={() => setStatusFilter('quoted')}>Quoted</button>
                        <button type="button" className={`filter-tab ${statusFilter === 'closed' ? 'active' : ''}`} onClick={() => setStatusFilter('closed')}>Closed</button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                            value={priorityFilter}
                            onChange={(event) => setPriorityFilter(event.target.value)}
                            className="admin-search-input"
                            style={{ minWidth: '140px' }}
                        >
                            <option value="all">All Priority</option>
                            <option value="high">High Priority</option>
                            <option value="normal">Normal Priority</option>
                        </select>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search customer/product"
                            className="admin-search-input"
                            style={{ minWidth: '220px' }}
                        />
                        <button type="button" className="btn-secondary" onClick={fetchRequests}>
                            Search
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="error-message-banner" style={{ marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <p className="admin-page-subtitle">Loading requests...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Received</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', color: 'var(--admin-text-light)' }}>
                                            No requests found for selected filters.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <p className="font-semibold" style={{ margin: 0 }}>{item.customer?.name}</p>
                                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--admin-text-light)' }}>{item.customer?.email}</p>
                                                <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.82rem', color: 'var(--admin-text-light)' }}>{item.customer?.phone}</p>
                                            </td>
                                            <td>
                                                <p className="font-semibold" style={{ margin: 0 }}>{item.product?.productName}</p>
                                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--admin-text-light)' }}>{item.product?.productPrice || '-'}</p>
                                            </td>
                                            <td>
                                                {item.request?.quantity} ({item.request?.purchaseType})
                                            </td>
                                            <td>
                                                <span className={`status-badge ${item.priority === 'high' ? 'status-warning' : 'status-success'}`}>
                                                    {item.priority === 'high' ? 'High' : 'Normal'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${statusClassMap[item.status] || 'status-warning'}`}>
                                                    {item.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>{formatDate(item.createdAt)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <select
                                                        defaultValue={item.status}
                                                        disabled={updatingId === item._id}
                                                        onChange={(event) => handleStatusChange(item._id, event.target.value)}
                                                        className="admin-search-input"
                                                        style={{ minWidth: '130px' }}
                                                    >
                                                        {statusOptions.map((statusOption) => (
                                                            <option key={statusOption.value} value={statusOption.value}>
                                                                {statusOption.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRequests;
