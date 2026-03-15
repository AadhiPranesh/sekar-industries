/**
 * Admin Sales Entry
 * Simple form to record offline shop sales
 */

import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';

const AdminSalesEntry = () => {
    // Full product catalog — matches mockProducts.js
    const [products] = useState([
        { id: 'prod-001', name: 'Orange Niwar Folding Bed', price: 2800 },
        { id: 'prod-002', name: 'Single Niwar Folding Bed', price: 2500 },
        { id: 'prod-003', name: 'Polished Niwar Folding Bed', price: 3200 },
        { id: 'prod-004', name: 'Blue Niwar Folding Bed', price: 2600 },
        { id: 'prod-005', name: 'Wire Netted S Type Chair', price: 1850 },
        { id: 'prod-006', name: 'Low Back S Type Chair', price: 1650 },
        { id: 'prod-007', name: 'S Type Chair', price: 1750 },
        { id: 'prod-008', name: 'Rolling Chair For Office', price: 3200 },
        { id: 'prod-009', name: 'Mild Steel Movable Walker', price: 2800 },
        { id: 'prod-010', name: 'S Type Visitor Chair', price: 1800 },
        { id: 'prod-011', name: '2 Seater Teak Wood Dining Table Set', price: 12500 },
        { id: 'prod-012', name: 'Polished Teak Wood Dining Table Set', price: 18500 },
        { id: 'prod-013', name: 'Maharaja Teak Wood Dining Table Set', price: 28500 },
        { id: 'prod-014', name: 'Antique Teak Wood Chair', price: 4500 },
        { id: 'prod-015', name: 'S Type Steel Chair', price: 1900 },
        { id: 'prod-016', name: 'Rectangular Teak Wood Table', price: 9800 },
        { id: 'prod-017', name: 'Green Niwar Folding Bed', price: 2700 },
        { id: 'prod-018', name: 'Floral Printed Folding Bed', price: 2900 },
        { id: 'prod-019', name: 'Folding Bed Niwar', price: 2400 },
        { id: 'prod-020', name: 'Folding Cot Bed', price: 2300 },
        { id: 'prod-021', name: 'Single Folding Steel Cot', price: 2600 },
        { id: 'prod-022', name: 'Foldable Single Cot', price: 2200 },
        { id: 'prod-023', name: 'Foldable Double Cot', price: 3500 },
    ]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [billNumber, setBillNumber] = useState('');
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [recentSales, setRecentSales] = useState([]);

    const loadRecentSales = async () => {
        try {
            const response = await adminApi.getRecentSales(10);
            setRecentSales(response.sales || []);
        } catch {
            setRecentSales([]);
        }
    };

    useEffect(() => {
        loadRecentSales();
    }, []);

    const handleProductSelect = (productId) => {
        setSelectedProduct(productId);
        const product = products.find(p => p.id === productId);
        if (product && quantity) {
            setAmount((product.price * parseInt(quantity)).toString());
        }
    };

    const handleQuantityChange = (value) => {
        setQuantity(value);
        if (selectedProduct && value) {
            const product = products.find(p => p.id === selectedProduct);
            if (product) {
                setAmount((product.price * parseInt(value)).toString());
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!billNumber.trim()) {
            setError('Bill number is required.');
            return;
        }

        const product = products.find((p) => p.id === selectedProduct);
        if (!product) {
            setError('Please select a product.');
            return;
        }

        setSaving(true);

        try {
            await adminApi.createSale({
                billNumber,
                productId: product.id,
                productName: product.name,
                quantity: Number(quantity),
                amount: Number(amount),
                saleDate
            });

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            setSelectedProduct('');
            setBillNumber('');
            setQuantity('');
            setAmount('');
            setSaleDate(new Date().toISOString().split('T')[0]);

            await loadRecentSales();
        } catch (saveError) {
            setError(saveError.message || 'Failed to record sale.');
        } finally {
            setSaving(false);
        }
    };

    const selectedProductData = products.find(p => p.id === selectedProduct);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Record Sales</h2>
                    <p className="admin-page-subtitle">Enter offline sales that happened in your shop</p>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="admin-alert admin-alert-success">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Sale recorded successfully!</span>
                </div>
            )}

            {/* Sales Entry Form */}
            <div className="admin-section">
                <div className="admin-section-header">
                    <h3 className="admin-section-title">Enter Sale Details</h3>
                </div>

                <form onSubmit={handleSubmit} className="admin-sales-form">
                    {error && (
                        <div className="error-message-banner" style={{ marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-step">
                        <div className="form-step-number">1</div>
                        <div className="form-step-content">
                            <label className="form-label">Bill Number (manual entry)</label>
                            <input
                                className="form-input form-input-lg"
                                value={billNumber}
                                onChange={(e) => setBillNumber(e.target.value.toUpperCase())}
                                placeholder="e.g., SK-2026-001"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-step">
                        <div className="form-step-number">2</div>
                        <div className="form-step-content">
                            <label className="form-label">Sale Date</label>
                            <input
                                type="date"
                                className="form-input form-input-lg"
                                value={saleDate}
                                onChange={(e) => setSaleDate(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    {/* Step 1: Select Product */}
                    <div className="form-step">
                        <div className="form-step-number">3</div>
                        <div className="form-step-content">
                            <label className="form-label">Which product was sold?</label>
                            <select
                                className="form-input form-input-lg"
                                value={selectedProduct}
                                onChange={(e) => handleProductSelect(e.target.value)}
                                required
                            >
                                <option value="">Select a product...</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - ₹{product.price.toLocaleString('en-IN')} ({product.stock} in stock)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Step 2: Enter Quantity */}
                    {selectedProduct && (
                        <div className="form-step">
                            <div className="form-step-number">4</div>
                            <div className="form-step-content">
                                <label className="form-label">How many were sold?</label>
                                <div className="quantity-input-group">
                                    <button
                                        type="button"
                                        className="quantity-btn"
                                        onClick={() => quantity && handleQuantityChange((parseInt(quantity) - 1).toString())}
                                        disabled={!quantity || parseInt(quantity) <= 1}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <input
                                        type="number"
                                        className="form-input quantity-input"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        min="1"
                                        max={selectedProductData?.stock}
                                        placeholder="0"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(quantity ? (parseInt(quantity) + 1).toString() : '1')}
                                        disabled={quantity && parseInt(quantity) >= selectedProductData?.stock}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                {selectedProductData && quantity && parseInt(quantity) > selectedProductData.stock && (
                                    <p className="form-hint form-hint-error">
                                        Not enough stock! Only {selectedProductData.stock} available
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Enter Amount */}
                    {quantity && (
                        <div className="form-step">
                            <div className="form-step-number">5</div>
                            <div className="form-step-content">
                                <label className="form-label">Total amount received</label>
                                <div className="amount-input-group">
                                    <span className="amount-symbol">₹</span>
                                    <input
                                        type="number"
                                        className="form-input amount-input"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        min="0"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                {selectedProductData && quantity && (
                                    <p className="form-hint">
                                        Suggested: ₹{(selectedProductData.price * parseInt(quantity)).toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    {quantity && amount && (
                        <div className="form-actions-centered">
                            <button type="submit" className="btn-primary btn-lg">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Save Sale
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Recent Sales */}
            {recentSales.length > 0 && (
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">Today's Sales</h3>
                    </div>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Bill #</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Review Status</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSales.map((sale) => (
                                    <tr key={sale._id}>
                                        <td>{new Date(sale.saleDate || sale.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>{sale.billNumber}</td>
                                        <td className="font-semibold">{sale.productName}</td>
                                        <td>{sale.quantity}</td>
                                        <td>
                                            <span className={`status-badge ${sale.hasBeenReviewed ? 'status-success' : 'status-warning'}`}>
                                                {sale.hasBeenReviewed ? 'Used' : 'Not Used'}
                                            </span>
                                        </td>
                                        <td className="text-success">₹{Number(sale.amount || 0).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSalesEntry;
