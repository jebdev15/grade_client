import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router';

const FacultyErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      gap={2}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />

      <Typography variant="h4" fontWeight={700} color="error.main">
        Oops! Something went wrong.
      </Typography>

      <Typography variant="body1" color="text.secondary">
        We couldn't load the Faculty page. Please try again or contact support.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/admin')}
        sx={{ mt: 2 }}
      >
        Go Back to Faculty
      </Button>
    </Box>
  );
};

export default FacultyErrorPage;
