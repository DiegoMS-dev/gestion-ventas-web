# Vue 3 + Vite

# 🛒 Sistema de Gestión de Ventas – Frontend

Aplicación web para la gestión de ventas e inventario, desarrollada con **Vue 3**, diseñada para ofrecer una interfaz intuitiva y adaptable que facilite la administración de las operaciones de un negocio.

El proyecto utiliza la arquitectura **SPA (Single Page Application)**, permitiendo navegar entre las diferentes vistas sin necesidad de recargar completamente la página.

## ✨ Características

- **Dashboard:** Resumen de la actividad del negocio, indicadores principales y notificaciones.
- **Productos:** Registro, edición, eliminación y consulta de productos.
- **Categorías:** Administración y clasificación de categorías de productos.
- **Clientes:** Gestión de información de clientes.
- **Proveedores:** Administración de proveedores.
- **Compras:** Gestión de operaciones de compra.
- **Inventario:** Control y seguimiento de existencias.
- **Ventas:** Registro y gestión de ventas.
- **Reportes:** Consulta y análisis de información del negocio.

## 🚀 Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| JavaScript | Lenguaje de programación principal |
| Vue 3 | Framework de desarrollo frontend |
| Vite | Herramienta de desarrollo y compilación |
| Vue Router | Navegación y gestión de rutas SPA |
| Tailwind CSS 4 | Diseño y estilos de la interfaz |
| Axios | Comunicación HTTP con el backend |
| Lucide Vue Next | Biblioteca de iconos |

## ⚡ Arquitectura SPA

La aplicación está desarrollada bajo la arquitectura **Single Page Application (SPA)**.

A diferencia de las páginas web tradicionales, donde cada navegación requiere recargar completamente el sitio, Vue Router permite gestionar los cambios de vista desde el navegador, sin realizar una recarga completa de la página.

Esto proporciona:

- Navegación fluida entre las diferentes secciones.
- Transiciones rápidas entre vistas.
- Renderizado dinámico de componentes.
- Actualización reactiva de los datos.
- Comunicación con el backend mediante solicitudes HTTP.

El frontend consume una API REST desarrollada con Laravel, encargada de gestionar la lógica del sistema y las operaciones con la base de datos.

## 📋 Requisitos previos

- Node.js
- npm
- Git
- Backend API en funcionamiento, localmente o en un servidor.

## ⚙️ Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/DiegoMS-dev/gestion-ventas-web
cd gestion-ventas-web
```

**2. Instalar las dependencias**

```bash
npm install
```

**3. Configurar las variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Modificar la URL según la ubicación donde se encuentre desplegado el backend.

**4. Iniciar el servidor de desarrollo**

```bash
npm run dev
```

**5. Generar la versión de producción**

```bash
npm run build
```

## 🔗 Backend

Este proyecto requiere la API REST desarrollada con Laravel:

[Ver repositorio del Backend – Sistema de Gestión de Ventas](https://github.com/DiegoMS-dev/gestion-ventas-api)

## 👨‍💻 Autor

**Diego Mendieta Saucedo**

GitHub: [@DiegoMS-dev](https://github.com/DiegoMS-dev)

---

Desarrollado como proyecto de desarrollo de software utilizando Vue 3 y tecnologías modernas para aplicaciones web.
