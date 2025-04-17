// src/views/App.tsx
import React from 'react';
import '../css/style.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Import pages

import OrganizationLayout from './Layouts/organization-layout/Layout';
import LoginPage from './pages/auth/login/Login';
import UnauthorizedPage from './pages/auth/unauthorized/Unauthorized';
// import NotFoundPage from './pages/NotFoundPage';

// Import protected routes
import { Role } from '../types/auth.types';
import ProtectedRoute from './components/ProtectedRoute';

// Import organization pages
import OrganizationOverview from './pages/manage-organization/OrganizationOverview/OrganizationOverview';
import Team from './pages/manage-organization/Team/Team';

// Import project pages
import ProjectOverview from './pages/manage-projects/ProjectOverview/ProjectOverview';
import Languages from './pages/manage-projects/Languages/Languages';

import ThemeProvider from '../utils/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import ManagePhrases from './pages/Phrases/ManagePhrases/ManagePhrases';
import UserContextProvider from '@/context/UserContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  // Create router with protected routes
  const router = createBrowserRouter([
    // Public routes - no authentication required
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'unauthorized',
      element: <UnauthorizedPage />,
    },

    // Protected routes - authentication required
    {
      element: <ProtectedRoute />, // Basic auth check - all authenticated users
      children: [
        {
          path: '/',
          element: <OrganizationLayout />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'manage-phrases', element: <ManagePhrases /> },
            // { path: 'page-manager', element: <PageManger /> },
          ],
        },
      ],
    },

    // Manager/Admin routes - requires manager or admin role
    {
      element: <ProtectedRoute requiredRoles={[Role.MANAGER, Role.ADMIN]} />,
      children: [
        {
          path: '/',
          element: <OrganizationLayout />,
          children: [
            // Project management routes
            { path: 'project-overview', element: <ProjectOverview /> },
            { path: 'languages', element: <Languages /> },
          ],
        },
      ],
    },

    // Admin only routes
    {
      element: <ProtectedRoute requiredRoles={[Role.ADMIN]} />,
      children: [
        {
          path: '/',
          element: <OrganizationLayout />,
          children: [
            // Organization management routes
            {
              path: 'organization-overview',
              element: <OrganizationOverview />,
            },
            { path: 'team', element: <Team /> },
          ],
        },
      ],
    }
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserContextProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </UserContextProvider>
      </ThemeProvider>
      {/* Add React Query Devtools (visible only in development) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
