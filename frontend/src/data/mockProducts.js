/**
 * Mock Products Data
 * Real Sekar Industries Product Catalog
 */

export const mockProducts = [
    // Folding Bed
     {
        id: 'prod-001',
        name: 'Orange Niwar Folding Bed',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Durable folding bed with orange woven surface. Portable and comfortable.',
        price: 2800,
        unit: 'piece',
        stock: 45,
        lowStockThreshold: 10,
        isFeatured: true,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456197215/VZ/MO/BM/113411322/wrwerwrwerwerwer-500x500.jpeg'
    },
    {
        id: 'prod-002',
        name: 'Single Niwar Folding Bed',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Single size folding bed with high-strength woven surface.',
        price: 2500,
        unit: 'piece',
        stock: 38,
        lowStockThreshold: 10,
        isFeatured: false,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456196991/TS/WN/JK/113411322/rewrwrwerwer-500x500.jpeg'
    },
    {
        id: 'prod-003',
        name: 'Polished Niwar Folding Bed',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Premium polished frame folding bed with woven surface.',
        price: 3200,
        unit: 'piece',
        stock: 28,
        lowStockThreshold: 8,
        isFeatured: true,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456196829/CZ/CK/ZH/113411322/ewrwerewrwerwerw-500x500.jpeg'
    },
    {
        id: 'prod-004',
        name: 'Blue Niwar Folding Bed',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Blue colored woven folding bed with sturdy frame and easy storage.',
        price: 2600,
        unit: 'piece',
        stock: 35,
        lowStockThreshold: 8,
        isFeatured: false,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456196666/LJ/GO/XI/113411322/wwerwerwrw-500x500.jpeg'
    },
    {
        id: 'prod-017',
        name: 'Green Niwar Folding Bed',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Green colored woven folding bed with comfortable sleeping surface.',
        price: 2700,
        unit: 'piece',
        stock: 32,
        lowStockThreshold: 8,
        isFeatured: false,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456196489/UE/PD/TP/113411322/432343223423-500x500.jpeg'
    },
    {
        id: 'prod-018',
        name: 'Floral Printed Folding Bed',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Decorative folding bed with attractive floral print design.',
        price: 2900,
        unit: 'piece',
        stock: 25,
        lowStockThreshold: 8,
        isFeatured: false,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456196337/JL/YY/MC/113411322/werwerwerwerw-500x500.jpeg'
    },
    {
        id: 'prod-019',
        name: 'Folding Bed Niwar',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Standard niwar folding bed with reliable construction.',
        price: 2400,
        unit: 'piece',
        stock: 40,
        lowStockThreshold: 10,
        isFeatured: false,
        image: 'https://5.imimg.com/data5/IOS/Default/2024/11/466982590/FZ/IY/FT/113411322/product-jpeg-500x500.png'
    },
    {
        id: 'prod-020',
        name: 'Folding Cot Bed',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Classic folding cot bed design with durable frame.',
        price: 2300,
        unit: 'piece',
        stock: 42,
        lowStockThreshold: 10,
        isFeatured: false,
        image: 'https://5.imimg.com/data5/ANDROID/Default/2020/9/CC/RC/CR/113411322/product-jpeg-500x500.jpg'
    },
    {
        id: 'prod-021',
        name: 'Single Folding Steel Cot',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Single size steel cot with folding mechanism for easy storage.',
        price: 2600,
        unit: 'piece',
        stock: 30,
        lowStockThreshold: 8,
        isFeatured: false,
        image: 'https://5.imimg.com/data5/NSDMERP/Default/2022/12/IR/QT/QC/113411322/nylon-standing-cot-1670494972060-500x500.jpg'
    },
    {
        id: 'prod-022',
        name: 'Foldable Single Cot',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Compact foldable single cot perfect for small spaces.',
        price: 2200,
        unit: 'piece',
        stock: 38,
        lowStockThreshold: 10,
        isFeatured: false,
        image: 'https://5.imimg.com/data5/ANDROID/Default/2025/3/493894656/JX/BI/TQ/113411322/product-jpeg-1000x1000.jpeg'
    },
    {
        id: 'prod-023',
        name: 'Foldable Double Cot',
        category: 'Woven & Folding',
        categoryId: 'cat-001',
        description: 'Spacious double size foldable cot for comfortable sleeping.',
        price: 3500,
        unit: 'piece',
        stock: 20,
        lowStockThreshold: 6,
        isFeatured: true,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456196212/BX/OF/BR/113411322/werrwerwe-1000x1000.jpeg'
    },

    // S Type Chairs
    {
        id: 'prod-005',
        name: 'Wire Netted S Type Chair',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Ergonomic S-shaped chair with wire netted back for office and visitor seating.',
        price: 1850,
        unit: 'piece',
        stock: 55,
        lowStockThreshold: 12,
        isFeatured: true,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/456197410/XC/WN/II/113411322/wwerwerwerwer-500x500.jpeg'
    },
    {
        id: 'prod-006',
        name: 'Low Back S Type Chair',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Compact S type chair with low back support, ideal for waiting areas.',
        price: 1650,
        unit: 'piece',
        stock: 48,
        lowStockThreshold: 10,
        isFeatured: false,
        image: '/images/products/low-back-chair.jpg'
    },
    {
        id: 'prod-007',
        name: 'S Type Chair',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Standard S type visitor chair with durable steel frame and comfortable seating.',
        price: 1750,
        unit: 'piece',
        stock: 52,
        lowStockThreshold: 10,
        isFeatured: true,
        image: '/images/products/s-type-standard.jpg'
    },
    {
        id: 'prod-008',
        name: 'Rolling Chair For Office',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Office rolling chair with smooth wheels and adjustable height.',
        price: 3200,
        unit: 'piece',
        stock: 35,
        lowStockThreshold: 8,
        isFeatured: true,
        image: '/images/products/rolling-office-chair.jpg'
    },

    // Movable Walker & Dining Sets
    {
        id: 'prod-009',
        name: 'Mild Steel Movable Walker',
        category: 'Steel Furniture',
        categoryId: 'cat-002',
        description: 'Medical grade movable walker made of mild steel for mobility support.',
        price: 2800,
        unit: 'piece',
        stock: 25,
        lowStockThreshold: 6,
        isFeatured: false,
        image: '/images/products/walker.jpg'
    },
    {
        id: 'prod-010',
        name: 'S Type Visitor Chair',
        category: 'Dining Sets',
        categoryId: 'cat-004',
        description: 'S type visitor chair perfect for dining rooms and waiting areas.',
        price: 1800,
        unit: 'piece',
        stock: 40,
        lowStockThreshold: 10,
        isFeatured: false,
        image: '/images/products/s-visitor-chair.jpg'
    },
    {
        id: 'prod-011',
        name: '2 Seater Teak Wood Dining Table Set',
        category: 'Dining Sets',
        categoryId: 'cat-004',
        description: 'Compact 2-seater dining table set made from premium teak wood.',
        price: 12500,
        unit: 'set',
        stock: 18,
        lowStockThreshold: 5,
        isFeatured: true,
        image: '/images/products/2-seater-teak.jpg'
    },
    {
        id: 'prod-012',
        name: 'Polished Teak Wood Dining Table Set',
        category: 'Dining Sets',
        categoryId: 'cat-004',
        description: 'Beautifully polished teak wood dining set with elegant finish.',
        price: 18500,
        unit: 'set',
        stock: 12,
        lowStockThreshold: 4,
        isFeatured: true,
        image: '/images/products/polished-teak-dining.jpg'
    },

    // Wooden Chairs & Tables
    {
        id: 'prod-013',
        name: 'Maharaja Teak Wood Dining Table Set',
        category: 'Dining Sets',
        categoryId: 'cat-004',
        description: 'Premium maharaja style teak wood dining set with intricate design.',
        price: 28500,
        unit: 'set',
        stock: 8,
        lowStockThreshold: 3,
        isFeatured: true,
        image: '/images/products/maharaja-dining.jpg'
    },
    {
        id: 'prod-014',
        name: 'Antique Teak Wood Chair',
        category: 'Wooden Furniture',
        categoryId: 'cat-003',
        description: 'Classic antique teak wood chair with traditional craftsmanship.',
        price: 4500,
        unit: 'piece',
        stock: 22,
        lowStockThreshold: 6,
        isFeatured: false,
        image: '/images/products/antique-teak-chair.jpg'
    },
    {
        id: 'prod-015',
        name: 'S Type Steel Chair',
        category: 'Wooden Furniture',
        categoryId: 'cat-003',
        description: 'Durable S type chair with steel frame and wooden accents.',
        price: 1900,
        unit: 'piece',
        stock: 45,
        lowStockThreshold: 10,
        isFeatured: false,
        image: '/images/products/s-type-steel.jpg'
    },
    {
        id: 'prod-016',
        name: 'Rectangular Teak Wood Table',
        category: 'Wooden Furniture',
        categoryId: 'cat-003',
        description: 'Large rectangular teak wood table perfect for dining or conference rooms.',
        price: 9800,
        unit: 'piece',
        stock: 12,
        lowStockThreshold: 4,
        isFeatured: true,
        image: '/images/products/rect-teak-table.jpg'
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
