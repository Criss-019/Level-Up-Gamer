import AdminLayout from '../../components/AdminLayout'
import {
  PRODUCTOS_INICIALES,
  USUARIOS_INICIALES,
  BLOGS_INICIALES
} from '../../js/data'

function AdminRespaldos() {
  const exportarRespaldoJSON = () => {
    const backup = {
      productos: JSON.parse(localStorage.getItem('productos')) || [],
      usuarios: JSON.parse(localStorage.getItem('usuarios')) || [],
      blogs: JSON.parse(localStorage.getItem('blogs')) || [],
      pedidos: JSON.parse(localStorage.getItem('pedidos')) || []
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    const fecha = new Date().toISOString().split('T')[0]
    downloadAnchor.setAttribute('download', `LevelUpGamer_Respaldo_${fecha}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    alert('Respaldo JSON generado y descargado exitosamente.')
  }

  const resetearDatosSistema = () => {
    if (confirm('¿Estás seguro de restablecer todos los datos a sus valores iniciales?')) {
      localStorage.setItem('productos', JSON.stringify(PRODUCTOS_INICIALES))
      localStorage.setItem('usuarios', JSON.stringify(USUARIOS_INICIALES))
      localStorage.setItem('blogs', JSON.stringify(BLOGS_INICIALES))
      localStorage.setItem('carrito', JSON.stringify([]))
      localStorage.setItem('pedidos', JSON.stringify([]))
      alert('Sistema restablecido exitosamente a los valores iniciales por defecto.')
    }
  }

  return (
    <AdminLayout activeTab="respaldos">
      <h2 className="brand-font text-light mb-4">
        <i className="bi bi-database-down text-neon"></i> Respaldos del <span className="text-neon">Sistema</span>
      </h2>

      <div className="row g-4">
        {/* Exportar Respaldo */}
        <div className="col-md-6">
          <div className="card card-gamer p-4 h-100 border-start border-4 border-success">
            <h4 className="brand-font text-neon mb-3">
              <i className="bi bi-download"></i> Exportar Respaldo JSON
            </h4>
            <p className="text-muted mb-4">
              Descarga un archivo en formato JSON con la copia de seguridad completa del catálogo de productos, usuarios y blogs.
            </p>
            <button onClick={exportarRespaldoJSON} className="btn btn-neon py-2">
              <i className="bi bi-file-earmark-arrow-down-fill me-2"></i> Descargar Respaldo JSON
            </button>
          </div>
        </div>

        {/* Restablecer Sistema */}
        <div className="col-md-6">
          <div className="card card-gamer p-4 h-100 border-start border-4 border-danger">
            <h4 className="brand-font text-danger mb-3">
              <i className="bi bi-arrow-counterclockwise"></i> Restablecer Datos Iniciales
            </h4>
            <p className="text-muted mb-4">
              Limpia el almacenamiento local (localStorage) y restaura los datos iniciales de productos y usuarios.
            </p>
            <button onClick={resetearDatosSistema} className="btn btn-outline-danger py-2">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> Restablecer a Valores Iniciales
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminRespaldos
