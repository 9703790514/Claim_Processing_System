import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './Header.css'; // Optional: for extra custom styles

 function Footer() {
  return (
    <Box
      component="footer"
      className="footer"
      sx={{
        width: '100%',
        bgcolor: 'linear-gradient(90deg, #00022e 0%, #fc86aa 100%)',
        color: '#fff',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        letterSpacing: '1px',
        fontSize: '1rem',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <Typography variant="body2" align="center" sx={{ width: '100%' }}>
        © {new Date().getFullYear()} INSUREAPP. All rights reserved.
      </Typography>
    </Box>
  );
}
export default Footer