import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validatePasswordStrength } from '../../utils/auth';
import { useHistory } from '@docusaurus/router';

interface RegisterFormProps {
  onRegistrationSuccess?: () => void; // Callback function when registration is successful
  switchToLogin?: () => void;        // Callback to switch to login form
  redirectTo?: string; // Where to redirect after successful registration (default: home)
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistrationSuccess, switchToLogin, redirectTo = '/' }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth(); // Using the new Better Auth function
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      setValidationErrors(passwordValidation.errors);
      setIsLoading(false);
      return;
    } else {
      setValidationErrors([]);
    }

    try {
      // Using the new Better Auth sign-up function from context
      await signUp(email, username, password);

      setSuccessMessage('Registration successful! Redirecting...');

      // Execute the callback if provided
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }

      // Redirect to the specified location or home
      setTimeout(() => {
        history.push(redirectTo);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h3>Create Account</h3>
      {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {successMessage && <div className="success" style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

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

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
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
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>Already have an account? <button
          type="button"
          onClick={switchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#007cba',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Login
        </button></p>
      </div>
    </div>
  );
};

export default RegisterForm;