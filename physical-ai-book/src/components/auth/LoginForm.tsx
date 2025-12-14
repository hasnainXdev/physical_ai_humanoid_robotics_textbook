import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';

interface LoginFormProps {
  onLoginSuccess?: () => void; // Callback function when login is successful
  switchToRegister?: () => void; // Callback to switch to register form
  redirectTo?: string; // Where to redirect after successful login (default: home)
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, switchToRegister, redirectTo = '/' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth(); // Using the new Better Auth function
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Using the new Better Auth sign-in function from context
      await signIn(email, password);

      // Execute the callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Redirect to the specified location or home
      history.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h3>Login</h3>
      {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleLogin}>
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

        <div style={{ marginBottom: '15px', textAlign: 'right' }}>
          <Link to="/reset-password-request" style={{ fontSize: '0.9em' }}>
            Forgot password?
          </Link>
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
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>Don't have an account? <button
          type="button"
          onClick={switchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: '#007cba',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Register
        </button></p>
      </div>
    </div>
  );
};

export default LoginForm;