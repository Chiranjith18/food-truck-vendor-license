import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

function DisplayFoodTruck() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/vendors/all');
      setVendors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      let msg = 'Failed to fetch vendors. Please try again.';
      if (err.response?.data) {
        const data = err.response.data;
        msg = typeof data === 'string' ? data : data.error || JSON.stringify(data);
      }
      setError(msg);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await api.delete(`/api/vendors/${id}`);
      fetchVendors();
    } catch (err) {
      let msg = 'Failed to delete vendor';
      if (err.response?.data) {
        const data = err.response.data;
        msg = typeof data === 'string' ? data : data.error || JSON.stringify(data);
      }
      alert(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        p: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 1100,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff',
          overflowX: 'auto',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="#fff">
          Submitted Food Truck Vendor Applications
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '3rem auto', color: '#fff' }} />
        ) : (
          <Table sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(175,0,45,0.8)' }}>
                {['Name', 'Cuisine', 'Region', 'Menu Highlights', 'Phone', 'Actions'].map(header => (
                  <TableCell key={header} sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: '#fff' }}>
                    No vendors available
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map(vendor => (
                  <TableRow key={vendor.id} hover sx={{ cursor: 'default' }}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.cuisineSpecialties}</TableCell>
                    <TableCell>{vendor.operatingRegion}</TableCell>
                    <TableCell>{vendor.menuHighlights}</TableCell>
                    <TableCell>{vendor.phoneNumber}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(vendor.id)}
                        sx={{ color: '#fff', borderColor: '#fff', '&:hover': { backgroundColor: '#AF002D', borderColor: '#AF002D' } }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}

export default DisplayFoodTruck;
