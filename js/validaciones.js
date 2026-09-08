/* 
  ===================================================================
  LEVEL-UP GAMER - VALIDACIONES EN JAVASCRIPT (validaciones.js)
  Contiene las funciones para validar formularios en tiempo real y 
  en el envío de datos, mostrando mensajes de error personalizados.
  ===================================================================
*/

// ! Mostrar mensaje de error en el elemento con su correspondiente estilo visual
function mostrarError(inputId, errorId, mensaje) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (input) {
    input.classList.add("is-invalid-gamer");
  }
  if (errorEl) {
    errorEl.innerText = mensaje;
    errorEl.style.display = "block";
  }
}

// ! Limpiar mensaje de error cuando el valor ingresado sea válido
function limpiarError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (input) {
    input.classList.remove("is-invalid-gamer");
  }
  if (errorEl) {
    errorEl.innerText = "";
    errorEl.style.display = "none";
  }
}

// ! VALIDACIÓN DE CORREO ELECTRÓNICO
// Permitidos: @duoc.cl, @profesor.duoc.cl y @gmail.com
function esCorreoValido(correo) {
  if (!correo || correo.length > 100) return false;
  const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  return dominiosPermitidos.some(dominio => correo.toLowerCase().endsWith(dominio));
}

// ! VALIDACIÓN DE RUN / RUT CHILENO (SIN PUNTOS NI GUION) Ej: 19011022K
function esRunValido(run) {
  if (!run || run.length < 7 || run.length > 9) return false;
  // Expresión regular para 7-8 dígitos más un dígito verificador (número o K/k)
  const regexRun = /^[0-9]{7,8}[0-9kK]{1}$/;
  if (!regexRun.test(run)) return false;

  // Algoritmo de validación de módulo 11 para el RUN
  const cuerpo = run.slice(0, -1);
  let dvIngresado = run.slice(-1).toUpperCase();
  
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplicador;
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }
  
  let dvEsperado = 11 - (suma % 11);
  if (dvEsperado === 11) dvEsperado = '0';
  else if (dvEsperado === 10) dvEsperado = 'K';
  else dvEsperado = dvEsperado.toString();

  return dvIngresado === dvEsperado;
}

// ! VALIDACIÓN DE MAYORÍA DE EDAD (MAYORES DE 18 AÑOS)
function esMayorDeEdad(fechaNacimientoStr) {
  if (!fechaNacimientoStr) return false;
  const fechaNac = new Date(fechaNacimientoStr);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad >= 18;
}

