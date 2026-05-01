import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const CategoryManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { 
    try {
      const res = await api.get('/categories'); 
      setCategories(res.data); 
    } catch(err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await api.post('/categories', { name });
      setName('');
      fetchData();
    } catch(err) { alert('Gagal simpan'); }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Hapus kategori ini?')) { 
      try {
        await api.delete(`/categories/${id}`); 
        fetchData(); 
      } catch(err) { alert('Gagal hapus'); }
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Manage Categories</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="New Category Name"
            variant="outlined"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            sx={{ px: 4, fontWeight: 'bold' }}
          >
            Add
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {categories.map(c => (
          <Grid item xs={12} sm={6} md={3} key={c.id}>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h6" fontWeight="bold">{c.name}</Typography>
              </CardContent>
              <IconButton onClick={() => handleDelete(c.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryManager;
