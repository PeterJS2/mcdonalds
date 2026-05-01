import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  IconButton, 
  Divider,
  Paper
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  Refresh as RefreshCwIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const KasirOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { 
    try {
      const res = await api.get('/orders'); 
      setOrders(res.data); 
    } catch(err) { console.error(err); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus riwayat pesanan ini secara permanen?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchData();
      } catch(err) { console.error(err); }
    }
  };


  return (
    <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate('/admin/dashboard')} 
            sx={{ bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: '#f0f0f0' } }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">Manage Orders</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<RefreshCwIcon />} 
          onClick={fetchData}
          sx={{ fontWeight: 'bold' }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {orders.map(order => (
          <Grid item xs={12} md={6} lg={4} key={order.id}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: 2, 
              borderTop: '5px solid #DA291C' 
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>ORDER ID</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                      {order.id.substring(0, 8)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={order.status.toUpperCase()} 
                      size="small"
                      color={
                        order.status === 'pending' ? 'warning' : 
                        order.status === 'completed' ? 'success' : 'error'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                    <IconButton size="small" color="error" onClick={() => handleDelete(order.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ my: 2, py: 1, borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                  {order.items?.map((item: any) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{item.quantity}x {item.product?.name}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="body1" fontWeight="bold">Total</Typography>
                  <Typography variant="h6" fontWeight="bold" color="error">
                    Rp {Number(order.total_price).toLocaleString('id-ID')}
                  </Typography>
                </Box>

                {order.status === 'pending' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="success"
                      onClick={() => updateStatus(order.id, 'completed')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Selesai
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="inherit"
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Batal
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {orders.length === 0 && (
        <Typography variant="h6" color="text.disabled" sx={{ textAlign: 'center', mt: 10 }}>
          Belum ada pesanan.
        </Typography>
      )}
    </Box>
  );
};

export default KasirOrders;
