/* 
  ===================================================================
  LEVEL-UP GAMER - LÓGICA DE ADMINISTRACIÓN (admin.js)
  Gestión de productos (Ingresar/Modificar/Dar de baja), usuarios 
  y copias de respaldo JSON del sistema.
  ===================================================================
*/

// Variable global para modo edición
let modoEdicionProducto = false;
let modoEdicionUsuario = false;

/* 
  ===================================================================
  1. GESTIÓN DE PRODUCTOS (ADMIN)
  ===================================================================
*/
function renderizarTablaProductosAdmin() {
  const tbody = document.getElementById("tbody-admin-productos");
  if (!tbody) return;

  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  if (productos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No hay productos registrados.</td></tr>`;
    return;
  }

  let html = "";
  productos.forEach(p => {
    // ! Alerta de stock crítico en tabla de administración
    let stockTd = `${p.stock}`;
    if (p.stock === 0) {
      stockTd = `<span class="badge bg-danger">Agotado (0)</span>`;
    } else if (p.stock <= p.stockCritico) {
      stockTd = `<span class="badge stock-critico-badge">Stock Crítico (${p.stock})</span>`;
    }

    const estadoBadge = p.activo 
      ? `<span class="badge bg-success">Activo</span>` 
      : `<span class="badge bg-secondary">Dado de baja</span>`;

    html += `
      <tr>
        <td><strong>${p.codigo}</strong></td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${formatearPrecio(p.precio)}</td>
        <td>${stockTd}</td>
        <td>${estadoBadge}</td>
        <td>
          <button onclick="prepararEditarProducto('${p.codigo}')" class="btn btn-outline-info btn-sm me-1" title="Editar">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button onclick="alternarEstadoProducto('${p.codigo}')" class="btn btn-outline-${p.activo ? 'warning' : 'success'} btn-sm" title="${p.activo ? 'Dar de Baja' : 'Reactivar'}">
            <i class="bi bi-${p.activo ? 'dash-circle' : 'check-circle'}"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// ! Guardar o Actualizar Producto con Validaciones de Formulario
function guardarProductoAdmin(event) {
  event.preventDefault();

  const codigo = document.getElementById("txtProdCodigo").value.trim();
  const nombre = document.getElementById("txtProdNombre").value.trim();
  const categoria = document.getElementById("cboProdCategoria").value;
  const precio = parseFloat(document.getElementById("numProdPrecio").value);
  const stock = parseInt(document.getElementById("numProdStock").value);
  const stockCritico = parseInt(document.getElementById("numProdStockCritico").value) || 0;
  const descripcion = document.getElementById("txtProdDescripcion").value.trim();
  const imagen = document.getElementById("txtProdImagen").value.trim() || "img/Logo.png";

  // Limpiar errores
  ["txtProdCodigo", "txtProdNombre", "cboProdCategoria", "numProdPrecio", "numProdStock", "txtProdDescripcion"].forEach(id => {
    limpiarError(id, "err" + id.replace("txt", "").replace("cbo", "").replace("num", ""));
  });

  let valido = true;

  // ! Validaciones de Campos
  if (!codigo || codigo.length < 3) {
    mostrarError("txtProdCodigo", "errProdCodigo", "El código debe tener al menos 3 caracteres.");
    valido = false;
  }

  if (!nombre || nombre.length > 100) {
    mostrarError("txtProdNombre", "errProdNombre", "El nombre es requerido y máximo 100 caracteres.");
    valido = false;
  }

  if (!categoria) {
    mostrarError("cboProdCategoria", "errProdCategoria", "Seleccione una categoría.");
    valido = false;
  }

  if (isNaN(precio) || precio < 0) {
    mostrarError("numProdPrecio", "errProdPrecio", "El precio es requerido y debe ser >= 0.");
    valido = false;
  }

  if (isNaN(stock) || stock < 0) {
    mostrarError("numProdStock", "errProdStock", "El stock es requerido y debe ser un número entero >= 0.");
    valido = false;
  }

  if (descripcion.length > 500) {
    mostrarError("txtProdDescripcion", "errProdDescripcion", "La descripción no debe superar los 500 caracteres.");
    valido = false;
  }

  if (!valido) return false;

  let productos = JSON.parse(localStorage.getItem("productos")) || [];

  if (modoEdicionProducto) {
    // Modo Edición
    const index = productos.findIndex(p => p.codigo === codigo);
    if (index !== -1) {
      productos[index] = {
        ...productos[index],
        nombre, categoria, precio, stock, stockCritico, descripcion, imagen
      };
      alert("Producto actualizado exitosamente.");
    }
  } else {
    // Modo Creación
    if (productos.some(p => p.codigo.toLowerCase() === codigo.toLowerCase())) {
      mostrarError("txtProdCodigo", "errProdCodigo", "El código ingresado ya existe.");
      return false;
    }
    productos.push({
      codigo, nombre, categoria, precio, stock, stockCritico, descripcion, imagen, activo: true
    });
    alert("Producto registrado exitosamente.");
  }

  localStorage.setItem("productos", JSON.stringify(productos));

  // Cerrar modal
  const modalEl = document.getElementById("modalProducto");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  renderizarTablaProductosAdmin();
}

// Cargar producto en el formulario modal para editar
function prepararEditarProducto(codigo) {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const p = productos.find(prod => prod.codigo === codigo);
  if (!p) return;

  modoEdicionProducto = true;
  document.getElementById("modalProductoLabel").innerText = "Editar Producto";
  document.getElementById("txtProdCodigo").value = p.codigo;
  document.getElementById("txtProdCodigo").readOnly = true;
  document.getElementById("txtProdNombre").value = p.nombre;
  document.getElementById("cboProdCategoria").value = p.categoria;
  document.getElementById("numProdPrecio").value = p.precio;
  document.getElementById("numProdStock").value = p.stock;
  document.getElementById("numProdStockCritico").value = p.stockCritico || 0;
  document.getElementById("txtProdDescripcion").value = p.descripcion || "";
  document.getElementById("txtProdImagen").value = p.imagen || "";

  const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
  modal.show();
}

// Cambiar estado del producto (Dar de baja / Reactivar)
function alternarEstadoProducto(codigo) {
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  const p = productos.find(prod => prod.codigo === codigo);
  if (!p) return;

  p.activo = !p.activo;
  localStorage.setItem("productos", JSON.stringify(productos));
  renderizarTablaProductosAdmin();
}

// Resetear formulario modal de producto
function prepararNuevoProducto() {
  modoEdicionProducto = false;
  document.getElementById("modalProductoLabel").innerText = "Nuevo Producto";
  document.getElementById("formProductoAdmin").reset();
  document.getElementById("txtProdCodigo").readOnly = false;
}

/* 
  ===================================================================
  2. GESTIÓN DE USUARIOS (ADMIN)
  ===================================================================
*/
function renderizarTablaUsuariosAdmin() {
  const tbody = document.getElementById("tbody-admin-usuarios");
  if (!tbody) return;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let html = "";
  usuarios.forEach(u => {
    const estadoBadge = u.activo 
      ? `<span class="badge bg-success">Activo</span>` 
      : `<span class="badge bg-secondary">Dado de baja</span>`;

    html += `
      <tr>
        <td><strong>${u.run}</strong></td>
        <td>${u.nombre} ${u.apellidos}</td>
        <td>${u.correo}</td>
        <td><span class="badge bg-info text-dark">${u.tipoUsuario}</span></td>
        <td>${u.region}</td>
        <td>${estadoBadge}</td>
        <td>
          <button onclick="prepararEditarUsuario('${u.run}')" class="btn btn-outline-info btn-sm me-1" title="Editar">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button onclick="alternarEstadoUsuario('${u.run}')" class="btn btn-outline-${u.activo ? 'warning' : 'success'} btn-sm" title="${u.activo ? 'Dar de Baja' : 'Reactivar'}">
            <i class="bi bi-${u.activo ? 'dash-circle' : 'check-circle'}"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Cambiar estado de usuario (Dar de baja / Reactivar)
function alternarEstadoUsuario(run) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const u = usuarios.find(user => user.run === run);
  if (!u) return;

  if (u.correo === "admin@duoc.cl") {
    alert("No puedes dar de baja al administrador principal del sistema.");
    return;
  }

  u.activo = !u.activo;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  renderizarTablaUsuariosAdmin();
}

/* 
  ===================================================================
  3. GESTIÓN DE RESPALDOS (EXPORTAR / IMPORTAR / RESETEAR)
  ===================================================================
*/
function exportarRespaldoJSON() {
  const data = {
    productos: JSON.parse(localStorage.getItem("productos")) || [],
    usuarios: JSON.parse(localStorage.getItem("usuarios")) || [],
    blogs: JSON.parse(localStorage.getItem("blogs")) || [],
    fechaExportacion: new Date().toISOString()
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_levelup_gamer_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function resetearDatosSistema() {
  if (confirm("¿Estás seguro de que deseas restablecer todos los datos del sistema a los valores iniciales?")) {
    localStorage.clear();
    inicializarLocalStorage();
    alert("Sistema restablecido con éxito.");
    window.location.reload();
  }
}
