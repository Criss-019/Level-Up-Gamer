import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'

function AdminDashboard() {
  const [totalProductos, setTotalProductos] = useState(0)
  const [stockCriticoCount, setStockCriticoCount] = useState(0)
  const [totalUsuarios, setTotalUsuarios] = useState(0)

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem('productos')) || []
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

    setTotalProductos(productos.length)
    setTotalUsuarios(usuarios.length)
    setStockCriticoCount(productos.filter(p => p.stock <= p.stockCritico).length)
  }, [])

  return (
    <AdminLayout activeTab="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="brand-font text-light mb-0">¡HOLA, ADMINISTRADOR!</h2>
        <span className="badge bg-success px-3 py-2 fs-6">Sistema Online</span>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card card-gamer p-4 border-start border-4 border-info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Total Productos</h6>
                <h2 className="brand-font text-light mb-0">{totalProductos}</h2>
              </div>
              <i className="bi bi-controller display-4 text-electric"></i>
            </div>
            <Link to="/admin/productos" className="btn btn-link text-info p-0 mt-3 text-decoration-none">
              Gestionar productos &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card card-gamer p-4 border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Alertas Stock Crítico</h6>
                <h2 className="brand-font text-warning mb-0">{stockCriticoCount}</h2>
              </div>
              <i className="bi bi-exclamation-triangle display-4 text-warning"></i>
            </div>
            <Link to="/admin/productos" className="btn btn-link text-warning p-0 mt-3 text-decoration-none">
              Ver inventario &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card card-gamer p-4 border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Usuarios Registrados</h6>
                <h2 className="brand-font text-neon mb-0">{totalUsuarios}</h2>
              </div>
              <i className="bi bi-people display-4 text-neon"></i>
            </div>
            <Link to="/admin/usuarios" className="btn btn-link text-neon p-0 mt-3 text-decoration-none">
              Gestionar usuarios &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* INSTRUCCIONES */}
      <div className="card card-gamer p-4">
        <h4 className="brand-font text-electric mb-3">
          <i className="bi bi-info-circle"></i> Panel de Control de Inventario y Usuarios
        </h4>
        <p className="text-light mb-0">
          Desde este módulo privado puedes crear nuevos productos, modificar precios y stock, gestionar las alertas de stock crítico y controlar el perfil de los usuarios del sistema Level-Up Gamer.
        </p>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
