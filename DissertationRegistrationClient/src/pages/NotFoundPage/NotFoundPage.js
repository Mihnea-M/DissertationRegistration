import React from 'react';
import { useNavigate } from 'react-router';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(-1);
  };

  return (
      <div className={styles.container}>
        <h1 className={styles.heading}>404 - Page Not Found</h1>
        <p className={styles.message}>Sorry, the page you are looking for does not exist.</p>
        <button className={styles.button} onClick={handleGoHome}>Go Back</button>
      </div>
  );
}

export default NotFoundPage;