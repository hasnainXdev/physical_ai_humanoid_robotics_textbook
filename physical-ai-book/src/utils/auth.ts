// Utility functions for authentication
import { AuthAction } from '../contexts/AuthContext';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';


const { siteConfig: { customFields } } = useDocusaurusContext();
/**
 * Validate password strength according to spec requirements
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Minimum length of 8 characters
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // At least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${customFields.backendUrl}/api/auth/reset-password/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Password reset request failed');
    }

    return { success: true, message: data.message || 'Password reset email sent successfully' };
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Confirm password reset
 */
export const confirmPasswordReset = async (
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${customFields.backendUrl}/api/auth/reset-password/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }

    return { success: true, message: data.message || 'Password reset successfully' };
  } catch (error: any) {
    console.error('Password reset confirmation error:', error);
    return { success: false, message: error.message };
  }
};