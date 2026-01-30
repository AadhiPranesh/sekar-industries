/**
 * SalesTrendGraph Component
 * Duration-based sales trend visualization for shop owners
 * Automatically adjusts data granularity based on selected time range
 */

import { useState, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom tooltip component (outside render)
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

// Format Y-axis values (utility function)
const formatYAxis = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
};

const SalesTrendGraph = () => {
    const [selectedRange, setSelectedRange] = useState('1M');
    
    // Deterministic pseudo-random function (seeded by date)
    const seededRandom = useCallback((seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }, []);

    // Duration configuration
    const durations = [
        { value: '1M', label: '1M', title: 'Last 1 Month' },
        { value: '2M', label: '2M', title: 'Last 2 Months' },
        { value: '3M', label: '3M', title: 'Last 3 Months' },
        { value: '6M', label: '6M', title: 'Last 6 Months' },
        { value: '1Y', label: '1Y', title: 'Last 1 Year' }
    ];

    // Get current duration config
    const currentDuration = durations.find(d => d.value === selectedRange) || durations[0];

    // Generate mock data based on selected range
    const chartData = useMemo(() => {
        const now = new Date();
        const data = [];

        switch (selectedRange) {
            case '1M': {
                // Daily data for 30 days
                for (let i = 29; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const day = date.getDate();
                    const seed = date.getFullYear() * 10000 + date.getMonth() * 100 + day;
                    
                    // Simulate realistic sales pattern (higher on weekends, some variation)
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const baseSales = isWeekend ? 55000 : 42000;
                    const variation = seededRandom(seed) * 15000 - 7500;
                    const sales = Math.max(25000, Math.round(baseSales + variation));

                    data.push({
                        label: day.toString(),
                        fullDate: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        sales: sales
                    });
                }
                break;
            }

            case '2M': {
                // Daily data for 60 days
                for (let i = 59; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const day = date.getDate();
                    const seed = date.getFullYear() * 10000 + date.getMonth() * 100 + day;
                    
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const baseSales = isWeekend ? 55000 : 42000;
                    const variation = seededRandom(seed) * 15000 - 7500;
                    const sales = Math.max(25000, Math.round(baseSales + variation));

                    // Show every 3rd day label to avoid crowding
                    data.push({
                        label: i % 3 === 0 ? day.toString() : '',
                        fullDate: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        sales: sales
                    });
                }
                break;
            }

            case '3M': {
                // Weekly data for 12 weeks
                for (let i = 11; i >= 0; i--) {
                    const weekStart = new Date(now);
                    weekStart.setDate(weekStart.getDate() - (i * 7));
                    const seed = weekStart.getFullYear() * 1000 + Math.floor(weekStart.getTime() / 604800000);
                    
                    // Aggregate weekly sales (7 days * avg daily)
                    const avgDailySales = 45000 + seededRandom(seed) * 10000 - 5000;
                    const weeklySales = Math.round(avgDailySales * 7);
                    
                    const weekNum = 12 - i;
                    const monthName = weekStart.toLocaleDateString('en-IN', { month: 'short' });

                    data.push({
                        label: `W${weekNum}`,
                        fullDate: `Week ${weekNum}, ${monthName}`,
                        sales: weeklySales
                    });
                }
                break;
            }

            case '6M': {
                // Monthly data for 6 months
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(now);
                    date.setMonth(date.getMonth() - i);
                    const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
                    const seed = date.getFullYear() * 100 + date.getMonth();
                    
                    // Monthly aggregated sales (30 days * avg daily)
                    const avgDailySales = 45000 + seededRandom(seed) * 15000 - 7500;
                    const monthlySales = Math.round(avgDailySales * 30);

                    data.push({
                        label: monthName,
                        fullDate: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                        sales: monthlySales
                    });
                }
                break;
            }

            case '1Y': {
                // Monthly data for 12 months
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(now);
                    date.setMonth(date.getMonth() - i);
                    const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
                    const seed = date.getFullYear() * 100 + date.getMonth();
                    
                    // Monthly aggregated sales with seasonal variation
                    const seasonalFactor = Math.sin((date.getMonth() / 12) * Math.PI * 2) * 0.2 + 1;
                    const avgDailySales = 45000 * seasonalFactor + seededRandom(seed) * 10000 - 5000;
                    const monthlySales = Math.round(avgDailySales * 30);

                    data.push({
                        label: monthName,
                        fullDate: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                        sales: monthlySales
                    });
                }
                break;
            }

            default:
                return [];
        }

        return data;
    }, [selectedRange, seededRandom]);

    return (
        <div className="sales-trend-graph">
            <div className="graph-header">
                <div>
                    <h3 className="graph-title">Sales Trend</h3>
                    <p className="graph-subtitle">{currentDuration.title}</p>
                </div>
                
                {/* Duration Selector */}
                <div className="duration-selector">
                    {durations.map((duration) => (
                        <button
                            key={duration.value}
                            className={`duration-btn ${selectedRange === duration.value ? 'active' : ''}`}
                            onClick={() => setSelectedRange(duration.value)}
                            aria-label={duration.title}
                        >
                            {duration.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Graph Container */}
            <div className="graph-container">
                {chartData.length === 0 ? (
                    <div className="graph-empty">
                        <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                        </svg>
                        <p>No sales recorded for this period</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                        >
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
