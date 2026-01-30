/**
 * Admin Products Management
 * Simple interface for managing product inventory
 */

import { useState } from 'react';

const AdminProducts = () => {
    const [products, setProducts] = useState([
        { id: 'prod-001', name: 'Niwar Folding Cot', category: 'Woven & Folding', stock: 45, price: 2500, unit: 'piece' },
        { id: 'prod-002', name: 'Heavy Duty Folding Cot', category: 'Woven & Folding', stock: 32, price: 3200, unit: 'piece' },
        { id: 'prod-005', name: 'S-Type Visitor Chair', category: 'Steel Furniture', stock: 55, price: 1850, unit: 'piece' },
        { id: 'prod-013', name: 'Oval Top Dining Set', category: 'Dining Sets', stock: 8, price: 25500, unit: 'set' }
    ]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = ['All', 'Woven & Folding', 'Steel Furniture', 'Folding Tables', 'Dining Sets'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleStockUpdate = (productId, newStock) => {
        setProducts(products.map(p =>
            p.id === productId ? { ...p, stock: parseInt(newStock) } : p
        ));
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Manage Products</h2>
                    <p className="admin-page-subtitle">Update stock levels and product details</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowAddForm(true)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Product
                </button>
            </div>

            {/* Search and Filter */}
            <div className="admin-filters">
                <div className="admin-search">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-search-input"
                    />
                </div>

                <div className="admin-filter-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-tab ${filterCategory === cat ? 'active' : ''}`}
                            onClick={() => setFilterCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="admin-section">
                <div className="admin-section-header">
                    <h3 className="admin-section-title">
                        All Products ({filteredProducts.length})
                    </h3>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Current Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="font-semibold">{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price.toLocaleString('en-IN')}/{product.unit}</td>
                                    <td>
                                        <div className="stock-edit">
                                            <input
                                                type="number"
                                                value={product.stock}
                                                onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                                                className="stock-input"
                                                min="0"
                                            />
                                            <span className="stock-unit">{product.unit}s</span>
                                        </div>
                                    </td>
                                    <td>
                                        {product.stock === 0 ? (
                                            <span className="status-badge status-danger">Out of Stock</span>
                                        ) : product.stock <= 10 ? (
                                            <span className="status-badge status-warning">Low Stock</span>
                                        ) : (
                                            <span className="status-badge status-success">In Stock</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn-icon"
                                            onClick={() => console.log('Edit', product.id)}
                                            title="Edit product"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="admin-empty-state">
                        <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        <p>No products found</p>
                    </div>
                )}
            </div>

            {/* Add Product Form Modal */}
            {showAddForm && (
                <div className="admin-modal-overlay" onClick={() => setShowAddForm(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Add New Product</h3>
                            <button
                                className="btn-icon"
                                onClick={() => setShowAddForm(false)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <form className="admin-form">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" className="form-input" placeholder="Enter product name" />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select className="form-input">
                                        <option>Select category</option>
                                        <option>Woven & Folding</option>
                                        <option>Steel Furniture</option>
                                        <option>Folding Tables</option>
                                        <option>Dining Sets</option>
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price (₹)</label>
                                        <input type="number" className="form-input" placeholder="0" />
                                    </div>
                                    <div className="form-group">
                                        <label>Initial Stock</label>
                                        <input type="number" className="form-input" placeholder="0" />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Add Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
