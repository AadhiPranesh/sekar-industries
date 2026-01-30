/**
 * Product Service
 * Abstracts product data operations from UI components
 */

import { fetchData, createResponse } from '../api/config';
import {
    getProducts as getMockProducts,
    getProductsByCategory as getMockProductsByCategory,
    getFeaturedProducts as getMockFeaturedProducts,
    getLowStockProducts as getMockLowStockProducts,
    getOutOfStockProducts as getMockOutOfStockProducts,
    getProductById as getMockProductById
} from '../data/mockProducts';

/**
 * Get all products
 */
export const getAllProducts = () => {
    return fetchData('/products', () => createResponse(getMockProducts()));
};

/**
 * Get products by category
 * @param {string} category - Category name or 'All'
 */
export const getProductsByCategory = (category) => {
    return fetchData(`/products?category=${category}`, () =>
        createResponse(getMockProductsByCategory(category))
    );
};

/**
 * Get featured products for homepage
 */
export const getFeaturedProducts = () => {
    return fetchData('/products?featured=true', () =>
        createResponse(getMockFeaturedProducts())
    );
};

/**
 * Get low stock products (for admin alerts)
 */
export const getLowStockProducts = () => {
    return fetchData('/products?lowStock=true', () =>
        createResponse(getMockLowStockProducts())
    );
};

/**
 * Get out of stock products
 */
export const getOutOfStockProducts = () => {
    return fetchData('/products?outOfStock=true', () =>
        createResponse(getMockOutOfStockProducts())
    );
};

/**
 * Get product by ID
 * @param {string} id - Product ID
 */
export const getProductById = (id) => {
    return fetchData(`/products/${id}`, () => {
        const product = getMockProductById(id);
        if (!product) {
            return createResponse(null, 'Product not found');
        }
        return createResponse(product);
    });
};

/**
 * Search products by name (client-side for mock)
 * @param {string} query - Search query
 */
export const searchProducts = (query) => {
    return fetchData(`/products/search?q=${query}`, () => {
        const products = getMockProducts();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );
        return createResponse(filtered);
    });
};

export default {
    getAllProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getLowStockProducts,
    getOutOfStockProducts,
    getProductById,
    searchProducts
};
