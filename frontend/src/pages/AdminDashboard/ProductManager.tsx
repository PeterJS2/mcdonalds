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
import { Delete as DeleteIcon, CloudUpload as UploadIcon } from '@mui/icons-material';

const ProductManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', category_id: '', image_url: '' });
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (data.imageUrl) {
        setForm({ ...form, image_url: data.imageUrl });
        alert('Gambar berhasil diunggah!');
      }
    } catch (err) {
      alert('Gagal mengunggah gambar');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
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

            <Grid item xs={12} sm={4}>
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

            <Grid item xs={12} sm={4}>
              <Box
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragging ? 'primary.main' : '#ccc',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  bgcolor: isDragging ? '#e3f2fd' : '#fafafa',
                  cursor: 'pointer',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.3s'
                }}
              >
                <UploadIcon sx={{ mr: 1, color: isDragging ? 'primary.main' : '#666' }} />
                <Typography variant="body2" color="textSecondary">
                  {form.image_url ? `Selected: ${form.image_url.split('/').pop()}` : 'Drop Image Here'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
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
