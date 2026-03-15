/**
 * NotFound Page
 * 404 error page
 */

import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Icons from '../components/common/Icons';

const NotFound = () => {
    const HomeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
    );

    return (
        <div className="page not-found-page">
            <Header />

            <main>
                <section className="not-found-section">
                    <div className="container">
                        <div className="not-found-content">
                            <div className="not-found-icon">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="not-found-title">404</h1>
                            <h2 className="not-found-subtitle">Page Not Found</h2>
                            <p className="not-found-description">
                                Sorry, we couldn't find the page you're looking for.
                                The page might have been moved or doesn't exist.
                            </p>
                            <div className="not-found-actions">
                                <Link to="/" className="btn btn-primary btn-lg">
                                    <HomeIcon />
                                    Back to Home
                                </Link>
                                <Link to="/products" className="btn btn-secondary btn-lg">
                                    Browse Products
                                </Link>
                            </div>
                            <div className="not-found-links">
                                <p>You might be interested in:</p>
                                <div className="quick-links">
                                    <Link to="/categories">Categories</Link>
                                    <Link to="/about">About Us</Link>
                                    <a href="#contact">Contact</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default NotFound;

