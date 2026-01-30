/**
 * Mock Categories Data
 * Structured to match future API response format
 */

export const mockCategories = [
    {
        id: 'cat-001',
        name: 'Woven & Folding',
        icon: 'grid',
        description: 'Cots, Niwar beds, Mats, and portable folding furniture',
        productCount: 12,
        color: '#2D473E'
    },
    {
        id: 'cat-002',
        name: 'Steel Furniture',
        icon: 'chair',
        description: 'S-type visitor chairs and durable steel-framed seating',
        productCount: 8,
        color: '#4A90D9'
    },
    {
        id: 'cat-003',
        name: 'Folding Tables',
        icon: 'table',
        description: 'Rectangular and Teak wood folding tables',
        productCount: 6,
        color: '#8B4513'
    },
    {
        id: 'cat-004',
        name: 'Dining Sets',
        icon: 'dining',
        description: 'Signature Oval Top wooden dining sets - Manufacturer Exclusive',
        productCount: 4,
        color: '#C17767'
    }
];

export const getCategories = () => mockCategories;

export const getCategoryById = (id) => mockCategories.find(cat => cat.id === id);

export const getCategoryByName = (name) => mockCategories.find(
    cat => cat.name.toLowerCase() === name.toLowerCase()
);
