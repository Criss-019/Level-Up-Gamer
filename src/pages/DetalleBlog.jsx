import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function DetalleBlog() {
  const [searchParams] = useSearchParams()
  const id = parseInt(searchParams.get('id')) || 1
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || []
    const encontrado = blogs.find(b => b.id === id) || blogs[0]
    setBlog(encontrado)
  }, [id])

  if (!blog) {
    return (
      <main className="container my-5 text-center">
        <h4 className="text-light">Cargando artículo...</h4>
      </main>
    )
  }

  return (
    <main className="container my-4">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <Link to="/blog" className="btn btn-outline-secondary btn-sm mb-3">
            &larr; Volver al Blog
          </Link>

          <article className="card card-gamer p-4">
            <h1 className="brand-font text-neon mb-3">{blog.titulo}</h1>
            <div className="d-flex gap-3 text-muted small mb-4">
              <span>
                <i className="bi bi-person"></i> {blog.autor}
              </span>
              <span>
                <i className="bi bi-calendar"></i> {blog.fecha}
              </span>
            </div>

            <div className="mb-4 text-center">
              <img
                src={Logo}
                alt={blog.titulo}
                className="img-fluid rounded border border-primary"
                style={{ maxHeight: '350px', width: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = Logo }}
              />
            </div>

            <div className="fs-5 text-light lh-lg" style={{ whiteSpace: 'pre-line' }}>
              {blog.contenido}
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}

export default DetalleBlog
