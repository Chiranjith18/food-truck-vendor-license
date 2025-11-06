import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          403 - Unauthorized Access
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          You don't have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            background: 'linear-gradient(90deg, #FF7A18, #AF002D 70%)',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(90deg, #AF002D, #FF7A18 70%)',
            },
          }}
        >
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
}

export default Unauthorized;
