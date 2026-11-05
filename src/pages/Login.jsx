import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/styles.css'
import '../css/tienda.css'
import Logo from '../assets/images/Logo.png'

function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  const esCorreoValido = (email) => {
    if (!email || email.length > 100) return false
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@duocuc.cl', '@test.com']
    return dominiosPermitidos.some(d => email.toLowerCase().endsWith(d))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = {}

    if (!correo.trim()) {
      err.correo = 'El correo electrónico es requerido.'
    }

    if (!password) {
      err.password = 'La contraseña es requerida.'
    }

    if (Object.keys(err).length > 0) {
      setErrores(err)
      return
    }

    // Iniciar sesión mediante AuthContext
    const resultado = iniciarSesion(correo, password)
    const esExitoso = typeof resultado === 'object' ? resultado?.ok : Boolean(resultado)

    if (esExitoso) {
      const usuarioLogueado = resultado?.usuario
      if (usuarioLogueado?.tipoUsuario === 'Administrador') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      const msj = (typeof resultado === 'object' && resultado?.msj) ||
        'credenciales incorrectas. revisa tu correo o contraseña.'
      setErrores({ general: msj })
    }
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card card-gamer p-4 shadow-lg">
            {/* Logo y Título */}
            <div className="text-center mb-4">
              <img src={Logo} alt="Logo Empresa" style={{ maxHeight: '80px' }} className="mb-2" />
              <h3 className="brand-font text-neon">LEVEL-UP GAMER</h3>
              <p className="text-muted small">Ingresa tus credenciales para acceder</p>
            </div>

            {/* Banner informativo Duoc */}
            <div className="alert alert-dark border-info text-info small mb-3">
              💡 Si tu correo es <strong>@duoc.cl</strong> o <strong>@duocuc.cl</strong>, obtendrás un 20% de descuento automático.
            </div>

            {errores.general && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                {errores.general}
              </div>
            )}

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Campo Correo */}
              <div className="mb-3">
                <label htmlFor="txtCorreoLogin" className="form-label text-light">Correo Electrónico</label>
                <input
                  type="email"
                  id="txtCorreoLogin"
                  className={`form-control form-control-gamer ${errores.correo ? 'is-invalid-gamer' : ''}`}
                  placeholder="nombre@ejemplo.com"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value)
                    if (errores.correo || errores.general) setErrores({})
                  }}
                />
                {errores.correo && (
                  <div className="invalid-feedback-custom" style={{ display: 'block' }}>
                    {errores.correo}
                  </div>
                )}
                <small className="text-muted d-block mt-1">Soportados: @duoc.cl, @profesor.duoc.cl, @duocuc.cl, @gmail.com</small>
              </div>

              {/* Campo Contraseña */}
              <div className="mb-4">
                <label htmlFor="txtPasswordLogin" className="form-label text-light">Contraseña</label>
                <input
                  type="password"
                  id="txtPasswordLogin"
                  className={`form-control form-control-gamer ${errores.password ? 'is-invalid-gamer' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errores.password || errores.general) setErrores({})
                  }}
                />
                {errores.password && (
                  <div className="invalid-feedback-custom" style={{ display: 'block' }}>
                    {errores.password}
                  </div>
                )}
              </div>

              {/* Botón */}
              <button type="submit" className="btn btn-electric w-100 py-2 brand-font fs-6 mb-3">
                <i className="bi bi-box-arrow-in-right me-1"></i> Entrar
              </button>
            </form>

            {/* Credenciales de prueba */}
            <div className="alert alert-dark border-secondary p-2 mt-2 text-center small">
              <span className="text-info fw-bold d-block">Credenciales de prueba:</span>
              <strong>Admin:</strong> admin@duoc.cl / admin123<br />
              <strong>Cliente:</strong> juan.perez@gmail.com / user123
            </div>

            {/* Registro */}
            <div className="text-center mt-3 border-top border-secondary pt-3">
              <span className="text-muted small">¿No tienes una cuenta aún?</span><br />
              <Link to="/registro" className="text-neon fw-bold text-decoration-none">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
