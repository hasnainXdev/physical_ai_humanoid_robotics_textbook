import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from '@docusaurus/router';

const UserProfile = () => {
  const { state, signOut } = useAuth();
  const [hardwareBackground, setHardwareBackground] = useState('');
  const [softwareBackground, setSoftwareBackground] = useState('');
  const history = useHistory();

  // Load user profile data if available
  useEffect(() => {
    // In a real implementation, this would fetch user profile data from the API
    // For now, we just set empty values
    setHardwareBackground('');
    setSoftwareBackground('');
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      history.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // If user is not authenticated, redirect to login or show a message
  if (!state.isAuthenticated) {
    return (
      <Layout title="User Profile">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <div className={styles.profileContainer}>
                <h2>Access Denied</h2>
                <p>Please <a href="/login">log in</a> to view your profile.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would save the profile data to the backend
    alert('Profile information saved successfully!');
  };

  return (
    <Layout title="User Profile">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className={styles.profileContainer}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Welcome, {state.user?.username || 'User'}!</h2>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>

              <p>Email: {state.user?.email || 'Not provided'}</p>

              <form onSubmit={handleSubmit}>
                <div className={styles.formControl}>
                  <label htmlFor="hardware">Hardware Background</label>
                  <textarea
                    id="hardware"
                    rows={5}
                    value={hardwareBackground}
                    onChange={(e) => setHardwareBackground(e.target.value)}
                  ></textarea>
                </div>
                <div className={styles.formControl}>
                  <label htmlFor="software">Software Background</label>
                  <textarea
                    id="software"
                    rows={5}
                    value={softwareBackground}
                    onChange={(e) => setSoftwareBackground(e.target.value)}
                  ></textarea>
                </div>
                <div className={styles.formActions}>
                  <button type="submit">Save Profile</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
