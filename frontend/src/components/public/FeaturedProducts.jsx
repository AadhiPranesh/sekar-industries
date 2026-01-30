/**
 * Featured Products Component
 * Displays featured products carousel on homepage
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const FeaturedProducts = ({ products, loading }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const featuredShowcase = [
        {
            title: "Heavy Duty Folding Cots",
            description: "Portable and durable cots with high-strength woven surface",
            image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=500&fit=crop",
            category: "Woven & Folding",
            link: "/products?category=Woven%20%26%20Folding"
        },
        {
            title: "Premium S-Type Chairs",
            description: "Steel-framed visitor chairs with superior comfort and durability",
            image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=500&fit=crop",
            category: "Steel Furniture",
            link: "/products?category=Steel%20Furniture"
        },
        {
            title: "Signature Oval Dining Sets",
            description: "Manufacturer Exclusive - Handcrafted wooden dining sets",
            image: "https://ik.imagekit.io/2xkwa8s1i/img/npl_raw_images/WSFA_M/WSFACRO1FMMG/WSFACRO1FMMG_1.jpg?tr=w-1200",
            category: "Dining Sets",
            badge: "EXCLUSIVE",
            link: "/products?category=Dining%20Sets"
        }
    ];

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlay) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % featuredShowcase.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlay, featuredShowcase.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % featuredShowcase.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + featuredShowcase.length) % featuredShowcase.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    return (
        <section className="section featured-section">
            <div className="container">
                {/* Hero Carousel */}
                <div className="featured-carousel">
                    <div className="carousel-container">
                        {featuredShowcase.map((item, index) => (
                            <div
                                key={index}
                                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                            >
                                <div className="carousel-image-wrapper">
                                    <div
                                        className="carousel-image"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        {item.badge && (
                                            <div className="exclusive-badge">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                                {item.badge}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="carousel-content">
                                    <span className="carousel-category">{item.category}</span>
                                    <h2 className="carousel-title">{item.title}</h2>
                                    <p className="carousel-description">{item.description}</p>
                                    <Link to={item.link} className="carousel-btn">
                                        Explore Collection
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide} aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide} aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    {/* Dots Indicator */}
                    <div className="carousel-dots">
                        {featuredShowcase.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="section-header" style={{ marginTop: 'var(--space-16)' }}>
                    <h2 className="section-title">All Featured Products</h2>
                    <p className="section-subtitle">
                        Browse our complete collection of furniture and accessories
                    </p>
                </div>

                {loading ? (
                    <div className="loading-grid">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="loading-card">
                                <div className="loading-image skeleton"></div>
                                <div className="loading-content">
                                    <div className="loading-line skeleton short"></div>
                                    <div className="loading-line skeleton"></div>
                                    <div className="loading-line skeleton shorter"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="featured-grid">
                            {products?.filter(p => p.isFeatured).slice(0, 8).map((product, index) => (
                                <ProductCard key={product.id} product={product} style={{ animationDelay: `${index * 0.1}s` }} />
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link to="/products" className="view-all-link">
                                View All Products
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
