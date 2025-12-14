import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock the history push function
jest.mock('@docusaurus/router', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('Session Management', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    mockLocalStorage.clear();
  });

  it('should initialize auth state based on existing token', () => {
    // Set a mock token in localStorage
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzAxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    mockLocalStorage.setItem('better-auth-token', mockToken);

    // Create a component that uses the auth context
    const TestComponent = () => {
      const { state } = useAuth();
      return <div>{state.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Check that the user is authenticated based on the token
    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });

  it('should not initialize auth state if token is expired', async () => {
    // Set an expired token (exp = 1 which is in the past)
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MX0.something';
    mockLocalStorage.setItem('better-auth-token', expiredToken);

    // Create a component that uses the auth context
    const TestComponent = () => {
      const { state } = useAuth();
      return <div>{state.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Check that the user is not authenticated because the token is expired
    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
    
    // Check that the expired token was removed from localStorage
    await waitFor(() => {
      expect(mockLocalStorage.getItem('better-auth-token')).toBeNull();
    });
  });

  it('should clear authentication state on logout', async () => {
    // Set a valid token in localStorage
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzAxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    mockLocalStorage.setItem('better-auth-token', mockToken);

    // Create a component that uses the auth context and dispatches logout
    const LogoutTestComponent = () => {
      const { state, dispatch } = useAuth();
      
      const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
      };
      
      return (
        <div>
          <div>{state.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <LogoutTestComponent />
      </AuthProvider>
    );

    // Initially authenticated
    expect(screen.getByText('Authenticated')).toBeInTheDocument();
    
    // Click logout
    const logoutButton = screen.getByText('Logout');
    logoutButton.click();
    
    // Should no longer be authenticated
    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
  });
});