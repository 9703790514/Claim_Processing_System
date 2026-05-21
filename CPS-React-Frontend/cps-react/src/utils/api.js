// API Configuration - Centralized API endpoints for the Claims Processing System
// All requests go through the API Gateway on port 8899

const API_BASE_URL = "http://localhost:8899";

// API Gateway Routes
export const API_ROUTES = {
  // Customer Service Routes (via /customer/**)
  CUSTOMER: {
    BASE: `${API_BASE_URL}/customer`,
    ADD_CUSTOMER: `${API_BASE_URL}/customer/addCustomer`,
    ALL_CUSTOMERS: `${API_BASE_URL}/customer/allCustomer`,
    GET_CUSTOMER: (id) => `${API_BASE_URL}/customer/getCustomer/${id}`,
    UPDATE_CUSTOMER: (id) => `${API_BASE_URL}/customer/${id}`,
    DELETE_CUSTOMER: (id) => `${API_BASE_URL}/customer/${id}`,
    LOGIN: `${API_BASE_URL}/customer/login`,
    
    // Policies
    ALL_POLICIES: `${API_BASE_URL}/customer/allPolicies`,
    GET_POLICIES: (customerId) => `${API_BASE_URL}/customer/policies/${customerId}`,
    
    // Covers
    ALL_COVERS: `${API_BASE_URL}/customer/allCovers`,
    GET_COVERS: (customerId) => `${API_BASE_URL}/customer/covers/${customerId}`,
    
    // Hospitals
    ALL_HOSPITALS: `${API_BASE_URL}/customer/allHospitals`,
    HOSPITALS_BY_CITY: (city) => `${API_BASE_URL}/customer/city/${city}`,
    
    // Claims
    GET_CLAIMS: (customerId) => `${API_BASE_URL}/customer/claims/${customerId}`,
    ADD_CLAIM: `${API_BASE_URL}/customer/addClaims`,
    UPDATE_CLAIM: (claimId) => `${API_BASE_URL}/customer/claims/${claimId}`,
    DELETE_CLAIM: (claimId) => `${API_BASE_URL}/customer/claims/${claimId}`,
  },

  // Documents Service Routes (via /documents/**)
  DOCUMENTS: {
    BASE: `${API_BASE_URL}/documents`,
    GET_ALL: `${API_BASE_URL}/documents/getAll`,
    GET_BY_ID: (id) => `${API_BASE_URL}/documents/${id}`,
    UPLOAD: `${API_BASE_URL}/documents/upload`,
    UPDATE: (id) => `${API_BASE_URL}/documents/${id}`,
    DELETE: (id) => `${API_BASE_URL}/documents/delete/${id}`,
  },

  // Regional Head Service Routes (via /head/**)
  REGIONAL_HEAD: {
    BASE: `${API_BASE_URL}/head`,
    FORWARDED_CLAIMS: `${API_BASE_URL}/head/forwarded`,
    UPDATE_STATUS: (claimId) => `${API_BASE_URL}/head/${claimId}/status`,
  },
};

// Helper function to construct query params
export const buildQueryParams = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `?${queryString}` : '';
};

export default API_ROUTES;
