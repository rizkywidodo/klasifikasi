// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, TextField, Typography, Link, Container, Paper, CssBaseline, InputAdornment } from '@mui/material';
import { PersonOutline, MailOutline, LockOutlined } from '@mui/icons-material';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== retypePassword) {
            alert("Password tidak cocok!");
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registrasi berhasil! Silakan login.');
                navigate('/login');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            alert('Tidak bisa terhubung ke server.');
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <CssBaseline />
            <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '1rem', width: '100%' }}>
                
                <Typography component="h1" variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Sign Up
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Name</Typography>
                        <TextField fullWidth required placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} InputProps={{ endAdornment: (<InputAdornment position="end"><PersonOutline /></InputAdornment>)}} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Email</Typography>
                        <TextField fullWidth required placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ endAdornment: (<InputAdornment position="end"><MailOutline /></InputAdornment>)}} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Password</Typography>
                        <TextField fullWidth required placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ endAdornment: (<InputAdornment position="end"><LockOutlined /></InputAdornment>)}} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Re-type Password</Typography>
                        <TextField fullWidth required placeholder="Re-enter your password" type="password" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} InputProps={{ endAdornment: (<InputAdornment position="end"><LockOutlined /></InputAdornment>)}} />
                    </Box>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '0.5rem', textTransform: 'none', fontSize: '1rem' }}>
                        Create account
                    </Button>
                    <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login" sx={{ fontWeight: '600', textDecoration: 'none' }}>
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}