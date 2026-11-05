# Level-Up Gamer

Tienda online especializada en productos gamer, consolas, accesorios y juegos de mesa. Proyecto frontend desarrollado con **React**, **Vite** y **Bootstrap**, enfocado en componentes reutilizables, gestión de estado global y pruebas unitarias automatizadas.

---

## Características Principales

* **Catálogo Interactivo:** Búsqueda en tiempo real, filtro por categorías y filtro por rango de precios.
* **Carrito de Compras:** Control de stock, cálculo de subtotal y aplicación automática de un **20% de descuento** para correos de Duoc UC (`@duoc.cl` / `@duocuc.cl`).
* **Autenticación y Roles:** Registro de usuarios con validación de RUT chileno y mayoría de edad (+18 años), inicio de sesión y persistencia en `localStorage`.
* **Panel de Administración:** Gestión de productos (CRUD), visualización de stock crítico, control de usuarios y respaldo de datos en formato JSON.
* **Pruebas Unitarias:** 34 tests automatizados con **Vitest** y **React Testing Library** con 100% de éxito.

---

## Requisitos del Sistema

Para ejecutar este proyecto necesitas tener instalado en tu computadora:

* **Node.js:** Versión 18.x o superior (recomendado v20+ o v24+).
* **NPM:** Versión 9.x o superior.
* Un navegador web moderno (por ejemplo: Google Chrome, Microsoft Edge, Mozilla Firefox).

---

## Instrucciones de Instalación y Ejecución

Sigue estos pasos en la terminal para poner en marcha el proyecto:

1. **Clonar el repositorio o abrir la carpeta del proyecto:**
   ```bash
   cd "Level-Up Gamer"
   ```

2. **Instalar dependencias necesarias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Haz clic en el enlace local que muestra la terminal (generalmente `http://localhost:5173`).

---

## Pruebas Unitarias (Testing)

El proyecto incluye una batería completa de pruebas unitarias para validar componentes, formularios, contextos y cálculos del carrito:

* **Ejecutar todas las pruebas una sola vez:**
  ```bash
  npm test -- --run
  ```

* **Ejecutar pruebas en modo observador:**
  ```bash
  npm test
  ```

* **Generar el informe de cobertura de código:**
  ```bash
  npm run test:coverage
  ```
  *(El reporte se genera en la carpeta `coverage/index.html`)*

---

## Cuentas de Acceso para Pruebas

El sistema cuenta con usuarios precargados en `localStorage` para evaluar las distintas funcionalidades:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@duoc.cl` | `admin123` | Acceso total al panel administrativo (`/admin`) |
| **Cliente** | `juan.perez@gmail.com` | `user123` | Navegación, compra en tienda y perfil de usuario |

---

## Estructura del Código Fuente (`src/`)

* `src/components/`: Componentes reutilizables (Cabecera, Footers, Layout de Admin).
* `src/context/`: Estado global de la aplicación (`AuthContext` y `CarritoContext`).
* `src/pages/`: Vistas públicas (Home, Catálogo, Detalle, Carrito, Login, Registro, etc.).
* `src/pages/admin/`: Vistas privadas del panel de administración (Dashboard, Productos, Usuarios, Respaldos).
* `src/js/data.js`: Fuente de datos simulada y precarga en `localStorage`.
