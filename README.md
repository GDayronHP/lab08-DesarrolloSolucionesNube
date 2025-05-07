# 📦 Aplicación Simple con Docker, React, Node.js y PostgreSQL

Este proyecto es una aplicación web básica que cumple con los requisitos funcionales mínimos. Está diseñada para ejecutarse en contenedores Docker y consta de tres servicios:

- **Frontend** (React - puerto `4000`)
- **API Backend** (Node.js/Express - puerto `8000`)
- **Base de datos** (PostgreSQL)

---

## 📁 Estructura del Proyecto
```bash
proyecto/
├── docker-compose.yml
├── frontend/
│ ├── Dockerfile
│ ├── package.json
│ ├── public/
│ │ └── index.html
│ └── src/
│ ├── App.js
│ └── index.js
└── api/
├── Dockerfile
├── package.json
└── index.js
```

---

## 🚀 Instrucciones de Instalación

1. **Clona el proyecto** usando el siguiente comando:

   ```bash
   git clone <URL-del-repositorio>
   ```

2. **Ingresa al directorio del proyecto**:

   ```bash
   cd lab08-DesarrolloSolucionesNube
   ```

3. **Levanta los servicios con Docker Compose (Forma moderna)**:

   ```bash
   docker compose up -d
   ```

4. Espera a que todos los servicios se inicien correctamente.

5. Abre tu navegador y accede a la aplicación usando la siguiente estructura:  
   ```
   http://<tu-ip>:4000
   ```


