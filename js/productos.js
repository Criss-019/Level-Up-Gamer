/* 
  ===================================================================
  LEVEL-UP GAMER - GESTIÓN DE PRODUCTOS Y CATÁLOGO (productos.js)
  Muestra productos, realiza filtros de búsqueda/categoría/precio 
  y gestiona el detalle del producto con comentarios.
  ===================================================================
*/

// ! Cargar productos desde localStorage
function obtenerProductos() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

// ! Formatear valores numéricos a pesos chilenos (CLP)
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
}

// ! RENDERIZAR LISTA DE PRODUCTOS EN EL CATÁLOGO CON FILTROS
function renderizarProductos(productosFiltrados) {
  const contenedor = document.getElementById("grid-productos");
  if (!contenedor) return;

  const lista = productosFiltrados || obtenerProductos().filter(p => p.activo);

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <h4 class="text-secondary">No se encontraron productos con los criterios seleccionados.</h4>
      </div>
    `;
    return;
  }

  let html = "";
  lista.forEach(prod => {
    // ! Alerta visual si el stock es menor o igual al stock crítico
    let badgeStock = "";
    if (prod.stock === 0) {
      badgeStock = `<span class="badge bg-danger position-absolute top-0 end-0 m-2">Agotado</span>`;
    } else if (prod.stock <= prod.stockCritico) {
      badgeStock = `<span class="badge stock-critico-badge position-absolute top-0 end-0 m-2">Stock Crítico (${prod.stock})</span>`;
    }

    html += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
        <div class="card card-gamer h-100 position-relative">
          ${badgeStock}
          <div class="product-img-container">
            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='img/Logo.png'">
          </div>
          <div class="card-body d-flex flex-column">
            <span class="badge bg-secondary mb-2 align-self-start">${prod.categoria}</span>
            <h5 class="card-title brand-font text-truncate" title="${prod.nombre}">${prod.nombre}</h5>
            <p class="card-text text-muted small text-truncate-2 flex-grow-1">${prod.descripcion}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="precio-tag">${formatearPrecio(prod.precio)}</span>
              <small class="text-light">Stock: ${prod.stock}</small>
            </div>
            <div class="mt-3 d-grid gap-2">
              <a href="detalle-producto.html?codigo=${prod.codigo}" class="btn btn-outline-electric btn-sm">Ver Detalle</a>
              <button onclick="agregarAlCarrito('${prod.codigo}')" class="btn btn-neon btn-sm" ${prod.stock === 0 ? 'disabled' : ''}>
                <i class="bi bi-cart-plus"></i> Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  contenedor.innerHTML = html;
}

// ! APLICAR FILTROS COMBINADOS: BÚSQUEDA, CATEGORÍA Y RANGO DE PRECIO
function aplicarFiltros() {
  const txtBuscar = document.getElementById("txtBuscarProducto") ? document.getElementById("txtBuscarProducto").value.toLowerCase() : "";
  const cboCat = document.getElementById("cboCategoriaFiltro") ? document.getElementById("cboCategoriaFiltro").value : "";
  const numPrecioMax = document.getElementById("rangePrecio") ? parseFloat(document.getElementById("rangePrecio").value) : Infinity;

  const productos = obtenerProductos().filter(p => p.activo);

  const filtrados = productos.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(txtBuscar) || p.descripcion.toLowerCase().includes(txtBuscar);
    const coincideCategoria = cboCat === "" || p.categoria === cboCat;
    const coincidePrecio = p.precio <= numPrecioMax;
    return coincideNombre && coincideCategoria && coincidePrecio;
  });

  renderizarProductos(filtrados);
}

// ! CARGAR DETALLE DE PRODUCTO INDIVIDUAL (detalle-producto.html)
function cargarDetalleProducto() {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");

  if (!codigo) return;

  const productos = obtenerProductos();
  const producto = productos.find(p => p.codigo === codigo);

  if (!producto) {
    document.getElementById("detalle-container").innerHTML = `<h3 class="text-danger text-center">Producto no encontrado.</h3>`;
    return;
  }

  // Renderizar información del producto
  document.getElementById("det-nombre").innerText = producto.nombre;
  document.getElementById("det-categoria").innerText = producto.categoria;
  document.getElementById("det-codigo").innerText = `Código: ${producto.codigo}`;
  document.getElementById("det-precio").innerText = formatearPrecio(producto.precio);
  document.getElementById("det-descripcion").innerText = producto.descripcion;
  document.getElementById("det-stock").innerText = producto.stock;
  document.getElementById("det-img").src = producto.imagen;

  // Botón añadir al carrito
  const btnAdd = document.getElementById("btn-add-cart-detail");
  if (btnAdd) {
    btnAdd.onclick = function() {
      const cantidad = parseInt(document.getElementById("numCantidad").value) || 1;
      agregarAlCarrito(producto.codigo, cantidad);
    };
  }

  // Renderizar comentarios guardados
  renderizarComentarios(producto.codigo);
}

// ! RENDERIZAR COMENTARIOS Y RESEÑAS DEL PRODUCTO
function renderizarComentarios(codigoProducto) {
  const contenedor = document.getElementById("lista-comentarios");
  if (!contenedor) return;

  const todosComentarios = JSON.parse(localStorage.getItem("comentarios_productos")) || {};
  const comentariosProducto = todosComentarios[codigoProducto] || [];

  if (comentariosProducto.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">Aún no hay reseñas para este producto. ¡Sé el primero en opinar!</p>`;
    return;
  }

  let html = "";
  comentariosProducto.forEach(c => {
    const estrellas = "★".repeat(c.calificacion) + "☆".repeat(5 - c.calificacion);
    html += `
      <div class="comentario-card">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong class="text-info">${c.usuario}</strong>
          <span class="estrellas-rating">${estrellas}</span>
        </div>
        <p class="mb-1 text-light">${c.comentario}</p>
        <small class="text-muted">${c.fecha}</small>
      </div>
    `;
  });
  contenedor.innerHTML = html;
}

// ! AGREGAR UN NUEVO COMENTARIO A UN PRODUCTO
function agregarComentarioProducto(event) {
  event.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  if (!codigo) return;

  const comentarioTxt = document.getElementById("txtNuevoComentario").value.trim();
  const ratingVal = parseInt(document.getElementById("cboCalificacion").value);
  const usuario = obtenerUsuarioActual();

  limpiarError("txtNuevoComentario", "errNuevoComentario");

  if (!comentarioTxt) {
    mostrarError("txtNuevoComentario", "errNuevoComentario", "El comentario no puede estar vacío.");
    return;
  } else if (comentarioTxt.length > 500) {
    mostrarError("txtNuevoComentario", "errNuevoComentario", "El comentario no debe superar los 500 caracteres.");
    return;
  }

  const nombreUsuario = usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Gamer Anónimo";

  const nuevoComentario = {
    usuario: nombreUsuario,
    comentario: comentarioTxt,
    calificacion: ratingVal,
    fecha: new Date().toLocaleDateString("es-CL")
  };

  const todosComentarios = JSON.parse(localStorage.getItem("comentarios_productos")) || {};
  if (!todosComentarios[codigo]) {
    todosComentarios[codigo] = [];
  }
  todosComentarios[codigo].push(nuevoComentario);
  localStorage.setItem("comentarios_productos", JSON.stringify(todosComentarios));

  document.getElementById("formComentario").reset();
  renderizarComentarios(codigo);
  alert("¡Gracias por tu opinión! Reseña agregada correctamente.");
}
