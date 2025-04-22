// src/api/apiClient.js
const API_URL = process.env.REACT_APP_API_URL; // Replace with your actual API URL

// Base fetch function with auth header
export const fetchWithAuth = async (endpoint: any) => {
  const token = localStorage.getItem('auth_token'); // Or however you store your token
  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
};

// Specific API endpoints
export const api = {
  // Dashboard data
  getDashboardStats: () => fetchWithAuth('dashboard/stats'),

  // Sales data
  getSalesData: () => fetchWithAuth('sales'),

  // Customers data
  getCustomers: () => fetchWithAuth('customers'),

  // Users data
  getAllUsers: () => fetchWithAuth('user'),
};
