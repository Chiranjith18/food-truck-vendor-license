import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Container, Typography, TextField, Button, Alert, Box, Paper } from '@mui/material'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      window.history.replaceState({}, document.title)
    }
  }, [location.state?.successMessage])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const ok = await login(email, password)
      if (ok) navigate('/')
      else setError('Invalid email or password')
    } catch (err) {
      let msg = 'Invalid email or password'
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
          maxWidth: 400,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff'
        }}
      >
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, opacity: 0.8 }}>
          Sign in to continue
        </Typography>
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            variant="filled"
            InputProps={{ style: { color: '#fff' } }}
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
              '&:hover': { background: 'linear-gradient(90deg, #AF002D, #FF7A18 70%)' }
            }}
          >
            Login
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 3, fontSize: 14 }}>
          Don't have an account?{' '}
          <Button
            onClick={() => navigate('/register')}
            sx={{
              color: '#FFD700',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Register
          </Button>
        </Typography>
      </Paper>
    </Box>
  )
}

export default Login
