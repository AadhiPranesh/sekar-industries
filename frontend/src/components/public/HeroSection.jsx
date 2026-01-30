/**
 * Hero Section Component
 * Landing page hero with business identity
 */

import { Link } from 'react-router-dom';
import Icons from '../common/Icons';

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const HeroSection = ({ businessInfo }) => {
    const { stats, features } = businessInfo || {};

    const getIcon = (iconName) => {
        const IconComponent = Icons[iconName];
        return IconComponent ? <IconComponent /> : <Icons.Orders />;
    };

    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <StarIcon /> Trusted Since 1995
                        </div>
                        <h1 className="hero-title">
                            Quality Products,<br />
                            <span>Trusted Service</span>
                        </h1>
                        <p className="hero-description">
                            Your one-stop destination for industrial supplies, hardware, electrical
                            components, and more. Serving businesses and individuals with quality
                            products at competitive prices.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-accent btn-lg">
                                Browse Products
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <a href="#contact" className="btn btn-secondary btn-lg">
                                Contact Us
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </a>
                        </div>

                        {stats && (
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-value">{stats.yearsInBusiness}<span>+</span></div>
                                    <div className="stat-label">Years Experience</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{stats.productsAvailable}<span>+</span></div>
                                    <div className="stat-label">Products</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{(stats.happyCustomers / 1000).toFixed(0)}K<span>+</span></div>
                                    <div className="stat-label">Happy Customers</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hero-visual">
                        <div className="hero-card">
                            <div className="hero-features">
                                {features?.map((feature, index) => (
                                    <div key={index} className="hero-feature">
                                        <div className="hero-feature-icon">{getIcon(feature.icon)}</div>
                                        <div className="hero-feature-title">{feature.title}</div>
                                        <div className="hero-feature-desc">{feature.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

