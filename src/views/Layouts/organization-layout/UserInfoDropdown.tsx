// src/views/components/UserInfoDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Default avatar if user doesn't have one
// import DefaultAvatar from '../../images/user-avatar-32.png';
import { useAuthContext } from '@/context/AuthContext';
import { Role } from '@/types/auth.types';
import Transition from '@/utils/Transition';

const UserInfoDropdown: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, isLogoutLoading } = useAuthContext();
  const navigate = useNavigate();

  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current?.contains(target as Node)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user's full name or email to display
  const displayName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email);

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case Role.ADMIN:
        return 'Administrator';
      case Role.MANAGER:
        return 'Manager';
      case Role.MEMBER:
        return 'Team Member';
      default:
        return role;
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="w-8 h-8 rounded-full"
          //   src={DefaultAvatar}
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {displayName || 'Guest'}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      {/* @ts-ignore */}
      <Transition
        className="origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 right-0"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">
              {displayName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              {user?.role ? getRoleDisplayName(user.role) : 'Guest'}
              {user?.isSystemAdmin && ' (System Admin)'}
            </div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/settings"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg
                  className="w-4 h-4 mr-2 fill-current text-violet-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                </svg>
                <span>Settings</span>
              </Link>
            </li>
            {/* Admin specific menu items */}
            {user?.role === Role.ADMIN && (
              <li>
                <Link
                  className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                  to="/admin-console"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <svg
                    className="w-4 h-4 mr-2 fill-current text-violet-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a5 5 0 10.001 10.001A5 5 0 008 1zm0 8C6.343 9 5 7.657 5 6s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                    <path d="M13 14h-2v-2c0-.6-.4-1-1-1H6c-.6 0-1 .4-1 1v2H3c-.6 0-1 .4-1 1v1h12v-1c0-.6-.4-1-1-1z" />
                  </svg>
                  <span>Admin Console</span>
                </Link>
              </li>
            )}
            <li>
              <button
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3 w-full text-left"
                onClick={handleLogout}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? (
                  <svg
                    className="animate-spin w-4 h-4 mr-2 fill-current text-violet-500"
                    viewBox="0 0 16 16"
                  >
                    <circle
                      className="opacity-25"
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M8 1a7 7 0 00-7 7h2a5 5 0 0110 0h2a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-2 fill-current text-violet-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7 14c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1s1 .4 1 1v10c0 .6-.4 1-1 1z" />
                    <path d="M11 8c0-.6-.4-1-1-1H3c-.6 0-1 .4-1 1s.4 1 1 1h7c.6 0 1-.4 1-1z" />
                  </svg>
                )}
                <span>{isLogoutLoading ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
};

export default UserInfoDropdown;
