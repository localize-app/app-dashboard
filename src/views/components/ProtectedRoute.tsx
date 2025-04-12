import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthContext } from '@/context/AuthContext';

interface ProtectedRouteProps {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  redirectPath?: string;
}

/**
 * A route wrapper component that checks authentication and authorization before
 * rendering the child route components.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles = [],
  requiredPermissions = [],
  redirectPath = '/login',
}) => {
  const { isAuthenticated, hasRole, hasPermission, isLoading } =
    useAuthContext();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has the required roles
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check if user has the required permissions
  if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and authorized, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
