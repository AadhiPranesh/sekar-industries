/**
 * Admin Sales Prediction
 * Real-time connection to Python ML Service via Node.js
 */

import { useState, useEffect, useRef } from 'react';
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
    const chartShellRef = useRef(null);
    const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

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

    useEffect(() => {
        const element = chartShellRef.current;
        if (!element) {
            return undefined;
        }

        const updateSize = () => {
            const rect = element.getBoundingClientRect();
            setChartDimensions({
                width: Math.max(0, Math.floor(rect.width)),
                height: Math.max(0, Math.floor(rect.height))
            });
        };

        updateSize();

        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(() => {
                updateSize();
            });
            resizeObserver.observe(element);
            return () => resizeObserver.disconnect();
        }

        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [loading, error, selectedProduct]);

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

        const withPrice = rows.map((row) => {
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
    const selectedProductName = productList.find((p) => p.id === selectedProduct)?.name || selectedProduct;
    const growthRate = ((predictionPoint.sales - latestHistory.sales) / Math.max(1, latestHistory.sales)) * 100;
    const forecastUnitsDelta = predictionPoint.sales - latestHistory.sales;
    const forecastRevenue = currentData.prediction.predicted_revenue;
    const previousYearValue = predictionPoint.previousYearSales;
    const previousYearDelta = previousYearValue !== null && previousYearValue !== undefined
        ? predictionPoint.sales - previousYearValue
        : null;

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
                    <p className="prediction-kpi-label">Forecast Growth vs Last Point</p>
                    <p className={`prediction-kpi-value ${growthRate >= 0 ? 'pos' : 'neg'}`}>{formatPercent(growthRate)}</p>
                </div>
                <div className="prediction-kpi-card">
                    <p className="prediction-kpi-label">Forecast Units Delta</p>
                    <p className={`prediction-kpi-value ${forecastUnitsDelta >= 0 ? 'pos' : 'neg'}`}>
                        {forecastUnitsDelta >= 0 ? '+' : ''}{Math.round(forecastUnitsDelta)} units
                    </p>
                </div>
                <div className="prediction-kpi-card">
                    <p className="prediction-kpi-label">Forecast Revenue</p>
                    <p className="prediction-kpi-value">{formatCurrency(forecastRevenue)}</p>
                </div>
                <div className="prediction-kpi-card">
                    <p className="prediction-kpi-label">Forecast vs Last Year</p>
                    <p className={`prediction-kpi-value ${previousYearDelta !== null && previousYearDelta >= 0 ? 'pos' : 'neg'}`}>
                        {previousYearDelta === null
                            ? 'N/A'
                            : `${previousYearDelta >= 0 ? '+' : ''}${Math.round(previousYearDelta)} units`}
                    </p>
                </div>
            </div>

            <div className="prediction-chart-panel">
                <div className="prediction-panel-top">
                    <h3 className="admin-section-title">Unified Market View</h3>
                </div>

                <div className="prediction-chart-shell" ref={chartShellRef}>
                    {chartDimensions.width > 0 && chartDimensions.height > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={280}>
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
                    ) : null}
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
        </div>
    );
};

export default AdminPrediction;