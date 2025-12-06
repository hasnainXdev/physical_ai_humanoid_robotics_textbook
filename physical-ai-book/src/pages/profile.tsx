import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const UserProfile = () => {
  return (
    <Layout title="User Profile">
      <div className="container">
        <div className={styles.profileContainer}>
          <h2>User Profile</h2>
          <form>
            <div className={styles.formControl}>
              <label htmlFor="hardware">Hardware Background</label>
              <textarea id="hardware" rows={5}></textarea>
            </div>
            <div className={styles.formControl}>
              <label htmlFor="software">Software Background</label>
              <textarea id="software" rows={5}></textarea>
            </div>
            <div className={styles.formActions}>
              <button type="submit">Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
