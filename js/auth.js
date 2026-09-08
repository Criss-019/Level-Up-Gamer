/* 
  ===================================================================
  LEVEL-UP GAMER - AUTENTICACIÓN Y SESIONES (auth.js)
  Manejo del estado de sesión del usuario y protección de páginas administrativas.
  ===================================================================
*/

// ! Obtener el usuario actualmente autenticado desde localStorage
function obtenerUsuarioActual() {
  const usuarioStr = localStorage.getItem("usuarioActual");
  if (usuarioStr) {
    try {
      return JSON.parse(usuarioStr);
    } catch (e) {
      console.error("Error al parsear usuario actual:", e);
      return null;
    }
  }
  return null;
}

// ! Guardar la sesión del usuario al iniciar sesión
function guardarSesionUsuario(usuario) {
  localStorage.setItem("usuarioActual", JSON.stringify(usuario));
  actualizarBarraNavegacion();
}

// ! Cerrar sesión del usuario activo
function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  alert("Has cerrado sesión exitosamente.");
  window.location.href = "index.html";
}

// ! Protección de la Vista de Administración
// Verifica que únicamente los usuarios con rol "Administrador" puedan ingresar a páginas administrativas
function protegerRutaAdministrador() {
  const usuario = obtenerUsuarioActual();
  
  // ! Si no hay usuario logeado o su rol no es Administrador, bloqueamos el acceso
  if (!usuario || usuario.tipoUsuario !== "Administrador") {
    alert("Acceso denegado. Se requieren permisos de Administrador para acceder a esta vista.");
    window.location.href = "../login.html";
  }
}

// ! Actualizar la barra de navegación dependiendo si el usuario está logeado y su rol
function actualizarBarraNavegacion() {
  const contenedorAuth = document.getElementById("nav-auth-container");
  if (!contenedorAuth) return;

  const usuario = obtenerUsuarioActual();

  if (usuario) {
    // Si el usuario está logeado, mostramos su nombre, enlace a cuenta y opción de salir
    let menuAdmin = "";
    if (usuario.tipoUsuario === "Administrador") {
      menuAdmin = `<li class="nav-item">
        <a class="nav-link text-warning fw-bold" href="admin/index.html">
          <i class="bi bi-shield-lock-fill"></i> Administrar
        </a>
      </li>`;
    }

    contenedorAuth.innerHTML = `
      <ul class="navbar-nav ms-auto align-items-center">
        ${menuAdmin}
        <li class="nav-item">
          <a class="nav-link text-light" href="cuenta.html">
            <i class="bi bi-person-circle"></i> Hola, ${usuario.nombre}
            ${usuario.descuentoDuoc ? '<span class="badge badge-duoc ms-1">Desc. 20% Duoc</span>' : ''}
          </a>
        </li>
        <li class="nav-item">
          <button onclick="cerrarSesion()" class="btn btn-outline-danger btn-sm ms-2">Cerrar Sesión</button>
        </li>
      </ul>
    `;
  } else {
    // Si no está logeado, mostramos Iniciar Sesión y Registrarse
    contenedorAuth.innerHTML = `
      <div class="d-flex gap-2 ms-auto">
        <a href="login.html" class="btn btn-outline-electric btn-sm">Iniciar Sesión</a>
        <a href="registro.html" class="btn btn-neon btn-sm">Registrarse</a>
      </div>
    `;
  }
}

// Ejecutar actualización de navbar cuando cargue el documento
document.addEventListener("DOMContentLoaded", function() {
  actualizarBarraNavegacion();
});
