/**
 * Admin Sales Prediction
 * Real-time connection to Python ML Service via Node.js
 */

import { useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { productList } from '../../api/productConfig'; 

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload; 
        const revenue = data.type === 'history' ? data.revenue : data.revenue; 
        
        return (
            <div style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                padding: '12px', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <p style={{ margin: '0 0 5px 0', color: '#6b7280', fontSize: '12px', fontWeight: 'bold' }}>
                    {label}
                </p>
                <p style={{ margin: '0', color: '#374151', fontSize: '14px' }}>
                    Sales: <strong>{payload[0].value} Units</strong>
                </p>
                <p style={{ margin: '0', color: '#16a34a', fontSize: '14px', fontWeight: '500' }}>
                    Revenue: {formatCurrency(revenue)}
                </p>
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
                const res = await fetch(`http://localhost:8000/dashboard/${selectedProduct}`);
                
                if (!res.ok) {
                    throw new Error(`Server Error: ${res.status}`);
                }
                
                const data = await res.json();
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

    const getChartData = () => {
        const historyData = currentData.history.map(h => ({
            name: h.date,
            sales: h.sales,
            revenue: h.revenue,
            type: 'history'
        }));
        
        const futureData = {
            name: currentData.prediction.date,
            sales: currentData.prediction.predicted_quantity,
            revenue: currentData.prediction.predicted_revenue,
            type: 'prediction'
        };
        
        return [...historyData, futureData];
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Sales Prediction</h2>
                    <p className="admin-page-subtitle">Real-time forecast for {selectedProduct}</p>
                </div>
                
                <div className="admin-actions">
                    <select 
                        className="form-input" 
                        style={{ minWidth: '250px', cursor: 'pointer' }}
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        {productList.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="admin-stats-grid">
                
                {/* Card 1: Predicted Sales */}
                <div className="admin-stat-card stat-primary">
                    <div className="stat-icon">
                        <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Predicted Sales</p>
                        <p className="stat-value">{currentData.prediction.predicted_quantity} Units</p>
                        <p className="stat-detail">Forecast for {currentData.prediction.date}</p>
                    </div>
                </div>

                {/* Card 2: Revenue */}
                <div className="admin-stat-card stat-success">
                    <div className="stat-icon">
                         <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Projected Revenue</p>
                        <p className="stat-value">{formatCurrency(currentData.prediction.predicted_revenue)}</p>
                        <p className="stat-detail">Based on price {formatCurrency(currentData.currentPrice)}</p>
                    </div>
                </div>

                {/* Card 3: Inventory Status */}
                <div className="admin-stat-card" style={{ borderLeft: `4px solid ${statusStyle.border}` }}>
                    <div className="stat-icon" style={{ color: statusStyle.text, background: statusStyle.bg }}>
                        <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d={statusStyle.icon} clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Inventory Status</p>
                        <p className="stat-value" style={{ color: statusStyle.text }}>{stockStatus}</p>
                        <p className="stat-detail">
                            Stock: {currentData.currentStock} vs Demand: {currentData.prediction.predicted_quantity}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- GRAPH --- */}
            <div className="admin-section">
                <div className="admin-section-header">
                    <h3 className="admin-section-title">Forecast Visualization</h3>
                </div>
                
                <div className="admin-table-container" style={{ padding: '20px', background: 'white' }}>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <AreaChart data={getChartData()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2D473E" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#2D473E" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} axisLine={{ stroke: '#d1d5db' }} tickLine={false} />
                                <YAxis stroke="#6b7280" tick={{fontSize: 12}} axisLine={{ stroke: '#d1d5db' }} tickLine={false} />
                                
                                <Tooltip content={<CustomTooltip />} />
                                
                                <Area type="monotone" dataKey="sales" stroke="#2D473E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" activeDot={{ r: 6, fill: '#6B8E7F', stroke: '#fff', strokeWidth: 2 }} />
                                <ReferenceLine x={currentData.prediction.date} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Forecast', fill: '#ef4444', fontSize: 12, fontWeight: 500 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Insight Text */}
                    <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', marginTop: '10px' }}>
                        <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0 }}>
                            <strong>💡 AI Insight:</strong> Based on historical data from {currentData.history[0].date} to {currentData.history[currentData.history.length-1].date}, 
                            demand for this product is expected to be 
                            <strong> {currentData.prediction.predicted_quantity} units</strong> next month.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPrediction;