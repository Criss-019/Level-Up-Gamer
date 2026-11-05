import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/styles.css'
import '../css/admin.css'
import Logo from '../assets/images/Logo.png'

function AdminLayout({ children, activeTab }) {
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()

  useEffect(() => {
    if (!usuario || usuario.tipoUsuario !== 'Administrador') {
      alert('Acceso denegado. Se requieren permisos de Administrador para acceder a esta vista.')
      navigate('/login')
    }
  }, [usuario, navigate])

  const handleCerrarSesion = () => {
    cerrarSesion()
    alert('Has cerrado sesión exitosamente.')
    navigate('/')
  }

  return (
    <div>
      {/* BARRA DE NAVEGACIÓN SUPERIOR DE ADMIN */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-primary px-3">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/admin">
            <img src={Logo} alt="Logo" style={{ height: '35px' }} />
            <span className="brand-font fs-5 text-light">
              PANEL <span className="text-neon">ADMINISTRATIVO</span>
            </span>
          </Link>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <Link to="/" className="btn btn-outline-light btn-sm">
              <i className="bi bi-shop"></i> Ir a la Tienda
            </Link>
            <button onClick={handleCerrarSesion} className="btn btn-outline-danger btn-sm">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* ESTRUCTURA DE ADMINISTRACIÓN CON MENÚ LATERAL */}
      <div className="admin-wrapper">
        <aside className="admin-sidebar">
          <h6 className="brand-font text-muted mb-3 px-2">MENÚ PRINCIPAL</h6>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} to="/admin">
                <i className="bi bi-speedometer2"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'productos' ? 'active' : ''}`} to="/admin/productos">
                <i className="bi bi-box-seam"></i> Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`} to="/admin/usuarios">
                <i className="bi bi-people"></i> Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'respaldos' ? 'active' : ''}`} to="/admin/respaldos">
                <i className="bi bi-database-down"></i> Respaldos
              </Link>
            </li>
          </ul>
        </aside>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
