import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Area,
    Line
} from 'recharts';
import './UnifiedMarketChart.css';

const demoData = [
    {
        month: 'Oct 2025',
        volume: 34,
        demand: 31,
        revenue: 68000,
        marketIndex: 44,
        movingAvg: 29,
        rangeLow: 25,
        rangeHigh: 38
    },
    {
        month: 'Nov 2025',
        volume: 39,
        demand: 36,
        revenue: 84000,
        marketIndex: 46,
        movingAvg: 33,
        rangeLow: 28,
        rangeHigh: 43
    },
    {
        month: 'Dec 2025',
        volume: 42,
        demand: 40,
        revenue: 112000,
        marketIndex: 49,
        movingAvg: 36,
        rangeLow: 32,
        rangeHigh: 47
    },
    {
        month: 'Jan 2026',
        volume: 46,
        demand: 44,
        revenue: 128000,
        marketIndex: 52,
        movingAvg: 39,
        rangeLow: 36,
        rangeHigh: 51
    },
    {
        month: 'Feb 2026',
        volume: 50,
        demand: 47,
        revenue: 168000,
        marketIndex: 55,
        movingAvg: 43,
        rangeLow: 40,
        rangeHigh: 56
    },
    {
        month: 'Mar 2026',
        volume: 54,
        demand: 52,
        revenue: 242000,
        marketIndex: 58,
        movingAvg: 47,
        rangeLow: 45,
        rangeHigh: 60
    }
];

const formatINR = (value) => {
    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(1)}Cr`;
    }

    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
        return `₹${(value / 1000).toFixed(1)}K`;
    }

    return `₹${value}`;
};

const withForecastBand = (rows) => {
    return rows.map((row) => ({
        ...row,
        forecastBase: row.rangeLow,
        forecastBand: Math.max(0, row.rangeHigh - row.rangeLow)
    }));
};

const tooltipDot = (className) => <span className={`unified-tooltip-dot ${className}`} />;

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const row = payload[0].payload;

    return (
        <div className="unified-tooltip">
            <p className="unified-tooltip-title">{label}</p>
            <p className="unified-tooltip-line">
                {tooltipDot('dot-volume')}
                Volume: <strong>{row.volume}</strong>
            </p>
            <p className="unified-tooltip-line unified-tooltip-revenue">
                {tooltipDot('dot-revenue')}
                Revenue: <strong>{formatINR(row.revenue)}</strong>
            </p>
            <p className="unified-tooltip-line">
                {tooltipDot('dot-market')}
                Market Index: {row.marketIndex}
            </p>
            <p className="unified-tooltip-line">
                {tooltipDot('dot-range')}
                Range: {row.rangeLow} - {row.rangeHigh}
            </p>
        </div>
    );
};

const UnifiedMarketChart = ({
    data = demoData,
    title = 'Unified Market View'
}) => {
    const chartData = withForecastBand(data);

    return (
        <section className="unified-market-card">
            <h3 className="unified-market-title">{title}</h3>

            <div className="unified-market-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 8, bottom: 4, left: 0 }}>
                        <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            interval={0}
                        />

                        <YAxis
                            yAxisId="left"
                            domain={[0, 60]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickFormatter={formatINR}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(226, 232, 240, 0.35)' }} />

                        <Area
                            yAxisId="left"
                            dataKey="forecastBase"
                            stackId="forecast"
                            stroke="none"
                            fill="transparent"
                            isAnimationActive={false}
                        />
                        <Area
                            yAxisId="left"
                            dataKey="forecastBand"
                            stackId="forecast"
                            stroke="none"
                            fill="rgba(156, 163, 175, 0.25)"
                            isAnimationActive={false}
                        />

                        <Bar
                            yAxisId="left"
                            dataKey="volume"
                            fill="#9ca3af"
                            radius={[8, 8, 0, 0]}
                            barSize={22}
                        />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#16a34a"
                            strokeWidth={2.5}
                            dot={false}
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="demand"
                            stroke="#374151"
                            strokeWidth={2.6}
                            dot={false}
                            activeDot={{ r: 5, fill: '#ffffff', stroke: '#374151', strokeWidth: 2 }}
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="marketIndex"
                            stroke="#7c3aed"
                            strokeWidth={2.4}
                            dot={false}
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="movingAvg"
                            stroke="#f59e0b"
                            strokeWidth={2.2}
                            strokeDasharray="5 5"
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="unified-market-legend">
                <span className="legend-item">
                    <span className="legend-swatch swatch-volume" />
                    Volume
                </span>
                <span className="legend-item">
                    <span className="legend-swatch swatch-revenue" />
                    Revenue
                </span>
                <span className="legend-item">
                    <span className="legend-swatch swatch-demand" />
                    Demand
                </span>
                <span className="legend-item">
                    <span className="legend-swatch swatch-market" />
                    Market Index
                </span>
                <span className="legend-item">
                    <span className="legend-swatch swatch-moving" />
                    Moving Avg
                </span>
                <span className="legend-item">
                    <span className="legend-swatch swatch-range" />
                    Forecast Range
                </span>
            </div>
        </section>
    );
};

export default UnifiedMarketChart;
