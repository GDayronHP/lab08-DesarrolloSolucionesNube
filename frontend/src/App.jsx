import React, { useState, useEffect } from 'react';

// URL de la API
const API_URL = 'http://35.175.244.62:8000';

function App() {
  // Estados generales
  const [view, setView] = useState('login'); // login, register, clients, products
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  
  // Estados para formularios
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', nombre: '', email: '' });
  const [search, setSearch] = useState('');
  
  // Estados para datos
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    console.log("Token en localStorage:", savedToken);
    
    if (savedToken) {
      setToken(savedToken);
      setView('clients');
      fetchClients();
    } else {
      console.log("No se encontró ningún token");
    }
  }, []);
  
  // Comprobar si hay un token guardado al cargar
  useEffect(() => {
    // Añadir CDN de Bootstrap al cargar el componente
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCSS);
    
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setView('clients');
      fetchClients();
    }
    
    // Limpiar al desmontar
    return () => {
      document.head.removeChild(bootstrapCSS);
    };
  }, []);
  
  // Funciones auxiliares para API
  async function fetchApi(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }
  
  // Funciones de autenticación
  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    
    try {
      const data = await fetchApi('/api/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      });
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setView('clients');
      fetchClients();
    } catch (err) {
      // Error ya está establecido en fetchApi
    }
  }
  
  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    
    try {
      const data = await fetchApi('/api/register', {
        method: 'POST',
        body: JSON.stringify(registerForm),
      });
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setView('clients');
      fetchClients();
    } catch (err) {
      // Error ya está establecido en fetchApi
    }
  }
  
  function handleLogout() {
    localStorage.removeItem('token');
    setToken('');
    setView('login');
  }
  
  // Funciones para obtener datos
  async function fetchClients() {
    try {
      const data = await fetchApi('/api/clients');
      setClients(data);
    } catch (err) {
      // Error ya está establecido en fetchApi
    }
  }
  
  async function fetchProducts() {
    try {
      const endpoint = search ? `/api/products?search=${search}` : '/api/products';
      const data = await fetchApi(endpoint);
      setProducts(data);
    } catch (err) {
      // Error ya está establecido en fetchApi
    }
  }
  
  // Manejadores de cambio de formularios
  function handleLoginChange(e) {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  }
  
  function handleRegisterChange(e) {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  }
  
  // Cargar productos al cambiar a esa vista
  useEffect(() => {
    if (view === 'products' && token) {
      fetchProducts();
    }
  }, [view, token, search]);
  
  // Renderizado condicional según la vista
  function renderContent() {
    switch(view) {
      case 'login':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">Iniciar Sesión</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Usuario:</label>
                  <input 
                    type="text" 
                    name="username" 
                    className="form-control"
                    value={loginForm.username} 
                    onChange={handleLoginChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña:</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control"
                    value={loginForm.password} 
                    onChange={handleLoginChange} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
              </form>
            </div>
            <div className="card-footer text-center">
              <a href="#" className="text-decoration-none" onClick={(e) => { e.preventDefault(); setView('register'); }}>
                Registrarse
              </a>
            </div>
          </div>
        );
        
      case 'register':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h2 className="h4 mb-0">Registro</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Usuario:</label>
                  <input 
                    type="text" 
                    name="username" 
                    className="form-control"
                    value={registerForm.username} 
                    onChange={handleRegisterChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña:</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control"
                    value={registerForm.password} 
                    onChange={handleRegisterChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre:</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    className="form-control"
                    value={registerForm.nombre} 
                    onChange={handleRegisterChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control"
                    value={registerForm.email} 
                    onChange={handleRegisterChange} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">Registrarse</button>
              </form>
            </div>
            <div className="card-footer text-center">
              <a href="#" className="text-decoration-none" onClick={(e) => { e.preventDefault(); setView('login'); }}>
                Iniciar Sesión
              </a>
            </div>
          </div>
        );
        
      case 'clients':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h2 className="h4 mb-0">Lista de Clientes</h2>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead>
                    <tr className="table-dark">
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Nombre</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length > 0 ? (
                      clients.map(client => (
                        <tr key={client.id}>
                          <td>{client.id}</td>
                          <td>{client.username}</td>
                          <td>{client.nombre}</td>
                          <td>{client.email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No hay clientes para mostrar</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'products':
        return (
          <div className="card shadow-sm">
            <div className="card-header bg-warning">
              <h2 className="h4 mb-0">Productos</h2>
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Buscar producto..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
                <button className="btn btn-outline-secondary" onClick={fetchProducts}>Buscar</button>
              </div>
              
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr className="table-dark">
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map(product => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.nombre}</td>
                          <td>{product.descripcion}</td>
                          <td>${product.precio}</td>
                          <td>
                            <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                              {product.stock}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No hay productos para mostrar</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div className="alert alert-danger">Vista no encontrada</div>;
    }
  }
  
  // Navegación para usuarios autenticados
  function renderNav() {
    if (token) {
      return (
        <nav className="navbar bg-dark mb-4 p-2 rounded">
          <div className="container-fluid">
            <div className="navbar-nav me-auto mb-0 mb-lg-0">
              <button 
                className={`btn me-2 ${view === 'clients' ? 'btn-light' : 'btn-outline-light'}`} 
                onClick={() => setView('clients')}
              >
                Clientes
              </button>
              <button 
                className={`btn me-2 ${view === 'products' ? 'btn-light' : 'btn-outline-light'}`} 
                onClick={() => setView('products')}
              >
                Productos
              </button>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      );
    }
    return null;
  }
  
  // Mensaje de error
  function renderError() {
    if (error) {
      return (
        <div className="alert alert-danger mb-3">{error}</div>
      );
    }
    return null;
  }
  
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Sistema Simple</h1>
      {renderNav()}
      {renderError()}
      {renderContent()}
      <footer className="mt-4 text-center text-muted">
        <small>&copy; 2025 Sistema Simple</small>
      </footer>
    </div>
  );
}

export default App;