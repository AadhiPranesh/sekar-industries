/**
 * Admin Product Health
 * ML-powered product health dashboard
 */

import { useState, useEffect } from 'react';

const ML_URL = 'http://localhost:8000';

/* ── SVG icon components for each status ── */
const IconFire = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-3-2-5-2-5s0 3-3 3c-1.5 0-2-1-2-2 0-2 2-4 2-7z" fill={color} fillOpacity="0.15" />
        <path d="M12 22c-2.76 0-5-2.24-5-5 0-3.5 3-6 3-9 1.5 2 2 4 2 4s1.5-1 1.5-3c1.5 1.5 3.5 4 3.5 8a5 5 0 01-5 5z" />
    </svg>
);
const IconTrendUp = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);
const IconMinus = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconTrendDown = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
    </svg>
);
const IconStop = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
);

const STATUS_CONFIG = {
    'Selling Fast': { key: 'hot',     color: '#ef4444', bg: '#fef2f2', bar: '#ef4444', Icon: IconFire     },
    'Growing':      { key: 'growing', color: '#10b981', bg: '#ecfdf5', bar: '#10b981', Icon: IconTrendUp  },
    'Steady Sales': { key: 'steady',  color: '#3b82f6', bg: '#eff6ff', bar: '#3b82f6', Icon: IconMinus    },
    'Slow Moving':  { key: 'slow',    color: '#f59e0b', bg: '#fffbeb', bar: '#f59e0b', Icon: IconTrendDown},
    'Not Moving':   { key: 'cold',    color: '#6b7280', bg: '#f9fafb', bar: '#9ca3af', Icon: IconStop     },
};

const getRecommendation = (status) => {
    const map = {
        'Selling Fast': 'CAPITALIZE: Increase order quantities immediately to avoid stockouts. Feature on homepage.',
        'Growing':      'ACCELERATE: Growing trend detected. Increase stock & feature in "Trending" section.',
        'Steady Sales': 'MAINTAIN: Consistent performer. Keep current stock strategy and monitor weekly.',
        'Slow Moving':  'REVIVE: Apply 10-15% discount or create bundle offers. Check SEO & product images.',
        'Not Moving':   'CLEARANCE: Run a clearance sale to free warehouse space. Review pricing vs competitors.',
    };
    return map[status] || 'Monitor performance closely.';
};


const daysOfStockRemaining = (stock, dailyVelocity) => {
    if (dailyVelocity <= 0) return '∞';
    const days = Math.round(stock / dailyVelocity);
    if (days > 90) return '> 3 months';
    if (days > 30) return `${Math.ceil(days / 7)} weeks`;
    if (days < 1) return '< 1 day';
    return `${days} days`;
};

const HealthScoreBar = ({ score, color }) => (
    <div className="ph-score-bar-wrap">
        <div className="ph-score-bar-track">
            <div
                className="ph-score-bar-fill"
                style={{ width: `${score}%`, background: color }}
            />
        </div>
        <span className="ph-score-number" style={{ color }}>{score}</span>
    </div>
);

const SkeletonCard = () => (
    <div className="ph-card ph-skeleton-card">
        <div className="ph-skeleton ph-sk-badge" />
        <div className="ph-skeleton ph-sk-title" />
        <div className="ph-skeleton ph-sk-sub" />
        <div className="ph-skeleton ph-sk-bar" />
        <div className="ph-card-stats">
            <div className="ph-skeleton ph-sk-stat" />
            <div className="ph-skeleton ph-sk-stat" />
            <div className="ph-skeleton ph-sk-stat" />
        </div>
    </div>
);

