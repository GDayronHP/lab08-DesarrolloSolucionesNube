# 📦 Aplicación Simple con Docker, React, Node.js y PostgreSQL

Este proyecto es una aplicación web básica que cumple con los requisitos funcionales mínimos. Está diseñada para ejecutarse en contenedores Docker y consta de tres servicios:

- **Frontend** (React - puerto `4000`)
- **API Backend** (Node.js/Express - puerto `8000`)
- **Base de datos** (PostgreSQL)

---

## 📁 Estructura del Proyecto

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


---

## 🚀 Instrucciones de Instalación

1. **Clona o crea la estructura del proyecto** según el esquema anterior.
2. **Agrega el código fuente** en cada archivo según lo proporcionado.
3. En la raíz del proyecto, ejecuta el siguiente comando:

```bash
docker-compose up -d
