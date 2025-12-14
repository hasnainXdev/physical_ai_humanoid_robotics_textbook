import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define types for user and auth state
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Define actions
export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'CHECK_AUTH_STATUS'; payload: { user: User; token: string } };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<void>;
} | undefined>(undefined);

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'CHECK_AUTH_STATUS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Better Auth API functions
  const betterAuthSignIn = async (email: string, password: string) => {
    try {
      const backendUrl = (window as any).__BACKEND_URL__ || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      // Extract user and token from the response
      const { user, token } = data.data || data;

      // Store token in localStorage
      if (token) {
        localStorage.setItem('better-auth-token', token);
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            id: user.id,
            username: user.name || user.username || '',
            email: user.email || ''
          },
          token: token
        }
      });
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Sign in failed'
      });
      throw error;
    }
  };

  const betterAuthSignOut = async () => {
    try {
      const backendUrl = (window as any).__BACKEND_URL__ || 'http://localhost:8000';
      await fetch(`${backendUrl}/api/auth/sign-out`, {
        method: 'POST',
      });

      // Remove token from localStorage
      localStorage.removeItem('better-auth-token');

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if the API call fails, clear local state
      localStorage.removeItem('better-auth-token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const betterAuthSignUp = async (email: string, username: string, password: string) => {
    try {
      const backendUrl = (window as any).__BACKEND_URL__ || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      // Extract user and token from the response
      const { user, token } = data.data || data;

      // Store token in localStorage
      if (token) {
        localStorage.setItem('better-auth-token', token);
      }

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: {
            id: user.id,
            username: user.name || user.username || '',
            email: user.email || ''
          },
          token: token
        }
      });
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Sign up failed'
      });
      throw error;
    }
  };

  // Check if user is already authenticated on initial load or when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('better-auth-token');
      if (token) {
        try {
          // Verify the token by fetching user session
          const backendUrl = (window as any).__BACKEND_URL__ || 'http://localhost:8000';
          const response = await fetch(`${backendUrl}/api/auth/session`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const sessionData = await response.json();
            const user = sessionData.user || sessionData.data?.user;

            if (user) {
              dispatch({
                type: 'CHECK_AUTH_STATUS',
                payload: {
                  user: {
                    id: user.id,
                    username: user.name || user.username || '',
                    email: user.email || ''
                  },
                  token: token
                }
              });
            } else {
              // If no user in response, token might be invalid
              localStorage.removeItem('better-auth-token');
            }
          } else {
            // If session verification fails, remove the token
            localStorage.removeItem('better-auth-token');
          }
        } catch (e) {
          // If there's an error verifying the token, remove it
          localStorage.removeItem('better-auth-token');
        }
      }
    };

    checkAuthStatus();
  }, []);

  const contextValue = {
    state,
    dispatch,
    signIn: betterAuthSignIn,
    signOut: betterAuthSignOut,
    signUp: betterAuthSignUp
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the provider for use in main app
export default AuthContext;