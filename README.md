# Nativ POS System 

Sistema de punto de venta (POS) para restaurantes con facturación electrónica adaptada a Colombia.

## Descripción

Sistema completo de gestión para restaurantes que permite administrar órdenes, mesas, empleados, clientes y generar facturas conforme a los requisitos de facturación colombiana (DIAN).

## Características Principales

### Gestión de Órdenes
- Creación y seguimiento de órdenes en tiempo real
- Estados: PENDIENTE, EN_PREPARACION, LISTO, ENTREGADO, PAGADO, CANCELADO
- Asignación de meseros y mesas
- Cálculo automático de impuestos (IVA configurable por producto)

### Sistema de Facturación Colombiana
- Números de factura consecutivos únicos
- Soporte para clientes registrados y consumidores finales
- Campos obligatorios y opcionales según normativa DIAN
- Facturación electrónica (preparado para CUFE, QR, firma digital)
- Métodos de pago: Efectivo, Tarjeta Débito/Crédito, Transferencia
- Tipos de pago: Contado y Crédito
- Anulación de facturas (solo administradores)

### Gestión de Usuarios
- Roles: Administrador, Cajero, Mesero, Cliente
- Autenticación con JWT
- Control de acceso basado en roles
- Clientes registrados con historial de compras

### Gestión de Mesas
- Asignación de mesas a órdenes
- Estados de disponibilidad

## Stack Tecnológico

### Frontend
- **Framework:** React + Vite
- **Enrutamiento:** React Router DOM v6
- **Estado Global:** Redux Toolkit
- **Gestión de Datos:** TanStack Query (React Query)
- **Estilos:** Tailwind CSS
- **HTTP Client:** Axios
- **Notificaciones:** Notistack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de Datos:** MongoDB + Mongoose
- **Autenticación:** JWT (JSON Web Tokens)
- **Encriptación:** bcrypt
- **Variables de Entorno:** dotenv
- **Validación:** http-errors

## Estructura del Proyecto

```
nativ_POS_system/
├── pos-backend/
│   ├── config/
│   │   ├── config.js          # Configuración centralizada
│   │   └── database.js        # Conexión MongoDB
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   ├── invoiceController.js
│   │   ├── tableController.js
│   │   └── paymentController.js
│   ├── middlewares/
│   │   ├── tokenVerification.js
│   │   └── globalErrorHandler.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── orderModel.js
│   │   ├── invoiceModel.js
│   │   ├── tableModel.js
│   │   └── paymentModel.js
│   ├── routes/
│   │   ├── userRoute.js
│   │   ├── orderRoute.js
│   │   ├── invoiceRoute.js
│   │   ├── tableRoute.js
│   │   └── paymentRoute.js
│   ├── .env
│   ├── app.js
│   └── package.json
│
└── pos-frontend/
    ├── src/
    │   ├── components/
    │   │   └── shared/
    │   ├── hooks/
    │   │   └── useLoadData.js
    │   ├── https/
    │   │   ├── axiosWrapper.js
    │   │   └── index.js
    │   ├── pages/
    │   │   ├── Auth.jsx
    │   │   ├── Home.jsx
    │   │   ├── Orders.jsx
    │   │   ├── Tables.jsx
    │   │   ├── Menu.jsx
    │   │   └── Dashboard.jsx
    │   ├── redux/
    │   │   └── slices/
    │   │       └── userSlice.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

## Instalación

### Prerrequisitos
- Node.js v16 o superior
- MongoDB (local o Atlas)
- npm o yarn

### Backend

```bash
cd pos-backend
npm install
```

Crear archivo `.env`:
```env
PORT=8000
MONGODB_URI="tu_mongodb_connection_string"
JWT_SECRET=tu_secreto_jwt_seguro

# Datos del negocio para facturación
BUSINESS_NAME=Tu Restaurante SAS
BUSINESS_NIT=900123456-7
BUSINESS_ADDRESS=Calle 123 #45-67, Medellín, Antioquia
BUSINESS_PHONE=3001234567
BUSINESS_EMAIL=facturacion@turestaurante.com
```

Iniciar servidor:
```bash
npm run dev
```

### Frontend

```bash
cd pos-frontend
npm install
```

Crear archivo `.env`:
```env
VITE_BACKEND_URL=http://localhost:8000
```

Iniciar aplicación:
```bash
npm run dev
```

## API Endpoints

### Autenticación
```
POST   /api/user/register    - Registrar usuario
POST   /api/user/login       - Login
GET    /api/user             - Obtener datos del usuario (requiere auth)
POST   /api/user/logout      - Logout
```

### Órdenes
```
POST   /api/order            - Crear orden
GET    /api/order            - Listar órdenes
GET    /api/order/:id        - Obtener orden por ID
PATCH  /api/order/:id        - Actualizar orden
```

### Facturas
```
POST   /api/invoice                    - Crear factura
GET    /api/invoice                    - Listar facturas
GET    /api/invoice/:id                - Obtener factura por ID
GET    /api/invoice/customer/:id       - Facturas de un cliente
PATCH  /api/invoice/:id/cancel         - Anular factura (admin)
```

### Mesas
```
POST   /api/table            - Crear mesa
GET    /api/table            - Listar mesas
GET    /api/table/:id        - Obtener mesa por ID
PATCH  /api/table/:id        - Actualizar mesa
DELETE /api/table/:id        - Eliminar mesa
```

## Modelos de Datos

### Usuario
- Empleados: Administrador, Cajero, Mesero
- Clientes: Con datos opcionales de facturación (NIT, dirección)

### Orden
- Información del cliente (registrado o walk-in)
- Lista de productos con precios y cantidades
- Cálculo automático de subtotal, impuestos y total
- Estado de la orden y del pago
- Referencia a factura (cuando se genera)

### Factura
- Número consecutivo único
- Datos del emisor (restaurante)
- Datos del receptor (cliente o consumidor final)
- Detalle línea por línea de productos
- Totales discriminados (subtotal, IVA, total)
- Campos para factura electrónica
- Referencia a orden y cajero que procesó

## Características de Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración de 1 día
- Cookies HttpOnly para tokens
- Validación de permisos por rol
- CORS configurado
- Middleware de manejo de errores global

## Estado Actual del Proyecto

**Completado:**
- ✅ Sistema de autenticación completo
- ✅ Gestión de usuarios con roles
- ✅ CRUD de órdenes
- ✅ CRUD de mesas
- ✅ Sistema de facturación colombiana
- ✅ Relaciones entre modelos (órdenes, facturas, usuarios)
- ✅ Middleware de autenticación y autorización

**En Desarrollo:**
- 🚧 Catálogo de productos
- 🚧 Interfaz de caja/facturación (frontend)
- 🚧 Reportes y analytics
- 🚧 Integración con facturación electrónica DIAN

**Por Implementar:**
- 📋 Sistema de inventario
- 📋 Gestión de proveedores
- 📋 Reportes de ventas avanzados
- 📋 App móvil para meseros

## Flujo de Trabajo

1. **Mesero** toma la orden del cliente
2. La orden se crea con estado PENDIENTE
3. Cocina ve la orden y la marca como EN_PREPARACION
4. Cuando está lista, se marca como LISTO
5. Mesero entrega y marca como ENTREGADO
6. **Cajero** genera la factura desde la orden
7. Sistema registra el pago y actualiza la orden a PAGADO

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

