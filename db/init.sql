-- Crear tabla de CLIENTES
CREATE TABLE IF NOT EXISTS CLIENTES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL
);

-- Crear tabla de PRODUCTOS
CREATE TABLE IF NOT EXISTS PRODUCTOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50),
    imagen_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos datos de ejemplo
INSERT INTO CLIENTES (nombre, apellido, email, password, telefono, direccion) VALUES
('Juan', 'Pérez', 'juan@ejemplo.com', '$2b$10$XcUvp5FX8aXnq.ck5rKKB.bQAvbQg0yRY9CCJNCq8C9Ng8Ev4VPLe', '555-1234', 'Calle Principal 123'), -- password: password123
('María', 'González', 'maria@ejemplo.com', '$2b$10$XcUvp5FX8aXnq.ck5rKKB.bQAvbQg0yRY9CCJNCq8C9Ng8Ev4VPLe', '555-5678', 'Avenida Central 456'); -- password: password123

INSERT INTO PRODUCTOS (nombre, descripcion, precio, stock, categoria, imagen_url) VALUES
('Laptop HP', 'Laptop HP 15 pulgadas, 8GB RAM, 256GB SSD', 799.99, 10, 'Electrónica', '/images/laptop.jpg'),
('Monitor Dell', 'Monitor Dell 24 pulgadas Full HD', 249.99, 15, 'Electrónica', '/images/monitor.jpg'),
('Teclado Mecánico', 'Teclado gaming mecánico RGB', 89.99, 20, 'Accesorios', '/images/teclado.jpg'),
('Mouse Inalámbrico', 'Mouse óptico inalámbrico', 29.99, 30, 'Accesorios', '/images/mouse.jpg');
