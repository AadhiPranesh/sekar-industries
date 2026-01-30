/**
 * Product Card Component
 * Individual product display card
 */

import { Link } from 'react-router-dom';
import AvailabilityBadge from './AvailabilityBadge';
import Icons from '../common/Icons';

// Category icons mapping
const categoryIcons = {
    'Woven & Folding': '🛏️',
    'Steel Furniture': '🪑',
    'Folding Tables': '📋',
    'Dining Sets': '🍽️',
    'Electrical': <Icons.Electrical />,
    'Hardware': <Icons.Hardware />,
    'Plumbing': <Icons.Plumbing />,
    'Paints': <Icons.Paints />,
    'Safety': <Icons.Safety />,
    'Adhesives': <Icons.Adhesives />
};

const ProductCard = ({ product, style }) => {
    const {
        id,
        name,
        category,
        description,
        price,
        unit,
        availability,
        isExclusive,
        image
    } = product;

    const categoryIcon = categoryIcons[category] || <Icons.Orders />;

    return (
        <Link to={`/product/${id}`} className="product-card" style={style}>
            <div className="product-image">
                {image ? (
                    <img src={image} alt={name} className="product-img" />
                ) : (
                    <span className="product-icon-wrap">
                        {typeof categoryIcon === 'string' ? (
                            <span style={{ fontSize: '3rem' }}>{categoryIcon}</span>
                        ) : (
                            categoryIcon
                        )}
                    </span>
                )}
                {isExclusive && (
                    <div className="manufacturer-exclusive-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>Exclusive</span>
                    </div>
                )}
                <div className="product-badge">
                    <AvailabilityBadge availability={availability} />
                </div>
            </div>

            <div className="product-info">
                <div className="product-category">{category}</div>
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>

                <div className="product-footer">
                    <div className="product-price">
                        ₹{price.toLocaleString('en-IN')}
                        <span>/{unit}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;

