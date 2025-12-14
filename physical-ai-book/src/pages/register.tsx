import React from 'react';
import Layout from '@theme/Layout';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

export default function Register(): React.JSX.Element {
  const { state } = useAuth();

  // If user is already authenticated, redirect to homepage
  if (state.isAuthenticated) {
    return (
      <Layout title="Register" description="Create a new account">
        <main>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>You are already logged in</h1>
            <p>You are already registered and logged in.</p>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Register" description="Create a new account">
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
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h1>
                <RegisterForm
                  onRegistrationSuccess={() => {
                    // After successful registration, user can be redirected
                    // This would typically be handled by the parent component or through navigation
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