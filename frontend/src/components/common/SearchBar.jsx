/**
 * SearchBar Component
 * Product search with autocomplete suggestions
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../../services/productService';

const SearchBar = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const searchDebounce = setTimeout(async () => {
            if (query.trim().length > 1) {
                setLoading(true);
                try {
                    const response = await searchProducts(query);
                    if (response.success) {
                        setResults(response.data.slice(0, 5));
                        setIsOpen(true);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(searchDebounce);
    }, [query]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        setQuery('');
        setIsOpen(false);
        onClose?.();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && results.length > 0) {
            handleProductClick(results[0].id);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            onClose?.();
        }
    };

    return (
        <div className="search-bar" ref={searchRef}>
            <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    aria-label="Search products"
                />
                {query && (
                    <button
                        className="search-clear"
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="search-dropdown" role="listbox" aria-label="Search results">
                    {loading ? (
                        <div className="search-loading" role="status" aria-live="polite">
                            <span className="loading-spinner" aria-hidden="true"></span>
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            {results.map((product) => (
                                <div
                                    key={product.id}
                                    className="search-result-item"
                                    onClick={() => handleProductClick(product.id)}
                                    role="option"
                                    tabIndex="0"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleProductClick(product.id);
                                        }
                                    }}
                                >
                                    <div className="search-result-info">
                                        <div className="search-result-name">{product.name}</div>
                                        <div className="search-result-category">{product.category}</div>
                                    </div>
                                    <div className="search-result-price">₹{product.price.toLocaleString('en-IN')}</div>
                                </div>
                            ))}
                            <div className="search-footer">
                                Press Enter to see all results
                            </div>
                        </>
                    ) : (
                        <div className="search-no-results" role="status">
                            No products found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
