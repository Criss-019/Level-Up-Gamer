import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/styles.css'
import '../css/tienda.css'
import { REGIONES_Y_COMUNAS } from '../js/data'

function Registro() {
  const navigate = useNavigate()
  const { registrarUsuario } = useAuth()

  const [formData, setFormData] = useState({
    run: '',
    correo: '',
    nombre: '',
    apellidos: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
    edad: '',
    region: '',
    comuna: '',
    direccion: '',
    referido: ''
  })

  const [comunasDisponibles, setComunasDisponibles] = useState([])
  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'region') {
      const regionObj = REGIONES_Y_COMUNAS.find(r => r.region === value)
      setComunasDisponibles(regionObj ? regionObj.comunas : [])
      setFormData({
        ...formData,
        region: value,
        comuna: ''
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }

    if (errores[name] || errores.general) {
      setErrores({ ...errores, [name]: '', general: '' })
    }
  }

  // Validación de mayoría de edad
  const esMayorDeEdad = (fechaStr, edadNum) => {
    if (edadNum !== '' && !isNaN(edadNum)) {
      return Number(edadNum) >= 18
    }
    if (!fechaStr) return true // Asume 18 si no se especifica fecha
    const nac = new Date(fechaStr)
    const hoy = new Date()
    let edadCalculada = hoy.getFullYear() - nac.getFullYear()
    const mes = hoy.getMonth() - nac.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
      edadCalculada--
    }
    return edadCalculada >= 18
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrores({})
    setExito('')
    const err = {}

    // Nombre
    if (!formData.nombre.trim()) {
      err.nombre = 'El nombre es obligatorio.'
    }

    // Correo
    if (!formData.correo.trim()) {
      err.correo = 'El correo electrónico es obligatorio.'
    }

    // Contraseña
    if (!formData.password) {
      err.password = 'La contraseña es obligatoria.'
    } else if (formData.password.length < 6) {
      err.password = 'La contraseña debe tener al menos 6 caracteres.'
    }

    // Confirmar Contraseña
    if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = 'Las contraseñas no coinciden.'
    }

    // Fecha Nacimiento / Edad
    if (!esMayorDeEdad(formData.fechaNacimiento, formData.edad)) {
      err.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte.'
      err.general = 'Debes ser mayor de 18 años para registrarte en Level-Up Gamer.'
    }

    if (Object.keys(err).length > 0) {
      setErrores(err)
      return
    }

    const respuesta = registrarUsuario({
      run: formData.run.trim() || undefined,
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim() || undefined,
      email: formData.correo.trim(),
      correo: formData.correo.trim(),
      edad: Number(formData.edad) || 18,
      fechaNacimiento: formData.fechaNacimiento,
      password: formData.password,
      region: formData.region,
      comuna: formData.comuna,
      direccion: formData.direccion.trim(),
      referido: formData.referido.trim()
    })

    if (respuesta?.ok) {
      setExito(respuesta.msj || 'Cuenta creada con éxito')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } else {
      setErrores({ general: respuesta?.msj || 'Error al registrar usuario.' })
    }
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card card-gamer p-4 shadow-lg">
            <div className="text-center mb-4">
              <h3 className="brand-font text-neon">
                <i className="bi bi-person-plus-fill"></i> REGISTRO DE USUARIO
              </h3>
              <p className="text-muted small">Únete a la comunidad de Level-Up Gamer y acumula puntos</p>
            </div>

            {/* Banner Duoc UC */}
            <div className="alert alert-dark border-info text-info small mb-3">
              🎓 <strong>¿Perteneces a Duoc UC?</strong> Usa tu correo @duoc.cl o @duocuc.cl para activar un 20% de descuento permanente.
            </div>

            {errores.general && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                {errores.general}
              </div>
            )}

            {exito && (
              <div className="alert alert-success py-2 small mb-3" role="alert">
                {exito}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {/* Nombre */}
                <div className="col-md-6">
                  <label htmlFor="nombre" className="form-label text-light">Nombre Completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className={`form-control form-control-gamer ${errores.nombre ? 'is-invalid-gamer' : ''}`}
                    placeholder="Ej. Constanza Silva"
                    maxLength="50"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                  {errores.nombre && (
                    <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.nombre}</div>
                  )}
                </div>

                {/* Correo */}
                <div className="col-md-6">
                  <label htmlFor="correo" className="form-label text-light">Correo Electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    className={`form-control form-control-gamer ${errores.correo ? 'is-invalid-gamer' : ''}`}
                    placeholder="nombre@ejemplo.com"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                  {errores.correo && (
                    <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.correo}</div>
                  )}
                </div>

                {/* RUN */}
                <div className="col-md-6">
                  <label htmlFor="run" className="form-label text-light">RUN (Opcional, sin puntos ni guión)</label>
                  <input
                    type="text"
                    id="run"
                    name="run"
                    className="form-control form-control-gamer"
                    placeholder="Ej: 19011022K"
                    maxLength="9"
                    value={formData.run}
                    onChange={handleChange}
                  />
                </div>

                {/* Apellidos */}
                <div className="col-md-6">
                  <label htmlFor="apellidos" className="form-label text-light">Apellidos (Opcional)</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    className="form-control form-control-gamer"
                    placeholder="Tus apellidos"
                    maxLength="100"
                    value={formData.apellidos}
                    onChange={handleChange}
                  />
                </div>

                {/* Contraseña */}
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label text-light">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control form-control-gamer ${errores.password ? 'is-invalid-gamer' : ''}`}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errores.password && (
                    <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.password}</div>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label text-light">Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control form-control-gamer ${errores.confirmPassword ? 'is-invalid-gamer' : ''}`}
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errores.confirmPassword && (
                    <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.confirmPassword}</div>
                  )}
                </div>

                {/* Fecha de Nacimiento / Edad */}
                <div className="col-md-6">
                  <label htmlFor="fechaNacimiento" className="form-label text-light">
                    Fecha de Nacimiento (Mayor de 18)
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    className={`form-control form-control-gamer ${errores.fechaNacimiento ? 'is-invalid-gamer' : ''}`}
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                  />
                  {errores.fechaNacimiento && (
                    <div className="invalid-feedback-custom" style={{ display: 'block' }}>{errores.fechaNacimiento}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="edad" className="form-label text-light">Edad (Opcional)</label>
                  <input
                    type="number"
                    id="edad"
                    name="edad"
                    className="form-control form-control-gamer"
                    placeholder="Ej. 20"
                    value={formData.edad}
                    onChange={handleChange}
                  />
                </div>

                {/* Región y Comuna */}
                <div className="col-md-6">
                  <label htmlFor="region" className="form-label text-light">Región</label>
                  <select
                    id="region"
                    name="region"
                    className="form-select form-select-gamer"
                    value={formData.region}
                    onChange={handleChange}
                  >
                    <option value="">-- Seleccione la región --</option>
                    {REGIONES_Y_COMUNAS.map(r => (
                      <option key={r.region} value={r.region}>{r.region}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="comuna" className="form-label text-light">Comuna</label>
                  <select
                    id="comuna"
                    name="comuna"
                    className="form-select form-select-gamer"
                    value={formData.comuna}
                    onChange={handleChange}
                    disabled={!formData.region}
                  >
                    <option value="">-- Seleccione la comuna --</option>
                    {comunasDisponibles.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Dirección */}
                <div className="col-md-12">
                  <label htmlFor="direccion" className="form-label text-light">Dirección de Despacho (Opcional)</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    className="form-control form-control-gamer"
                    placeholder="Av. Principal #123, Depto 45"
                    maxLength="300"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </div>

                {/* Referido */}
                <div className="col-md-12">
                  <label htmlFor="referido" className="form-label text-light">
                    Código de Referido (Opcional - Gana 150 Puntos LevelUp)
                  </label>
                  <input
                    type="text"
                    id="referido"
                    name="referido"
                    className="form-control form-control-gamer"
                    placeholder="Ej: GAMER2026"
                    value={formData.referido}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Botón */}
              <button type="submit" className="btn btn-neon w-100 py-2 brand-font fs-6 mt-4">
                <i className="bi bi-check-circle-fill me-1"></i> Registrarme
              </button>
            </form>

            <div className="text-center mt-3 border-top border-secondary pt-3">
              <span className="text-muted small">¿Ya tienes una cuenta?</span><br />
              <Link to="/login" className="text-electric fw-bold text-decoration-none">
                Inicia sesión aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Registro
