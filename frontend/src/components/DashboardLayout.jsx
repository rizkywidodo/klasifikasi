// src/components/DashboardLayout.jsx
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          // --- UBAH PADDING DI SINI ---
          p: { xs: 3, sm: 4, md: 5 }, // Padding lebih besar
          width: `calc(100% - ${drawerWidth}px)` 
        }}
      >
        <Toolbar sx={{ minHeight: '80px !important' }} /> {/* <-- Samakan tinggi spacer dengan header */}
        <Outlet />
      </Box>
    </Box>
  );
}