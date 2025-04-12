// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  AuthResponse,
  LoginCredentials,
  RegisterDto,
  User,
} from '../../types/auth.types';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup axios interceptor
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Auth API functions
const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return Promise.reject(error?.response?.data || error);
    }
  },

  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      // First try to get user from API
      const response = await api.get<User>('/auth/profile');
      return response.data;
    } catch (error) {
      // If API call fails, check if we have stored user data
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        return JSON.parse(storedUser) as User;
      }
      // If nothing works, throw the original error
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    // Clear the token from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Clear the axios instance headers
    delete api.defaults.headers.common['Authorization'];
  },
};

/**
 * Custom hook that provides authentication functionality using React Query
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser) as User;
        // Preload the user data into the query cache
        queryClient.setQueryData(['currentUser'], user);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        // Clear invalid data
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }

    setIsInitialized(true);
  }, [queryClient]);

  // Query for fetching the current user
  const {
    data: user,
    isLoading,
    error,
    refetch,
  }: any = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    // Only run this query once initialization is complete and we have a token
    enabled: isInitialized && !!localStorage.getItem('auth_token'),
    // Keep the previous data while fetching new data
    keepPreviousData: true,
    // Return stale data if error occurs during fetch
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
    // If getCurrentUser fails, don't retry immediately
    retry: false,
    // Add error and success handlers
    onError: (error) => {
      console.error('Failed to fetch user profile', error);
      // If we can't get the user profile, clear the auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
    onSuccess: (userData) => {
      // Make sure we always have the latest user data in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store token and user info
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      // Update the cached user data
      queryClient.setQueryData(['currentUser'], data.user);

      // Invalidate any queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(['currentUser'], null);

      // Reset the cache completely
      queryClient.clear();
    },
  });

  // Helper function to check roles
  const hasRole = (requiredRoles: string | string[]): boolean => {
    if (!user) return false;

    // If no roles are required, return true
    if (
      !requiredRoles ||
      (Array.isArray(requiredRoles) && requiredRoles.length === 0)
    ) {
      return true;
    }

    // Always grant access to system admins
    if (user.isSystemAdmin) {
      return true;
    }

    // Check for specific roles
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.some((role) => user.role === role);
    }

    return user.role === requiredRoles;
  };

  // Helper function to check permissions
  const hasPermission = (requiredPermissions: string | string[]): boolean => {
    if (!user) return false;

    // If no permissions are required, return true
    if (
      !requiredPermissions ||
      (Array.isArray(requiredPermissions) && requiredPermissions.length === 0)
    ) {
      return true;
    }

    // Always grant permissions to system admins
    if (user.isSystemAdmin) {
      return true;
    }

    // If user has no permissions defined, return false
    if (!user.permissions || user.permissions.length === 0) {
      return false;
    }

    // Check for specific permissions
    if (Array.isArray(requiredPermissions)) {
      return requiredPermissions.some((permission) =>
        user.permissions?.includes(permission)
      );
    }

    return user.permissions.includes(requiredPermissions);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized || isLoading,
    error,

    login: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutateAsync,
    isRegisterLoading: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutateAsync,
    isLogoutLoading: logoutMutation.isPending,

    refetch,
    hasRole,
    hasPermission,
  };
}
