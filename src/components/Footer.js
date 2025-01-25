import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        position: 'fixed', // Lo fija en la pantalla
        bottom: 0,         // Lo alinea en la parte inferior
        left: 0,
        width: '100%',     // Ocupa todo el ancho de la pantalla
        bgcolor: '#3f51b5',
        color: '#fff',
        textAlign: 'center',
        padding: '1rem 0',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Comparador de Precios. Todos los derechos reservados.
      </Typography>
      <Typography variant="body2">
        Creado por{' '}
        <Link href="https://github.com/" target="_blank" color="inherit" underline="hover">
          Tu Nombre
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
