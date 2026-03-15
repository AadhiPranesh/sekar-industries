/**
 * Combo Service
 * Handles fetching combo offers from the ML backend
 */

const ML_BASE_URLS = ['http://localhost:8000', 'http://127.0.0.1:8000'];

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
        } catch (error) {
            console.error(`Error fetching combo offers from ${baseUrl}:`, error);
        }
    }

    return {
        success: false,
        data: [],
        message: 'Failed to fetch from backend (tried localhost and 127.0.0.1)'
    };
};
