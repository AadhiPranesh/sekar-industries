/**
 * Combo Offers Component
 * Displays special combo deals pairing best-sellers with slower-moving products
 */

import { useState, useEffect } from 'react';
import { getComboOffers } from '../../services/comboService';
import LoadingSpinner from '../common/LoadingSpinner';
import { mockProducts } from '../../data/mockProducts';

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

const ComboOffers = () => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        <h2 className="section-title">🎁 Special Combo Offers</h2>
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
                        <h2 className="section-title">🎁 Special Combo Offers</h2>
                        <p className="section-subtitle">
                            No combo offers available at the moment
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="combo-offers-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">🎁 Special Combo Offers</h2>
                    <p className="section-subtitle">
                        Get our best deals! Save 10% when you bundle these products together
                    </p>
                </div>

                <div className="combo-grid">
                    {combos.map((combo) => (
                        <div key={combo.combo_id} className="combo-card">
                            <div className="combo-badge">
                                <span className="discount-badge">Save ₹{combo.discount}</span>
                            </div>
                            
                            <div className="combo-header">
                                <h3 className="combo-title">Combo Deal #{combo.combo_id}</h3>
                            </div>

                            <div className="combo-products">
                                <div className="combo-product-item">
                                    <img
                                        src={getProductImage(combo.product_1_id)}
                                        alt={combo.product_1}
                                        className="combo-product-image"
                                        onError={(e) => handleImageError(e, combo.product_1_id, combo.product_1_category, combo.product_1)}
                                    />
                                    <div className="combo-product-details">
                                        <h4 className="combo-product-name">{combo.product_1}</h4>
                                        <p className="combo-product-price">₹{combo.product_1_price.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="plus-icon">+</div>

                                <div className="combo-product-item">
                                    <img
                                        src={getProductImage(combo.product_2_id)}
                                        alt={combo.product_2}
                                        className="combo-product-image"
                                        onError={(e) => handleImageError(e, combo.product_2_id, combo.product_2_category, combo.product_2)}
                                    />
                                    <div className="combo-product-details">
                                        <h4 className="combo-product-name">{combo.product_2}</h4>
                                        <p className="combo-product-price">₹{combo.product_2_price.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="combo-pricing">
                                <div className="original-price">
                                    <span className="label">Regular Price:</span>
                                    <span className="price strikethrough">
                                        ₹{(combo.product_1_price + combo.product_2_price).toLocaleString()}
                                    </span>
                                </div>
                                <div className="combo-price">
                                    <span className="label">Combo Price:</span>
                                    <span className="price highlight">
                                        ₹{combo.combo_price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button className="btn-combo">
                                Get This Combo
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ComboOffers;
