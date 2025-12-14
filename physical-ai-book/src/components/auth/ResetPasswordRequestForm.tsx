import React, { useState } from 'react';
import { requestPasswordReset } from '../../utils/auth';
import Link from '@docusaurus/Link';

interface ResetPasswordRequestFormProps {
  onPasswordResetRequestSuccess?: () => void;
}

const ResetPasswordRequestForm: React.FC<ResetPasswordRequestFormProps> = ({ onPasswordResetRequestSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setSuccessMessage(result.message || 'Password reset email sent. Please check your inbox.');
        if (onPasswordResetRequestSuccess) {
          onPasswordResetRequestSuccess();
        }
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Password reset request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-request-form">
      <h3>Reset Password</h3>
      {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {successMessage && <div className="success" style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
      
      <p style={{ marginBottom: '20px' }}>Enter your email address and we'll send you a link to reset your password.</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
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
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>Remember your password? <Link to="/login">Back to Login</Link></p>
      </div>
    </div>
  );
};

export default ResetPasswordRequestForm;