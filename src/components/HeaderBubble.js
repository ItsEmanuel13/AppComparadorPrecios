import React, { useState, useEffect } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Para la navegación dinámica
import axios from 'axios';

const HeaderBubble = () => {
  const [categorias, setCategorias] = useState([]); // Almacenar categorías con subcategorías
  const [anchorEl, setAnchorEl] = useState(null); // Control del menú de categorías
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null); // Control del submenú de subcategorías
  const [currentSubcategories, setCurrentSubcategories] = useState([]); // Subcategorías actuales
  const navigate = useNavigate(); // Navegación dinámica

  // Obtener categorías y subcategorías desde el backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5001/categorias');
        setCategorias(response.data); // Cargar datos en el estado
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  // Abrir/Cerrar el menú principal
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Abrir/Configurar subcategorías dinámicamente
  const handleOpenSubMenu = (event, subcategories) => {
    setSubMenuAnchorEl(event.currentTarget);
    setCurrentSubcategories(subcategories);
  };
  const handleCloseSubMenu = () => setSubMenuAnchorEl(null);

  // Navegar a la página de productos de subcategorías
  const handleNavigate = (subcategoriaId) => {
    navigate(`/productos/${subcategoriaId}`);
    handleCloseMenu();
    handleCloseSubMenu();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: '0.5rem 2rem',
        display: 'flex',
        zIndex: 1000,
        '@media (max-width: 600px)': { padding: '0.5rem' },
      }}
    >
      <Link to="/HomePage" style={{ textDecoration: 'none' }}>
        <Button variant="text" color="primary">Home</Button>
      </Link>
      <Link to="/ofertas" style={{ textDecoration: 'none' }}>
        <Button variant="text" color="primary">Ofertas</Button>
      </Link>

      {/* Botón Categorías con Menú */}
      <Button variant="text" color="primary" onClick={handleOpenMenu}>
        Categorías
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {categorias.map((categoria) => (
          <MenuItem
            key={categoria.id}
            onClick={(event) => handleOpenSubMenu(event, categoria.subcategorias)}
          >
            {categoria.nombre}
          </MenuItem>
        ))}
      </Menu>

      {/* Submenú de Subcategorías */}
      <Menu
        anchorEl={subMenuAnchorEl}
        open={Boolean(subMenuAnchorEl)}
        onClose={handleCloseSubMenu}
      >
        {currentSubcategories.map((subcategoria) => (
          <MenuItem
            key={subcategoria.id}
            onClick={() => handleNavigate(subcategoria.id)}
          >
            {subcategoria.nombre}
          </MenuItem>
        ))}
      </Menu>

      <Button variant="text" color="primary">Carrito</Button>
    </Box>
  );
};

export default HeaderBubble;
