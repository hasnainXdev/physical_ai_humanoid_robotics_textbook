import React, { JSX } from 'react';
import Layout from '@theme/Layout';
import ResetPasswordRequestForm from '../components/auth/ResetPasswordRequestForm';

export default function ResetPasswordRequest(): JSX.Element {
  return (
    <Layout title="Reset Password" description="Request a password reset link">
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
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Reset Password</h1>
                <ResetPasswordRequestForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}