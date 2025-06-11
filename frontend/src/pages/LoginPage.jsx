// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, TextField, Typography, Link, Container, Paper, CssBaseline, InputAdornment } from '@mui/material';
import { MailOutline, LockOutlined } from '@mui/icons-material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user_is_logged_in', 'true');
        navigate('/');
      } else {
        alert(`Login Gagal: ${data.message}`);
      }
    } catch (error) {
      alert('Tidak bisa terhubung ke server.');
    }
  };

  return (
    // --- PERUBAHAN DI SINI: maxWidth="sm" ---
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <CssBaseline />
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '1rem', width: '100%' }}>
        <Typography component="h1" variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
          Sign In
        </Typography>
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            Welcome back! Please enter your details.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Email</Typography>
                <TextField fullWidth required placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ endAdornment: (<InputAdornment position="end"><MailOutline /></InputAdornment>)}} />
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Password</Typography>
                <TextField fullWidth required placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ endAdornment: (<InputAdornment position="end"><LockOutlined /></InputAdornment>)}} />
            </Box>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '0.5rem', textTransform: 'none', fontSize: '1rem' }}>
                Sign In
            </Button>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" sx={{ fontWeight: '600', textDecoration: 'none' }}>
                    Sign up
                </Link>
            </Typography>
        </Box>
      </Paper>
    </Container>
  );
}