/**
 * Mock Products Data
 * Structured to match future API response format
 */

export const mockProducts = [
    // Woven & Folding Products
    {
        id: 'prod-001',
        name: 'Niwar Folding Cot',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'A portable, foldable cot with a high-strength woven surface. Perfect for guests and travel.',
        price: 2500,
        unit: 'piece',
        stock: 45,
        lowStockThreshold: 10,
        isFeatured: true,
        image: '/images/products/niwar-cot.jpg'
    },
    {
        id: 'prod-002',
        name: 'Heavy Duty Folding Cot',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Extra strong folding cot with reinforced frame, supports up to 150kg weight.',
        price: 3200,
        unit: 'piece',
        stock: 32,
        lowStockThreshold: 8,
        isFeatured: true,
        image: '/images/products/heavy-cot.jpg'
    },
    {
        id: 'prod-003',
        name: 'Woven Sleeping Mat',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Traditional woven mat, breathable and comfortable for all seasons.',
        price: 850,
        unit: 'piece',
        stock: 65,
        lowStockThreshold: 15,
        isFeatured: false,
        image: '/images/products/mat.jpg'
    },
    {
        id: 'prod-004',
        name: 'Portable Niwar Bed',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Lightweight portable bed with durable niwar weaving, easy to store.',
        price: 2800,
        unit: 'piece',
        stock: 28,
        lowStockThreshold: 8,
        isFeatured: false,
        image: '/images/products/niwar-bed.jpg'
    },

    // Steel Furniture Products
    {
        id: 'prod-005',
        name: 'S-Type Visitor Chair',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Durable steel-framed chair with wire-based support, ideal for visitors and office use.',
        price: 1850,
        unit: 'piece',
        stock: 55,
        lowStockThreshold: 12,
        isFeatured: true,
        image: '/images/products/s-type-chair.jpg'
    },
    {
        id: 'prod-006',
        name: 'Premium S-Type Chair Set (4pcs)',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Set of 4 premium S-type chairs with cushioned seating, powder-coated finish.',
        price: 6800,
        unit: 'set',
        stock: 18,
        lowStockThreshold: 5,
        isFeatured: true,
        image: '/images/products/chair-set.jpg'
    },
    {
        id: 'prod-007',
        name: 'Steel Waiting Chair',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Sturdy steel waiting chair with comfortable mesh back, stackable design.',
        price: 2100,
        unit: 'piece',
        stock: 42,
        lowStockThreshold: 10,
        isFeatured: false,
        image: '/images/products/waiting-chair.jpg'
    },
    {
        id: 'prod-008',
        name: 'Steel Frame Folding Chair',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Lightweight folding chair with steel frame, perfect for events.',
        price: 1450,
        unit: 'piece',
        stock: 60,
        lowStockThreshold: 15,
        isFeatured: false,
        image: '/images/products/folding-chair.jpg'
    },

    // Folding Tables Products
    {
        id: 'prod-009',
        name: 'Teak Wood Folding Table',
        category: 'Folding Tables',
        categoryId: 'cat-003',
        description: 'Premium rectangular folding table made of durable teak wood. Weather-resistant finish.',
        price: 5500,
        unit: 'piece',
        stock: 22,
        lowStockThreshold: 5,
        isFeatured: true,
        image: '/images/products/teak-table.jpg'
    },
    {
        id: 'prod-010',
        name: 'Rectangular Folding Table (4ft)',
        category: 'Folding Tables',
        categoryId: 'cat-003',
        description: 'Standard 4-foot rectangular folding table, suitable for indoor and outdoor use.',
        price: 3200,
        unit: 'piece',
        stock: 35,
        lowStockThreshold: 8,
        isFeatured: false,
        image: '/images/products/rect-table-4ft.jpg'
    },
    {
        id: 'prod-011',
        name: 'Rectangular Folding Table (6ft)',
        category: 'Folding Tables',
        categoryId: 'cat-003',
        description: 'Large 6-foot folding table, ideal for gatherings and events.',
        price: 4200,
        unit: 'piece',
        stock: 28,
        lowStockThreshold: 6,
        isFeatured: false,
        image: '/images/products/rect-table-6ft.jpg'
    },
    {
        id: 'prod-012',
        name: 'Premium Teak Wood Table (Large)',
        category: 'Folding Tables',
        categoryId: 'cat-003',
        description: 'Extra-large premium teak wood folding table with reinforced legs.',
        price: 7800,
        unit: 'piece',
        stock: 15,
        lowStockThreshold: 4,
        isFeatured: true,
        image: '/images/products/teak-table-large.jpg'
    },

    // Dining Sets Products - MANUFACTURER EXCLUSIVE
    {
        id: 'prod-013',
        name: 'Oval Top Dining Set',
        category: 'Dining Sets',
        categoryId: 'cat-004',
        description: 'Signature wooden dining table with a classic oval top and matching chairs. Manufacturer Exclusive - We manufacture this product in-house.',
        price: 25500,
        unit: 'set',
        stock: 8,
        lowStockThreshold: 3,
        isFeatured: true,
        isExclusive: true,
        image: '/images/products/oval-dining.jpg'
    },
    {
        id: 'prod-014',
        name: 'Oval Top Dining Set (6 Seater)',
        category: 'Dining Sets',
        categoryId: 'cat-004',
        description: 'Premium 6-seater oval dining set with cushioned chairs. Manufacturer Exclusive.',
        price: 32000,
        unit: 'set',
        stock: 5,
        lowStockThreshold: 2,
        isFeatured: true,
        isExclusive: true,
        image: '/images/products/oval-dining-6.jpg'
    },
    {
        id: 'prod-015',
        name: 'Oval Top Dining Set (8 Seater)',
        category: 'Dining Sets',
        categoryId: 'cat-004',
        description: 'Grand 8-seater oval dining set, perfect for large families. Manufacturer Exclusive.',
        price: 42000,
        unit: 'set',
        stock: 3,
        lowStockThreshold: 1,
        isFeatured: true,
        isExclusive: true,
        image: '/images/products/oval-dining-8.jpg'
    },
    {
        id: 'prod-016',
        name: 'Oval Top Dining Set (Deluxe)',
        category: 'Dining Sets',
        categoryId: 'cat-004',
        description: 'Deluxe oval dining set with premium wood finish and ergonomic chairs. Manufacturer Exclusive.',
        price: 48000,
        unit: 'set',
        stock: 2,
        lowStockThreshold: 1,
        isFeatured: false,
        isExclusive: true,
        image: '/images/products/oval-dining-deluxe.jpg'
    }
];

