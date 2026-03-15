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
import ReviewSummary from '../components/public/ReviewSummary';
import ReviewList from '../components/public/ReviewList';
import ReviewModal from '../components/public/ReviewModal';
import QuoteModal from '../components/public/QuoteModal';
import { getProductById } from '../services/productService';
import Icons from '../components/common/Icons';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState('');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

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

    useEffect(() => {
        const fetchReviews = async () => {
            setReviewsLoading(true);
            setReviewsError('');
            try {
                const response = await fetch(`http://localhost:5000/api/reviews?productId=${encodeURIComponent(id)}`);
                const data = await response.json().catch(() => ({}));

                if (!response.ok || !data?.success) {
                    throw new Error(data?.message || 'Failed to load reviews');
                }

                const mapped = (data.reviews || []).map((item) => ({
                    id: item._id,
                    userName: item.userName,
                    rating: item.rating,
                    isVerified: true,
                    date: item.createdAt,
                    reviewText: item.reviewText,
                    images: item.images || [],
                    ownerReply: item.ownerReply || '',
                    helpfulCount: 0
                }));
                setReviews(mapped);
            } catch (loadError) {
                setReviewsError(loadError.message || 'Failed to load reviews');
                setReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    const handleReviewSubmitted = async () => {
        setIsReviewModalOpen(false);
        setReviewsError('Your review was submitted and is pending admin approval.');
        try {
            const response = await fetch(`http://localhost:5000/api/reviews?productId=${encodeURIComponent(id)}`);
            const data = await response.json().catch(() => ({}));
            if (response.ok && data?.success) {
                const mapped = (data.reviews || []).map((item) => ({
                    id: item._id,
                    userName: item.userName,
                    rating: item.rating,
                    isVerified: true,
                    date: item.createdAt,
                    reviewText: item.reviewText,
                    images: item.images || [],
                    ownerReply: item.ownerReply || '',
                    helpfulCount: 0
                }));
                setReviews(mapped);
            }
        } catch {
            // non-blocking refresh failure
        }
    };

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
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="product-image" />
                                    ) : (
                                        <span className="product-icon-large">{categoryIcon}</span>
                                    )}
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
                                    <button 
                                        onClick={() => setIsQuoteModalOpen(true)}
                                        className="btn btn-primary btn-lg"
                                    >
                                        <Icons.Email />
                                        Request Quote
                                    </button>
                                    <a href="tel:+917708644431" className="btn btn-secondary btn-lg">
                                        <Icons.Phone />
                                        Call Now
                                    </a>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} at Sekar Industries: ${window.location.href}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary btn-lg"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.25a.75.75 0 00.918.918l5.451-1.472A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.698-.508-5.24-1.396l-.374-.22-3.884 1.05 1.056-3.808-.242-.388A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                        </svg>
                                        Share on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Customer Reviews Section */}
                <section className="product-reviews-section">
                    <div className="container">
                        <div className="reviews-header">
                            <h2>Customer Reviews & Ratings</h2>
                            <button 
                                className="write-review-btn"
                                onClick={() => setIsReviewModalOpen(true)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Write a Verified Review
                            </button>
                        </div>
                        
                        <ReviewSummary reviews={reviews} />
                        {reviewsError && (
                            <p style={{ margin: '0.75rem 0', color: 'var(--primary)' }}>{reviewsError}</p>
                        )}
                        <ReviewList reviews={reviews} loading={reviewsLoading} />
                    </div>
                </section>

                <RelatedProducts currentProductId={product.id} category={product.category} />
            </main>

            {/* Review Modal */}
            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product.id}
                onReviewSubmitted={handleReviewSubmitted}
            />

            {/* Quote Modal */}
            <QuoteModal 
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                product={product}
            />

            <Footer />
        </div>
    );
};

export default ProductDetail;

