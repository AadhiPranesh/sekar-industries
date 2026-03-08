/**
 * Combo Offers Component (2026 Premium Edition)
 * Displays special combo deals with glassmorphism, micro-interactions & AR integration
 */

import { useState, useEffect } from 'react';
import { getComboOffers } from '../../services/comboService';
import LoadingSpinner from '../common/LoadingSpinner';
import { mockProducts } from '../../data/mockProducts';
import QuoteModal from './QuoteModal';

// Use product-specific local images from frontend/public/images/products
const getProductImage = (productId) => `/images/products/${productId}.jpg`;

const getMockImageByName = (productName) => {
    const match = mockProducts.find((item) => item.name === productName);
    return match?.image || null;
};

const handleImageError = (e, productId, category, productName) => {
    const currentStage = e.currentTarget.dataset.stage || 'jpg';

    if (currentStage === 'jpg') {
        e.currentTarget.dataset.stage = 'png';
        e.currentTarget.src = `/images/products/${productId}.png`;
        return;
    }

    if (currentStage === 'png') {
        const mockImage = getMockImageByName(productName);
        if (mockImage) {
            e.currentTarget.dataset.stage = 'mock';
            e.currentTarget.src = mockImage;
            return;
        }
    }

    e.currentTarget.src = getFallbackImage(category);
};

const getFallbackImage = (category) => {
    const categoryFallback = {
        Bed: '/images/warehouse.jpg',
        Chair: '/images/warehouse.png',
        Dining: '/images/warehouse.jpg',
        Table: '/images/warehouse.png',
        Medical: '/images/warehouse.jpg'
    };

    return categoryFallback[category] || '/images/warehouse.jpg';
};

const GiftIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D473E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"></polyline>
        <rect x="2" y="7" width="20" height="5"></rect>
        <path d="M12 9V2M7 7h10"></path>
    </svg>
);

const calculateSavingsPercentage = (originalPrice, comboPrice) => {
    return Math.round(((originalPrice - comboPrice) / originalPrice) * 100);
};

