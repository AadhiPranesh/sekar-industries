/**
 * Business Service
 * Abstracts business data operations from UI components
 */

import { fetchData, createResponse } from '../api/config';
import { getBusinessInfo as getMockBusinessInfo } from '../data/mockBusiness';

/**
 * Get complete business information
 */
export const getBusinessInfo = () => {
    return fetchData('/business', () => createResponse(getMockBusinessInfo()));
};

/**
 * Get contact information only
 */
export const getContactInfo = () => {
    return fetchData('/business/contact', () => {
        const business = getMockBusinessInfo();
        return createResponse({
            contact: business.contact,
            timings: business.timings,
            socialMedia: business.socialMedia
        });
    });
};

/**
 * Get business stats
 */
export const getBusinessStats = () => {
    return fetchData('/business/stats', () => {
        const business = getMockBusinessInfo();
        return createResponse(business.stats);
    });
};

/**
 * Get business features/highlights
 */
export const getBusinessFeatures = () => {
    return fetchData('/business/features', () => {
        const business = getMockBusinessInfo();
        return createResponse(business.features);
    });
};

export default {
    getBusinessInfo,
    getContactInfo,
    getBusinessStats,
    getBusinessFeatures
};
