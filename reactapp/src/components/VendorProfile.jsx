import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Select, MenuItem, Button, Alert, CircularProgress, Box, Paper } from '@mui/material';
import api from '../api';

function VendorProfile() {
  const [profile, setProfile] = useState({
    name: '',
    cuisineSpecialties: '',
    operatingRegion: '',
    menuHighlights: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/vendors/me');
        if (res.status === 200 && res.data) {
          setProfileId(res.data.id);
          setProfile({
            name: res.data.name || '',
            cuisineSpecialties: res.data.cuisineSpecialties || '',
            operatingRegion: res.data.operatingRegion || '',
            menuHighlights: res.data.menuHighlights || '',
            phoneNumber: res.data.phoneNumber || '',
          });
        }
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          alert('Error loading profile. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    const err = {};
    if (!profile.name.trim()) err.name = 'Name is required';
    if (!profile.cuisineSpecialties.trim()) err.cuisineSpecialties = 'Cuisine Specialties are required';
    if (!profile.operatingRegion) err.operatingRegion = 'Operating Region is required';
    if (!profile.menuHighlights.trim()) err.menuHighlights = 'Menu Highlights are required';
    if (!profile.phoneNumber.trim()) err.phoneNumber = 'Phone Number is required';
    else if (!/^[6-9]\d{9}$/.test(profile.phoneNumber)) err.phoneNumber = 'Invalid Indian phone number';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (field) => (e) => {
    setProfile(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (profileId) {
        await api.put(`/api/vendors/${profileId}`, profile);
      } else {
        await api.post('/api/vendors', profile);
      }
      setMessage('Profile saved successfully!');
    } catch {
      setMessage('Failed to save profile. Please try again.');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '3rem auto', color: '#fff' }} />;

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
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Vendor Profile
        </Typography>
        {message && (
          <Alert
            severity={message.includes('successfully') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="filled"
            value={profile.name}
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
            value={profile.cuisineSpecialties}
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
            value={profile.operatingRegion}
            onChange={handleChange('operatingRegion')}
            displayEmpty
            fullWidth
            error={!!errors.operatingRegion}
            sx={{ mt: 2, mb: errors.operatingRegion ? 0 : 3,
                backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1,
                color: profile.operatingRegion ? '#fff' : '#ccc' }}
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
            value={profile.menuHighlights}
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
            value={profile.phoneNumber}
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
            Save Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default VendorProfile;
