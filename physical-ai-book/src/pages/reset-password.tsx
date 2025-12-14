import React, { JSX } from 'react';
import Layout from '@theme/Layout';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

export default function ResetPassword(): JSX.Element {
  return (
    <Layout title="Set New Password" description="Set a new password using the reset token">
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
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Set New Password</h1>
                <ResetPasswordForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}