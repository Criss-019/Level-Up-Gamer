import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])

  const cargarUsuarios = () => {
    const users = JSON.parse(localStorage.getItem('usuarios')) || []
    setUsuarios(users)
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const alternarEstadoUsuario = (run) => {
    const userStr = localStorage.getItem('usuarioActual')
    let usuarioActual = null
    if (userStr) {
      try {
        usuarioActual = JSON.parse(userStr)
      } catch (e) {
        usuarioActual = null
      }
    }

    if (usuarioActual && usuarioActual.run === run) {
      alert('No puedes desactivar tu propia cuenta de Administrador.')
      return
    }

    const nuevosUsuarios = usuarios.map(u => {
      if (u.run === run) {
        const nuevoEstado = !u.activo
        alert(`Usuario ${u.nombre} ${u.apellidos} ${nuevoEstado ? 'reactivado' : 'dado de baja'}.`)
        return { ...u, activo: nuevoEstado }
      }
      return u
    })

    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios))
    setUsuarios(nuevosUsuarios)
  }

  return (
    <AdminLayout activeTab="usuarios">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="brand-font text-light mb-0">
          <i className="bi bi-people text-electric"></i> Gestión de <span className="text-electric">Usuarios</span>
        </h2>
        <Link to="/registro" className="btn btn-electric">
          <i className="bi bi-person-plus-fill me-1"></i> Registrar Nuevo Usuario
        </Link>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="card card-gamer p-3">
        <div className="table-responsive">
          <table className="table table-gamer table-hover">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Tipo de Usuario</th>
                <th>Región</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">No hay usuarios registrados.</td>
                </tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.run}>
                    <td><strong>{u.run}</strong></td>
                    <td>{u.nombre} {u.apellidos}</td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={`badge ${u.tipoUsuario === 'Administrador' ? 'bg-warning text-dark' : 'bg-info'}`}>
                        {u.tipoUsuario}
                      </span>
                    </td>
                    <td>{u.region || 'Metropolitana'}</td>
                    <td>
                      {u.activo ? (
                        <span className="badge bg-success">Activo</span>
                      ) : (
                        <span className="badge bg-secondary">Dado de baja</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => alternarEstadoUsuario(u.run)}
                        className={`btn btn-outline-${u.activo ? 'warning' : 'success'} btn-sm`}
                        title={u.activo ? 'Dar de Baja' : 'Reactivar'}
                      >
                        <i className={`bi bi-${u.activo ? 'person-dash' : 'person-check'}`}></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminUsuarios
