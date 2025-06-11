import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';

const drawerWidth = 280;

export default function Sidebar() {
  // ... (logic handleLogout jika ada, tetap sama)

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Riwayat Analisis', icon: <HistoryIcon />, path: '/history' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            // --- PERUBAHAN DI SINI ---
            bgcolor: '#1C2434', // Warna gelap hardcode
            color: '#DEE4EE',   // Warna teks terang hardcode
            borderRight: 'none'
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Typography variant="h5" color="white" fontWeight="bold">Analisis App</Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{my: 1, px: 2}}>
              <ListItemButton component={RouterLink} to={item.path} sx={{ borderRadius: '0.5rem', '&:hover': { bgcolor: '#333A48' } }}>
                <ListItemIcon sx={{ color: '#DEE4EE' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}