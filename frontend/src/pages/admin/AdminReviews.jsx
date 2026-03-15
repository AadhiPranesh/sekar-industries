import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';

const statusClassMap = {
    pending: 'status-warning',
    approved: 'status-success',
    rejected: 'status-danger'
};

const AdminReviews = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('all');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [updatingId, setUpdatingId] = useState('');
    const [updatingAction, setUpdatingAction] = useState('');
    const [replyDrafts, setReplyDrafts] = useState({});

    const loadReviews = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await adminApi.getAdminReviews(statusFilter);
            const list = response.reviews || [];
            setReviews(list);
            setReplyDrafts((prev) => {
                const next = { ...prev };
                list.forEach((item) => {
                    if (!(item._id in next)) {
                        next[item._id] = item.ownerReply || '';
                    }
                });
                return next;
            });
        } catch (loadError) {
            setError(loadError.message || 'Failed to load reviews.');
            if ((loadError.message || '').toLowerCase().includes('login again')) {
                navigate('/admin/login', { replace: true });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const stats = useMemo(() => {
        const pending = reviews.filter((r) => r.status === 'pending').length;
        const approved = reviews.filter((r) => r.status === 'approved').length;
        const rated = reviews.filter((r) => typeof r.rating === 'number');
        const avg = rated.length
            ? (rated.reduce((sum, item) => sum + item.rating, 0) / rated.length).toFixed(1)
            : '0.0';
        return { pending, approved, avg };
    }, [reviews]);

    const updateReview = async (reviewId, payload, actionLabel) => {
        setUpdatingId(reviewId);
        setUpdatingAction(actionLabel);
        setError('');
        setSuccess('');
        try {
            await adminApi.updateAdminReview(reviewId, payload);
            setSuccess(actionLabel === 'reply' ? 'Owner reply saved successfully.' : `Review ${actionLabel} successfully.`);
            await loadReviews();
        } catch (updateError) {
            setError(updateError.message || 'Failed to update review.');
            if ((updateError.message || '').toLowerCase().includes('login again')) {
                navigate('/admin/login', { replace: true });
            }
        } finally {
            setUpdatingId('');
            setUpdatingAction('');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Review Management</h2>
                    <p className="admin-page-subtitle">Approve, reject and reply to customer reviews</p>
                </div>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card stat-warning">
                    <div className="stat-content">
                        <p className="stat-label">Pending</p>
                        <p className="stat-value">{stats.pending}</p>
                    </div>
                </div>
                <div className="admin-stat-card stat-success">
                    <div className="stat-content">
                        <p className="stat-label">Approved</p>
                        <p className="stat-value">{stats.approved}</p>
                    </div>
                </div>
                <div className="admin-stat-card stat-primary">
                    <div className="stat-content">
                        <p className="stat-label">Average Rating</p>
                        <p className="stat-value">{stats.avg}</p>
                    </div>
                </div>
            </div>

            <div className="admin-section">
                <div className="admin-filter-tabs" style={{ marginBottom: '1rem' }}>
                    <button type="button" className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
                    <button type="button" className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>Pending</button>
                    <button type="button" className={`filter-tab ${statusFilter === 'approved' ? 'active' : ''}`} onClick={() => setStatusFilter('approved')}>Approved</button>
                    <button type="button" className={`filter-tab ${statusFilter === 'rejected' ? 'active' : ''}`} onClick={() => setStatusFilter('rejected')}>Rejected</button>
                    <button type="button" className="btn-secondary btn-sm" onClick={loadReviews}>Refresh</button>
                </div>

                {error && (
                    <div className="error-message-banner" style={{ marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="admin-alert admin-alert-success" style={{ marginBottom: '1rem' }}>
                        <span>{success}</span>
                    </div>
                )}

                {loading ? (
                    <p className="admin-page-subtitle">Loading reviews...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Rating</th>
                                    <th>Review</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-light)' }}>
                                            No reviews found for this filter.
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <p className="font-semibold" style={{ margin: 0 }}>{item.userName || 'Customer'}</p>
                                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--admin-text-light)' }}>Bill: {item.billNumber}</p>
                                            </td>
                                            <td>{item.productName}</td>
                                            <td>{item.rating} / 5</td>
                                            <td style={{ maxWidth: '260px' }}>{item.reviewText}</td>
                                            <td>
                                                <span className={`status-badge ${statusClassMap[item.status] || 'status-warning'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                                                        <button type="button" className="btn-secondary btn-sm" disabled={updatingId === item._id} onClick={() => updateReview(item._id, { status: 'approved' }, 'approved')}>
                                                            {updatingId === item._id && updatingAction === 'approved' ? 'Approving...' : 'Approve'}
                                                        </button>
                                                        <button type="button" className="btn-secondary btn-sm" disabled={updatingId === item._id} onClick={() => updateReview(item._id, { status: 'rejected' }, 'rejected')}>
                                                            {updatingId === item._id && updatingAction === 'rejected' ? 'Rejecting...' : 'Reject'}
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        value={replyDrafts[item._id] || ''}
                                                        onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [item._id]: event.target.value }))}
                                                        placeholder="Owner reply (optional)"
                                                        rows={2}
                                                        style={{ minWidth: '180px', padding: '0.45rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-secondary btn-sm"
                                                        disabled={updatingId === item._id}
                                                        onClick={() => updateReview(item._id, { ownerReply: replyDrafts[item._id] || '' }, 'reply')}
                                                    >
                                                        {updatingId === item._id && updatingAction === 'reply' ? 'Saving...' : 'Save Reply'}
                                                    </button>
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

export default AdminReviews;
