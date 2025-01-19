import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { toast } from "react-hot-toast";
import styles from './LoginPage.module.css';

import AuthContext from "../../providers/AuthProvider";

function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const user = await login(username, password);
      if (user.role === 'student') {
        navigate('/student-dashboard');
      } else if (user.role === 'professor') {
        navigate('/professor-dashboard');
      } else {
        navigate('/');
      }
      toast.success('Logged in successfully');
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Login</h2>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
  );
}

export default LoginPage;