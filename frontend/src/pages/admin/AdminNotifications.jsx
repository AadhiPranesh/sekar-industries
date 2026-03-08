/**
 * Admin Notifications
 * Separate notification center with severity filters
 */
import { useMemo, useState } from 'react';

const AdminNotifications = () => {
    const [notificationFilter, setNotificationFilter] = useState('all');

    const [notifications] = useState([
        {
            id: 'n-001',
            type: 'critical',
            title: 'Out of Stock Warning',
            message: 'Product S Type Chair is out of stock. Immediate restock required.',
            category: 'Stock & Inventory',
            timeAgo: '10m ago',
            isUnread: true
        },
        {
            id: 'n-002',
            type: 'warning',
            title: 'Low Stock Alert',
            message: 'Low stock detected for Folding Bed Niwar. Only 12 units remaining.',
            category: 'Stock & Inventory',
            timeAgo: '25m ago',
            isUnread: true
        },
        {
            id: 'n-003',
            type: 'warning',
            title: 'Overstock Warning',
            message: 'High inventory detected for Foldable Single Cot. Consider reducing next order.',
            category: 'Stock & Inventory',
            timeAgo: '40m ago',
            isUnread: true
        },
        {
            id: 'n-004',
            type: 'suggestion',
            title: 'Slow Moving Inventory',
            message: 'Low sales detected for Wire Netted S Type Chair. Consider promotional discount.',
            category: 'Stock & Inventory',
            timeAgo: '1h ago',
            isUnread: true
        },
        {
            id: 'n-005',
            type: 'info',
            title: 'Demand Increase',
            message: 'Demand for Maharaja Teak Wood Dining Table is predicted to increase next week. Consider increasing stock.',
            category: 'Demand Prediction',
            timeAgo: '2h ago',
            isUnread: true
        },
        {
            id: 'n-006',
            type: 'info',
            title: 'Demand Drop',
            message: 'Demand for Mild Steel Movable Walker is expected to decline. Avoid overstocking.',
            category: 'Demand Prediction',
            timeAgo: '3h ago',
            isUnread: false
        },
        {
            id: 'n-007',
            type: 'info',
            title: 'Top Selling Product',
            message: 'Orange Niwar Folding Bed is the best selling product this week.',
            category: 'Sales Performance',
            timeAgo: '4h ago',
            isUnread: false
        },
        {
            id: 'n-008',
            type: 'suggestion',
            title: 'Promotion Opportunity',
            message: 'Floral Printed Folding Bed shows low demand. Consider promotional offers.',
            category: 'Pricing & Promotion',
            timeAgo: '5h ago',
            isUnread: false
        },
        {
            id: 'n-009',
            type: 'suggestion',
            title: 'Combo Opportunity',
            message: 'Recommended combo: Maharaja Dining Table + S Type Chair. Bundle offer may increase sales.',
            category: 'Pricing & Promotion',
            timeAgo: '6h ago',
            isUnread: false
        },
        {
            id: 'n-010',
            type: 'critical',
            title: 'Need Attention',
            message: 'Inventory imbalance detected between chairs and tables. Supplier restock planning required today.',
            category: 'Operational Alert',
            timeAgo: '8h ago',
            isUnread: false
        }
    ]);

    const filteredNotifications = useMemo(() => {
        if (notificationFilter === 'all') {
            return notifications;
        }

        if (notificationFilter === 'unread') {
            return notifications.filter((notification) => notification.isUnread);
        }

        return notifications.filter((notification) => notification.type === notificationFilter);
    }, [notificationFilter, notifications]);

    const unreadCount = useMemo(
        () => notifications.filter((notification) => notification.isUnread).length,
        [notifications]
    );

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Notifications</h2>
                    <p className="admin-page-subtitle">Actionable stock, demand, sales, pricing and AI insight alerts</p>
                </div>
                <span className="notification-count-pill">{unreadCount} unread</span>
            </div>

            <div className="admin-section admin-notification-panel">
                <div className="admin-notification-tabs">
                    <button type="button" className={`filter-tab ${notificationFilter === 'all' ? 'active' : ''}`} onClick={() => setNotificationFilter('all')}>All</button>
                    <button type="button" className={`filter-tab ${notificationFilter === 'unread' ? 'active' : ''}`} onClick={() => setNotificationFilter('unread')}>Unread</button>
                    <button type="button" className={`filter-tab ${notificationFilter === 'critical' ? 'active' : ''}`} onClick={() => setNotificationFilter('critical')}>Critical</button>
                    <button type="button" className={`filter-tab ${notificationFilter === 'warning' ? 'active' : ''}`} onClick={() => setNotificationFilter('warning')}>Warning</button>
                    <button type="button" className={`filter-tab ${notificationFilter === 'info' ? 'active' : ''}`} onClick={() => setNotificationFilter('info')}>Info</button>
                    <button type="button" className={`filter-tab ${notificationFilter === 'suggestion' ? 'active' : ''}`} onClick={() => setNotificationFilter('suggestion')}>Suggestion</button>
                </div>

                <div className="admin-notification-list">
                    {filteredNotifications.map((notification) => (
                        <article
                            key={notification.id}
                            className={`admin-notification-item notification-${notification.type} ${notification.isUnread ? 'is-unread' : ''}`}
                        >
                            <div className="notification-dot" />
                            <div className="notification-content">
                                <div className="notification-top-row">
                                    <h4 className="notification-title">{notification.title}</h4>
                                    <span className="notification-time">{notification.timeAgo}</span>
                                </div>
                                <p className="notification-message">{notification.message}</p>
                                <div className="notification-meta-row">
                                    <span className={`notification-type-badge type-${notification.type}`}>{notification.type}</span>
                                    <span className="notification-category">{notification.category}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
