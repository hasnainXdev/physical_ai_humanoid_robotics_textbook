import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from '@docusaurus/Link'; // Docusaurus Link component

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Optional fallback component to show when not authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <div>Please log in to access this content. <Link to="/login">Login</Link></div>
}) => {
  const { state } = useAuth();

  // If user is not authenticated, show fallback
  if (!state.isAuthenticated) {
    return fallback;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;