/* 
  ===================================================================
  1. VALIDACIÓN DEL FORMULARIO DE INICIO DE SESIÓN (LOGIN)
  ===================================================================
*/
function validarLogin(event) {
  event.preventDefault();
  let valido = true;

  const correo = document.getElementById("txtCorreoLogin").value.trim();
  const password = document.getElementById("txtPasswordLogin").value;

  limpiarError("txtCorreoLogin", "errCorreoLogin");
  limpiarError("txtPasswordLogin", "errPasswordLogin");

  // ! Validación de Correo: Requerido, máx 100 caracteres, solo dominios permitidos
  if (!correo) {
    mostrarError("txtCorreoLogin", "errCorreoLogin", "El correo electrónico es requerido.");
    valido = false;
  } else if (correo.length > 100) {
    mostrarError("txtCorreoLogin", "errCorreoLogin", "El correo no debe superar los 100 caracteres.");
    valido = false;
  } else if (!esCorreoValido(correo)) {
    mostrarError("txtCorreoLogin", "errCorreoLogin", "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    valido = false;
  }

  // ! Validación de Contraseña: Requerida, entre 4 y 10 caracteres
  if (!password) {
    mostrarError("txtPasswordLogin", "errPasswordLogin", "La contraseña es requerida.");
    valido = false;
  } else if (password.length < 4 || password.length > 10) {
    mostrarError("txtPasswordLogin", "errPasswordLogin", "La contraseña debe tener entre 4 y 10 caracteres.");
    valido = false;
  }

  if (!valido) return false;

  // Autenticar contra los usuarios almacenados en localStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioEncontrado = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password);

  if (usuarioEncontrado) {
    if (!usuarioEncontrado.activo) {
      alert("Su cuenta se encuentra dada de baja. Contacte con administración.");
      return false;
    }
    guardarSesionUsuario(usuarioEncontrado);
    alert(`¡Bienvenido de nuevo, ${usuarioEncontrado.nombre}!`);
    
    // Si es Administrador, redirigir al panel de control
    if (usuarioEncontrado.tipoUsuario === "Administrador") {
      window.location.href = "admin/index.html";
    } else {
      window.location.href = "index.html";
    }
  } else {
    mostrarError("txtCorreoLogin", "errCorreoLogin", "Correo o contraseña incorrectos.");
  }
}

/* 
  ===================================================================
  2. VALIDACIÓN DEL FORMULARIO DE REGISTRO DE USUARIO
  ===================================================================
*/
function validarRegistro(event) {
  event.preventDefault();
  let valido = true;

  const run = document.getElementById("txtRun").value.trim();
  const nombre = document.getElementById("txtNombre").value.trim();
  const apellidos = document.getElementById("txtApellidos").value.trim();
  const correo = document.getElementById("txtCorreo").value.trim();
  const password = document.getElementById("txtPassword").value;
  const confirmPassword = document.getElementById("txtConfirmPassword").value;
  const fechaNac = document.getElementById("txtFechaNacimiento").value;
  const region = document.getElementById("cboRegion").value;
  const comuna = document.getElementById("cboComuna").value;
  const direccion = document.getElementById("txtDireccion").value.trim();

  // Limpiar errores previos
  ["txtRun", "txtNombre", "txtApellidos", "txtCorreo", "txtPassword", "txtConfirmPassword", "txtFechaNacimiento", "cboRegion", "cboComuna", "txtDireccion"].forEach(id => {
    limpiarError(id, "err" + id.replace("txt", "").replace("cbo", ""));
  });

  // ! Validar RUN: Requerido, sin puntos ni guión
  if (!run) {
    mostrarError("txtRun", "errRun", "El RUN es requerido (ejemplo: 19011022K).");
    valido = false;
  } else if (!esRunValido(run)) {
    mostrarError("txtRun", "errRun", "El RUN ingresado no es válido. Escriba sin puntos ni guión (Ej: 19011022K).");
    valido = false;
  }

  // ! Validar Nombre: Requerido, máximo 50 caracteres
  if (!nombre) {
    mostrarError("txtNombre", "errNombre", "El nombre es requerido.");
    valido = false;
  } else if (nombre.length > 50) {
    mostrarError("txtNombre", "errNombre", "El nombre no puede superar los 50 caracteres.");
    valido = false;
  }

  // ! Validar Apellidos: Requerido, máximo 100 caracteres
  if (!apellidos) {
    mostrarError("txtApellidos", "errApellidos", "Los apellidos son requeridos.");
    valido = false;
  } else if (apellidos.length > 100) {
    mostrarError("txtApellidos", "errApellidos", "Los apellidos no pueden superar 100 caracteres.");
    valido = false;
  }

  // ! Validar Correo: Requerido, máx 100 caracteres y dominios válidos
  if (!correo) {
    mostrarError("txtCorreo", "errCorreo", "El correo es requerido.");
    valido = false;
  } else if (!esCorreoValido(correo)) {
    mostrarError("txtCorreo", "errCorreo", "Dominio de correo no permitido (Usar @duoc.cl, @profesor.duoc.cl o @gmail.com).");
    valido = false;
  }

  // Validar Contraseña
  if (!password || password.length < 4 || password.length > 10) {
    mostrarError("txtPassword", "errPassword", "La contraseña debe tener entre 4 y 10 caracteres.");
    valido = false;
  }
  if (password !== confirmPassword) {
    mostrarError("txtConfirmPassword", "errConfirmPassword", "Las contraseñas no coinciden.");
    valido = false;
  }

  // ! Validar Fecha de Nacimiento: Solo usuarios mayores de 18 años
  if (!fechaNac) {
    mostrarError("txtFechaNacimiento", "errFechaNacimiento", "La fecha de nacimiento es requerida.");
    valido = false;
  } else if (!esMayorDeEdad(fechaNac)) {
    mostrarError("txtFechaNacimiento", "errFechaNacimiento", "Debes ser mayor de 18 años para registrarte.");
    valido = false;
  }

  // Validar Región y Comuna
  if (!region) {
    mostrarError("cboRegion", "errRegion", "Seleccione su región.");
    valido = false;
  }
  if (!comuna) {
    mostrarError("cboComuna", "errComuna", "Seleccione su comuna.");
    valido = false;
  }

  // ! Validar Dirección: Requerida, máximo 300 caracteres
  if (!direccion) {
    mostrarError("txtDireccion", "errDireccion", "La dirección es requerida.");
    valido = false;
  } else if (direccion.length > 300) {
    mostrarError("txtDireccion", "errDireccion", "La dirección no debe superar los 300 caracteres.");
    valido = false;
  }

  if (!valido) return false;

  // ! Verificar si el usuario o correo ya existe
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase())) {
    mostrarError("txtCorreo", "errCorreo", "Este correo electrónico ya está registrado.");
    return false;
  }

  // ! Beneficio Duoc: 20% Descuento de por vida si es correo Duoc
  const esDuoc = correo.toLowerCase().endsWith("@duoc.cl") || correo.toLowerCase().endsWith("@profesor.duoc.cl");

  const nuevoUsuario = {
    run: run.toUpperCase(),
    nombre: nombre,
    apellidos: apellidos,
    correo: correo,
    password: password,
    fechaNacimiento: fechaNac,
    tipoUsuario: "Cliente",
    region: region,
    comuna: comuna,
    direccion: direccion,
    puntosLevelUp: 50, // Puntos iniciales de bienvenida
    descuentoDuoc: esDuoc,
    activo: true
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  guardarSesionUsuario(nuevoUsuario);

  alert(`¡Registro exitoso! ${esDuoc ? 'Se ha activado tu 20% de descuento de por vida por pertenecer a Duoc.' : ''}`);
  window.location.href = "index.html";
}

