/**
 * Admin Sales Prediction
 * Real-time connection to Python ML Service via Node.js
 */

import { useState, useEffect } from 'react';
import { 
    Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { productList } from '../../api/productConfig'; 
import { adminApi } from '../../api/adminApi';

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
const formatCompact = (value) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return `${value}`;
};

const parseMonthLabel = (value) => {
    if (!value) return null;
    const parsed = new Date(`${value.replace(/\s+/g, ' ')} 01`);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return {
        month: parsed.getMonth(),
        year: parsed.getFullYear()
    };
};

const UnifiedTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        
        return (
            <div className="prediction-tooltip">
                <p className="prediction-tooltip-label">
                    {label}
                </p>
                <p>
                    Current Trend: <strong>{data.sales} Units</strong>
                </p>
                {data.previousYearSales !== null && data.previousYearSales !== undefined && (
                    <p>
                        Last Year: <strong>{Math.round(data.previousYearSales)} Units</strong>
                    </p>
                )}
                {data.type === 'prediction' && <p>Forecast month</p>}
            </div>
        );
    }
    return null;
};

const AdminPrediction = () => {
    const [selectedProduct, setSelectedProduct] = useState(productList[0].id);
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await adminApi.getPrediction(selectedProduct);
                setApiData(data);
                
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedProduct]);

    if (loading) {
        return (
            <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>🔄 Analyzing Sales Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page" style={{ padding: '40px' }}>
                <div style={{ padding: '20px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
                    <h3>⚠️ Prediction Failed</h3>
                    <p>Could not connect to the Forecasting Service.</p>
                    <small>Error: {error}</small>
                </div>
            </div>
        );
    }

    if (!apiData) return null;

    const currentData = {
        name: selectedProduct,
        currentPrice: apiData.current_price,
        currentStock: apiData.current_stock,
        prediction: apiData.prediction,
        history: apiData.history_graph  
    };

    let stockStatus = 'Sufficient';
    let stockColor = 'success'; 
    
    if (currentData.currentStock < 10) {
        stockStatus = 'Low Stock';
        stockColor = 'warning';
    } else if (currentData.prediction.predicted_quantity > currentData.currentStock) {
        stockStatus = 'Insufficient';
        stockColor = 'danger';
    }

    const colors = {
        success: { border: '#16a34a', bg: '#dcfce7', text: '#16a34a', icon: 'M5 13l4 4L19 7' },
        warning: { border: '#eab308', bg: '#fef9c3', text: '#ca8a04', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        danger:  { border: '#dc2626', bg: '#fee2e2', text: '#dc2626', icon: 'M6 18L18 6M6 6l12 12' }
    };
    
    const statusStyle = colors[stockColor];

    const buildMarketData = () => {
        const rows = [
            ...currentData.history.map((h) => ({
                name: h.date,
                sales: h.sales,
                revenue: h.revenue,
                type: 'history'
            })),
            {
                name: currentData.prediction.date,
                sales: currentData.prediction.predicted_quantity,
                revenue: currentData.prediction.predicted_revenue,
                type: 'prediction'
            }
        ];

        const comparisonBaseline = apiData?.comparison?.available
            ? apiData.comparison.same_month_last_year_quantity
            : null;

        const previousYearLookup = rows.reduce((acc, row) => {
            const parsed = parseMonthLabel(row.name);
            if (!parsed) {
                return acc;
            }

            acc[`${parsed.year}-${parsed.month}`] = row.sales;
            return acc;
        }, {});

        let previousClose = Math.max(10, currentData.currentPrice * 0.94);

        const withPrice = rows.map((row, index) => {
            const parsed = parseMonthLabel(row.name);
            const previousYearKey = parsed ? `${parsed.year - 1}-${parsed.month}` : null;

            return {
                ...row,
                previousYearSales: comparisonBaseline !== null && comparisonBaseline !== undefined
                    ? comparisonBaseline
                    : previousYearKey && previousYearLookup[previousYearKey] !== undefined
                        ? previousYearLookup[previousYearKey]
                        : null
            };
        });

        return withPrice;
    };

    const chartData = buildMarketData();
    const hasPreviousYearSeries = chartData.some((point) => point.previousYearSales !== null && point.previousYearSales !== undefined);
    const predictionPoint = chartData[chartData.length - 1];
    const latestHistory = chartData[chartData.length - 2] || predictionPoint;
    const previousHistory = chartData[chartData.length - 3] || latestHistory;
    const selectedProductName = productList.find((p) => p.id === selectedProduct)?.name || selectedProduct;
    const growthRate = ((predictionPoint.sales - latestHistory.sales) / Math.max(1, latestHistory.sales)) * 100;
    const momentum = growthRate >= 0 ? 'Bullish' : 'Cooling';
    const confidenceSpread = ((predictionPoint.forecastHigh - predictionPoint.forecastLow) / Math.max(1, predictionPoint.sales)) * 100;
    const confidenceLabel = confidenceSpread <= 20 ? 'High Confidence' : confidenceSpread <= 30 ? 'Medium Confidence' : 'Low Confidence';
    const shortTermTrend = ((latestHistory.sales - previousHistory.sales) / Math.max(1, previousHistory.sales)) * 100;
    const demandGap = currentData.currentStock - currentData.prediction.predicted_quantity;
    const volatilityScore = Math.abs(shortTermTrend) + Math.abs(growthRate / 2);

    return (
        <div className="admin-page">
            <div className="prediction-terminal-header">
                <div>
                    <h2 className="admin-page-title">Sales Prediction Desk</h2>
                    <p className="admin-page-subtitle">Live market behavior view for {selectedProductName}</p>
                </div>

                <div className="prediction-toolbar">
                    <select 
                        className="form-input prediction-product-select"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        {productList.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="prediction-kpi-strip">
                <div className="prediction-kpi-card">
                    <p className="prediction-kpi-label">Forecast Growth</p>
                    <p className={`prediction-kpi-value ${growthRate >= 0 ? 'pos' : 'neg'}`}>{formatPercent(growthRate)}</p>
                </div>
                <div className="prediction-kpi-card">
                    <p className="prediction-kpi-label">Momentum</p>
                    <p className={`prediction-kpi-value ${shortTermTrend >= 0 ? 'pos' : 'neg'}`}>{momentum} {formatPercent(shortTermTrend)}</p>
                </div>
                <div className="prediction-kpi-card">
                    <p className="prediction-kpi-label">Projected Revenue</p>
                    <p className="prediction-kpi-value">{formatCurrency(currentData.prediction.predicted_revenue)}</p>
                </div>
                <div className="prediction-kpi-card">
                    <p className="prediction-kpi-label">Confidence</p>
                    <p className="prediction-kpi-value">{confidenceLabel}</p>
                </div>
            </div>

            <div className="prediction-board">
                <div className="prediction-chart-panel">
                    <div className="prediction-panel-top">
                        <h3 className="admin-section-title">Unified Market View</h3>
                        <span className={`prediction-status-badge ${stockColor}`} style={{ borderColor: statusStyle.border, color: statusStyle.text, background: statusStyle.bg }}>
                            {stockStatus}
                        </span>
                    </div>

                    <div className="prediction-chart-shell">
                        <ResponsiveContainer>
                            <ComposedChart data={chartData} margin={{ top: 12, right: 24, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="units" stroke="#6b7280" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} />

                                <Tooltip content={<UnifiedTooltip />} />

                                <Line yAxisId="units" type="monotone" dataKey="sales" name="Prediction Trend" stroke="#2f3a38" strokeWidth={2.8} dot={{ r: 2.5 }} activeDot={{ r: 5, fill: '#ffffff', stroke: '#2f3a38', strokeWidth: 2 }} />
                                <Line yAxisId="units" type="monotone" dataKey="previousYearSales" name="Last Year Same Month" stroke="#2563eb" strokeWidth={2.2} strokeDasharray="6 4" dot={false} connectNulls={false} />

                                <ReferenceLine x={currentData.prediction.date} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Forecast', fill: '#ef4444', fontSize: 12, fontWeight: 500 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="prediction-mini-legend">
                        <span><i className="lg demand" />Prediction Trend</span>
                        <span><i className="lg previous-year" />Last Year Same Month</span>
                    </div>

                    {!hasPreviousYearSeries && (
                        <div className="prediction-data-note">
                            {apiData?.comparison?.note || 'Prediction available, but previous-year same-month comparison is not available in the dataset.'}
                        </div>
                    )}
                </div>

                <aside className="prediction-side-panel">
                    <h4>Signal Panel</h4>
                    <div className="prediction-side-metric">
                        <span>Predicted Units</span>
                        <strong>{currentData.prediction.predicted_quantity}</strong>
                    </div>
                    <div className="prediction-side-metric">
                        <span>Current Stock</span>
                        <strong>{currentData.currentStock}</strong>
                    </div>
                    <div className="prediction-side-metric">
                        <span>Supply Gap</span>
                        <strong className={demandGap < 0 ? 'neg' : 'pos'}>{demandGap}</strong>
                    </div>
                    <div className="prediction-side-metric">
                        <span>Volatility Score</span>
                        <strong>{volatilityScore.toFixed(1)}</strong>
                    </div>
                    <div className="prediction-side-note">
                        <p>
                            <strong>Desk note:</strong> {selectedProductName} is showing {momentum.toLowerCase()} momentum with {confidenceLabel.toLowerCase()} confidence.
                            Keep stock buffer of at least {Math.max(0, Math.round(predictionPoint.sales * 0.1))} units near forecast cycle.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminPrediction;