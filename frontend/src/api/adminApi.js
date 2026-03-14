const ADMIN_AUTH_TOKEN_KEY = 'admin_jwt_token';

export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);

    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    return fetch(url, {
        ...options,
        headers
    });
};

export const adminApi = {
    getPrediction: async (productId) => {
        const response = await authFetch(`http://localhost:5000/api/adminDashboard/predict/${productId}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }
        return response.json();
    }
};
