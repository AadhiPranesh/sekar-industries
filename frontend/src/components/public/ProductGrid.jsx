/**
 * Product Grid Component
 * Displays products in a responsive grid
 */

import ProductCard from './ProductCard';
import Icons from '../common/Icons';

const ProductGrid = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="loading-grid">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="loading-card">
                        <div className="loading-image skeleton" style={{ height: '180px' }}></div>
                        <div className="loading-content" style={{ padding: '1.25rem' }}>
                            <div className="loading-line skeleton short" style={{ height: '14px', marginBottom: '8px' }}></div>
                            <div className="loading-line skeleton" style={{ height: '18px', marginBottom: '8px' }}></div>
                            <div className="loading-line skeleton" style={{ height: '14px', marginBottom: '16px' }}></div>
                            <div className="loading-line skeleton shorter" style={{ height: '24px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <Icons.Orders />
                </div>
                <h3>No Products Found</h3>
                <p>Try selecting a different category or check back later.</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;

