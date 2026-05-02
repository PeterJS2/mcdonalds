import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import CustomerMenu from './pages/CustomerMenu';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import KasirOrders from './pages/KasirOrders';
import { useState, useEffect } from 'react';
import { Box, CircularProgress, CssBaseline } from '@mui/material';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '1000px', width: '100%' }}>
        <CircularProgress sx={{ m: 'auto' }} />
      </Box>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isKasir = user?.role === 'kasir' || user?.role === 'admin';

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ minHeight: '1000px' }}>
        <Routes>
          {/* Customer Side */}
          <Route path="/" element={<CustomerMenu />} />
          
          {/* Admin Side */}
          <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          
          <Route 
            path="/admin/dashboard/*" 
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
          />
          
          <Route 
            path="/kasir" 
            element={isKasir ? <KasirOrders /> : <Navigate to="/admin/login" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
