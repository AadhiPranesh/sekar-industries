/**
 * Combo Service
 * Handles fetching combo offers from the ML backend
 */

import { API_CONFIG } from '../api/config';
import { mockProducts } from '../data/mockProducts';

const isBrowserLocalhost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

const normalizeBaseUrl = (value) => {
    if (!value) return null;
    const trimmed = String(value).trim();
    if (!trimmed) return null;

    // Support both ".../ml" and plain host values.
    return trimmed.replace(/\/+$/, '').replace(/\/ml$/, '');
};

const isLocalCandidate = (value) => /localhost|127\.0\.0\.1/.test(value);

const ML_BASE_URLS = [
    normalizeBaseUrl(import.meta.env.VITE_ML_BASE_URL),
    normalizeBaseUrl(API_CONFIG.ML_URL),
    'https://sekar-industries-backend.onrender.com'
].filter(Boolean)
    .filter((url, idx, arr) => arr.indexOf(url) === idx)
    .filter((url) => !isLocalCandidate(url) || isBrowserLocalhost);

const getFallbackCombos = () => {
    const picks = [
        ['prod-001', 'prod-010'],
        ['prod-003', 'prod-021'],
        ['prod-017', 'prod-019']
    ];

    return picks.map(([a, b], idx) => {
        const first = mockProducts.find((p) => p.id === a);
        const second = mockProducts.find((p) => p.id === b);

        const originalPrice = Number(first?.price || 0) + Number(second?.price || 0);
        const discountedPrice = Math.max(0, Math.round(originalPrice * 0.9));

        return {
            id: `fallback-combo-${idx + 1}`,
            name: `Combo ${idx + 1}`,
            items: [a, b],
            originalPrice,
            discountedPrice
        };
    });
};

/**
 * Get combo offers from the ML API
 */
export const getComboOffers = async () => {
    for (const baseUrl of ML_BASE_URLS) {
        try {
            const response = await fetch(`${baseUrl}/combo`);

            if (!response.ok) {
                throw new Error(`Failed with status ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                data: data,
                message: 'Combo offers fetched successfully'
            };
        } catch {
            // Try the next configured endpoint.
        }
    }

    return {
        success: true,
        data: getFallbackCombos(),
        message: 'Live combo service unavailable. Showing fallback offers.'
    };
};
