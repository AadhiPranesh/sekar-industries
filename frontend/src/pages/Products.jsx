/**
 * Products Page
 * Product catalog with category filtering
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CategoryFilter from '../components/public/CategoryFilter';
import ProductGrid from '../components/public/ProductGrid';
import { getProductsByCategory } from '../services/productService';
import { getCategories } from '../services/categoryService';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    // Get category from URL params
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setActiveCategory(categoryParam);
        }
    }, [searchParams]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch products when category changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProductsByCategory(activeCategory);
                if (response.success) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        if (category === 'All') {
            setSearchParams({});
        } else {
            setSearchParams({ category });
        }
    };

    return (
        <div className="page products-page">
            <Header />

            <main>
                <div className="products-header">
                    <div className="container">
                        <h1>Our Products</h1>
                        <p>
                            Browse our extensive catalog of quality industrial supplies,
                            hardware, and electrical components.
                        </p>
                    </div>
                </div>

                <div className="products-content">
                    <div className="container">
                        <CategoryFilter
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryChange}
                        />

                        <ProductGrid
                            products={products}
                            loading={loading}
                        />

                        {!loading && products.length > 0 && (
                            <div className="text-center mt-8">
                                <p className="text-secondary">
                                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                                    {activeCategory !== 'All' && ` in ${activeCategory}`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Products;
