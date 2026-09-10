# E-novamarket 🛒

E-commerce de tecnología desarrollado con **React + Vite + Tailwind CSS** en el frontend, integrado con un backend propio (Node.js) desarrollado por un compañero de equipo.

## 📋 Descripción

Nova-Market es una tienda online de productos tecnológicos (accesorios, periféricos y gadgets) que permite a los usuarios registrarse, iniciar sesión, explorar el catálogo de productos, agregar ítems al carrito y generar órdenes de compra. Cuenta además con un panel de administración para la gestión de productos y órdenes.

## ✨ Funcionalidades

- **Autenticación**: registro e inicio de sesión de usuarios, con persistencia de sesión mediante `AuthContext` (token + datos de usuario).
- **Catálogo de productos**: grilla de productos conectada al backend, con filtrado por categoría (Accesorios, Periféricos, Gadgets) y búsqueda en vivo.
- **Detalle de producto**: modal "Ver detalles" con imagen ampliada.
- **Carrito de compras**: manejo de ítems, cantidades y totales mediante `CartContext`.
- **Checkout**: página completa de finalización de compra, con resumen del pedido, datos del cliente y confirmación de orden (`POST /api/orders`).
- **Panel de administración**: acceso restringido a usuarios con rol `admin` para la gestión de productos y visualización/actualización de órdenes.
- **Diseño responsive** basado en un sistema de tarjetas (header, carrusel/hero, grilla de productos y footer), con paleta de marca (`#457B9D`, `#2B8D8B`).

## 🛠️ Tecnologías

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [lucide-react](https://lucide.dev/) (íconos)
- Backend propio en Node.js (repositorio separado)

## 📁 Estructura del proyecto

```
src/
├── assets/            # Imágenes y recursos estáticos
├── context/           # AuthContext y CartContext
├── pages/
│   ├── Register.jsx   # Página de registro
│   ├── login.jsx      # Página de inicio de sesión
│   ├── Checkout.jsx   # Página de checkout
│   └── AdminProductos.jsx  # Panel de administración de productos
├── components/
│   ├── EcommerceHero.jsx   # Header, hero, categorías y grilla de productos
│   └── Footer.jsx          # Footer del sitio
├── App.jsx
└── main.jsx
```

## 🚀 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/marianafuego96-png/E-novamarket.git
   cd E-novamarket
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno necesarias para apuntar al backend (URL base de la API).

4. Ejecutar el proyecto en modo desarrollo:
   ```bash
   npm run dev
   ```

## 🔌 Backend

El backend es desarrollado y mantenido en un repositorio separado por otro integrante del equipo. Expone, entre otros, los siguientes endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| GET | `/api/products` | Listado de productos |
| POST | `/api/orders` | Crear orden (requiere autenticación) |
| GET | `/api/orders/my` | Órdenes del usuario autenticado |
| GET | `/api/orders` | Todas las órdenes (solo admin) |
| PUT | `/api/orders/<order_id>/status` | Actualizar estado de una orden (solo admin) |

> La protección de las rutas de administración en el frontend es solo una capa de UX; la seguridad real se aplica en el backend mediante JWT y validación de rol.

## 📌 Estado del proyecto

En desarrollo activo. Próximas mejoras incluyen la gestión completa de órdenes desde el panel de administración y el descuento de stock al confirmar una compra.
