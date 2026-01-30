/**
 * RelatedProducts Component
 * Shows related products based on category
 */

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory } from '../../services/productService';

const RelatedProducts = ({ currentProductId, category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                const response = await getProductsByCategory(category);
                if (response.success) {
                    // Filter out current product and limit to 4
                    const filtered = response.data
                        .filter(p => p.id !== currentProductId)
                        .slice(0, 4);
                    setProducts(filtered);
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRelatedProducts();
        }
    }, [currentProductId, category]);

    if (loading || products.length === 0) {
        return null;
    }

    return (
        <section className="related-products">
            <div className="container">
                <h2 className="section-title">Related Products</h2>
                <div className="featured-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;
