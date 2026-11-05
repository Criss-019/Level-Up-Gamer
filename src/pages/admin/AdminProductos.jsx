import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)

  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    stockCritico: '3',
    descripcion: '',
    imagen: 'img/Logo.png'
  })

  const [errores, setErrores] = useState({})

  const cargarProductos = () => {
    const prods = JSON.parse(localStorage.getItem('productos')) || []
    setProductos(prods)
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  const abrirModalNuevo = () => {
    setModoEdicion(false)
    setForm({
      codigo: '',
      nombre: '',
      categoria: '',
      precio: '',
      stock: '',
      stockCritico: '3',
      descripcion: '',
      imagen: 'img/Logo.png'
    })
    setErrores({})
    setMostrarModal(true)
  }

  const abrirModalEditar = (prod) => {
    setModoEdicion(true)
    setForm({
      codigo: prod.codigo,
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio.toString(),
      stock: prod.stock.toString(),
      stockCritico: (prod.stockCritico || 0).toString(),
      descripcion: prod.descripcion || '',
      imagen: prod.imagen || 'img/Logo.png'
    })
    setErrores({})
    setMostrarModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' })
    }
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    const err = {}

    if (!form.codigo.trim() || form.codigo.trim().length < 3) {
      err.codigo = 'El código debe tener al menos 3 caracteres.'
    }

    if (!form.nombre.trim() || form.nombre.trim().length > 100) {
      err.nombre = 'El nombre es requerido y máximo 100 caracteres.'
    }

    if (!form.categoria) {
      err.categoria = 'Seleccione una categoría.'
    }

    if (form.precio === '' || isNaN(form.precio) || Number(form.precio) < 0) {
      err.precio = 'Ingrese un precio válido.'
    }

    if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0) {
      err.stock = 'Ingrese un stock válido.'
    }

    if (form.descripcion && form.descripcion.length > 500) {
      err.descripcion = 'La descripción no puede superar 500 caracteres.'
    }

    if (!modoEdicion) {
      const existe = productos.some(p => p.codigo.toUpperCase() === form.codigo.trim().toUpperCase())
      if (existe) {
        err.codigo = 'Ya existe un producto con este código.'
      }
    }

    if (Object.keys(err).length > 0) {
      setErrores(err)
      return
    }

    let nuevosProductos = [...productos]

    if (modoEdicion) {
      nuevosProductos = nuevosProductos.map(p => {
        if (p.codigo === form.codigo) {
          return {
            ...p,
            nombre: form.nombre.trim(),
            categoria: form.categoria,
            precio: parseFloat(form.precio),
            stock: parseInt(form.stock),
            stockCritico: parseInt(form.stockCritico) || 0,
            descripcion: form.descripcion.trim(),
            imagen: form.imagen.trim() || 'img/Logo.png'
          }
        }
        return p
      })
      alert(`Producto "${form.nombre}" actualizado con éxito.`)
    } else {
      const nuevo = {
        codigo: form.codigo.trim().toUpperCase(),
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        stockCritico: parseInt(form.stockCritico) || 0,
        descripcion: form.descripcion.trim(),
        imagen: form.imagen.trim() || 'img/Logo.png',
        activo: true
      }
      nuevosProductos.push(nuevo)
      alert(`Producto "${form.nombre}" creado exitosamente.`)
    }

    localStorage.setItem('productos', JSON.stringify(nuevosProductos))
    setProductos(nuevosProductos)
    setMostrarModal(false)
  }

  const alternarEstado = (codigo) => {
    const nuevosProductos = productos.map(p => {
      if (p.codigo === codigo) {
        const nuevoEstado = !p.activo
        alert(`Producto ${p.codigo} ${nuevoEstado ? 'reactivado' : 'dado de baja'}.`)
        return { ...p, activo: nuevoEstado }
      }
      return p
    })
    localStorage.setItem('productos', JSON.stringify(nuevosProductos))
    setProductos(nuevosProductos)
  }

  return (
    <AdminLayout activeTab="productos">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="brand-font text-light mb-0">
          <i className="bi bi-box-seam text-neon"></i> Gestión de <span className="text-neon">Productos</span>
        </h2>
        <button onClick={abrirModalNuevo} className="btn btn-neon">
          <i className="bi bi-plus-circle-fill me-1"></i> Nuevo Producto
        </button>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="card card-gamer p-3">
        <div className="table-responsive">
          <table className="table table-gamer table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">No hay productos registrados.</td>
                </tr>
              ) : (
                productos.map(p => {
                  let stockTd = `${p.stock}`
                  if (p.stock === 0) {
                    stockTd = <span className="badge bg-danger">Agotado (0)</span>
                  } else if (p.stock <= p.stockCritico) {
                    stockTd = <span className="badge stock-critico-badge">Stock Crítico ({p.stock})</span>
                  }

                  return (
                    <tr key={p.codigo}>
                      <td><strong>{p.codigo}</strong></td>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>{formatearPrecio(p.precio)}</td>
                      <td>{stockTd}</td>
                      <td>
                        {p.activo ? (
                          <span className="badge bg-success">Activo</span>
                        ) : (
                          <span className="badge bg-secondary">Dado de baja</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => abrirModalEditar(p)}
                          className="btn btn-outline-info btn-sm me-1"
                          title="Editar"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          onClick={() => alternarEstado(p.codigo)}
                          className={`btn btn-outline-${p.activo ? 'warning' : 'success'} btn-sm`}
                          title={p.activo ? 'Dar de Baja' : 'Reactivar'}
                        >
                          <i className={`bi bi-${p.activo ? 'dash-circle' : 'check-circle'}`}></i>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      {mostrarModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content modal-content-gamer">
              <div className="modal-header modal-header-gamer">
                <h5 className="modal-title brand-font text-neon">
                  {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>

              <form onSubmit={handleGuardar} noValidate>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Código */}
                    <div className="col-md-6">
                      <label className="form-label text-light">Código Producto</label>
                      <input
                        type="text"
                        name="codigo"
                        className={`form-control form-control-gamer ${errores.codigo ? 'is-invalid-gamer' : ''}`}
                        placeholder="Ej: JM001"
                        value={form.codigo}
                        onChange={handleChange}
                        disabled={modoEdicion}
                      />
                      {errores.codigo && (
                        <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.codigo}</div>
                      )}
                    </div>

                    {/* Nombre */}
                    <div className="col-md-6">
                      <label className="form-label text-light">Nombre del Producto</label>
                      <input
                        type="text"
                        name="nombre"
                        className={`form-control form-control-gamer ${errores.nombre ? 'is-invalid-gamer' : ''}`}
                        placeholder="Ej: PlayStation 5"
                        maxLength="100"
                        value={form.nombre}
                        onChange={handleChange}
                      />
                      {errores.nombre && (
                        <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.nombre}</div>
                      )}
                    </div>

                    {/* Categoría */}
                    <div className="col-md-6">
                      <label className="form-label text-light">Categoría</label>
                      <select
                        name="categoria"
                        className={`form-select form-select-gamer ${errores.categoria ? 'is-invalid-gamer' : ''}`}
                        value={form.categoria}
                        onChange={handleChange}
                      >
                        <option value="">-- Seleccionar Categoría --</option>
                        <option value="Juegos de Mesa">Juegos de Mesa</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Consolas">Consolas</option>
                        <option value="Computadores Gamers">Computadores Gamers</option>
                        <option value="Sillas Gamers">Sillas Gamers</option>
                        <option value="Mouse">Mouse</option>
                        <option value="Mousepad">Mousepad</option>
                        <option value="Poleras Personalizadas">Poleras Personalizadas</option>
                        <option value="Polerones Gamers Personalizados">Polerones Gamers</option>
                        <option value="Servicio Técnico">Servicio Técnico</option>
                      </select>
                      {errores.categoria && (
                        <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.categoria}</div>
                      )}
                    </div>

                    {/* Precio */}
                    <div className="col-md-6">
                      <label className="form-label text-light">Precio (CLP)</label>
                      <input
                        type="number"
                        name="precio"
                        className={`form-control form-control-gamer ${errores.precio ? 'is-invalid-gamer' : ''}`}
                        min="0"
                        step="100"
                        placeholder="Ej: 29990"
                        value={form.precio}
                        onChange={handleChange}
                      />
                      {errores.precio && (
                        <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.precio}</div>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="col-md-6">
                      <label className="form-label text-light">Stock en Inventario</label>
                      <input
                        type="number"
                        name="stock"
                        className={`form-control form-control-gamer ${errores.stock ? 'is-invalid-gamer' : ''}`}
                        min="0"
                        step="1"
                        placeholder="Ej: 10"
                        value={form.stock}
                        onChange={handleChange}
                      />
                      {errores.stock && (
                        <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.stock}</div>
                      )}
                    </div>

                    {/* Stock Crítico */}
                    <div className="col-md-6">
                      <label className="form-label text-light">Stock Crítico (Alerta)</label>
                      <input
                        type="number"
                        name="stockCritico"
                        className="form-control form-control-gamer"
                        min="0"
                        step="1"
                        placeholder="Ej: 3"
                        value={form.stockCritico}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Descripción */}
                    <div className="col-md-12">
                      <label className="form-label text-light">Descripción del Producto</label>
                      <textarea
                        name="descripcion"
                        className={`form-control form-control-gamer ${errores.descripcion ? 'is-invalid-gamer' : ''}`}
                        rows="3"
                        placeholder="Descripción opcional (máx 500 caracteres)..."
                        maxLength="500"
                        value={form.descripcion}
                        onChange={handleChange}
                      ></textarea>
                      {errores.descripcion && (
                        <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.descripcion}</div>
                      )}
                    </div>

                    {/* Imagen */}
                    <div className="col-md-12">
                      <label className="form-label text-light">Ruta de Imagen (Opcional)</label>
                      <input
                        type="text"
                        name="imagen"
                        className="form-control form-control-gamer"
                        placeholder="img/Logo.png"
                        value={form.imagen}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer modal-footer-gamer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-neon">
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProductos
