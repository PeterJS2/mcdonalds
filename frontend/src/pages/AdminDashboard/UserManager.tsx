import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const UserManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'kasir' });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { 
    try {
      const res = await api.get('/users'); 
      setUsers(res.data); 
    } catch(err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      setForm({ username: '', password: '', role: 'kasir' });
      fetchData();
    } catch(err) { alert('Gagal simpan user'); }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Hapus user ini?')) { 
      try {
        await api.delete(`/users/${id}`); 
        fetchData(); 
      } catch(err) { alert('Gagal hapus user'); }
    }
  };

  const handleResetPassword = async (id: string, username: string) => {
    const newPassword = window.prompt(`Masukkan password baru untuk user "${username}":`);
    if (newPassword) {
      if (newPassword.length < 4) {
        alert('Password terlalu pendek (min 4 karakter)');
        return;
      }
      try {
        await api.patch(`/users/${id}/reset-password`, { newPassword });
        alert('Password berhasil diperbarui!');
      } catch (err) {
        alert('Gagal memperbarui password');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Manage Admin Users</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={form.role}
                  label="Role"
                  onChange={e => setForm({...form, role: e.target.value})}
                  required
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="kasir">Kasir</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button 
                fullWidth 
                type="submit" 
                variant="contained" 
                color="primary" 
                sx={{ height: '56px', fontWeight: 'bold' }}
              >
                Add User
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper>
        <List disablePadding>
          {users.map((u, index) => (
            <Box key={u.id}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => handleResetPassword(u.id, u.username)}
                    >
                      Reset Pwd
                    </Button>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(u.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold">{u.username}</Typography>}
                  secondary={
                    <Chip 
                      label={u.role.toUpperCase()} 
                      size="small" 
                      color={u.role === 'admin' ? 'secondary' : 'default'} 
                      sx={{ mt: 0.5, fontWeight: 'bold' }}
                    />
                  }
                />
              </ListItem>
              {index < users.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

import { Divider } from '@mui/material';

export default UserManager;
