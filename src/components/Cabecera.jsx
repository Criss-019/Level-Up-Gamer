import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCarrito } from '../context/CarritoContext'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function Cabecera() {
  const { usuario, cerrarSesion } = useAuth()
  const { totalItems } = useCarrito()
  const navigate = useNavigate()
  const location = useLocation()

  const handleCerrarSesion = () => {
    cerrarSesion()
    alert('Has cerrado sesión exitosamente.')
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-gamer sticky-top">
      <div className="container">
        {/* Logo de la Tienda */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={Logo} alt="Level-Up Gamer Logo" />
          <span className="brand-font fs-4 text-light">
            LEVEL-UP <span className="text-neon">GAMER</span>
          </span>
        </Link>

        {/* Botón Toggler para dispositivos móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          {/* Menú de Navegación */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' || location.pathname === '/index.html' ? 'active' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/productos' || location.pathname === '/productos.html' ? 'active' : ''}`} to="/productos">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/blog' || location.pathname === '/blog.html' ? 'active' : ''}`} to="/blog">
                Blog Gamer
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/nosotros' || location.pathname === '/nosotros.html' ? 'active' : ''}`} to="/nosotros">
                Quiénes Somos
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/contacto' || location.pathname === '/contacto.html' ? 'active' : ''}`} to="/contacto">
                Contacto
              </Link>
            </li>
          </ul>

          {/* Acceso al Carrito de Compras */}
          <Link to="/carrito" className="btn btn-outline-neon me-3 position-relative" title="Ver Carrito">
            <i className="bi bi-cart3 fs-5"></i>
            <span id="cart-count-badge" className="position-absolute top-0 start-100 translate-middle badge cart-badge">
              {totalItems || 0}
            </span>
          </Link>

          {/* Contenedor dinámico de usuario */}
          <div id="nav-auth-container">
            {usuario ? (
              <ul className="navbar-nav ms-auto align-items-center">
                {usuario.tipoUsuario === 'Administrador' && (
                  <li className="nav-item">
                    <Link className="nav-link text-warning fw-bold" to="/admin">
                      <i className="bi bi-shield-lock-fill"></i> Administrar
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/cuenta">
                    <i className="bi bi-person-circle"></i> Hola, {usuario.nombre}
                    {(usuario.descuentoDuoc || usuario.esDuoc) && (
                      <span className="badge badge-duoc ms-1">Desc. 20% Duoc</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleCerrarSesion} className="btn btn-outline-danger btn-sm ms-2">
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            ) : (
              <div className="d-flex gap-2 ms-auto">
                <Link to="/login" className="btn btn-outline-electric btn-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn btn-neon btn-sm">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Cabecera
