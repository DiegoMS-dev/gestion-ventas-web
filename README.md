# Vue 3 + Vite

# 🛒 Sales Management System – Frontend

A modern sales and inventory management system built with **Vue 3**, designed to provide an intuitive and responsive interface for managing business operations.

This project follows the **Single Page Application (SPA)** architecture, allowing users to navigate between different views without reloading the entire page.

## ✨ Features

- **Dashboard:** Overview of business activity, key metrics and notifications.
- **Products:** Product registration, editing, deletion and inventory information.
- **Categories:** Product category management.
- **Clients:** Customer information management.
- **Suppliers:** Supplier management.
- **Purchases:** Purchase management.
- **Inventory:** Stock monitoring and inventory control.
- **Sales:** Sales management.
- **Reports:** Business data analysis and reporting.

## 🚀 Technologies

| Technology | Purpose |
|---|---|
| JavaScript | Main programming language |
| Vue 3 | Frontend framework |
| Vite | Development server and build tool |
| Vue Router | SPA navigation and routing |
| Tailwind CSS 4 | Styling and responsive design |
| Axios | HTTP requests to the backend API |
| Lucide Vue Next | Icons |

## ⚡ SPA Architecture

The application uses a **Single Page Application (SPA)** architecture.

Unlike traditional websites, where navigating to another page requires a complete reload, Vue Router handles navigation on the client side.

This provides:

- Navigation without full page reloads.
- Faster transitions between views.
- Dynamic component rendering.
- Reactive data updates.
- Communication with the backend through HTTP requests.

The frontend communicates with a REST API developed with Laravel.

## 📋 Requirements

- Node.js
- npm
- Git
- Backend API running locally or on a server.

## ⚙️ Installation

**1. Clone the repository**

```bash
git clone https://github.com/DiegoMS-dev/gestion-ventas-web
cd gestion-ventas-web
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Change the URL according to your backend deployment.

**4. Start the development server**

```bash
npm run dev
```

**5. Build for production**

```bash
npm run build
```

## 🔗 Backend

This frontend requires the Laravel REST API:

[Sales Management System – Backend](https://github.com/DiegoMS-dev/gestion-ventas-api)

## 👨‍💻 Author

**Diego Mendieta Saucedo**

GitHub: [@DiegoMS-dev](https://github.com/DiegoMS-dev)

---

Developed as a software development project using Vue 3 and modern web technologies.
