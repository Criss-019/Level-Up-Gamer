import { useState } from 'react'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  })

  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormulario({
      ...formulario,
      [name]: value
    })
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: ''
      })
    }
  }

  const esCorreoValido = (correo) => {
    if (!correo || correo.length > 100) return false
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']
    return dominiosPermitidos.some(d => correo.toLowerCase().endsWith(d))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevosErrores = {}

    // Validar nombre
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.'
    } else if (formulario.nombre.length > 100) {
      nuevosErrores.nombre = 'El nombre no puede superar los 100 caracteres.'
    }

    // Validar correo
    if (!formulario.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio.'
    } else if (!esCorreoValido(formulario.correo.trim())) {
      nuevosErrores.correo = 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com'
    }

    // Validar comentario
    if (!formulario.comentario.trim()) {
      nuevosErrores.comentario = 'El mensaje o comentario es obligatorio.'
    } else if (formulario.comentario.length > 500) {
      nuevosErrores.comentario = 'El comentario no puede superar los 500 caracteres.'
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    alert(`¡Gracias por contactarnos, ${formulario.nombre}! Tu mensaje ha sido enviado con éxito. Te responderemos pronto a ${formulario.correo}.`)
    setFormulario({
      nombre: '',
      correo: '',
      comentario: ''
    })
    setErrores({})
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card card-gamer p-4 shadow-lg">
            {/* Logo y Título */}
            <div className="text-center mb-4">
              <img src={Logo} alt="Logo Empresa" style={{ maxHeight: '70px' }} className="mb-2" />
              <h3 className="brand-font text-neon">FORMULARIO DE CONTACTO</h3>
              <p className="text-muted small">
                ¿Tienes dudas o consultas? Escríbenos y te responderemos a la brevedad.
              </p>
            </div>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label text-light">Nombre Completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control form-control-gamer ${errores.nombre ? 'is-invalid-gamer' : ''}`}
                  placeholder="Tu nombre y apellidos"
                  maxLength="100"
                  value={formulario.nombre}
                  onChange={handleChange}
                />
                {errores.nombre && (
                  <div className="invalid-feedback-custom" style={{ display: 'block' }}>
                    {errores.nombre}
                  </div>
                )}
              </div>

              {/* Correo */}
              <div className="mb-3">
                <label htmlFor="correo" className="form-label text-light">Correo Electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  className={`form-control form-control-gamer ${errores.correo ? 'is-invalid-gamer' : ''}`}
                  placeholder="ejemplo@duoc.cl"
                  value={formulario.correo}
                  onChange={handleChange}
                />
                {errores.correo && (
                  <div className="invalid-feedback-custom" style={{ display: 'block' }}>
                    {errores.correo}
                  </div>
                )}
                <small className="text-muted d-block mt-1">Soportados: @duoc.cl, @profesor.duoc.cl, @gmail.com</small>
              </div>

              {/* Comentario */}
              <div className="mb-4">
                <label htmlFor="comentario" className="form-label text-light">Mensaje o Comentario</label>
                <textarea
                  id="comentario"
                  name="comentario"
                  className={`form-control form-control-gamer ${errores.comentario ? 'is-invalid-gamer' : ''}`}
                  rows="5"
                  placeholder="Escribe tu mensaje aquí (máximo 500 caracteres)..."
                  maxLength="500"
                  value={formulario.comentario}
                  onChange={handleChange}
                ></textarea>
                {errores.comentario && (
                  <div className="invalid-feedback-custom" style={{ display: 'block' }}>
                    {errores.comentario}
                  </div>
                )}
              </div>

              {/* Botón de Envío */}
              <button type="submit" className="btn btn-neon w-100 py-2 brand-font fs-6">
                <i className="bi bi-send-fill me-2"></i> ENVIAR MENSAJE
              </button>
            </form>

            {/* Chat WhatsApp */}
            <div className="text-center mt-4 border-top border-secondary pt-3">
              <p className="text-muted small mb-2">¿Prefieres atención inmediata para Soporte Técnico?</p>
              <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-success btn-sm px-4"
              >
                <i className="bi bi-whatsapp me-2"></i> Chatear por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contacto
