/**
 * Category Service
 * Abstracts category data operations from UI components
 */

import { fetchData, createResponse } from '../api/config';
import {
    getCategories as getMockCategories,
    getCategoryById as getMockCategoryById
} from '../data/mockCategories';

/**
 * Get all categories
 */
export const getCategories = () => {
    return fetchData('/categories', () => createResponse(getMockCategories()));
};

/**
 * Get category by ID
 */
export const getCategoryById = (id) => {
    return fetchData(`/categories/${id}`, () => {
        const category = getMockCategoryById(id);
        if (!category) {
            return createResponse(null, 'Category not found');
        }
        return createResponse(category);
    });
};

export default {
    getCategories,
    getCategoryById
};
