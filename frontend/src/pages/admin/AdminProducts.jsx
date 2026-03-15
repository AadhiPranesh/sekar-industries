/**
 * Admin Products Management
 * Simple interface for managing product inventory
 */

import { useEffect, useState, useRef } from 'react';
import { adminApi } from '../../api/adminApi';

const AdminProducts = () => {
    const initialAddForm = {
        productId: '',
        name: '',
        category: 'Woven & Folding',
        description: '',
        price: '',
        unit: 'piece',
        stock: '',
        lowStockThreshold: '10',
        isFeatured: false,
        image: ''
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [addForm, setAddForm] = useState(initialAddForm);
    const [editForm, setEditForm] = useState(initialAddForm);
    const [addError, setAddError] = useState('');
    const [editError, setEditError] = useState('');
    const [addSaving, setAddSaving] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [editImageUploading, setEditImageUploading] = useState(false);
    const [imageFileName, setImageFileName] = useState('');
    const [editImageFileName, setEditImageFileName] = useState('');
    const [deletingProductId, setDeletingProductId] = useState('');
    const [editingProductId, setEditingProductId] = useState('');
    const stockTimeouts = useRef({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = ['All', 'Woven & Folding', 'Steel Furniture', 'Folding Tables', 'Dining Sets'];

    const loadProducts = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getProducts();
            setProducts(res.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProducts(); }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleStockChange = (productId, newStock) => {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: parseInt(newStock) || 0 } : p));
        // Debounce PATCH call
        clearTimeout(stockTimeouts.current[productId]);
        stockTimeouts.current[productId] = setTimeout(async () => {
            try {
                await adminApi.updateProduct(productId, { stock: parseInt(newStock) || 0 });
                setSuccess('Stock updated');
                setTimeout(() => setSuccess(''), 2000);
            } catch (err) {
                setError(err.message || 'Failed to update stock');
                setTimeout(() => setError(''), 3000);
            }
        }, 800);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setAddError('');
        if (!addForm.productId || !addForm.name || !addForm.price || !addForm.stock) {
            setAddError('Product ID, name, price and stock are required.');
            return;
        }
        setAddSaving(true);
        try {
            const res = await adminApi.createProduct({
                ...addForm,
                price: Number(addForm.price),
                stock: Number(addForm.stock),
                lowStockThreshold: Number(addForm.lowStockThreshold) || 10
            });
            setProducts(prev => [...prev, res.data]);
            setShowAddForm(false);
            setAddForm(initialAddForm);
            setImageFileName('');
            setSuccess('Product added successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setAddError(err.message || 'Failed to add product');
        } finally {
            setAddSaving(false);
        }
    };

    const openEditForm = (product) => {
        setEditError('');
        setEditingProductId(product.id);
        setEditImageFileName('');
        setEditForm({
            productId: product.productId || '',
            name: product.name || '',
            category: product.category || 'Woven & Folding',
            description: product.description || '',
            price: String(product.price ?? ''),
            unit: product.unit || 'piece',
            stock: String(product.stock ?? ''),
            lowStockThreshold: String(product.lowStockThreshold ?? 10),
            isFeatured: Boolean(product.isFeatured),
            image: product.image || ''
        });
        setShowEditForm(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError('');

        if (!editForm.name || !editForm.category || !editForm.price) {
            setEditError('Product name, category and price are required.');
            return;
        }

        setEditSaving(true);
        try {
            const res = await adminApi.updateProduct(editingProductId, {
                name: editForm.name,
                category: editForm.category,
                description: editForm.description,
                price: Number(editForm.price),
                unit: editForm.unit,
                stock: Number(editForm.stock) || 0,
                lowStockThreshold: Number(editForm.lowStockThreshold) || 10,
                isFeatured: Boolean(editForm.isFeatured),
                image: editForm.image
            });

            setProducts((prev) => prev.map((p) => (p.id === editingProductId ? res.data : p)));
            setShowEditForm(false);
            setEditingProductId('');
            setSuccess('Product updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setEditError(err.message || 'Failed to update product');
        } finally {
            setEditSaving(false);
        }
    };

    const handleEditLocalImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setEditError('');
        setEditImageUploading(true);
        setEditImageFileName(file.name);

        try {
            const uploadRes = await adminApi.uploadProductImage(file);
            const finalUrl = uploadRes.imageUrl?.startsWith('http')
                ? uploadRes.imageUrl
                : `http://localhost:5000${uploadRes.imageUrl}`;

            setEditForm((prev) => ({ ...prev, image: finalUrl }));
        } catch (err) {
            setEditError(err.message || 'Image upload failed');
            setEditImageFileName('');
        } finally {
            setEditImageUploading(false);
            event.target.value = '';
        }
    };

    const handleLocalImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setAddError('');
        setImageUploading(true);
        setImageFileName(file.name);

        try {
            const uploadRes = await adminApi.uploadProductImage(file);
            const finalUrl = uploadRes.imageUrl?.startsWith('http')
                ? uploadRes.imageUrl
                : `http://localhost:5000${uploadRes.imageUrl}`;

            setAddForm((prev) => ({ ...prev, image: finalUrl }));
        } catch (err) {
            setAddError(err.message || 'Image upload failed');
            setImageFileName('');
        } finally {
            setImageUploading(false);
            event.target.value = '';
        }
    };

    const handleDeleteProduct = async (product) => {
        const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
        if (!confirmed) return;

        setDeletingProductId(product.id);
        setError('');

        try {
            await adminApi.deleteProduct(product.id);
            setProducts((prev) => prev.filter((p) => p.id !== product.id));
            setSuccess('Product deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete product');
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingProductId('');
        }
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

            {success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}><span>{success}</span></div>}
            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><span>{error}</span></div>}

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
                        All Products ({loading ? '...' : filteredProducts.length})
                    </h3>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading products...</div>
                ) : (
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
                                                onChange={(e) => handleStockChange(product.id, e.target.value)}
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button
                                                className="btn-icon"
                                                onClick={() => openEditForm(product)}
                                                title="Edit product"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleDeleteProduct(product)}
                                                title="Delete product"
                                                disabled={deletingProductId === product.id}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h.293l.853 10.243A2 2 0 006.14 18h7.72a2 2 0 001.994-1.757L16.707 6H17a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 3V4h4v1H8zm-1 3a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 10-2 0v6a1 1 0 102 0V7z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}

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
                            <form className="admin-form" onSubmit={handleAddSubmit}>
                                {addError && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><span>{addError}</span></div>}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Product ID *</label>
                                        <input type="text" className="form-input" placeholder="e.g. prod-024" value={addForm.productId} onChange={e => setAddForm(f => ({ ...f, productId: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Unit</label>
                                        <select className="form-input" value={addForm.unit} onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))}>
                                            <option value="piece">piece</option>
                                            <option value="set">set</option>
                                            <option value="pair">pair</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input type="text" className="form-input" placeholder="Enter product name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select className="form-input" value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}>
                                        <option>Woven & Folding</option>
                                        <option>Steel Furniture</option>
                                        <option>Wooden Furniture</option>
                                        <option>Dining Sets</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <input type="text" className="form-input" placeholder="Short description" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price (₹) *</label>
                                        <input type="number" className="form-input" placeholder="0" min="0" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Initial Stock *</label>
                                        <input type="number" className="form-input" placeholder="0" min="0" value={addForm.stock} onChange={e => setAddForm(f => ({ ...f, stock: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Low Stock Alert At</label>
                                        <input type="number" className="form-input" placeholder="10" min="1" value={addForm.lowStockThreshold} onChange={e => setAddForm(f => ({ ...f, lowStockThreshold: e.target.value }))} />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                                        <input type="checkbox" id="isFeatured" checked={addForm.isFeatured} onChange={e => setAddForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                                        <label htmlFor="isFeatured">Featured Product</label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Upload Image (from local device)</label>
                                    <input type="file" className="form-input" accept="image/*" onChange={handleLocalImageUpload} disabled={imageUploading} />
                                    {imageUploading && <small>Uploading image...</small>}
                                    {!imageUploading && imageFileName && <small>Uploaded: {imageFileName}</small>}
                                </div>
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input type="text" className="form-input" placeholder="https://..." value={addForm.image} onChange={e => setAddForm(f => ({ ...f, image: e.target.value }))} />
                                    {addForm.image && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <img src={addForm.image} alt="Product preview" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                                        </div>
                                    )}
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={addSaving}>
                                        {addSaving ? 'Adding...' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Form Modal */}
            {showEditForm && (
                <div className="admin-modal-overlay" onClick={() => setShowEditForm(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Edit Product</h3>
                            <button
                                className="btn-icon"
                                onClick={() => setShowEditForm(false)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <form className="admin-form" onSubmit={handleEditSubmit}>
                                {editError && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><span>{editError}</span></div>}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Product ID</label>
                                        <input type="text" className="form-input" value={editForm.productId} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Unit</label>
                                        <select className="form-input" value={editForm.unit} onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}>
                                            <option value="piece">piece</option>
                                            <option value="set">set</option>
                                            <option value="pair">pair</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input type="text" className="form-input" placeholder="Enter product name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select className="form-input" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                                        <option>Woven & Folding</option>
                                        <option>Steel Furniture</option>
                                        <option>Wooden Furniture</option>
                                        <option>Dining Sets</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <input type="text" className="form-input" placeholder="Short description" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price (₹) *</label>
                                        <input type="number" className="form-input" placeholder="0" min="0" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock</label>
                                        <input type="number" className="form-input" placeholder="0" min="0" value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Low Stock Alert At</label>
                                        <input type="number" className="form-input" placeholder="10" min="1" value={editForm.lowStockThreshold} onChange={e => setEditForm(f => ({ ...f, lowStockThreshold: e.target.value }))} />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                                        <input type="checkbox" id="editIsFeatured" checked={editForm.isFeatured} onChange={e => setEditForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                                        <label htmlFor="editIsFeatured">Featured Product</label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Upload Image (from local device)</label>
                                    <input type="file" className="form-input" accept="image/*" onChange={handleEditLocalImageUpload} disabled={editImageUploading} />
                                    {editImageUploading && <small>Uploading image...</small>}
                                    {!editImageUploading && editImageFileName && <small>Uploaded: {editImageFileName}</small>}
                                </div>
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input type="text" className="form-input" placeholder="https://..." value={editForm.image} onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))} />
                                    {editForm.image && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <img src={editForm.image} alt="Product preview" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                                        </div>
                                    )}
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowEditForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={editSaving}>
                                        {editSaving ? 'Saving...' : 'Save Changes'}
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
