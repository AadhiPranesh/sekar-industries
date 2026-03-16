/**
 * API Configuration
 * Central configuration for data sources and deployed service endpoints.
 */

const normalizeOrigin = (value) => {
  if (!value) return '';
  return String(value).trim().replace(/\/+$/, '');
};

export const BACKEND_ORIGIN = normalizeOrigin(import.meta.env.VITE_API_BASE_URL) || 'https://sekar-industries.onrender.com';
export const ML_ORIGIN = normalizeOrigin(import.meta.env.VITE_ML_BASE_URL) || 'https://sekar-industries-2.onrender.com';
export const ANALYTICS_ORIGIN = normalizeOrigin(import.meta.env.VITE_ANALYTICS_BASE_URL) || 'https://sekar-industries-1.onrender.com';

export const buildApiUrl = (endpoint = '') => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BACKEND_ORIGIN}/api${normalizedEndpoint}`;
};

export const buildBackendUrl = (path = '') => {
  if (!path) return BACKEND_ORIGIN;
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_ORIGIN}${normalizedPath}`;
};

export const API_CONFIG = {
  USE_MOCK_DATA: false,
  BASE_URL: `${BACKEND_ORIGIN}/api`,
  ML_URL: ML_ORIGIN,
  ANALYTICS_URL: ANALYTICS_ORIGIN,
  TIMEOUT: 10000,
  VERSION: '1.0.0'
};

/**
 * Simulate API delay for realistic mock behavior
 */
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create standardized API response format
 */
export const createResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data,
  meta: {
    timestamp: new Date().toISOString(),
    version: API_CONFIG.VERSION
  }
});

/**
 * Create error response format
 */
export const createErrorResponse = (message, code = 'ERROR') => ({
  success: false,
  message,
  error: { code },
  meta: {
    timestamp: new Date().toISOString(),
    version: API_CONFIG.VERSION
  }
});

/**
 * Fetch data - abstracts data source (mock or API)
 * @param {string} endpoint - API endpoint path
 * @param {Function} mockDataFn - Function that returns mock data
 */
export const fetchData = async (endpoint, mockDataFn) => {
  if (API_CONFIG.USE_MOCK_DATA) {
    await simulateDelay();
    return mockDataFn();
  }
  
  const getMockFallback = async () => {
    if (typeof mockDataFn !== 'function') {
      return null;
    }

    await simulateDelay();
    return mockDataFn();
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const fallback = await getMockFallback();
      if (fallback) {
        return fallback;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    const fallback = await getMockFallback();
    if (fallback) {
      return fallback;
    }

    return createErrorResponse(error.message, 'FETCH_ERROR');
  }
};

/**
 * Post data - abstracts data mutations
 * @param {string} endpoint - API endpoint path
 * @param {object} data - Data to send
 * @param {string} method - HTTP method (POST, PUT, PATCH, DELETE)
 * @param {Function} mockMutateFn - Function that handles mock mutation
 */
export const postData = async (endpoint, data, method = 'POST', mockMutateFn) => {
  if (API_CONFIG.USE_MOCK_DATA) {
    await simulateDelay();
    return mockMutateFn(data);
  }
  
  // Future: Real API call
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return createErrorResponse(error.message, 'POST_ERROR');
  }
};
