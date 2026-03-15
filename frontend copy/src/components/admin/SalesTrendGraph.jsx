/**
 * SalesTrendGraph Component
 * Duration-based sales trend visualization for shop owners
 */

import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const buildMockTrendData = (range) => {
    const now = new Date();
    const presets = {
        '1M': { points: 30, stepDays: 1, labelsEvery: 3, min: 18000, max: 52000 },
        '2M': { points: 60, stepDays: 1, labelsEvery: 6, min: 16000, max: 54000 },
        '3M': { points: 13, stepDays: 7, labelsEvery: 1, min: 90000, max: 220000 },
        '6M': { points: 26, stepDays: 7, labelsEvery: 2, min: 85000, max: 240000 },
        '1Y': { points: 12, stepDays: 30, labelsEvery: 1, min: 320000, max: 780000 }
    };

    const config = presets[range] || presets['1M'];
    const span = config.max - config.min;

    return Array.from({ length: config.points }, (_, index) => {
        const offset = config.points - index - 1;
        const pointDate = new Date(now);
        pointDate.setDate(now.getDate() - offset * config.stepDays);

        const seasonalWave = Math.sin(index / 1.8) * (span * 0.18);
        const growthCurve = index * (span / Math.max(config.points, 1)) * 0.28;
        const pulse = (index % 4 === 0 ? 1 : -1) * span * 0.04;
        const sales = Math.max(0, Math.round(config.min + seasonalWave + growthCurve + pulse));

        const isMonthly = range === '1Y';
        const showLabel = isMonthly || index % config.labelsEvery === 0;

        return {
            label: showLabel
                ? pointDate.toLocaleDateString('en-IN', isMonthly ? { month: 'short' } : { day: 'numeric' })
                : '',
            fullDate: pointDate.toLocaleDateString(
                'en-IN',
                isMonthly
                    ? { month: 'long', year: 'numeric' }
                    : { day: 'numeric', month: 'short', year: 'numeric' }
            ),
            sales,
            isMock: true
        };
    });
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="sales-graph-tooltip">
                <p className="tooltip-amount">₹{payload[0].value.toLocaleString('en-IN')}</p>
                <p className="tooltip-date">{data.fullDate}</p>
            </div>
        );
    }
    return null;
};

const formatYAxis = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
};

const SalesTrendGraph = () => {
    const [selectedRange, setSelectedRange] = useState('1M');
    const [chartData, setChartData] = useState([]);
    const [loadingChart, setLoadingChart] = useState(true);
    const [usingMockData, setUsingMockData] = useState(false);

    const durations = [
        { value: '1M', label: '1M', title: 'Last 1 Month' },
        { value: '2M', label: '2M', title: 'Last 2 Months' },
        { value: '3M', label: '3M', title: 'Last 3 Months' },
        { value: '6M', label: '6M', title: 'Last 6 Months' },
        { value: '1Y', label: '1Y', title: 'Last 1 Year' }
    ];

    const currentDuration = durations.find((d) => d.value === selectedRange) || durations[0];

    const handleRangeChange = (range) => {
        if (range === selectedRange) {
            return;
        }

        setLoadingChart(true);
        setUsingMockData(false);
        setSelectedRange(range);
    };

    useEffect(() => {
        adminApi.getSalesTrend(selectedRange)
            .then((res) => {
                if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                    setChartData(res.data);
                    return;
                }

                setChartData(buildMockTrendData(selectedRange));
                setUsingMockData(true);
            })
            .catch(() => {
                setChartData(buildMockTrendData(selectedRange));
                setUsingMockData(true);
            })
            .finally(() => setLoadingChart(false));
    }, [selectedRange]);

    return (
        <div className="sales-trend-graph">
            <div className="graph-header">
                <div>
                    <h3 className="graph-title">Sales Trend</h3>
                    <p className="graph-subtitle">
                        {currentDuration.title}
                        {usingMockData ? ' • Mock data' : ''}
                    </p>
                </div>

                <div className="duration-selector">
                    {durations.map((duration) => (
                        <button
                            key={duration.value}
                            className={`duration-btn ${selectedRange === duration.value ? 'active' : ''}`}
                            onClick={() => handleRangeChange(duration.value)}
                            aria-label={duration.title}
                        >
                            {duration.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="graph-container">
                {loadingChart ? (
                    <div className="graph-empty">
                        <p>Loading sales trend...</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="graph-empty">
                        <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                        </svg>
                        <p>No sales recorded for this period</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis
                                dataKey="label"
                                stroke="#6b7280"
                                tick={{ fontSize: 13 }}
                                tickLine={false}
                                axisLine={{ stroke: '#d1d5db' }}
                            />
                            <YAxis
                                stroke="#6b7280"
                                tick={{ fontSize: 13 }}
                                tickLine={false}
                                axisLine={{ stroke: '#d1d5db' }}
                                tickFormatter={formatYAxis}
                                width={65}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#2D473E"
                                strokeWidth={3}
                                dot={{ fill: '#2D473E', r: 4 }}
                                activeDot={{ r: 6, fill: '#6B8E7F' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default SalesTrendGraph;
