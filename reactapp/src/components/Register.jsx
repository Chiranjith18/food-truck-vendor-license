import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { Container, Typography, TextField, Button, Select, MenuItem, Alert, Box, Paper } from '@mui/material'

function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'VENDOR' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    try {
      await api.post('/api/auth/register', formData)
      navigate('/login', { state: { successMessage: 'Registration successful! Please login.' } })
    } catch (err) {
      let msg = 'Registration failed'
      if (err.response?.data) {
        const data = err.response.data
        if (typeof data === 'string') msg = data
        else if (data.error) msg = data.error
        else msg = JSON.stringify(data)
      }
      setError(msg)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff'
        }}
      >
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, opacity: 0.8 }}>
          Join the Food Truck System
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            variant="filled"
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            variant="filled"
            helperText="Minimum 6 characters"
            FormHelperTextProps={{ style: { color: '#ddd' } }}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#ccc' } }}
            sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
          />
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            variant="filled"
            sx={{
              mt: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 1,
              color: '#fff',
              '.MuiSvgIcon-root': { color: '#fff' },
              '.MuiInputBase-input': { color: '#fff' }
            }}
          >
            <MenuItem value="VENDOR">Vendor</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="REVIEWER">Reviewer</MenuItem>
            <MenuItem value="INSPECTOR">Inspector</MenuItem>
            <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
          </Select>
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
              '&:hover': { background: 'linear-gradient(90deg, #AF002D, #FF7A18 70%)' }
            }}
          >
            Register
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 3, fontSize: 14 }}>
          Already have an account?{' '}
          <Button
            onClick={() => navigate('/login')}
            sx={{
              color: '#FFD700',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  )
}

export default Register
