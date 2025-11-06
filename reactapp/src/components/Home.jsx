import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';

function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        p: 2,
        textAlign: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 600,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to the Food Truck Vendor Application
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.5 }}
        >
          <b>Discover the Best Food Trucks in Chennai & Bangalore!</b>
          <br />
          <br />
          Join our community of talented vendors and connect with food lovers who love culinary delights on wheels.
          <br />
          <br />
          Whether you’re a vendor looking to showcase your food or a foodie wanting to explore vibrant street food, you’ve come to the right place!
        </Typography>
        <Button
          component={RouterLink}
          to="/apply"
          variant="contained"
          sx={{
            py: 1.3,
            px: 4,
            borderRadius: 2,
            fontWeight: 'bold',
            fontSize: '1rem',
            background: 'linear-gradient(90deg, #FF7A18, #AF002D 70%)',
            '&:hover': { background: 'linear-gradient(90deg, #AF002D, #FF7A18 70%)' },
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Become a Vendor
        </Button>
      </Paper>
    </Box>
  );
}

export default Home;
