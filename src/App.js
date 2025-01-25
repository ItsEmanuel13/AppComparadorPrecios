import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Ofertas from './pages/Ofertas';
import ProductosCategoria from './pages/ProductosCategoria';




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/productos/:subcategoriaId" element={<ProductosCategoria />} />
        {/* Otras rutas */}
        <Route path="/comparar/:idSubcategoria" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
