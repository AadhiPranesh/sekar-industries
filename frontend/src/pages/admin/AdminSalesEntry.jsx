/**
 * Admin Sales Entry
 * Simple form to record offline shop sales
 */

import { useState } from 'react';

const AdminSalesEntry = () => {
    // TODO: Replace with API fetch
    const [products] = useState([
        { id: 'prod-001', name: 'Niwar Folding Cot', price: 2500, stock: 45 },
        { id: 'prod-002', name: 'Heavy Duty Folding Cot', price: 3200, stock: 32 },
        { id: 'prod-005', name: 'S-Type Visitor Chair', price: 1850, stock: 55 },
        { id: 'prod-013', name: 'Oval Top Dining Set', price: 25500, stock: 8 }
    ]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    // TODO: Replace with API fetch
    const [recentSales] = useState([
        { id: 1, product: 'S-Type Visitor Chair', quantity: 4, amount: 7400, time: '2:45 PM' },
        { id: 2, product: 'Niwar Folding Cot', quantity: 2, amount: 5000, time: '1:20 PM' }
    ]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Submit to API
        console.log({ selectedProduct, quantity, amount });

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        // Reset form
        setSelectedProduct('');
        setQuantity('');
        setAmount('');
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
                    {/* Step 1: Select Product */}
                    <div className="form-step">
                        <div className="form-step-number">1</div>
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
                            <div className="form-step-number">2</div>
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
                            <div className="form-step-number">3</div>
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
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td>{sale.time}</td>
                                        <td className="font-semibold">{sale.product}</td>
                                        <td>{sale.quantity}</td>
                                        <td className="text-success">₹{sale.amount.toLocaleString('en-IN')}</td>
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
