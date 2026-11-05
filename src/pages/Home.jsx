import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function Home() {
  const [productosDestacados, setProductosDestacados] = useState([])
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    // 1. Cargar 3 productos destacados activos
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || []
    const destacados = productosGuardados.filter(p => p.activo).slice(0, 3)
    setProductosDestacados(destacados)

    // 2. Cargar blogs
    const blogsGuardados = JSON.parse(localStorage.getItem('blogs')) || []
    setBlogs(blogsGuardados)
  }, [])

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  return (
    <>
      <main className="container my-4">
        {/* SECCIÓN BANNER DESTACADO */}
        <section className="hero-gamer text-center text-md-start">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="hero-title mb-3">
                DESAFÍA TUS LÍMITES EN <span className="text-neon">LEVEL-UP GAMER</span>
              </h1>
              <p className="hero-subtitle fs-5">
                La tienda #1 de videojuegos, consolas, componentes y accesorios en Chile.
              </p>
              <p className="text-light">
                ¡Regístrate con tu correo Duoc y obtén un{' '}
                <strong className="text-neon">20% de descuento de por vida</strong> en todos nuestros productos!
              </p>
              <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-md-start mt-4">
                <Link to="/productos" className="btn btn-neon btn-lg px-4 fs-6">
                  Ver Catálogo
                </Link>
                <Link to="/registro" className="btn btn-outline-electric btn-lg px-4 fs-6">
                  Crear Cuenta
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <img
                src={Logo}
                alt="Level Up Hero"
                className="img-fluid floating-hero"
                style={{ maxHeight: '280px', filter: 'drop-shadow(0 0 15px rgba(30,144,255,0.6))' }}
              />
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS */}
        <section className="row text-center mb-5 g-3">
          <div className="col-6 col-md-3">
            <div className="card card-gamer p-3">
              <h3 className="text-neon brand-font">+5.000</h3>
              <p className="text-muted mb-0 small">Gamers Satisfechos</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card card-gamer p-3">
              <h3 className="text-electric brand-font">100%</h3>
              <p className="text-muted mb-0 small">Envíos a Todo Chile</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card card-gamer p-3">
              <h3 className="text-neon brand-font">20% OFF</h3>
              <p className="text-muted mb-0 small">Descuento Alumnos Duoc</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card card-gamer p-3">
              <h3 className="text-electric brand-font">24/7</h3>
              <p className="text-muted mb-0 small">Soporte por WhatsApp</p>
            </div>
          </div>
        </section>

        {/* PRODUCTOS DESTACADOS */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="brand-font border-start border-4 border-primary ps-3 mb-0">
              Productos <span className="text-electric">Destacados</span>
            </h2>
            <Link to="/productos" className="btn btn-outline-electric btn-sm">
              Ver Todo &rarr;
            </Link>
          </div>

          <div className="row" id="grid-productos-destacados">
            {productosDestacados.map((prod) => (
              <div key={prod.codigo} className="col-12 col-md-4 mb-3">
                <div className="card card-gamer h-100">
                  <div className="product-img-container">
                    <img
                      src={Logo}
                      alt={prod.nombre}
                      onError={(e) => { e.target.src = Logo }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="brand-font text-truncate" title={prod.nombre}>
                      {prod.nombre}
                    </h5>
                    <p className="text-muted small text-truncate-2 flex-grow-1">
                      {prod.descripcion}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="precio-tag">{formatearPrecio(prod.precio)}</span>
                    </div>
                    <Link to={`/detalle-producto?codigo=${prod.codigo}`} className="btn btn-outline-neon btn-sm">
                      Ver Detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NOTICIAS Y BLOGS GAMER */}
        <section className="mb-5">
          <h2 className="brand-font border-start border-4 border-success ps-3 mb-4">
            Novedades del <span className="text-neon">Mundo Gamer</span>
          </h2>
          <div className="row g-4" id="contenedor-home-blogs">
            {blogs.map((b) => (
              <div key={b.id} className="col-md-6">
                <div className="card card-gamer h-100">
                  <div className="card-body">
                    <span className="badge bg-primary mb-2">{b.autor}</span>
                    <h4 className="brand-font">{b.titulo}</h4>
                    <p className="text-muted small">{b.resumen}</p>
                    <Link to={`/detalle-blog?id=${b.id}`} className="btn btn-outline-electric btn-sm">
                      Leer Más
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* BOTÓN DE SOPORTE POR WHATSAPP */}
      <a
        href="https://wa.me/56912345678"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp-float"
        title="Contactar Soporte Técnico en WhatsApp"
      >
        <i className="bi bi-whatsapp fs-4"></i>
        <span className="d-none d-md-inline ms-1">Soporte Técnico</span>
      </a>
    </>
  )
}

export default Home
