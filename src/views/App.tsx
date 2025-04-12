// src/views/App.tsx
import React from 'react';
import '../css/style.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Import pages
import Dashboard from './pages/dashboard/Dashboard';
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
import ActivityStream from './pages/manage-organization/ActivityStream/ActivityStream';
import ApiKeys from './pages/manage-organization/ApiKeys/ApiKeys';
import OrganizationSettings from './pages/manage-organization/OrganizationSettings/OrganizationSettings';

// Import project pages
import ProjectOverview from './pages/manage-projects/ProjectOverview/ProjectOverview';
import Languages from './pages/manage-projects/Languages/Languages';
import WebHooks from './pages/manage-projects/WebHooks/WebHooks';
import StyleGuide from './pages/manage-projects/StyleGuide/StyleGuide';
import Integration from './pages/manage-projects/Integration/Integration';
import Widget from './pages/manage-projects/Widget/Widget';
import ProjectSettings from './pages/manage-projects/ProjectSettings/ProjectSettings';

// Import phrase pages
import ManagePhrases from './pages/phrases/ManagePhrases/ManagePhrases';
import CatTool from './pages/phrases/CatTool/CatTool';
import Glossary from './pages/phrases/Glossary/Glossary';
import FileMangment from './pages/phrases/FileMangment/FileMangment';
import ContextEditor from './pages/phrases/ContextEditor/ContextEditor';
import PageManger from './pages/phrases/PageManger/PageManger';
import LableManager from './pages/phrases/LableManager/LableManager';
import DynamicPhrases from './pages/phrases/DynamicPhrases/DynamicPhrases';

// Import other pages
import Orders from './pages/orders/Orders';
import Reports from './pages/reports/Reports';

import ThemeProvider from '../utils/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

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

            // Orders and Reports routes
            { path: 'orders', element: <Orders /> },
            { path: 'reports', element: <Reports /> },

            // Phrases management routes
            { path: 'manage-phrases', element: <ManagePhrases /> },
            { path: 'cat-tool', element: <CatTool /> },
            { path: 'glossary', element: <Glossary /> },
            { path: 'file-managment', element: <FileMangment /> },
            { path: 'context-editor', element: <ContextEditor /> },
            { path: 'page-manager', element: <PageManger /> },
            { path: 'lable-manager', element: <LableManager /> },
            { path: 'dynamic-phrases', element: <DynamicPhrases /> },
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
            { path: 'web-hooks', element: <WebHooks /> },
            { path: 'style-guide', element: <StyleGuide /> },
            { path: 'integration', element: <Integration /> },
            { path: 'widget', element: <Widget /> },
            { path: 'project-settings', element: <ProjectSettings /> },
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
            { path: 'activity-stream', element: <ActivityStream /> },
            { path: 'api-keys', element: <ApiKeys /> },
            {
              path: 'organization-settings',
              element: <OrganizationSettings />,
            },
          ],
        },
      ],
    },

    // 404 page
    // {
    //   path: '*',
    //   element: <NotFoundPage />,
    // },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
      {/* Add React Query Devtools (visible only in development) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
