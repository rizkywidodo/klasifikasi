// src/components/Header.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Switch, Avatar, ListItemIcon } from '@mui/material';

// Import Ikon
import Logout from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import ModeNightOutlinedIcon from '@mui/icons-material/ModeNightOutlined';

import { ThemeContext } from '../context/ThemeContext';

const drawerWidth = 280;

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useContext(ThemeContext);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('user_is_logged_in');
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0} // Hapus bayangan default
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: 'background.paper', // Gunakan warna paper dari tema
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider' // Gunakan warna divider dari tema
      }}
    >
      <Toolbar sx={{ minHeight: '80px !important' }}> {/* <-- BUAT HEADER LEBIH TINGGI */}
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ mr: 2 }} onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <WbSunnyOutlinedIcon /> : <ModeNightOutlinedIcon />}
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="large" onClick={handleMenu} color="inherit">
            <Avatar sx={{ width: 40, height: 40 }} />
          </IconButton>
          <Menu /* ... (sisa kode Menu tidak berubah) ... */
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{ elevation: 0, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon><AccountCircleOutlinedIcon fontSize="small" /></ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              Log Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}