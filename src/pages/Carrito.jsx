import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function Carrito() {
  const {
    carrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    subtotal,
    descuento,
    esEstudianteDuoc,
    total
  } = useCarrito()

  const { usuario, agregarPuntos } = useAuth()
  const [ordenGenerada, setOrdenGenerada] = useState(null)

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  const finalizarCompra = () => {
    if (carrito.length === 0) return

    const ordenId = `#LUG-${Math.floor(100000 + Math.random() * 900000)}`
    setOrdenGenerada(ordenId)

    // Guardar en pedidos
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || []
    pedidos.push({
      ordenId: ordenId,
      fecha: new Date().toISOString().split('T')[0],
      total: total,
      items: carrito,
      estado: 'En Preparación'
    })
    localStorage.setItem('pedidos', JSON.stringify(pedidos))

    // Si hay usuario autenticado, sumar puntos por la compra
    if (usuario && agregarPuntos) {
      const puntosGanados = Math.floor(total / 1000)
      if (puntosGanados > 0) {
        agregarPuntos(puntosGanados)
      }
    }

    // Vaciar carrito
    vaciarCarrito()
  }

  return (
    <main className="container my-4">
      <h2 className="brand-font mb-4 text-light">
        <i className="bi bi-cart-check-fill text-neon"></i> Carrito de <span className="text-neon">Compras</span>
      </h2>

      <div className="row g-4">
        {/* LISTA DE ITEMS */}
        <div className="col-lg-8" id="contenedor-cart-items">
          {carrito.length === 0 ? (
            <div className="card card-gamer p-5 text-center">
              <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
              <h4 className="text-light">Tu carrito está vacío</h4>
              <p className="text-muted">¡Explora nuestro catálogo para armar tu setup ideal!</p>
              <div className="mt-3">
                <Link to="/productos" className="btn btn-neon px-4">
                  Ir al Catálogo de Productos
                </Link>
              </div>
            </div>
          ) : (
            carrito.map(item => {
              const itemId = item.codigo || item.id || item.idProducto
              return (
                <div key={itemId} className="card card-gamer p-3 mb-3">
                  <div className="row align-items-center">
                    <div className="col-3 col-md-2 text-center">
                      <img
                        src={Logo}
                        alt={item.nombre}
                        className="img-fluid rounded"
                        style={{ maxHeight: '70px', objectFit: 'contain' }}
                        onError={(e) => { e.target.src = Logo }}
                      />
                    </div>
                    <div className="col-9 col-md-4">
                      <h6 className="brand-font text-light mb-1">{item.nombre}</h6>
                      <small className="text-muted">Código: {itemId}</small>
                      <div className="precio-tag d-md-none mt-1">{formatearPrecio(item.precio)}</div>
                    </div>
                    <div className="col-6 col-md-3 mt-2 mt-md-0 d-flex align-items-center gap-2">
                      <button
                        onClick={() => cambiarCantidad(itemId, -1)}
                        className="btn btn-outline-secondary btn-sm"
                        aria-label={`Disminuir ${item.nombre}`}
                      >
                        -
                      </button>
                      <span className="text-light fw-bold px-2">{item.cantidad}</span>
                      <button
                        onClick={() => cambiarCantidad(itemId, 1)}
                        className="btn btn-outline-secondary btn-sm"
                        aria-label={`Aumentar ${item.nombre}`}
                      >
                        +
                      </button>
                    </div>
                    <div className="col-4 col-md-2 text-end d-none d-md-block">
                      <span className="precio-tag">{formatearPrecio(item.precio * item.cantidad)}</span>
                    </div>
                    <div className="col-2 col-md-1 text-end">
                      <button
                        onClick={() => eliminarDelCarrito(itemId)}
                        className="btn btn-outline-danger btn-sm"
                        title="Eliminar"
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* RESUMEN DEL PEDIDO */}
        <div className="col-lg-4" id="contenedor-cart-resumen">
          <div className="card card-gamer p-4">
            <h4 className="brand-font text-neon mb-4">Resumen del Pedido</h4>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-light">Subtotal:</span>
              <strong className="text-light">{formatearPrecio(subtotal)}</strong>
            </div>

            {esEstudianteDuoc && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Descuento Duoc (20%):</span>
                <strong>-{formatearPrecio(descuento)}</strong>
              </div>
            )}

            <div className="d-flex justify-content-between mb-3">
              <span className="text-light">Despacho:</span>
              <span className="text-neon fw-bold">Gratis</span>
            </div>

            <hr className="border-secondary my-3" />

            <div className="d-flex justify-content-between mb-4 fs-5">
              <span className="brand-font text-light">Total:</span>
              <span className="precio-tag">{formatearPrecio(total)}</span>
            </div>

            <button
              onClick={finalizarCompra}
              disabled={carrito.length === 0}
              className="btn btn-neon w-100 py-3 brand-font fs-6"
            >
              <i className="bi bi-credit-card me-2"></i> Finalizar Compra
            </button>

            {esEstudianteDuoc ? (
              <small className="text-success d-block text-center mt-3">
                ✓ Descuento de Alumno Duoc (20%) aplicado a tu compra.
              </small>
            ) : (
              <small className="text-muted d-block text-center mt-3">
                Inicia sesión con correo @duoc.cl o @duocuc.cl para obtener un 20% de descuento.
              </small>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE COMPRA EXITOSA */}
      {ordenGenerada && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card-gamer border-success">
              <div className="modal-header border-secondary text-center">
                <h5 className="modal-title brand-font text-neon w-100">
                  <i className="bi bi-check-circle-fill text-success fs-2 d-block mb-2"></i>
                  ¡FELICIDADES POR TU COMPRA!
                </h5>
              </div>
              <div className="modal-body text-center">
                <p className="fs-5 text-light mb-3">Tu orden ha sido procesada exitosamente.</p>
                <p className="text-muted small">
                  Pronto recibirás la boleta electrónica y el número de seguimiento en tu correo.
                </p>
                <div className="alert alert-dark text-neon border-success">
                  <strong>Orden ID: {ordenGenerada}</strong>
                </div>
              </div>
              <div className="modal-footer border-secondary justify-content-center">
                <Link to="/" onClick={() => setOrdenGenerada(null)} className="btn btn-neon px-4">
                  Volver a la Tienda
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Carrito
