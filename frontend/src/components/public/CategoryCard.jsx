/**
 * CategoryCard Component
 * Category display card with icon and product count
 */

import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    const { id, name, icon, description, productCount, color } = category;

    // Icon mapping for professional SVG icons
    const getIcon = (iconName) => {
        const icons = {
            grid: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            chair: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                    <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5Z" />
                    <path d="M5 18v3" />
                    <path d="M19 18v3" />
                </svg>
            ),
            table: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            ),
            dining: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v12" />
                    <path d="M6 12h12" />
                    <circle cx="12" cy="12" r="2" />
                </svg>
            ),
        };
        return icons[iconName] || icons.grid;
    };

    return (
        <Link
            to={`/products?category=${name}`}
            className="category-card"
            style={{ '--category-color': color }}
        >
            <div className="category-card-icon">{getIcon(icon)}</div>
            <h3 className="category-card-name">{name}</h3>
            <p className="category-card-description">{description}</p>
            <div className="category-card-count">
                {productCount} Products
            </div>
            <div className="category-card-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </Link>
    );
};

export default CategoryCard;
