import React from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import styles from './Header.module.css';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';

import AuthContext from '../../providers/AuthProvider';

function Header() {
    const { user, logout } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const iconButtonRef = React.useRef(null);

    const handleMenuOpen = (event) => {
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        setMenuOpen(false)
        navigate('/');
        await logout();
        toast.success('Logged out successfully');
    };

    const handleSettings = () => {
        navigate('/settings');
        handleMenuClose();
    };

    const UserIcon = () => {
        if (user?.role === 'student') return <SchoolIcon />;
        if (user?.role === 'professor') return <PersonIcon />;
        return <AccountCircleIcon />;
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">Dissertation Registration</Link>
            </div>
            <nav className={styles.nav}>
                {user ? (
                    <>
                        <Tooltip title="Account">
                            <IconButton
                                onClick={handleMenuOpen}
                                ref={iconButtonRef}
                                sx={{
                                    backgroundColor: '#005bb5',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '0.3rem',
                                    '&:hover': { backgroundColor: '#003f7f' }
                                }}
                            >
                                <UserIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={iconButtonRef.current}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            classes={{ paper: styles.menuPaper }}
                        >
                            <MenuItem disabled className={styles.menuUsername}>
                                <Typography variant="body1">{user.name}</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleSettings}>Settings</MenuItem>
                            <MenuItem onClick={handleLogout} sx={{color: '#d32f2f'}}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Link to="/login" className={styles.loginButton}>Login</Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
