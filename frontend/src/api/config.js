/**
 * API Configuration
 * Central configuration for data sources and API endpoints
 * 
 * FUTURE INTEGRATION:
 * When backend is ready, simply set USE_MOCK_DATA to false
 * and update BASE_URL to point to your API server
 */

export const API_CONFIG = {
  USE_MOCK_DATA: true,  // Toggle for development/production
  BASE_URL: 'http://localhost:5000/api',  // Future backend URL
  ML_URL: 'http://localhost:8000/ml',     // Future ML service URL
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
  
  // Future: Real API call
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
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
