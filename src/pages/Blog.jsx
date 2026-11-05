import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function Blog() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const blogsGuardados = JSON.parse(localStorage.getItem('blogs')) || []
    setBlogs(blogsGuardados)
  }, [])

  return (
    <main className="container my-4">
      <div className="text-center mb-5">
        <h2 className="brand-font text-neon display-5">BLOG & NOVEDADES GAMER</h2>
        <p className="text-muted fs-5">
          Noticias, consejos, guías de armado de PC y secretos de la industria.
        </p>
      </div>

      {/* LISTADO DE PUBLICACIONES */}
      <div className="row g-4" id="contenedor-blogs">
        {blogs.map(b => (
          <div key={b.id} className="col-md-6">
            <div className="card card-gamer h-100">
              <div className="blog-img-box">
                <img
                  src={Logo}
                  alt={b.titulo}
                  onError={(e) => { e.target.src = Logo }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-primary">{b.autor}</span>
                  <small className="text-muted"><i className="bi bi-calendar"></i> {b.fecha}</small>
                </div>
                <h4 className="brand-font text-light mb-2">{b.titulo}</h4>
                <p className="text-muted small flex-grow-1">{b.resumen}</p>
                <div className="mt-3">
                  <Link to={`/detalle-blog?id=${b.id}`} className="btn btn-outline-electric btn-sm">
                    Leer Artículo Completo &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Blog
