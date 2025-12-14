import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../../components/auth/RegisterForm';
import { AuthProvider } from '../../contexts/AuthContext';

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

describe('RegisterForm', () => {
  it('renders correctly', () => {
    render(
      <AuthContextWrapper>
        <RegisterForm />
      </AuthContextWrapper>
    );

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(
      <AuthContextWrapper>
        <RegisterForm />
      </AuthContextWrapper>
    );

    // Fill in the form with mismatched passwords
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Different123!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('submits the form with matching passwords', async () => {
    // Mock the registerUser function
    jest.mock('../../utils/auth', () => ({
      registerUser: (username: string, email: string, password: string) => 
        Promise.resolve({ user: { id: '1', username: 'testuser', email: 'test@example.com' }, token: 'fake-token' })
    }));

    const { registerUser } = require('../../utils/auth');
    
    render(
      <AuthContextWrapper>
        <RegisterForm />
      </AuthContextWrapper>
    );

    // Fill in the form with matching passwords
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password123!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'Password123!');
    });
  });

  it('shows validation errors for weak passwords', async () => {
    render(
      <AuthContextWrapper>
        <RegisterForm />
      </AuthContextWrapper>
    );

    // Fill in the form with a weak password (less than 8 chars)
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'weak' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'weak' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    // Wait for the validation errors to appear
    await waitFor(() => {
      const errorElements = screen.getAllByText(/password must be at least 8 characters long|password must contain at least one uppercase letter|password must contain at least one number|password must contain at least one special character/i);
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });
});