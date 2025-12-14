import React from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '@site/src/contexts/AuthContext';

// This component can be used to conditionally render auth-related items
// For use in pages/layouts where dynamic auth UI is needed
const AuthControls = () => {
  const { state, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // The UI will automatically update via context state changes
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (state.isAuthenticated && state.user) {
    // Authenticated user - show profile and logout
    return (
      <div className="auth-controls">
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

  // Non-authenticated user - show login and register
  return (
    <div className="auth-controls">
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

export default AuthControls;