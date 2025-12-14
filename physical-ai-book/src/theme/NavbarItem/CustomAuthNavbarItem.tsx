import React from 'react';
import NavbarItem from '@theme/NavbarItem';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/contexts/AuthContext';
import { useHistory, useLocation } from '@docusaurus/router';

const CustomAuthNavbarItem = () => {
  const { state } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const handleLogout = async () => {
    // Remove token from localStorage
    localStorage.removeItem('better-auth-token');

    // Dispatch logout action to update context
    // Note: In a real implementation, you might want to call an actual logout API
    window.location.reload(); // Simple refresh to update UI state
  };

  // If user is authenticated, show profile link and logout
  if (state.isAuthenticated && state.user) {
    return (
      <div className="navbar__item navbar__item--right">
        <Link
          to="/profile"
          className="button button--secondary button--sm margin-right--sm"
        >
          Profile ({state.user.username})
        </Link>
        <button
          onClick={handleLogout}
          className="button button--outline button--sm"
        >
          Logout
        </button>
      </div>
    );
  }

  // If user is not authenticated, show login and register buttons
  return (
    <div className="navbar__item navbar__item--right">
      <Link
        to="/login"
        className="button button--secondary button--sm margin-right--sm"
        style={{ textDecoration: 'none' }}
      >
        Log in
      </Link>
      <Link
        to="/register"
        className="button button--primary button--sm"
        style={{ textDecoration: 'none' }}
      >
        Sign up
      </Link>
    </div>
  );
};

export default CustomAuthNavbarItem;