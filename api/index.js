const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const JWT_SECRET = 'secretkey';

// Conexión a la base de datos
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'app_db'
});

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Inicializar tablas
async function initTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio NUMERIC(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0
      )
    `);
    
    // Insertar algunos productos de ejemplo
    const count = await pool.query('SELECT COUNT(*) FROM productos');
    if (parseInt(count.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
        ('Laptop', 'Laptop 15 pulgadas', 800, 10),
        ('Monitor', 'Monitor 24 pulgadas', 200, 15),
        ('Teclado', 'Teclado mecánico', 80, 20),
        ('Mouse', 'Mouse inalámbrico', 50, 25)
      `);
    }
    
    console.log('Tablas inicializadas');
  } catch (err) {
    console.error('Error inicializando tablas:', err);
  }
}

// Middleware de autenticación simple
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// Rutas
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, nombre, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    
    const result = await pool.query(
      'INSERT INTO clientes (username, password, nombre, email) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, hashedPassword, nombre, email]
    );
    
    const token = jwt.sign({ id: result.rows[0].id, username }, JWT_SECRET);
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ message: 'Error en registro' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const result = await pool.query('SELECT * FROM clientes WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Error en login' });
  }
});

app.get('/api/clients', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, nombre, email FROM clientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
});

app.get('/api/products', authenticate, async (req, res) => {
  try {
    const search = req.query.search || '';
    let query = 'SELECT * FROM productos';
    let params = [];
    
    if (search) {
      query += ' WHERE nombre ILIKE $1 OR descripcion ILIKE $1';
      params.push(`%${search}%`);
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Iniciar todo
initTables();
app.listen(PORT, () => console.log(`API en puerto ${PORT}`));