/**
 * Product Detail Page
 * Detailed product information with related products
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import AvailabilityBadge from '../components/public/AvailabilityBadge';
import RelatedProducts from '../components/public/RelatedProducts';
import { getProductById } from '../services/productService';
import Icons from '../components/common/Icons';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getProductById(id);

                if (response.success && response.data) {
                    setProduct(response.data);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const breadcrumbItems = product ? [
        { label: 'Products', link: '/products' },
        { label: product.category, link: `/products?category=${product.category}` },
        { label: product.name }
    ] : [];

    // Category icons mapping
    const categoryIcons = {
        'Electrical': <Icons.Electrical />,
        'Hardware': <Icons.Hardware />,
        'Plumbing': <Icons.Plumbing />,
        'Paints': <Icons.Paints />,
        'Safety': <Icons.Safety />,
        'Adhesives': <Icons.Adhesives />
    };

    if (loading) {
        return (
            <div className="page product-detail-page">
                <Header />
                <main>
                    <div className="container">
                        <div className="product-detail-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading product details...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="page product-detail-page">
                <Header />
                <main>
                    <div className="container">
                        <div className="product-error">
                            <h1>Product Not Found</h1>
                            <p>{error || 'The product you are looking for does not exist.'}</p>
                            <Link to="/products" className="btn btn-primary">
                                Browse All Products
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const categoryIcon = categoryIcons[product.category] || <Icons.Orders />;

    return (
        <div className="page product-detail-page">
            <Header />

            <main>
                <div className="product-detail-header">
                    <div className="container">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <section className="product-detail-section">
                    <div className="container">
                        <div className="product-detail-content">
                            <div className="product-detail-image">
                                <div className="product-image-main">
                                    <span className="product-icon-large">{categoryIcon}</span>
                                </div>
                                <div className="product-detail-badge">
                                    <AvailabilityBadge availability={product.availability} />
                                </div>
                            </div>

                            <div className="product-detail-info">
                                <div className="product-detail-category">
                                    <Link to={`/products?category=${product.category}`}>
                                        {product.category}
                                    </Link>
                                </div>

                                <h1 className="product-detail-name">{product.name}</h1>

                                <div className="product-detail-price">
                                    <span className="price-amount">₹{product.price.toLocaleString('en-IN')}</span>
                                    <span className="price-unit">/ {product.unit}</span>
                                </div>

                                <div className="product-detail-description">
                                    <h3>Product Description</h3>
                                    <p>{product.description}</p>
                                </div>

                                <div className="product-detail-specs">
                                    <h3>Product Details</h3>
                                    <div className="specs-grid">
                                        <div className="spec-item">
                                            <span className="spec-label">Category</span>
                                            <span className="spec-value">{product.category}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Unit</span>
                                            <span className="spec-value">{product.unit}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Stock Status</span>
                                            <span className="spec-value">
                                                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                                            </span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Product ID</span>
                                            <span className="spec-value">{product.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-detail-actions">
                                    <a href="#contact" className="btn btn-primary btn-lg">
                                        <Icons.Email />
                                        Request Quote
                                    </a>
                                    <a href="tel:+919876543210" className="btn btn-secondary btn-lg">
                                        <Icons.Phone />
                                        Call Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <RelatedProducts currentProductId={product.id} category={product.category} />
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;

