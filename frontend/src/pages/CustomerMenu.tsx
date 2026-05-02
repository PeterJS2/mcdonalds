import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton,
  Container,
  Card,
  CardMedia,
  CardContent,
  CardActionArea
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon, 
  RestartAlt as RotateCcwIcon, 
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

const CustomerMenu = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isOrdered, setIsOrdered] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products')
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      if (catRes.data.length > 0) setActiveCategory(catRes.data[0].id);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        product_id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product_id === productId);
    if (item && item.quantity > 1) {
        setCart(cart.map(i => i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
        setCart(cart.filter(item => item.product_id !== productId));
    }
  };

  const resetCart = () => setCart([]);

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      await api.post('/orders', {
        items: cart,
        total_price: totalPrice
      });
      setIsOrdered(true);
      resetCart();
      setTimeout(() => setIsOrdered(false), 3000);
    } catch (error) {
      console.error('Error placing order', error);
      alert('Gagal membuat pesanan');
    }
  };

  const filteredProducts = activeCategory 
    ? products.filter(p => p.category_id === activeCategory)
    : products;

  if (isOrdered) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '1000px', 
        bgcolor: '#FFC72C', 
        color: 'white' 
      }}>
        <CheckCircleIcon sx={{ fontSize: 100, mb: 2 }} />
        <Typography variant="h2" fontWeight="bold">Terima Kasih!</Typography>
        <Typography variant="h5">Pesanan Anda sedang diproses.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '1000px', overflow: 'hidden' }}>
      {/* Sidebar: Categories */}
      <Box sx={{ 
        width: '25%', 
        bgcolor: '#DA291C', 
        p: 2, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          MCD MENU
        </Typography>
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant="contained"
            onClick={() => setActiveCategory(cat.id)}
            sx={{ 
              justifyContent: 'flex-start',
              p: 2,
              fontWeight: 'bold',
              bgcolor: activeCategory === cat.id ? '#FFC72C' : '#BD0017',
              color: activeCategory === cat.id ? '#DA291C' : 'white',
              '&:hover': {
                bgcolor: activeCategory === cat.id ? '#FFC72C' : '#A00014',
              }
            }}
          >
            {cat.name}
          </Button>
        ))}
      </Box>

      {/* Main Content: Products */}
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'white', overflowY: 'auto' }}>
        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea onClick={() => addToCart(product)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image_url || 'https://via.placeholder.com/140'}
                    alt={product.name}
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Typography variant="body1" color="error" fontWeight="bold">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Right Sidebar: Cart */}
      <Paper elevation={3} sx={{ width: '25%', p: 2, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #eee' }}>
          <ShoppingCartIcon color="error" />
          <Typography variant="h6" fontWeight="bold">Pesanan Saya</Typography>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 5 }}>
              Pilih menu untuk mulai memesan
            </Typography>
          ) : (
            <List disablePadding>
              {cart.map(item => (
                <Box key={item.product_id} sx={{ mb: 2, p: 1, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rp {item.price.toLocaleString('id-ID')} x {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <IconButton size="small" onClick={() => removeFromCart(item.product_id)} color="error">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => addToCart({ id: item.product_id, name: item.name, price: item.price })}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </List>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Total</Typography>
            <Typography variant="h5" fontWeight="bold" color="error">
              Rp {totalPrice.toLocaleString('id-ID')}
            </Typography>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<RotateCcwIcon />}
                onClick={resetCart}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                Reset
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button 
                fullWidth 
                variant="contained" 
                color="error"
                disabled={cart.length === 0}
                onClick={placeOrder}
                sx={{ py: 1.5, fontWeight: 'bold', bgcolor: '#DA291C' }}
              >
                Bayar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerMenu;
