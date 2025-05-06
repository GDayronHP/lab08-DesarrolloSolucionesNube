const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'appdb',
  port: process.env.DB_PORT || 3306
};

// Pool de conexiones
let pool;
const initializePool = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, direccion } = req.body;
    
    // Validación básica
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }
    
    // Verificar si el email ya existe
    const [rows] = await pool.query('SELECT * FROM CLIENTES WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insertar nuevo cliente
    await pool.query(
      'INSERT INTO CLIENTES (nombre, apellido, email, password, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, email, hashedPassword, telefono, direccion]
    );
    
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    // Buscar usuario por email
    const [rows] = await pool.query('SELECT * FROM CLIENTES WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const user = rows[0];
    
    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Actualizar último login
    await pool.query('UPDATE CLIENTES SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    
    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Rutas para CLIENTES
app.get('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, apellido, email, telefono, direccion, fecha_registro, ultimo_login FROM CLIENTES');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.get('/api/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, apellido, email, telefono, direccion, fecha_registro, ultimo_login FROM CLIENTES WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Rutas para PRODUCTOS
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM PRODUCTOS');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM PRODUCTOS WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Para rutas protegidas de productos (crear, actualizar, eliminar)
app.post('/api/productos', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;
    
    // Validación básica
    if (!nombre || !precio) {
      return res.status(400).json({ message: 'El nombre y precio son obligatorios' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO PRODUCTOS (nombre, descripcion, precio, stock, categoria, imagen_url) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock || 0, categoria, imagen_url]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(PORT, async () => {
  await initializePool();
  console.log(`Servidor API corriendo en el puerto ${PORT}`);
});