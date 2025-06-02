import React, { createContext, useContext, ReactNode } from 'react';

import {
  AuthResponse,
  LoginCredentials,
  RegisterDto,
  User,
} from '../types/auth.types';
import { useAuth } from '@/api/hooks/useAuth';

// Define the shape of the auth context
interface AuthContextType {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;

  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  isLoginLoading: boolean;
  loginError: Error | null;

  register: (userData: RegisterDto) => Promise<AuthResponse>;
  isRegisterLoading: boolean;
  registerError: Error | null;

  logout: () => Promise<void>;
  isLogoutLoading: boolean;

  hasRole: (requiredRoles: string | string[]) => boolean;
  hasPermission: (requiredPermissions: string | string[]) => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps your app and provides auth context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Get all auth functionality from our custom hook
  const auth = useAuth();

  // Provide the auth context to children components
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};
