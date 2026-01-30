/**
 * Footer Component
 * Site footer with company info and links
 */

import { Link } from 'react-router-dom';
import Icons from './Icons';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Link to="/" className="logo">
                            <div className="logo-icon">SI</div>
                            <div className="logo-text">
                                Sekar<span>Industries</span>
                            </div>
                        </Link>
                        <p>
                            Your trusted partner for quality industrial supplies, hardware,
                            and electrical components since 1995.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/" className="footer-link">Home</Link>
                            <Link to="/products" className="footer-link">Products</Link>
                            <Link to="/about" className="footer-link">About Us</Link>
                            <a href="#contact" className="footer-link">Contact</a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Categories</h4>
                        <div className="footer-links">
                            <Link to="/products?category=Electrical" className="footer-link">Electrical</Link>
                            <Link to="/products?category=Hardware" className="footer-link">Hardware</Link>
                            <Link to="/products?category=Plumbing" className="footer-link">Plumbing</Link>
                            <Link to="/products?category=Paints" className="footer-link">Paints</Link>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <div className="footer-links">
                            <span className="footer-link contact-footer-item">
                                <Icons.Location /> Chennai, India
                            </span>
                            <span className="footer-link contact-footer-item">
                                <Icons.Phone /> +91 98765 43210
                            </span>
                            <span className="footer-link contact-footer-item">
                                <Icons.Email /> info@sekarindustries.com
                            </span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} Sekar Industries. All rights reserved.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-btn" aria-label="Facebook">
                            <Icons.Facebook />
                        </a>
                        <a href="#" className="social-btn" aria-label="Instagram">
                            <Icons.Instagram />
                        </a>
                        <a href="#" className="social-btn" aria-label="WhatsApp">
                            <Icons.WhatsApp />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