const AdminProductHealth = () => {
    const [healthData, setHealthData]   = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        fetch(`${ML_URL}/api/product-health`)
            .then(res => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const mapped = data.map((item, idx) => {
                    const dailyVelocity = item.sales_qty / 365;
                    return {
                        id: item.product_id,
                        rank: idx + 1,
                        name: item.product_name,
                        stock: Math.round(item.stock_end),
                        totalSales: item.sales_qty,
                        healthScore: item.health_score,
                        status: item.dashboard_status,
                        dailyVelocity: dailyVelocity,
                        daysRemaining: daysOfStockRemaining(Math.round(item.stock_end), dailyVelocity),
                        cfg: STATUS_CONFIG[item.dashboard_status] || STATUS_CONFIG['Steady Sales'],
                        recommendation: getRecommendation(item.dashboard_status),
                    };
                });
                setHealthData(mapped);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const statusCounts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
        acc[s] = healthData.filter(p => p.status === s).length;
        return acc;
    }, {});

    const filters = ['All', ...Object.keys(STATUS_CONFIG)];
    const displayed = activeFilter === 'All'
        ? healthData
        : healthData.filter(p => p.status === activeFilter);

    if (error) return (
        <div className="admin-page">
            <div className="ph-error-box">
                <span className="ph-error-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
                <div>
                    <strong>Could not load product health data</strong>
                    <p>{error}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-page">

            {/* ── Page Header ── */}
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Product Health</h2>
                    <p className="admin-page-subtitle">
                        ML-powered scoring across {healthData.length} products · sorted by health score
                    </p>
                </div>
                <div className="ph-live-badge">
                    <span className="ph-live-dot" />
                    Live Data
                </div>
            </div>

            {/* ── 5-Status Summary Strip ── */}
            <div className="ph-summary-strip">
                {Object.entries(STATUS_CONFIG).map(([label, cfg]) => {
                    const TileIcon = cfg.Icon;
                    return (
                    <button
                        key={label}
                        className={`ph-summary-tile${activeFilter === label ? ' ph-tile-active' : ''}`}
                        style={{ '--tile-color': cfg.color, '--tile-bg': cfg.bg }}
                        onClick={() => setActiveFilter(activeFilter === label ? 'All' : label)}
                    >
                        <span className="ph-tile-emoji"><TileIcon color={cfg.color} /></span>
                        <span className="ph-tile-count">
                            {loading ? '–' : statusCounts[label]}
                        </span>
                        <span className="ph-tile-label">{label}</span>
                    </button>
                    );
                })}
            </div>

            {/* ── Filter Tabs ── */}
            <div className="ph-filter-bar">
                {filters.map(f => (
                    <button
                        key={f}
                        className={`ph-filter-tab${activeFilter === f ? ' ph-tab-active' : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f}
                        {f !== 'All' && !loading && (
                            <span className="ph-tab-count">{statusCounts[f]}</span>
                        )}
                        {f === 'All' && !loading && (
                            <span className="ph-tab-count">{healthData.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Cards Grid ── */}
            <div className="ph-cards-grid">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    : displayed.map(product => {
                        const StatusIcon = product.cfg.Icon;
                        return (
                        <div
                            key={product.id}
                            className="ph-card"
                            style={{ '--card-accent': product.cfg.color }}
                        >
                            {/* Rank + Badge */}
                            <div className="ph-card-top">
                                <span className="ph-rank">#{product.rank}</span>
                                <span
                                    className="ph-status-badge"
                                    style={{ background: product.cfg.bg, color: product.cfg.color }}
                                >
                                    <StatusIcon color={product.cfg.color} />
                                    {product.status}
                                </span>
                            </div>

                            {/* Product Name */}
                            <div className="ph-card-name">
                                <h4>{product.name}</h4>
                                <span className="ph-product-id">{product.id}</span>
                            </div>

                            {/* Health Score Bar */}
                            <div className="ph-score-section">
                                <span className="ph-score-label">Health Score</span>
                                <HealthScoreBar score={product.healthScore} color={product.cfg.bar} />
                            </div>

                            {/* Stats Row */}
                            <div className="ph-card-stats">
                                <div className="ph-stat">
                                    <span className="ph-stat-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                                    </span>
                                    <span className="ph-stat-val">{product.totalSales.toLocaleString()}</span>
                                    <span className="ph-stat-lbl">Total Sales</span>
                                </div>
                                <div className="ph-stat-divider" />
                                <div className="ph-stat">
                                    <span className="ph-stat-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M12 12v4M10 14h4"/></svg>
                                    </span>
                                    <span className="ph-stat-val">{product.stock}</span>
                                    <span className="ph-stat-lbl">In Stock</span>
                                </div>
                                <div className="ph-stat-divider" />
                                <div className="ph-stat">
                                    <span className="ph-stat-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                                    </span>
                                    <span className="ph-stat-val" style={{ color: product.cfg.color }}>
                                        {product.healthScore}
                                    </span>
                                    <span className="ph-stat-lbl">Score</span>
                                </div>
                            </div>

                            {/* Days of Stock Remaining */}
                            <div className="ph-stock-indicator">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={product.cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span style={{ color: product.cfg.color, fontWeight: 700 }}>
                                    {product.daysRemaining} remaining
                                </span>
                            </div>

                            {/* Recommendation */}
                            <div
                                className="ph-recommendation"
                                style={{ borderLeftColor: product.cfg.color, background: product.cfg.bg }}
                            >
                                <svg width="14" height="14" viewBox="0 0 20 20" fill={product.cfg.color} style={{ flexShrink: 0, marginTop: 2 }}>
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>{product.recommendation}</span>
                            </div>


                        </div>
                        );
                    })
                }
            </div>

            {!loading && displayed.length === 0 && (
                <div className="ph-empty">No products match this filter.</div>
            )}
        </div>
    );
};

export default AdminProductHealth;
