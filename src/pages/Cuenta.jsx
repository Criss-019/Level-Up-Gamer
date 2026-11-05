import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/styles.css'
import '../css/tienda.css'

function Cuenta() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [activeTab, setActiveTab] = useState('pedidos')
  const [pedidos, setPedidos] = useState([])
  const [tipoSugerencia, setTipoSugerencia] = useState('producto')
  const [mensajeSugerencia, setMensajeSugerencia] = useState('')

  useEffect(() => {
    if (!usuario) {
      alert('Debes iniciar sesión para acceder a tu cuenta.')
      navigate('/login')
      return
    }

    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos')) || []
    setPedidos(pedidosGuardados)
  }, [usuario, navigate])

  const handleSugerencia = (e) => {
    e.preventDefault()
    alert('¡Gracias por tu sugerencia! Ayudas a mejorar la comunidad.')
    setMensajeSugerencia('')
  }

  if (!usuario) {
    return null
  }

  return (
    <main className="container my-4">
      <div className="row">
        {/* PERFIL IZQUIERDO */}
        <div className="col-md-4 mb-4">
          <div className="card card-gamer p-4 text-center">
            <div className="mb-3">
              <i className="bi bi-person-circle display-1 text-neon"></i>
            </div>
            <h4 className="brand-font text-light" id="acc-nombre">
              {usuario.nombre} {usuario.apellidos}
            </h4>
            <span className="badge bg-secondary mb-2" id="acc-correo">
              {usuario.correo}
            </span>

            {usuario.descuentoDuoc && (
              <div className="mt-2">
                <span className="badge badge-duoc">20% Descuento Duoc Activo</span>
              </div>
            )}

            <div className="alert alert-dark border-primary mt-4 mb-0">
              <span className="text-muted small d-block">Puntos LevelUp Acumulados</span>
              <h3 className="text-neon brand-font mb-0" id="acc-puntos">
                {usuario.puntosLevelUp || 50} pts
              </h3>
            </div>
          </div>
        </div>

        {/* PESTAÑAS DERECHAS */}
        <div className="col-md-8">
          <ul className="nav nav-tabs border-secondary mb-3" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link text-light ${activeTab === 'pedidos' ? 'active' : ''}`}
                onClick={() => setActiveTab('pedidos')}
                type="button"
              >
                <i className="bi bi-box-seam"></i> Mis Pedidos
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link text-light ${activeTab === 'ruta' ? 'active' : ''}`}
                onClick={() => setActiveTab('ruta')}
                type="button"
              >
                <i className="bi bi-truck"></i> Pedidos en Ruta
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link text-light ${activeTab === 'boletas' ? 'active' : ''}`}
                onClick={() => setActiveTab('boletas')}
                type="button"
              >
                <i className="bi bi-receipt"></i> Boletas
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link text-light ${activeTab === 'sugerir' ? 'active' : ''}`}
                onClick={() => setActiveTab('sugerir')}
                type="button"
              >
                <i className="bi bi-lightbulb"></i> Sugerir
              </button>
            </li>
          </ul>

          <div className="tab-content card card-gamer p-4">
            {/* Pestaña 1: Mis Pedidos */}
            {activeTab === 'pedidos' && (
              <div>
                <h5 className="brand-font text-neon mb-3">Historial de Compras</h5>
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th># Orden</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map((p, idx) => (
                        <tr key={idx}>
                          <td><strong>{p.ordenId}</strong></td>
                          <td>{p.fecha}</td>
                          <td><span className="badge bg-info">{p.estado || 'En Preparación'}</span></td>
                          <td>${p.total ? p.total.toLocaleString('es-CL') : '0'} CLP</td>
                        </tr>
                      ))}
                      <tr>
                        <td><strong>#LUG-948271</strong></td>
                        <td>2026-08-30</td>
                        <td><span className="badge bg-success">Entregado</span></td>
                        <td>$79.990 CLP</td>
                      </tr>
                      <tr>
                        <td><strong>#LUG-102938</strong></td>
                        <td>2026-09-02</td>
                        <td><span className="badge bg-warning text-dark">En Ruta</span></td>
                        <td>$49.990 CLP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pestaña 2: Pedidos en Ruta */}
            {activeTab === 'ruta' && (
              <div>
                <h5 className="brand-font text-electric mb-3">Seguimiento de Envío</h5>
                <div className="card bg-dark border-primary p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Orden #LUG-102938</strong>
                    <span className="badge bg-warning text-dark">En Ruta de Entrega</span>
                  </div>
                  <p className="small text-muted mb-2">
                    Empresa de Despacho: Chilexpress - Número de Seguimiento: 789123456
                  </p>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar bg-info progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                  <small className="text-neon mt-2 d-block">
                    Llegada estimada: Mañana antes de las 18:00 hrs
                  </small>
                </div>
              </div>
            )}

            {/* Pestaña 3: Boletas */}
            {activeTab === 'boletas' && (
              <div>
                <h5 className="brand-font text-neon mb-3">Boletas Electrónicas</h5>
                <div className="list-group list-group-flush bg-transparent">
                  <button
                    onClick={() => alert('Descargando boleta electrónica PDF...')}
                    className="list-group-item list-group-item-action bg-dark text-light border-secondary d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <i className="bi bi-file-earmark-pdf text-danger me-2"></i> Boleta_LUG-948271.pdf
                      <small className="text-muted d-block">Emisión: 2026-08-30</small>
                    </div>
                    <span className="btn btn-outline-neon btn-sm">Descargar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Pestaña 4: Sugerir */}
            {activeTab === 'sugerir' && (
              <div>
                <h5 className="brand-font text-electric mb-3">Enviar Sugerencia a Level-Up Gamer</h5>
                <form onSubmit={handleSugerencia}>
                  <div className="mb-3">
                    <label htmlFor="txtTipoSugerencia" className="form-label text-light">Tipo de Sugerencia</label>
                    <select
                      id="txtTipoSugerencia"
                      className="form-select form-select-gamer"
                      value={tipoSugerencia}
                      onChange={(e) => setTipoSugerencia(e.target.value)}
                    >
                      <option value="producto">Nuevo Producto deseado</option>
                      <option value="web">Mejora de la Página Web</option>
                      <option value="evento">Sugerencia de Evento Gamer</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="txtMensajeSugerencia" className="form-label text-light">Detalle de tu Sugerencia</label>
                    <textarea
                      id="txtMensajeSugerencia"
                      className="form-control form-control-gamer"
                      rows="4"
                      placeholder="Escribe tus ideas..."
                      value={mensajeSugerencia}
                      onChange={(e) => setMensajeSugerencia(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-neon">Enviar Sugerencia</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Cuenta
