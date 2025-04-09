import '../css/style.css';
// Import pages
import Dashboard from './pages/Dashboard/Dashboard';
import Layout from './Layouts/Layout/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import OrganizationOverview from './pages/ManageOrganization/OrganizationOverview/OrganizationOverview';
import Team from './pages/ManageOrganization/Team/Team';
import ActivityStream from './pages/ManageOrganization/ActivityStream/ActivityStream';
import ApiKeys from './pages/ManageOrganization/ApiKeys/ApiKeys';
import OrganizationSettings from './pages/ManageOrganization/OrganizationSettings/OrganizationSettings';

import ProjectOverview from './pages/ManageProjects/ProjectOverview/ProjectOverview';
import Languages from './pages/ManageProjects/Languages/Languages';
import WebHooks from './pages/ManageProjects/WebHooks/WebHooks';
import StyleGuide from './pages/ManageProjects/StyleGuide/StyleGuide';
import Integration from './pages/ManageProjects/Integration/Integration';
import Widget from './pages/ManageProjects/Widget/Widget';
import ProjectSettings from './pages/ManageProjects/ProjectSettings/ProjectSettings';

import ManagePhrases from './pages/Phrases/ManagePhrases/ManagePhrases';
import CatTool from './pages/Phrases/CatTool/CatTool';
import Glossary from './pages/Phrases/Glossary/Glossary';
import FileMangment from './pages/Phrases/FileMangment/FileMangment';
import ContextEditor from './pages/Phrases/ContextEditor/ContextEditor';
import PageManger from './pages/Phrases/PageManger/PageManger';
import LableManager from './pages/Phrases/LableManager/LableManager';
import DynamicPhrases from './pages/Phrases/DynamicPhrases/DynamicPhrases';

import Orders from './pages/Orders/Orders';

import Reports from './pages/Reports/Reports';

import Login from './pages/Login/Login';

import UsersContextProvider from '../context/UserContext';

function App() {
  const routing = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        // Default route //
        { index: true, element: <Dashboard /> },
        { path: 'dashboard', element: <Dashboard /> },

        // Manage Organization routes //
        { path: 'organization-overview', element: <OrganizationOverview /> },
        { path: 'team', element: <Team /> },
        { path: 'activity-stream', element: <ActivityStream /> },
        { path: 'api-keys', element: <ApiKeys /> },
        { path: 'organization-settings', element: <OrganizationSettings /> },

        // Manage Project routes //
        { path: 'project-overview', element: <ProjectOverview /> },
        { path: 'languages', element: <Languages /> },
        { path: 'style-guide', element: <StyleGuide /> },
        { path: 'web-hooks', element: <WebHooks /> },
        { path: 'integration', element: <Integration /> },
        { path: 'widget', element: <Widget /> },
        { path: 'project-settings', element: <ProjectSettings /> },

        // Manage Phrases routes //
        { path: 'manage-phrases', element: <ManagePhrases /> },
        { path: 'cat-tool', element: <CatTool /> },
        { path: 'glossary', element: <Glossary /> },
        { path: 'file-managment', element: <FileMangment /> },
        { path: 'context-editor', element: <ContextEditor /> },
        { path: 'lable-manager', element: <LableManager /> },
        { path: 'page-manager', element: <PageManger /> },
        { path: 'dynamic-phrases', element: <DynamicPhrases /> },

        //  Other ------ routes  //
        { path: 'orders', element: <Orders /> },
        { path: 'reports', element: <Reports /> },

        { path: 'signin', element: <Login /> },
      ],
    },
  ]);
  // const location = useLocation();

  // useEffect(() => {
  //   document.querySelector('html').style.scrollBehavior = 'auto'
  //   window.scroll({ top: 0 })
  //   document.querySelector('html').style.scrollBehavior = ''
  // }, [location.pathname]); // triggered on route change

  return (
    <UsersContextProvider>
      <RouterProvider router={routing}></RouterProvider>
    </UsersContextProvider>
  );
}

export default App;
