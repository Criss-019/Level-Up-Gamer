import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

// Componentes
import Cabecera from './components/Cabecera'
import Footer from './components/Footer'
import FooterSecundario from './components/FooterSecundario'

// Páginas de la Tienda
import Home from './pages/Home'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Carrito from './pages/Carrito'
import Blog from './pages/Blog'
import DetalleBlog from './pages/DetalleBlog'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Cuenta from './pages/Cuenta'

// Páginas de Administración
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductos from './pages/admin/AdminProductos'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminRespaldos from './pages/admin/AdminRespaldos'

// Contextos Globales
import { AuthProvider } from './context/AuthContext'
import { CarritoProvider } from './context/CarritoContext'

// Inicialización de datos
import { inicializarLocalStorage } from './js/data'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isHome = location.pathname === '/' || location.pathname === '/index.html'

  useEffect(() => {
    inicializarLocalStorage()
  }, [])

  return (
    <AuthProvider>
      <CarritoProvider>
        {/* Cabecera para las vistas públicas */}
        {!isAdmin && <Cabecera />}

      {/* Rutas de la Aplicación */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos.html" element={<Productos />} />
        <Route path="/detalle-producto" element={<DetalleProducto />} />
        <Route path="/detalle-producto.html" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/carrito.html" element={<Carrito />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog.html" element={<Blog />} />
        <Route path="/detalle-blog" element={<DetalleBlog />} />
        <Route path="/detalle-blog.html" element={<DetalleBlog />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/nosotros.html" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/contacto.html" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login.html" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/registro.html" element={<Registro />} />
        <Route path="/cuenta" element={<Cuenta />} />
        <Route path="/cuenta.html" element={<Cuenta />} />

        {/* Rutas de Administración */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/index.html" element={<AdminDashboard />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/productos.html" element={<AdminProductos />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/usuarios.html" element={<AdminUsuarios />} />
        <Route path="/admin/respaldos" element={<AdminRespaldos />} />
        <Route path="/admin/respaldos.html" element={<AdminRespaldos />} />
      </Routes>

      {/* Footer condicional:
          - En Home (index) se muestra el Footer único
          - En las otras 10 páginas públicas se muestra el Footer secundario compartido
          - En las páginas de administración no se muestra footer
      */}
      {!isAdmin && (isHome ? <Footer /> : <FooterSecundario />)}
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App
