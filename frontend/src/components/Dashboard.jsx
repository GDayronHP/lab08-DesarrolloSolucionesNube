import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener información del usuario del localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Verificar que el token sea válido
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        // Configurar encabezado de autorización
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        // Intentar obtener datos del usuario para validar el token
        const response = await axios.get(`http://localhost:8000/api/clientes/${JSON.parse(storedUser).id}`, config);
        setUser(response.data);
        
        // Obtener conteo de productos
        const productsResponse = await axios.get('http://localhost:8000/api/productos');
        setProductCount(productsResponse.data.length);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al verificar el token:', error);
        // Si hay un error de autenticación, redirigir al login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };
    
    verifyToken();
  }, [navigate]);

  const handleLogout = () => {
    // Eliminar token y datos del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirigir al login
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Panel de Control</h1>
        <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
      </header>
      
      <div className="user-welcome">
        <h2>Bienvenido, {user.nombre} {user.apellido}</h2>
        <p>Email: {user.email}</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Productos</h3>
          <p className="stat-number">{productCount}</p>
          <Link to="/productos" className="btn-view">Ver Productos</Link>
        </div>
        
        {/* Puedes agregar más tarjetas de estadísticas según sea necesario */}
      </div>
      
      <div className="dashboard-actions">
        <h3>Acciones Rápidas</h3>
        <div className="action-buttons">
          <Link to="/productos" className="btn-action">Ver Catálogo</Link>
          {/* Puedes agregar más botones de acción según sea necesario */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;