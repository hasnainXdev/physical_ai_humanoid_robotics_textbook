import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../utils/auth';
import { useHistory } from '@docusaurus/router';

interface LogoutButtonProps {
  onLogout?: () => void; // Callback function when logout is successful
  redirectTo?: string; // Where to redirect after logout (default: home)
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, redirectTo = '/' }) => {
  const { dispatch } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await logoutUser();
      
      // Update the auth state to reflect logout
      dispatch({ type: 'LOGOUT' });
      
      // Execute the callback if provided
      if (onLogout) {
        onLogout();
      }
      
      // Redirect to the specified location or home
      history.push(redirectTo);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      style={{ 
        padding: '8px 16px', 
        backgroundColor: '#dc3545', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;