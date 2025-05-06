import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://54.211.90.70:8000/api/productos');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los productos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <h2>Catálogo de Productos</h2>
      
      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.imagen_url ? (
                  <img src={product.imagen_url} alt={product.nombre} />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
              </div>
              
              <div className="product-info">
                <h3>{product.nombre}</h3>
                <p className="product-price">${product.precio.toFixed(2)}</p>
                <p className="product-category">{product.categoria}</p>
                
                <Link to={`/productos/${product.id}`} className="btn-view-details">
                  Ver detalles
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No hay productos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;