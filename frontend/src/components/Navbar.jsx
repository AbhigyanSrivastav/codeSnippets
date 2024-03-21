import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const styles = {
  appBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
    background: 'linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%)',
    backdropFilter: 'blur(5px)', // Adds blur effect
    borderRadius: '10px',        // Adds rounded corners
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '90%',
  },
  navLinks: {
    display: 'flex',
    gap: 10,
  },
  link: {
    textDecoration: 'none', 
    color: 'white', 
    fontWeight: 'bold', 
  },
};

const NavBar = () => {
  return (
    <AppBar sx={styles.appBar} position="static">
      <Toolbar sx={styles.toolbar}>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}> 
          RunMyCode
        </Typography>
        <div sx={styles.navLinks}> 
          <Link to="/" style={styles.link}>
            <Button color="inherit">Submit Code</Button>
          </Link>
          <Link to="/display" style={styles.link}>
            <Button color="inherit">Submitted Code</Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
