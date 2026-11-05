import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function Nosotros() {
  return (
    <main className="container my-5">
      {/* ENCABEZADO Y SOBRE LA EMPRESA */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <h1 className="brand-font text-neon mb-3">SOBRE LEVEL-UP GAMER</h1>
          <p className="fs-5 text-light">
            Level-Up Gamer es una tienda online dedicada a satisfacer las necesidades de los entusiastas de los videojuegos en Chile.
          </p>
          <p className="text-muted">
            Lanzada hace dos años como respuesta a la creciente demanda durante la pandemia, Level-Up Gamer ofrece una amplia gama de productos para gamers, desde consolas y accesorios hasta computadores y sillas especializadas. Aunque no cuenta con una ubicación física, realiza despachos a todo el país.
          </p>
        </div>
        <div className="col-lg-6 text-center">
          <img
            src={Logo}
            alt="Level Up Community"
            className="img-fluid p-3 border border-primary rounded-circle"
            style={{ maxHeight: '280px', background: 'rgba(30,144,255,0.1)' }}
          />
        </div>
      </div>

      {/* MISIÓN Y VISIÓN */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card card-gamer p-4 h-100 border-start border-4 border-info">
            <h3 className="brand-font text-electric mb-3">
              <i className="bi bi-bullseye"></i> Nuestra Misión
            </h3>
            <p className="text-light fs-6">
              Proporcionar productos de alta calidad para gamers en todo Chile, ofreciendo una experiencia de compra única y personalizada, con un enfoque en la satisfacción del cliente y el crecimiento de la comunidad gamer.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card card-gamer p-4 h-100 border-start border-4 border-success">
            <h3 className="brand-font text-neon mb-3">
              <i className="bi bi-eye"></i> Nuestra Visión
            </h3>
            <p className="text-light fs-6">
              Ser la tienda online líder en productos para gamers en Chile, reconocida por su innovación, servicio al cliente excepcional, y un programa de fidelización basado en gamificación que recompense a nuestros clientes más fieles.
            </p>
          </div>
        </div>
      </div>

      {/* IMPACTO COMUNITARIO */}
      <section className="card card-gamer p-4 mb-5 text-center">
        <h3 className="brand-font text-electric mb-3">
          <i className="bi bi-controller"></i> Impacto Comunitario y Eventos
        </h3>
        <p className="text-light mx-auto" style={{ maxWidth: '75%' }}>
          En Level-Up Gamer apoyamos activamente a la comunidad de videojuegos en Chile patrocinando torneos locales, eventos E-Sports y ferias tecnológicas donde nuestros usuarios pueden ganar <strong>Puntos LevelUp</strong> para canjear por productos.
        </p>
      </section>
    </main>
  )
}

export default Nosotros
