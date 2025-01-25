import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import HeaderBubble from '../components/HeaderBubble';
import { Box, Typography, Grid, Card, CardContent, Button, Pagination } from '@mui/material';

const ProductosCategoria = () => {
  const { subcategoriaId } = useParams();
  const [productos, setProductos] = useState([]);
  const [subcategoriaNombre, setSubcategoriaNombre] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 8; // Productos por página

  // Cargar productos de la subcategoría
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Obtener productos
        const responseProductos = await axios.get(
          `http://localhost:5001/productos/subcategoria/${subcategoriaId}`
        );
        setProductos(responseProductos.data);

        // Obtener nombre de la subcategoría
        const responseSubcategoria = await axios.get(
          `http://localhost:5001/subcategoria/${subcategoriaId}`
        );
        setSubcategoriaNombre(responseSubcategoria.data.Nombre.trim());
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchProductos();
  }, [subcategoriaId]);

  // Calcular productos visibles para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productos.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular número total de páginas
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  // Manejar cambio de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ padding: '2rem', bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      <HeaderBubble />
      <div style={{ marginTop: '5rem', marginBottom: '5rem', textAlign: 'center' }}>
        {/* Título dinámico basado en la subcategoría */}
        <Typography variant="h4" gutterBottom>
          {subcategoriaNombre ? `Productos de ${subcategoriaNombre}` : 'Cargando...'}
        </Typography>

        {/* Mostrar mensaje si no hay productos */}
        {productos.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No hay productos en esta categoría.
          </Typography>
        ) : (
          <>
            {/* Productos visibles en la página actual */}
            <Grid container spacing={3}>
              {currentProducts.map((producto) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
                  <Card>
                    <CardContent>
                      <img
                        src={producto.img}
                        alt={producto.nombre}
                        style={{
                          width: '100%',
                          height: 'auto',
                          marginBottom: '0.5rem',
                          borderRadius: '8px',
                        }}
                      />
                      <Typography variant="h6">{producto.Nombre}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        Precio: ${producto.Precio}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '0.5rem' }}
                        onClick={() => window.open(producto.URL, '_blank')}
                      >
                        Ver Producto
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Controles de paginación */}
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
            />
          </>
        )}
        <Footer />
      </div>
    </Box>
  );
};

export default ProductosCategoria;
