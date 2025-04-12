import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuthContext } from '@/context/AuthContext';

const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <svg
          className="w-24 h-24 mx-auto text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-6">
          Access Denied
        </h2>

        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>

        <div className="mt-6">
          {user ? (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Logged in as <span className="font-semibold">{user.email}</span>{' '}
                with role <span className="font-semibold">{user.role}</span>
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                <Link
                  to="/dashboard"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Go to Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Sign In with Different Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
