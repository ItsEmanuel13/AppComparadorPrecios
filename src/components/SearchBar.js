import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, Collapse, Button } from '@mui/material';
import axios from 'axios';

const SearchBar = () => {
  const [products, setProducts] = useState([]); // Lista de productos cargados desde la base de datos
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la barra de búsqueda

  // Obtener productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/productos'); // Cambia la URL según tu configuración
        setProducts(response.data); // Asigna los datos de la base de datos
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar productos según la búsqueda
  const filteredProducts = products
    .filter((product) =>
      product.Nombre?.toLowerCase().includes(searchQuery.toLowerCase()) // Verifica si 'nombre' existe antes de llamar a 'toLowerCase'
    )
    .slice(0, 30); // Limita a los primeros 30 resultados


  return (
    <Box sx={{ padding: '1rem', maxWidth: '1000px', margin: 'auto' }}>
      {/* Barra de Búsqueda */}
      <TextField
        fullWidth
        label="Buscar Productos"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          marginBottom: '1rem',
          width: '113%', // Ajusta el ancho según sea necesario
          margin: '0 auto', // Centra la barra si no usas `fullWidth`
          right: '1rem',
        }}
      />

      {/* Contenedor animado con Collapse */}
      <Collapse in={searchQuery.length > 0}>
        <Box
          sx={{
            marginTop: '1rem',
            padding: '1rem',
            width: '106%',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            maxHeight: '250px',
            overflowX: 'auto',
            overflowY: 'hidden',
            whiteSpace: 'nowrap', // Hace que los elementos estén en una sola línea
            display: 'flex', // Flexbox para alinear productos
            gap: '1rem', // Espacio entre productos
          }}
        >
          {filteredProducts.map((product) => (
            <Card key={product.id} sx={{ minWidth: '180px', textAlign: 'center' }}>
              <CardContent>
                {/* Mostrar la imagen del producto desde el enlace */}
                <img
                  src={product.img} // Actualizado para usar la columna "img"
                  alt={product.Nombre} // Actualizado para usar la columna "nombre"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    marginBottom: '0.5rem',
                    borderRadius: '8px',
                  }}
                />
                <Typography variant="h6">{product.Nombre}</Typography> {/* Mostrar el nombre del producto */}
                <Typography>{`$${product.Precio}`}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: '0.5rem' }}
                  onClick={() => {
                    if (/^(http|https):\/\/[^ "]+$/.test(product.URL)) {
                      window.open(product.URL, '_blank');
                    } else {
                      alert('URL inválida');
                    }
                  }}
                  disabled={!product.URL} // Deshabilita si no hay URL
                >
                  Ver Producto
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default SearchBar;
