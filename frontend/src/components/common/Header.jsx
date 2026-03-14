/**
 * Header Component
 * Main navigation header with logo and menu
 */

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Header = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [requestSummary, setRequestSummary] = useState({ total: 0, open: 0, closed: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check for logged-in user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const loadRequestSummary = async () => {
            if (!user) {
                setRequestSummary({ total: 0, open: 0, closed: 0 });
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/requests/my/summary', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    setRequestSummary({ total: 0, open: 0, closed: 0 });
                    return;
                }

                const data = await response.json().catch(() => ({}));
                if (data?.success && data?.summary) {
                    setRequestSummary(data.summary);
                }
            } catch (error) {
                setRequestSummary({ total: 0, open: 0, closed: 0 });
            }
        };

        loadRequestSummary();
    }, [user]);

    // Close mobile menu when clicking on a link
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSearchOpen && !event.target.closest('.header-search')) {
                setIsSearchOpen(false);
            }
            if (isProfileOpen && !event.target.closest('.profile-menu')) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSearchOpen, isProfileOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                localStorage.removeItem('user');
                setUser(null);
                setIsProfileOpen(false);
                navigate('/');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <div className="logo-icon">SI</div>
                        <div className="logo-text">
                            Sekar<span>Industries</span>
                        </div>
                    </Link>

                    <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/products"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            Products
                        </NavLink>
                        <NavLink
                            to="/categories"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            Categories
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            Contact
                        </NavLink>
                    </nav>

                    <div className="header-actions">
                        {user ? (
                            <div className="profile-menu">
                                <button 
                                    className="profile-btn"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    title={user.name}
                                >
                                    <span className="profile-name">{user.name}</span>
                                    <span className="profile-request-count">{requestSummary.total}</span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                    </svg>
                                </button>

                                {isProfileOpen && (
                                    <div className="profile-dropdown">
                                        <div className="profile-header">
                                            <h4>{user.name}</h4>
                                            <p>{user.email}</p>
                                        </div>
                                        <div className="profile-actions">
                                            <Link to="/my-requests" className="profile-link" onClick={() => setIsProfileOpen(false)}>
                                                My Requests ({requestSummary.total})
                                            </Link>
                                            <div className="profile-link profile-link-summary">
                                                Open: {requestSummary.open} | Closed: {requestSummary.closed}
                                            </div>
                                            <button className="profile-link logout-btn" onClick={handleLogout}>
                                                🚪 Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary btn-sm">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-primary btn-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                        
                        <button
                            className={`search-toggle-btn ${isSearchOpen ? 'active' : ''}`}
                            onClick={toggleSearch}
                            aria-label="Toggle search"
                            aria-expanded={isSearchOpen}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <button
                            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

                {isSearchOpen && (
                    <div className="header-search">
                        <SearchBar onClose={() => setIsSearchOpen(false)} />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
