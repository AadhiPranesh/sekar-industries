const ADMIN_AUTH_TOKEN_KEY = 'admin_jwt_token';

const throwApiError = async (response) => {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
        throw new Error('Admin session expired. Please login again.');
    }

    throw new Error(errorData.message || `Request failed with status ${response.status}`);
};

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
            await throwApiError(response);
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
            await throwApiError(response);
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
            await throwApiError(response);
        }

        return response.json();
    },

    updateProductRequest: async (requestId, body) => {
        const response = await authFetch(`http://localhost:5000/api/requests/admin/${requestId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            await throwApiError(response);
        }

        return response.json();
    },

    createSale: async (payload) => {
        const response = await authFetch('http://localhost:5000/api/sales/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            await throwApiError(response);
        }

        return response.json();
    },

    getRecentSales: async (limit = 10) => {
        const response = await authFetch(`http://localhost:5000/api/sales/admin/recent?limit=${limit}`);

        if (!response.ok) {
            await throwApiError(response);
        }

        return response.json();
    },

    getAdminReviews: async (status = 'all') => {
        const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
        const response = await authFetch(`http://localhost:5000/api/reviews/admin${query}`);

        if (!response.ok) {
            await throwApiError(response);
        }

        return response.json();
    },

    updateAdminReview: async (reviewId, payload) => {
        const response = await authFetch(`http://localhost:5000/api/reviews/admin/${reviewId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            await throwApiError(response);
        }

        return response.json();
    },

    getDashboardStats: async () => {
        const response = await authFetch('http://localhost:5000/api/sales/admin/stats');
        if (!response.ok) await throwApiError(response);
        return response.json();
    },

    getSalesTrend: async (range = '1M') => {
        const response = await authFetch(`http://localhost:5000/api/sales/admin/trend?range=${range}`);
        if (!response.ok) await throwApiError(response);
        return response.json();
    },

    getProducts: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category && filters.category !== 'All') params.set('category', filters.category);
        if (filters.featured) params.set('featured', 'true');
        if (filters.lowStock) params.set('lowStock', 'true');
        if (filters.search) params.set('q', filters.search);
        const qs = params.toString();
        const response = await authFetch(`http://localhost:5000/api/products/admin${qs ? `?${qs}` : ''}`);
        if (!response.ok) await throwApiError(response);
        return response.json();
    },

    createProduct: async (payload) => {
        const response = await authFetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) await throwApiError(response);
        return response.json();
    },

    uploadProductImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await authFetch('http://localhost:5000/api/products/upload-image', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) await throwApiError(response);
        return response.json();
    },

    updateProduct: async (productId, payload) => {
        const response = await authFetch(`http://localhost:5000/api/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) await throwApiError(response);
        return response.json();
    },

    deleteProduct: async (productId) => {
        const response = await authFetch(`http://localhost:5000/api/products/${productId}`, {
            method: 'DELETE'
        });
        if (!response.ok) await throwApiError(response);
        return response.json();
    }
};
