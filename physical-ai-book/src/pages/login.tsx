import React from 'react';
import Layout from '@theme/Layout';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import Link from '@docusaurus/Link';

export default function Login(): React.JSX.Element {
  const { state } = useAuth();

  // If user is already authenticated, show a message instead of the login form
  if (state.isAuthenticated) {
    return (
      <Layout title="Login" description="Sign in to your account">
        <main>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Welcome Back!</h1>
            <p>You are already logged in as {state.user?.username}.</p>
            <Link to="/">Go to Home</Link>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Login" description="Sign in to your account">
      <main>
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <div style={{
                padding: '2rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign In</h1>
                <LoginForm
                  onLoginSuccess={() => {
                    // Handle successful login, maybe redirect or update UI
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}