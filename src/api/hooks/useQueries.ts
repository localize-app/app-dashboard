// src/hooks/useQueries.js
import { useQuery } from '@tanstack/react-query';
import { api } from '../apiClient';

// Dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: api.getDashboardStats,
  });
}

// Sales data
export function useSalesData() {
  return useQuery({
    queryKey: ['salesData'],
    queryFn: api.getSalesData,
  });
}

// Customers data
export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: api.getCustomers,
  });
}
// users data
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: api.getAllUsers,
  });
}
