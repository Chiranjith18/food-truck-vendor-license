import { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material'

function VendorApplication() {
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [applicationStatus, setApplicationStatus] = useState(null)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await api.get('/api/vendors/me')
        setProfileExists(!!res.data)
      } catch (error) {
        if (error.response && error.response.status === 404) setProfileExists(false)
        else alert('Error checking profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    const fetchApplications = async () => {
      try {
        const res = await api.get('/api/applications')
        if (res.data && res.data.length > 0) setApplicationStatus(res.data[0].status || 'Unknown')
      } catch {
        setApplicationStatus(null)
      }
    }

    checkProfile()
    fetchApplications()
  }, [])

  const submitApplication = async () => {
    setMessage('')
    try {
      await api.post('/api/applications/submit', {})
      setMessage('Application submitted successfully.')
      setTimeout(() => navigate('/vendor/dashboard'), 3000)
    } catch {
      setMessage('Failed to submit application. Please try again.')
    }
  }

  if (loading)
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)'
        }}
      >
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    )

  if (!profileExists) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
          p: 2
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.15)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
            color: '#fff'
          }}
        >
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            Complete Your Profile
          </Typography>
          <Typography align="center" sx={{ mb: 3, opacity: 0.9 }}>
            You need to complete your vendor profile before applying.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/vendor/profile')}
            sx={{
              mt: 2,
              py: 1.3,
              borderRadius: 2,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #FF7A18, #AF002D 70%)',
              '&:hover': { background: 'linear-gradient(90deg, #AF002D, #FF7A18 70%)' }
            }}
          >
            Go to Profile
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff'
        }}
      >
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Vendor License Application
        </Typography>

        {applicationStatus && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            Current Application Status: <strong>{applicationStatus}</strong>
          </Alert>
        )}

        {message && (
          <Alert
            severity={message.includes('successfully') ? 'success' : 'error'}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {message}
          </Alert>
        )}

        <Typography align="center" sx={{ mt: 1, mb: 3, opacity: 0.85 }}>
          Submit your application to start your vendor licensing process.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={submitApplication}
          sx={{
            py: 1.3,
            borderRadius: 2,
            fontWeight: 'bold',
            fontSize: '1rem',
            background: 'linear-gradient(90deg, #FF7A18, #AF002D 70%)',
            '&:hover': { background: 'linear-gradient(90deg, #AF002D, #FF7A18 70%)' }
          }}
        >
          Submit Application
        </Button>
      </Paper>
    </Box>
  )
}

export default VendorApplication
