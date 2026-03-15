/**
 * Category Filter Component
 * Filter buttons for product categories
 */

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
    return (
        <div className="category-filter">
            <button
                className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => onCategoryChange('All')}
            >
                <span className="icon">🏷️</span>
                All Products
            </button>

            {categories?.map(category => (
                <button
                    key={category.id}
                    className={`category-btn ${activeCategory === category.name ? 'active' : ''}`}
                    onClick={() => onCategoryChange(category.name)}
                >
                    <span className="icon">{category.icon}</span>
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
