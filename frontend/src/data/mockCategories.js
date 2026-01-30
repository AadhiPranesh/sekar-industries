/**
 * Mock Categories Data
 * Real Sekar Industries Product Categories
 */

export const mockCategories = [
    {
        id: 'cat-001',
        name: 'Woven & Folding',
        icon: 'grid',
        description: 'Folding beds with woven surfaces - Orange, Single, Polished, and Blue Niwar variants',
        productCount: 11,
        color: '#2D473E'
    },
    {
        id: 'cat-002',
        name: 'Steel Furniture',
        icon: 'chair',
        description: 'S-type chairs, rolling office chairs, and mild steel movable walkers',
        productCount: 5,
        color: '#4A90D9'
    },
    {
        id: 'cat-003',
        name: 'Wooden Furniture',
        icon: 'table',
        description: 'Antique teak wood chairs, S type steel chairs, and rectangular teak wood tables',
        productCount: 3,
        color: '#8B4513'
    },
    {
        id: 'cat-004',
        name: 'Dining Sets',
        icon: 'dining',
        description: 'Premium teak wood dining table sets - 2 Seater, Polished, and Maharaja styles',
        productCount: 4,
        color: '#C17767'
    }
];

export const getCategories = () => mockCategories;

export const getCategoryById = (id) => mockCategories.find(cat => cat.id === id);

export const getCategoryByName = (name) => mockCategories.find(
    cat => cat.name.toLowerCase() === name.toLowerCase()
);
