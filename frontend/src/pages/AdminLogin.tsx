import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert 
} from '@mui/material';

const AdminLogin = ({ setUser }: { setUser: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/kasir');
      }
    } catch (err: any) {
      setError('Login gagal. Silakan periksa username dan password Anda.');
    }
  };

  const handleForgotPassword = async () => {
    const userToReset = window.prompt('Masukkan Username Anda:');
    if (!userToReset) return;
    
    const newPwd = window.prompt('Masukkan Password Baru:');
    if (!newPwd) return;

    if (newPwd.length < 4) {
      alert('Password minimal 4 karakter.');
      return;
    }

    try {
      // Pastikan path ini sesuai dengan rute di backend (users/forgot-password)
      await api.post('/users/forgot-password', { 
        username: userToReset.toLowerCase().trim(), 
        newPassword: newPwd 
      });
      alert('Password berhasil direset! Silakan login menggunakan password baru.');
    } catch (err) {
      alert('Username tidak ditemukan atau terjadi kesalahan server.');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '1000px', 
      bgcolor: '#f5f5f5' 
    }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" sx={{ color: '#DA291C' }}>
            Staff Login
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Gunakan akun Admin atau Kasir
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 1, 
                py: 1.5, 
                bgcolor: '#DA291C', 
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#BD0017' } 
              }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="text"
              size="small"
              onClick={handleForgotPassword}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              Forgot Password?
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
