/**
 * Categories Page
 * Browse all product categories
 */

import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CategoryCard from '../components/public/CategoryCard';
import { getCategories } from '../services/categoryService';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="page categories-page">
            <Header />

            <main>
                <div className="categories-page-header">
                    <div className="container">
                        <h1>Product Categories</h1>
                        <p>
                            Browse our comprehensive range of industrial supplies organized by category.
                            Click on any category to explore products.
                        </p>
                    </div>
                </div>

                <section className="section">
                    <div className="container">
                        {loading ? (
                            <div className="categories-grid">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="category-card-skeleton skeleton"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="categories-grid">
                                {categories.map((category) => (
                                    <CategoryCard key={category.id} category={category} />
                                ))}
                            </div>
                        )}

                        {!loading && categories.length === 0 && (
                            <div className="text-center">
                                <p className="text-secondary">No categories available at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Categories;
