import React, { useState } from 'react';
import styles from './styles.module.css';

// TODO: Security Hardening
// - Implement input validation to prevent XSS attacks.
// - Use a secure method for handling authentication (e.g., JWT, OAuth).
// - Implement CSRF protection.
// - Ensure secure session management.
// - Use HTTPS in production.

const BetterAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className={styles.authContainer}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form>
        {!isLogin && (
          <div className={styles.formControl}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" required />
          </div>
        )}
        <div className={styles.formControl}>
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" required />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required />
        </div>
        <div className={styles.formActions}>
          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
          <button type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BetterAuth;
