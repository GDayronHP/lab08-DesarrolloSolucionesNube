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
  
  // Comprobar si hay un token guardado al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setView('clients');
      fetchClients();
    }
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
          <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
              <div>
                <label>Usuario:</label>
                <input 
                  type="text" 
                  name="username" 
                  value={loginForm.username} 
                  onChange={handleLoginChange} 
                  required 
                />
              </div>
              <div>
                <label>Contraseña:</label>
                <input 
                  type="password" 
                  name="password" 
                  value={loginForm.password} 
                  onChange={handleLoginChange} 
                  required 
                />
              </div>
              <button type="submit">Iniciar Sesión</button>
            </form>
            <p>
              <a href="#" onClick={() => setView('register')}>Registrarse</a>
            </p>
          </div>
        );
        
      case 'register':
        return (
          <div>
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
              <div>
                <label>Usuario:</label>
                <input 
                  type="text" 
                  name="username" 
                  value={registerForm.username} 
                  onChange={handleRegisterChange} 
                  required 
                />
              </div>
              <div>
                <label>Contraseña:</label>
                <input 
                  type="password" 
                  name="password" 
                  value={registerForm.password} 
                  onChange={handleRegisterChange} 
                  required 
                />
              </div>
              <div>
                <label>Nombre:</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={registerForm.nombre} 
                  onChange={handleRegisterChange} 
                  required 
                />
              </div>
              <div>
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  value={registerForm.email} 
                  onChange={handleRegisterChange} 
                  required 
                />
              </div>
              <button type="submit">Registrarse</button>
            </form>
            <p>
              <a href="#" onClick={() => setView('login')}>Iniciar Sesión</a>
            </p>
          </div>
        );
        
      case 'clients':
        return (
          <div>
            <h2>Lista de Clientes</h2>
            <table border="1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.username}</td>
                    <td>{client.nombre}</td>
                    <td>{client.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'products':
        return (
          <div>
            <h2>Productos</h2>
            <div>
              <input 
                type="text" 
                placeholder="Buscar producto..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <button onClick={fetchProducts}>Buscar</button>
            </div>
            <table border="1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.nombre}</td>
                    <td>{product.descripcion}</td>
                    <td>${product.precio}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      default:
        return <div>Vista no encontrada</div>;
    }
  }
  
  // Navegación para usuarios autenticados
  function renderNav() {
    if (token) {
      return (
        <nav>
          <button onClick={() => setView('clients')}>Clientes</button>
          <button onClick={() => setView('products')}>Productos</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </nav>
      );
    }
    return null;
  }
  
  // Mensaje de error
  function renderError() {
    if (error) {
      return <div style={{color: 'red', margin: '10px 0'}}>{error}</div>;
    }
    return null;
  }
  
  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '10px'}}>
      <h1>Sistema Simple</h1>
      {renderNav()}
      {renderError()}
      {renderContent()}
    </div>
  );
}

export default App;