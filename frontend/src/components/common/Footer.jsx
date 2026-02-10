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
                            <Link to="/products?category=Woven%20%26%20Folding" className="footer-link">Woven & Folding</Link>
                            <Link to="/products?category=Steel%20Furniture" className="footer-link">Steel Furniture</Link>
                            <Link to="/products?category=Wooden%20Furniture" className="footer-link">Wooden Furniture</Link>
                            <Link to="/products?category=Dining%20Sets" className="footer-link">Dining Sets</Link>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <div className="footer-links">
                            <span className="footer-link contact-footer-item">
                                <Icons.Location /> Perundurai Road, Erode
                            </span>
                            <a href="tel:+919876543210" className="footer-link contact-footer-item">
                                <Icons.Phone /> +91 98765 43210
                            </a>
                            <a href="mailto:info@sekarindustries.com" className="footer-link contact-footer-item">
                                <Icons.Email /> info@sekarindustries.com
                            </a>
                        </div>
                        <div className="social-links footer-social">
                            <a href="#" className="social-btn" aria-label="Facebook" title="Follow us on Facebook">
                                <Icons.Facebook />
                            </a>
                            <a href="#" className="social-btn" aria-label="Instagram" title="Follow us on Instagram">
                                <Icons.Instagram />
                            </a>
                            <a href="https://wa.me/919876543210" className="social-btn" aria-label="WhatsApp" title="Chat on WhatsApp">
                                <Icons.WhatsApp />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} Sekar Industries. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

