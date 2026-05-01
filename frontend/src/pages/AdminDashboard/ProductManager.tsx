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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ProductManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', category_id: '', image_url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
      setProducts(p.data);
      setCategories(c.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post('/products', form);
        setForm({ name: '', price: '', category_id: '', image_url: '' });
        fetchData();
    } catch (err) { alert('Gagal simpan'); }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Hapus produk ini?')) {
        await api.delete(`/products/${id}`);
        fetchData();
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Manage Products</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Baris 1: Nama dan Harga */}
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Product Name"
                variant="outlined"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price (Rp)"
                type="number"
                variant="outlined"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                required
              />
            </Grid>

            {/* Baris 2: Kategori, Gambar, dan Tombol */}
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category_id}
                  label="Category"
                  onChange={e => setForm({...form, category_id: e.target.value})}
                  required
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>Select Image File</InputLabel>
                <Select
                  value={form.image_url.replace('/images/', '')}
                  label="Select Image File"
                  onChange={e => setForm({...form, image_url: `/images/${e.target.value}`})}
                >
                  <MenuItem value="bigmac.png">bigmac.png</MenuItem>
                  <MenuItem value="cheeseburger.png">cheeseburger.png</MenuItem>
                  <MenuItem value="panas_special.png">panas_special.png</MenuItem>
                  <MenuItem value="fries.png">fries.png</MenuItem>
                  <MenuItem value="coca_cola.png">coca_cola.png</MenuItem>
                  <MenuItem value="mcflurry.png">mcflurry.png</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button 
                fullWidth 
                type="submit" 
                variant="contained" 
                color="primary" 
                sx={{ height: '56px', fontWeight: 'bold' }}
              >
                Add Product
              </Button>
            </Grid>
          </Grid>
        </Box>

            </Paper>

            <TableContainer component={Paper}>
            <Table>
            <TableHead sx={{ bgcolor: '#eee' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%' }}>Actions</TableCell>
            </TableRow>
            </TableHead>

          <TableBody>
            {products.map(p => (
              <TableRow key={p.id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category?.name || '-'}</TableCell>
                <TableCell>Rp {Number(p.price).toLocaleString('id-ID')}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(p.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductManager;
