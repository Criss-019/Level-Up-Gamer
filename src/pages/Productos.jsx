import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function Productos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [precioMax, setPrecioMax] = useState(1500000)
  const { agregarAlCarrito } = useCarrito()

  useEffect(() => {
    const prods = JSON.parse(localStorage.getItem('productos')) || []
    setProductos(prods.filter(p => p.activo))
  }, [])

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setCategoria('')
    setPrecioMax(1500000)
  }

  // Filtrar productos
  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto =
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoria === '' || prod.categoria === categoria
    const coincidePrecio = prod.precio <= precioMax
    return coincideTexto && coincideCategoria && coincidePrecio
  })

  return (
    <main className="container my-4">
      <h2 className="brand-font mb-4 text-light">
        Catálogo de <span className="text-neon">Productos Gamer</span>
      </h2>

      <div className="row g-4">
        {/* SIDEBAR DE FILTROS */}
        <div className="col-lg-3">
          <div className="filter-box">
            <h5 className="brand-font text-electric mb-3">
              <i className="bi bi-funnel"></i> Filtros de Búsqueda
            </h5>

            {/* Búsqueda */}
            <div className="mb-3">
              <label htmlFor="txtBuscarProducto" className="form-label text-muted small">
                Buscar Producto
              </label>
              <input
                type="text"
                id="txtBuscarProducto"
                className="form-control form-control-gamer"
                placeholder="Ej: PlayStation, Mouse..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Categoría */}
            <div className="mb-3">
              <label htmlFor="cboCategoriaFiltro" className="form-label text-muted small">
                Categoría
              </label>
              <select
                id="cboCategoriaFiltro"
                className="form-select form-select-gamer"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Todas las Categorías</option>
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
            </div>

            {/* Rango de Precio */}
            <div className="mb-3">
              <label htmlFor="rangePrecio" className="form-label text-muted small d-flex justify-content-between">
                <span>Precio Máximo:</span>
                <span id="lblPrecioMaxVal" className="text-neon fw-bold">
                  {formatearPrecio(precioMax)}
                </span>
              </label>
              <input
                type="range"
                className="form-range"
                id="rangePrecio"
                min="0"
                max="1500000"
                step="10000"
                value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
              />
            </div>

            <button onClick={limpiarFiltros} className="btn btn-outline-secondary btn-sm w-100 mt-2">
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="col-lg-9">
          <div className="row" id="grid-productos">
            {productosFiltrados.length === 0 ? (
              <div className="col-12 text-center py-5">
                <h4 className="text-secondary">No se encontraron productos con los criterios seleccionados.</h4>
              </div>
            ) : (
              productosFiltrados.map((prod) => {
                let badgeStock = null
                if (prod.stock === 0) {
                  badgeStock = (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">Agotado</span>
                  )
                } else if (prod.stock <= prod.stockCritico) {
                  badgeStock = (
                    <span className="badge stock-critico-badge position-absolute top-0 end-0 m-2">
                      Stock Crítico ({prod.stock})
                    </span>
                  )
                }

                return (
                  <div key={prod.codigo} className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
                    <div className="card card-gamer h-100 position-relative">
                      {badgeStock}
                      <div className="product-img-container">
                        <img
                          src={Logo}
                          alt={prod.nombre}
                          onError={(e) => { e.target.src = Logo }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <span className="badge bg-secondary mb-2 align-self-start">{prod.categoria}</span>
                        <h5 className="card-title brand-font text-truncate" title={prod.nombre}>
                          {prod.nombre}
                        </h5>
                        <p className="card-text text-muted small text-truncate-2 flex-grow-1">
                          {prod.descripcion}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="precio-tag">{formatearPrecio(prod.precio)}</span>
                          <small className="text-light">Stock: {prod.stock}</small>
                        </div>
                        <div className="mt-3 d-grid gap-2">
                          <Link
                            to={`/detalle-producto?codigo=${prod.codigo}`}
                            className="btn btn-outline-electric btn-sm"
                          >
                            Ver Detalle
                          </Link>
                          <button
                            onClick={() => agregarAlCarrito(prod)}
                            className="btn btn-neon btn-sm"
                            disabled={prod.stock === 0}
                          >
                            <i className="bi bi-cart-plus"></i> Añadir al Carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Productos
