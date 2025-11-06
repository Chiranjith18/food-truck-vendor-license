import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Typography, TextField, Button, Select, MenuItem, CircularProgress, Box, Alert, Paper } from '@mui/material';

function ApplyForm() {
  const [formData, setFormData] = useState({
    name: '',
    cuisineSpecialties: '',
    operatingRegion: '',
    menuHighlights: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/vendors/me')
      .then(res => {
        if (res.data) {
          setFormData({
            name: res.data.name || '',
            cuisineSpecialties: res.data.cuisineSpecialties || '',
            operatingRegion: res.data.operatingRegion || '',
            menuHighlights: res.data.menuHighlights || '',
            phoneNumber: res.data.phoneNumber || '',
          });
        }
      })
      .catch(() => {})  // Ignore errors for now
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.operatingRegion) errs.operatingRegion = 'Region is required';
    if (!formData.cuisineSpecialties.trim()) errs.cuisineSpecialties = 'Cuisine Specialties required';
    if (!formData.menuHighlights.trim()) errs.menuHighlights = 'Menu Highlights required';
    if (!formData.phoneNumber.trim()) errs.phoneNumber = 'Phone Number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber))
      errs.phoneNumber = 'Invalid Indian phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post('/api/vendors', formData);
      await api.post('/api/applications/submit', {});
      setShowSuccess(true);
      setTimeout(() => navigate('/vendor/dashboard'), 2000);
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '3rem auto', color: '#fff' }} />;

  if (showSuccess)
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 400,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.15)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Application submitted successfully!
          </Typography>
        </Paper>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Apply to Become a Food Truck Vendor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            variant="filled"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            margin="normal"
            required
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
          />
          <TextField
            label="Cuisine Specialties"
            variant="filled"
            value={formData.cuisineSpecialties}
            onChange={handleChange('cuisineSpecialties')}
            error={!!errors.cuisineSpecialties}
            helperText={errors.cuisineSpecialties}
            fullWidth
            margin="normal"
            required
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
          />
          <Select
            variant="filled"
            value={formData.operatingRegion}
            onChange={handleChange('operatingRegion')}
            displayEmpty
            fullWidth
            error={!!errors.operatingRegion}
            sx={{
              mt: 2,
              mb: errors.operatingRegion ? 0 : 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 1,
              color: formData.operatingRegion ? '#fff' : '#ccc',
            }}
            inputProps={{ 'aria-label': 'Operating Region' }}
          >
            <MenuItem value="">Select Region</MenuItem>
            <MenuItem value="Chennai">Chennai</MenuItem>
            <MenuItem value="Bangalore">Bangalore</MenuItem>
          </Select>
          {errors.operatingRegion && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.operatingRegion}
            </Alert>
          )}
          <TextField
            label="Menu Highlights"
            variant="filled"
            value={formData.menuHighlights}
            onChange={handleChange('menuHighlights')}
            error={!!errors.menuHighlights}
            helperText={errors.menuHighlights}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            required
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
          />
          <TextField
            label="Phone Number"
            variant="filled"
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            fullWidth
            margin="normal"
            required
            inputProps={{ maxLength: 10, style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.3,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
              background: 'linear-gradient(90deg, #FF7A18, #AF002D 70%)',
              '&:hover': { background: 'linear-gradient(90deg, #AF002D, #FF7A18 70%)' },
            }}
          >
            Submit Application
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ApplyForm;
