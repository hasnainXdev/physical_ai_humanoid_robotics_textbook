import React, { useState, useEffect } from 'react';
import { confirmPasswordReset, validatePasswordStrength } from '../../utils/auth';
import { useHistory, useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';

interface ResetPasswordFormProps {
  onPasswordResetSuccess?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onPasswordResetSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const history = useHistory();
  const location = useLocation();

  // Extract token from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Password reset token is missing. Please try resetting your password again.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      setValidationErrors(passwordValidation.errors);
      setIsLoading(false);
      return;
    } else {
      setValidationErrors([]);
    }

    try {
      // Make sure we have a token
      if (!token) {
        setError('Password reset token is missing.');
        setIsLoading(false);
        return;
      }

      const result = await confirmPasswordReset(token, newPassword);

      if (result.success) {
        setSuccessMessage(result.message || 'Password reset successfully!');
        if (onPasswordResetSuccess) {
          onPasswordResetSuccess();
        }
        // Redirect to login after a delay
        setTimeout(() => {
          history.push('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-form">
      <h3>Reset Your Password</h3>
      {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {successMessage && <div className="success" style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
      
      {token ? (
        <>
          <p style={{ marginBottom: '20px' }}>Please enter your new password.</p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px' }}>New Password:</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm New Password:</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            {validationErrors.length > 0 && (
              <div className="validation-errors" style={{ color: 'orange', marginBottom: '10px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                padding: '10px 15px', 
                backgroundColor: isLoading ? '#cccccc' : '#007cba', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </>
      ) : (
        <p>Invalid password reset link. Please try resetting your password again.</p>
      )}
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>Remember your password? <Link to="/login">Back to Login</Link></p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;