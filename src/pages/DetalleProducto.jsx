import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function DetalleProducto() {
  const [searchParams] = useSearchParams()
  const codigo = searchParams.get('codigo') || 'JM001'

  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [calificacion, setCalificacion] = useState('5')
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [errorComentario, setErrorComentario] = useState('')
  const { agregarAlCarrito } = useCarrito()

  const [comentarios, setComentarios] = useState([
    {
      autor: 'Cristián M.',
      calificacion: 5,
      fecha: '2026-08-15',
      texto: '¡Excelente producto! Llegó rápido y en perfectas condiciones.'
    },
    {
      autor: 'Andrea P.',
      calificacion: 4,
      fecha: '2026-08-10',
      texto: 'Muy buena calidad, cumple al 100% con lo prometido.'
    }
  ])

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem('productos')) || []
    const prod = productos.find(p => p.codigo === codigo) || productos[0]
    setProducto(prod)
  }, [codigo])

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  const handleAgregarAlCarrito = () => {
    if (!producto) return
    const cant = parseInt(cantidad) || 1
    if (cant < 1) {
      alert('La cantidad debe ser al menos 1.')
      return
    }
    agregarAlCarrito(producto, cant)
  }

  const handleAgregarComentario = (e) => {
    e.preventDefault()
    if (!nuevoComentario.trim()) {
      setErrorComentario('El comentario no puede estar vacío.')
      return
    }
    if (nuevoComentario.length > 500) {
      setErrorComentario('El comentario no puede exceder los 500 caracteres.')
      return
    }

    setErrorComentario('')
    const nuevo = {
      autor: 'Usuario Gamer',
      calificacion: parseInt(calificacion),
      fecha: new Date().toISOString().split('T')[0],
      texto: nuevoComentario.trim()
    }

    setComentarios([nuevo, ...comentarios])
    setNuevoComentario('')
    alert('¡Gracias por tu reseña! Ha sido publicada.')
  }

  if (!producto) {
    return (
      <main className="container my-5 text-center">
        <h4 className="text-light">Cargando producto...</h4>
      </main>
    )
  }

  return (
    <main className="container my-4" id="detalle-container">
      {/* Miga de pan */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-neon">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos" className="text-neon">Productos</Link>
          </li>
          <li className="breadcrumb-item active text-light" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      {/* CARD PRINCIPAL DEL PRODUCTO */}
      <div className="row g-4 mb-5">
        <div className="col-md-5">
          <div className="detalle-img-box">
            <img
              src={Logo}
              alt={producto.nombre}
              className="img-fluid"
              onError={(e) => { e.target.src = Logo }}
            />
          </div>
        </div>
        <div className="col-md-7">
          <span className="badge bg-secondary mb-2">{producto.categoria}</span>
          <h2 className="brand-font text-light">{producto.nombre}</h2>
          <small className="text-muted d-block mb-3">Código: {producto.codigo}</small>

          <div className="h3 precio-tag mb-3">{formatearPrecio(producto.precio)}</div>
          <p className="text-light fs-6 mb-4">{producto.descripcion}</p>

          <div className="mb-4">
            <span className="text-muted">Stock Disponible: </span>
            <strong className="text-neon">{producto.stock}</strong> unidades
          </div>

          {/* SELECCIÓN DE CANTIDAD Y BOTÓN DE COMPRA */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <label htmlFor="numCantidad" className="text-light">Cantidad:</label>
            <input
              type="number"
              id="numCantidad"
              className="form-control form-control-gamer"
              value={cantidad}
              min="1"
              max={producto.stock}
              onChange={(e) => setCantidad(e.target.value)}
              style={{ width: '80px' }}
              disabled={producto.stock === 0}
            />
            <button
              onClick={handleAgregarAlCarrito}
              className="btn btn-neon px-4"
              disabled={producto.stock === 0}
            >
              <i className="bi bi-cart-plus-fill me-2"></i> Añadir al Carrito
            </button>
          </div>

          {/* COMPARTIR */}
          <div className="border-top border-secondary pt-3">
            <span className="text-muted me-3">Compartir producto:</span>
            <button
              onClick={() => alert('¡Enlace copiado al portapapeles!')}
              className="btn btn-outline-light btn-sm me-2"
            >
              <i className="bi bi-share"></i> Compartir
            </button>
            <a
              href="https://twitter.com/intent/tweet?text=Mira%20este%20producto%20en%20Level-Up%20Gamer"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-electric btn-sm me-2"
            >
              <i className="bi bi-twitter-x"></i> Twitter
            </a>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE RESEÑAS */}
      <div className="row">
        <div className="col-md-8">
          <h4 className="brand-font text-electric mb-4">
            <i className="bi bi-chat-left-text"></i> Reseñas de Clientes
          </h4>

          <div id="lista-comentarios" className="mb-4">
            {comentarios.map((c, idx) => (
              <div key={idx} className="card card-gamer p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong className="text-light">{c.autor}</strong>
                  <span className="text-warning">{'★'.repeat(c.calificacion) + '☆'.repeat(5 - c.calificacion)}</span>
                </div>
                <small className="text-muted mb-2 d-block">{c.fecha}</small>
                <p className="text-light small mb-0">{c.texto}</p>
              </div>
            ))}
          </div>

          {/* FORMULARIO PARA INGRESAR NUEVO COMENTARIO */}
          <div className="card card-gamer p-4">
            <h5 className="brand-font text-neon mb-3">Dejar una Reseña</h5>
            <form onSubmit={handleAgregarComentario}>
              <div className="mb-3">
                <label htmlFor="cboCalificacion" className="form-label text-light">Calificación</label>
                <select
                  id="cboCalificacion"
                  className="form-select form-select-gamer"
                  value={calificacion}
                  onChange={(e) => setCalificacion(e.target.value)}
                >
                  <option value="5">★★★★★ (5/5) Excelente</option>
                  <option value="4">★★★★☆ (4/5) Muy bueno</option>
                  <option value="3">★★★☆☆ (3/5) Regular</option>
                  <option value="2">★★☆☆☆ (2/5) Malo</option>
                  <option value="1">★☆☆☆☆ (1/5) Pésimo</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="txtNuevoComentario" className="form-label text-light">Tu Comentario</label>
                <textarea
                  id="txtNuevoComentario"
                  className={`form-control form-control-gamer ${errorComentario ? 'is-invalid-gamer' : ''}`}
                  rows="3"
                  placeholder="Escribe tu opinión sobre este producto (máx 500 caracteres)..."
                  value={nuevoComentario}
                  onChange={(e) => {
                    setNuevoComentario(e.target.value)
                    if (errorComentario) setErrorComentario('')
                  }}
                ></textarea>
                {errorComentario && (
                  <div className="invalid-feedback-custom" style={{ display: 'block' }}>
                    {errorComentario}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-electric">Publicar Reseña</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DetalleProducto
