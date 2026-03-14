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
    },

    getProductRequests: async (filters = {}) => {
        const queryParams = new URLSearchParams();

        if (filters.status) {
            queryParams.set('status', filters.status);
        }

        if (filters.priority) {
            queryParams.set('priority', filters.priority);
        }

        if (filters.search) {
            queryParams.set('search', filters.search);
        }

        const queryString = queryParams.toString();
        const url = `http://localhost:5000/api/requests/admin${queryString ? `?${queryString}` : ''}`;

        const response = await authFetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        return response.json();
    },

    updateProductRequestStatus: async (requestId, status) => {
        const response = await authFetch(`http://localhost:5000/api/requests/admin/${requestId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        return response.json();
    }
};