const ComboOffers = () => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cardMousePos, setCardMousePos] = useState({});
    const [selectedCombo, setSelectedCombo] = useState(null);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                setLoading(true);
                console.log('Fetching combo offers...');
                const response = await getComboOffers();
                console.log('Combo response:', response);
                
                if (response.success) {
                    setCombos(response.data);
                    console.log('Combos set:', response.data);
                } else {
                    setError(response.message);
                    console.error('Combo fetch failed:', response.message);
                }
            } catch (err) {
                setError('Failed to load combo offers');
                console.error('Combo fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCombos();
    }, []);

    if (loading) {
        return (
            <section className="combo-offers-section">
                <div className="container">
                    <LoadingSpinner />
                </div>
            </section>
        );
    }

    if (error) {
        console.log('Combo error state:', error);
        return (
            <section className="combo-offers-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-icon"><GiftIcon /></div>
                        <h2 className="section-title">Special Combo Offers</h2>
                        <p className="section-subtitle" style={{color: 'red'}}>
                            {error} - Please check if the backend is running at http://localhost:8000
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (combos.length === 0) {
        return (
            <section className="combo-offers-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-icon"><GiftIcon /></div>
                        <h2 className="section-title">Special Combo Offers</h2>
                        <p className="section-subtitle">
                            No combo offers available at the moment
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const handleCardMouseMove = (e, comboId) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCardMousePos({ ...cardMousePos, [comboId]: { x, y, width: rect.width, height: rect.height } });
    };

    const handleCardMouseLeave = (comboId) => {
        const newPos = { ...cardMousePos };
        delete newPos[comboId];
        setCardMousePos(newPos);
    };

    return (
        <>
        <section className="combo-offers-section">
            <div className="container">
                <div className="section-header">
                    <div className="section-icon"><GiftIcon /></div>
                    <h2 className="section-title">Special Combo Offers</h2>
                    <p className="section-subtitle">
                        Get our best deals! Save up to 15% when you bundle these products together
                    </p>
                </div>

                <div className="combo-grid">
                    {combos.map((combo, idx) => {
                        const originalPrice = combo.product_1_price + combo.product_2_price;
                        const savingsAmount = originalPrice - combo.combo_price;
                        const savingsPercent = calculateSavingsPercentage(originalPrice, combo.combo_price);
                        
                        return (
                        <div 
                            key={combo.combo_id} 
                            className={`combo-card ${idx === 0 ? 'featured' : ''}`}
                            onMouseMove={(e) => handleCardMouseMove(e, combo.combo_id)}
                            onMouseLeave={() => handleCardMouseLeave(combo.combo_id)}
                            style={cardMousePos[combo.combo_id] ? {
                                '--mouse-x': `${cardMousePos[combo.combo_id].x}px`,
                                '--mouse-y': `${cardMousePos[combo.combo_id].y}px`,
                            } : {}}
                        >
                            <div className="combo-badge-container">
                                <div className="savings-badge">
                                    <span className="savings-label">Save</span>
                                    <span className="savings-amount">₹{savingsAmount}</span>
                                </div>
                                <div className="limited-badge">
                                    <span className="pulse-dot"></span>
                                    Limited Time
                                </div>
                            </div>
                            
                            <div className="combo-header">
                                <h3 className="combo-title">Combo Deal #{combo.combo_id}</h3>
                                <span className="combo-items-count">2 Items Bundle</span>
                            </div>

                            <div className="combo-products">
                                <div className="combo-product-item">
                                    <div className="combo-product-image-wrap">
                                        <img
                                            src={getProductImage(combo.product_1_id)}
                                            alt={combo.product_1}
                                            className="combo-product-image"
                                            onError={(e) => handleImageError(e, combo.product_1_id, combo.product_1_category, combo.product_1)}
                                        />
                                        <span className="product-category-badge">{combo.product_1_category}</span>
                                    </div>
                                    <div className="combo-product-details">
                                        <h4 className="combo-product-name">{combo.product_1}</h4>
                                        <p className="combo-product-price">₹{combo.product_1_price.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="plus-icon-wrap">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>

                                <div className="combo-product-item">
                                    <div className="combo-product-image-wrap">
                                        <img
                                            src={getProductImage(combo.product_2_id)}
                                            alt={combo.product_2}
                                            className="combo-product-image"
                                            onError={(e) => handleImageError(e, combo.product_2_id, combo.product_2_category, combo.product_2)}
                                        />
                                        <span className="product-category-badge">{combo.product_2_category}</span>
                                    </div>
                                    <div className="combo-product-details">
                                        <h4 className="combo-product-name">{combo.product_2}</h4>
                                        <p className="combo-product-price">₹{combo.product_2_price.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="combo-pricing">
                                <div className="price-row original-price">
                                    <span className="label">Regular Price:</span>
                                    <span className="price strikethrough">
                                        ₹{originalPrice.toLocaleString()}
                                    </span>
                                </div>
                                <div className="price-row combo-price">
                                    <span className="label">Combo Price:</span>
                                    <span className="price highlight">
                                        ₹{combo.combo_price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="combo-actions">
                                <button className="btn-combo" onClick={() => setSelectedCombo({
                                    id: combo.combo_id,
                                    name: `Combo Deal #${combo.combo_id} — ${combo.product_1} + ${combo.product_2}`,
                                    price: `₹${combo.combo_price.toLocaleString()} (combo price, save ₹${savingsAmount})`,
                                    unit: 'set'
                                })}>
                                    <span>Get This Combo</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
                                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </section>

        <QuoteModal
            isOpen={!!selectedCombo}
            onClose={() => setSelectedCombo(null)}
            product={selectedCombo}
        />
        </>
    );
};

export default ComboOffers;
