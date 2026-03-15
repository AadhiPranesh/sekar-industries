/**
 * CategoriesShowcase Component
 * Homepage section showcasing product categories
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import { getCategories } from '../../services/categoryService';

const CategoriesShowcase = () => {
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
        <section className="section categories-showcase">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Browse by Category</h2>
                    <p className="section-subtitle">
                        Explore our wide range of industrial supplies organized by category
                    </p>
                </div>

                {loading ? (
                    <div className="categories-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="category-card-skeleton skeleton"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="categories-grid">
                            {categories.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link to="/categories" className="btn btn-primary">
                                View All Categories
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default CategoriesShowcase;
