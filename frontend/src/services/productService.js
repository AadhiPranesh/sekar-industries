/**
 * Product Service
 * Abstracts product data operations from UI components
 */

import { fetchData, createResponse } from '../api/config';
import {
    mockProducts,
    getProducts as getMockProducts,
    getProductsByCategory as getMockProductsByCategory,
    getFeaturedProducts as getMockFeaturedProducts,
    getLowStockProducts as getMockLowStockProducts,
    getOutOfStockProducts as getMockOutOfStockProducts,
    getProductById as getMockProductById
} from '../data/mockProducts';

const ratingLookup = mockProducts.reduce((acc, product) => {
    const keys = [product.id, product.name]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase());

    keys.forEach((key) => {
        acc[key] = {
            rating: product.rating,
            reviewCount: product.reviewCount
        };
    });

    return acc;
}, {});

const getDeterministicSeed = (value) => {
    const input = String(value || 'sekar-product');
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
        hash = (hash * 31 + input.charCodeAt(i)) % 1000003;
    }
    return hash;
};

const getFallbackRatingMeta = (product) => {
    const seed = getDeterministicSeed(product?.id || product?.productId || product?.name);
    const rating = Math.round((4 + (seed % 10) / 10) * 10) / 10;
    const reviewCount = 40 + (seed % 220);

    return { rating, reviewCount };
};

const withRatingFallback = (product) => {
    if (!product || typeof product !== 'object') {
        return product;
    }

    const currentRating = Number(product.rating);
    const currentReviewCount = Number(product.reviewCount);
    const hasRating = Number.isFinite(currentRating) && currentRating > 0;
    const hasReviewCount = Number.isFinite(currentReviewCount) && currentReviewCount > 0;

    if (hasRating && hasReviewCount) {
        return {
            ...product,
            rating: Math.round(currentRating * 10) / 10,
            reviewCount: Math.round(currentReviewCount)
        };
    }

    const lookupKeys = [product.id, product.productId, product.name]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase());

    const match = lookupKeys.map((key) => ratingLookup[key]).find(Boolean);
    const fallback = match || getFallbackRatingMeta(product);

    return {
        ...product,
        rating: hasRating ? Math.round(currentRating * 10) / 10 : fallback.rating,
        reviewCount: hasReviewCount ? Math.round(currentReviewCount) : fallback.reviewCount
    };
};

const normalizeProductResponse = (response) => {
    if (!response?.success) {
        return response;
    }

    if (Array.isArray(response.data)) {
        return {
            ...response,
            data: response.data.map(withRatingFallback)
        };
    }

    if (response.data && typeof response.data === 'object') {
        return {
            ...response,
            data: withRatingFallback(response.data)
        };
    }

    return response;
};

/**
 * Get all products
 */
export const getAllProducts = () => {
    return fetchData('/products', () => createResponse(getMockProducts())).then(normalizeProductResponse);
};

/**
 * Get products by category
 * @param {string} category - Category name or 'All'
 */
export const getProductsByCategory = (category) => {
    const encodedCategory = encodeURIComponent(category || 'All');
    return fetchData(`/products?category=${encodedCategory}`, () =>
        createResponse(getMockProductsByCategory(category))
    ).then(normalizeProductResponse);
};

/**
 * Get featured products for homepage
 */
export const getFeaturedProducts = () => {
    return fetchData('/products?featured=true', () =>
        createResponse(getMockFeaturedProducts())
    ).then(normalizeProductResponse);
};

/**
 * Get low stock products (for admin alerts)
 */
export const getLowStockProducts = () => {
    return fetchData('/products?lowStock=true', () =>
        createResponse(getMockLowStockProducts())
    ).then(normalizeProductResponse);
};

/**
 * Get out of stock products
 */
export const getOutOfStockProducts = () => {
    return fetchData('/products?outOfStock=true', () =>
        createResponse(getMockOutOfStockProducts())
    ).then(normalizeProductResponse);
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
    }).then(normalizeProductResponse);
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
    }).then(normalizeProductResponse);
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
