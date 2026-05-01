import { Routes, Route, useNavigate, Link as RouterLink } from 'react-router';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider,
  IconButton
} from '@mui/material';
import { 
  Inventory as PackageIcon, 
  Category as TagsIcon, 
  People as UsersIcon, 
  Logout as LogOutIcon, 
  Dashboard as DashboardIcon,
  PointOfSale as ShoppingCartIcon
} from '@mui/icons-material';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import UserManager from './UserManager';

const drawerWidth = 240;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Products', icon: <PackageIcon />, path: '/admin/dashboard/products' },
    { text: 'Categories', icon: <TagsIcon />, path: '/admin/dashboard/categories' },
    { text: 'Users', icon: <UsersIcon />, path: '/admin/dashboard/users' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#212121',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <DashboardIcon sx={{ color: '#FFC72C' }} />
          <Typography variant="h6" fontWeight="bold">Admin</Typography>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/kasir">
              <ListItemIcon sx={{ color: 'white' }}><ShoppingCartIcon /></ListItemIcon>
              <ListItemText primary="Orders (Kasir)" />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ '&:hover': { bgcolor: '#DA291C' } }}>
              <ListItemIcon sx={{ color: 'white' }}><LogOutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 4, minHeight: '100vh' }}
      >
        <Routes>
          <Route path="products" element={<ProductManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="/" element={
            <Box sx={{ mt: 10, textAlign: 'center' }}>
              <Typography variant="h3" color="text.disabled" fontWeight="bold">
                Selamat Datang di Admin Panel
              </Typography>
            </Box>
          } />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
