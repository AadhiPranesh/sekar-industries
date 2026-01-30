/**
 * Admin Product Health
 * Simple view of which products are selling well
 */

import { useState } from 'react';

const AdminProductHealth = () => {
    // TODO: Replace with API fetch
    const [healthData] = useState([
            {
                id: 'prod-005',
                name: 'S-Type Visitor Chair',
                category: 'Steel Furniture',
                stock: 55,
                salesThisWeek: 28,
                salesLastWeek: 32,
                health: 'hot',
                healthLabel: 'Selling Fast',
                recommendation: 'Keep good stock - popular item'
            },
            {
                id: 'prod-013',
                name: 'Oval Top Dining Set',
                category: 'Dining Sets',
                stock: 8,
                salesThisWeek: 3,
                salesLastWeek: 2,
                health: 'steady',
                healthLabel: 'Steady Sales',
                recommendation: 'Maintain current stock level'
            },
            {
                id: 'prod-002',
                name: 'Heavy Duty Folding Cot',
                category: 'Woven & Folding',
                stock: 32,
                salesThisWeek: 12,
                salesLastWeek: 8,
                health: 'growing',
                healthLabel: 'Growing',
                recommendation: 'Consider increasing stock'
            },
            {
                id: 'prod-003',
                name: 'Woven Sleeping Mat',
                category: 'Woven & Folding',
                stock: 65,
                salesThisWeek: 2,
                salesLastWeek: 5,
                health: 'slow',
                healthLabel: 'Slow Moving',
                recommendation: 'High stock - reduce next order'
            },
            {
                id: 'prod-009',
                name: 'Teak Wood Folding Table',
                category: 'Folding Tables',
                stock: 22,
                salesThisWeek: 18,
                salesLastWeek: 15,
                health: 'hot',
                healthLabel: 'Selling Fast',
                recommendation: 'Restock soon - high demand'
            },
            {
                id: 'prod-011',
                name: 'Rectangular Folding Table (6ft)',
                category: 'Folding Tables',
                stock: 28,
                salesThisWeek: 0,
                salesLastWeek: 1,
                health: 'cold',
                healthLabel: 'Not Moving',
                recommendation: 'Consider promotion or reduce price'
            }
        ]);

    const getHealthBadgeClass = (health) => {
        switch (health) {
            case 'hot':
                return 'health-badge health-hot';
            case 'growing':
                return 'health-badge health-growing';
            case 'steady':
                return 'health-badge health-steady';
            case 'slow':
                return 'health-badge health-slow';
            case 'cold':
                return 'health-badge health-cold';
            default:
                return 'health-badge';
        }
    };

    const getHealthIcon = (health) => {
        switch (health) {
            case 'hot':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                );
            case 'growing':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                );
            case 'steady':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'slow':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                    </svg>
                );
            case 'cold':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const hotProducts = healthData.filter(p => p.health === 'hot');
    const needAttention = healthData.filter(p => p.health === 'slow' || p.health === 'cold');

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Product Health</h2>
                    <p className="admin-page-subtitle">See which products are selling well and which need attention</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="admin-health-summary">
                <div className="health-summary-card card-hot">
                    <div className="summary-icon">
                        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <div className="summary-value">{hotProducts.length}</div>
                        <div className="summary-label">Hot Sellers</div>
                    </div>
                </div>

                <div className="health-summary-card card-attention">
                    <div className="summary-icon">
                        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <div className="summary-value">{needAttention.length}</div>
                        <div className="summary-label">Need Attention</div>
                    </div>
                </div>
            </div>

            {/* All Products Health */}
            <div className="admin-section">
                <div className="admin-section-header">
                    <h3 className="admin-section-title">All Products</h3>
                </div>

                <div className="health-cards-grid">
                    {healthData.map((product) => (
                        <div key={product.id} className="health-card">
                            <div className="health-card-header">
                                <div>
                                    <h4 className="health-card-title">{product.name}</h4>
                                    <p className="health-card-category">{product.category}</p>
                                </div>
                                <div className={getHealthBadgeClass(product.health)}>
                                    {getHealthIcon(product.health)}
                                    <span>{product.healthLabel}</span>
                                </div>
                            </div>

                            <div className="health-card-stats">
                                <div className="health-stat">
                                    <span className="health-stat-label">This Week</span>
                                    <span className="health-stat-value">{product.salesThisWeek} sold</span>
                                </div>
                                <div className="health-stat">
                                    <span className="health-stat-label">Last Week</span>
                                    <span className="health-stat-value">{product.salesLastWeek} sold</span>
                                </div>
                                <div className="health-stat">
                                    <span className="health-stat-label">In Stock</span>
                                    <span className="health-stat-value">{product.stock} units</span>
                                </div>
                            </div>

                            <div className="health-card-recommendation">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>{product.recommendation}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminProductHealth;
