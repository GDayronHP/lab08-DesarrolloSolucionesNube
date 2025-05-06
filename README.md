Instrucciones para Aplicación Simple
Esta es una aplicación mínima que cumple con los requisitos especificados. Consta de tres contenedores Docker:

Frontend (puerto 4000): Una interfaz React muy básica
API (puerto 8000): Backend en Node.js/Express
Base de datos: PostgreSQL
Estructura de archivos
proyecto/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       └── index.js
└── api/
    ├── Dockerfile
    ├── package.json
    └── index.js
Instrucciones para instalar
Crea los directorios y archivos necesarios siguiendo la estructura anterior.
Copia y pega el código proporcionado en cada archivo correspondiente.
Desde el directorio raíz, ejecuta:
bash
docker-compose up -d
Características de la aplicación
Registro/Login: Permite crear un usuario y autenticarse
Lista de Clientes: Muestra todos los clientes registrados
Productos: Permite buscar y listar productos
Uso
Accede a http://tu-ip-de-ec2:4000 para ver la interfaz
Regístrate con un usuario o inicia sesión si ya tienes uno
Navega entre la lista de clientes y productos
Notas importantes
Esta es una versión minimalista que prioriza funcionalidad sobre estética
No hay estilos complejos ni validaciones extensas para ahorrar recursos
La aplicación cumple con todos los requisitos solicitados de manera eficiente
