import React from 'react';
import {useNavigate} from 'react-router';
import styles from './HomePage.module.css';
import AuthContext from '../../providers/AuthProvider';

function HomePage() {
    const {user} = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Welcome to Dissertation Registration System</h1>
            <div className={styles.buttonContainer}>
                {user ? (
                    <button
                        className={styles.button}
                        onClick={() => user.role === "professor" ? handleNavigate('/professor-dashboard') : handleNavigate('/student-dashboard')}
                    >
                        Go to Dashboard
                    </button>
                ) : (
                    <>
                        <button
                            className={styles.button}
                            onClick={() => handleNavigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => handleNavigate('/register')}
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomePage;
