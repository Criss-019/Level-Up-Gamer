import { Link } from 'react-router-dom'
import '../css/styles.css'
import '../css/tienda.css'

function Footer() {
  return (
    <footer className="footer-gamer">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <h5 className="brand-font text-light mb-3">LEVEL-UP GAMER</h5>
            <p className="small text-muted">
              Tu tienda online de confianza en Chile para potenciar tu experiencia gamer. Envíos garantizados a todo el país.
            </p>
          </div>
          <div className="col-md-4">
            <h5 className="brand-font text-light mb-3">ENLACES RÁPIDOS</h5>
            <ul className="list-unstyled small">
              <li><Link to="/productos">Catálogo Completo</Link></li>
              <li><Link to="/nosotros">Quiénes Somos</Link></li>
              <li><Link to="/blog">Guías Gamer y Blogs</Link></li>
              <li><Link to="/contacto">Soporte y Contacto</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="brand-font text-light mb-3">REDES SOCIALES</h5>
            <div className="d-flex gap-3 fs-4">
              <a href="#" className="text-light" title="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light" title="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light" title="Discord"><i className="bi bi-discord"></i></a>
              <a href="#" className="text-light" title="Twitter/X"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>
        </div>
        <div className="border-top border-secondary pt-3 text-center small text-muted">
          Level-Up Gamer &copy; 2026
        </div>
      </div>
    </footer>
  )
}

export default Footer