/**
 * Calculate availability status based on stock levels
 */
export const getAvailabilityStatus = (stock, lowThreshold) => {
    if (stock === 0) return { status: 'out-of-stock', label: 'Out of Stock', color: '#dc3545' };
    if (stock <= lowThreshold) return { status: 'low-stock', label: 'Low Stock', color: '#ffc107' };
    return { status: 'in-stock', label: 'In Stock', color: '#28a745' };
};

/**
 * Get all products with availability status
 */
export const getProducts = () => mockProducts.map(product => ({
    ...product,
    availability: getAvailabilityStatus(product.stock, product.lowStockThreshold)
}));

/**
 * Get products by category
 */
export const getProductsByCategory = (category) => {
    const products = getProducts();
    if (!category || category === 'All') return products;
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

/**
 * Get featured products
 */
export const getFeaturedProducts = () => getProducts().filter(p => p.isFeatured);

/**
 * Get low stock products
 */
export const getLowStockProducts = () => getProducts().filter(
    p => p.stock <= p.lowStockThreshold && p.stock > 0
);

/**
 * Get out of stock products
 */
export const getOutOfStockProducts = () => getProducts().filter(p => p.stock === 0);

/**
 * Get product by ID
 */
export const getProductById = (id) => {
    const product = mockProducts.find(p => p.id === id);
    if (!product) return null;
    return {
        ...product,
        availability: getAvailabilityStatus(product.stock, product.lowStockThreshold)
    };
};