/* 
  ===================================================================
  3. VALIDACIÓN DEL FORMULARIO DE CONTACTO
  ===================================================================
*/
function validarContacto(event) {
  event.preventDefault();
  let valido = true;

  const nombre = document.getElementById("txtNombreContacto").value.trim();
  const correo = document.getElementById("txtCorreoContacto").value.trim();
  const comentario = document.getElementById("txtComentarioContacto").value.trim();

  limpiarError("txtNombreContacto", "errNombreContacto");
  limpiarError("txtCorreoContacto", "errCorreoContacto");
  limpiarError("txtComentarioContacto", "errComentarioContacto");

  // ! Nombre: Requerido, máx 100 caracteres
  if (!nombre) {
    mostrarError("txtNombreContacto", "errNombreContacto", "El nombre es requerido.");
    valido = false;
  } else if (nombre.length > 100) {
    mostrarError("txtNombreContacto", "errNombreContacto", "El nombre no puede superar 100 caracteres.");
    valido = false;
  }

  // ! Correo: Máx 100 caracteres y dominios válidos
  if (!correo) {
    mostrarError("txtCorreoContacto", "errCorreoContacto", "El correo es requerido.");
    valido = false;
  } else if (!esCorreoValido(correo)) {
    mostrarError("txtCorreoContacto", "errCorreoContacto", "Usar correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).");
    valido = false;
  }

  // ! Comentario: Requerido, máx 500 caracteres
  if (!comentario) {
    mostrarError("txtComentarioContacto", "errComentarioContacto", "El mensaje o comentario es requerido.");
    valido = false;
  } else if (comentario.length > 500) {
    mostrarError("txtComentarioContacto", "errComentarioContacto", "El mensaje no debe superar los 500 caracteres.");
    valido = false;
  }

  if (!valido) return false;

  alert("¡Tu mensaje ha sido enviado exitosamente! Nos contactaremos contigo a la brevedad.");
  document.getElementById("formContacto").reset();
}

/* 
  ===================================================================
  4. NAVEGACIÓN DINÁMICA DE REGIONES Y COMUNAS
  ===================================================================
*/
function cargarRegionesYComunas(selectRegionId, selectComunaId) {
  const selectRegion = document.getElementById(selectRegionId);
  const selectComuna = document.getElementById(selectComunaId);
  if (!selectRegion || !selectComuna) return;

  selectRegion.innerHTML = '<option value="">-- Seleccione la región --</option>';
  REGIONES_Y_COMUNAS.forEach(item => {
    selectRegion.innerHTML += `<option value="${item.region}">${item.region}</option>`;
  });

  selectRegion.addEventListener("change", function() {
    const regionSeleccionada = this.value;
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    if (regionSeleccionada) {
      const objetoRegion = REGIONES_Y_COMUNAS.find(r => r.region === regionSeleccionada);
      if (objetoRegion) {
        objetoRegion.comunas.forEach(c => {
          selectComuna.innerHTML += `<option value="${c}">${c}</option>`;
        });
      }
    }
  });
}
