import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/productos/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del producto');
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <div className="loading">Cargando detalles del producto...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="not-found">Producto no encontrado</div>;
  }

  return (
    <div className="product-detail-container">
      <Link to="/productos" className="btn-back">← Volver al catálogo</Link>
      
      <div className="product-detail-content">
        <div className="product-detail-image">
          {product.imagen_url ? (
            <img src={product.imagen_url} alt={product.nombre} />
          ) : (
            <div className="no-image">Sin imagen</div>
          )}
        </div>
        
        <div className="product-detail-info">
          <h2>{product.nombre}</h2>
          <p className="product-price">${product.precio.toFixed(2)}</p>
          
          <div className="product-category">
            <span className="label">Categoría:</span>
            <span>{product.categoria || 'No especificada'}</span>
          </div>
          
          <div className="product-stock">
            <span className="label">Stock disponible:</span>
            <span>{product.stock} unidades</span>
          </div>
          
          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.descripcion || 'Sin descripción disponible'}</p>
          </div>
          
          <button className="btn-add-to-cart">Añadir al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;