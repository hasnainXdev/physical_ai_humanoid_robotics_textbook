import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import LoginForm from '../../components/auth/LoginForm';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock the useRouter hook
jest.mock('@docusaurus/router', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

// Create a wrapper component to provide auth context for testing
const AuthContextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

describe('LoginForm', () => {
  const mockLoginUser = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <AuthContextWrapper>
        <LoginForm />
      </AuthContextWrapper>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username or Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows error when trying to login with empty fields', async () => {
    render(
      <AuthContextWrapper>
        <LoginForm />
      </AuthContextWrapper>
    );

    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);

    // Check for validation error (browser's built-in validation)
    const usernameInput = screen.getByLabelText('Username or Email');
    expect(usernameInput).toBeInvalid();

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toBeInvalid();
  });

  it('submits the form with valid credentials', async () => {
    // Mock the loginUser function
    jest.mock('../../utils/auth', () => ({
      loginUser: (username: string, password: string) => 
        Promise.resolve({ user: { id: '1', username: 'testuser', email: 'test@example.com' }, token: 'fake-token' })
    }));

    const { loginUser } = require('../../utils/auth');
    
    render(
      <AuthContextWrapper>
        <LoginForm />
      </AuthContextWrapper>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username or Email'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'ValidPass123!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('testuser', 'ValidPass123!');
    });
  });

  it('shows error message on login failure', async () => {
    // Mock the loginUser function to return an error
    jest.mock('../../utils/auth', () => ({
      loginUser: (username: string, password: string) => 
        Promise.resolve({ error: 'Invalid credentials' })
    }));

    render(
      <AuthContextWrapper>
        <LoginForm />
      </AuthContextWrapper>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username or Email'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});