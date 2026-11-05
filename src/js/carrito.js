/* 
  ===================================================================
  LEVEL-UP GAMER - FUNCIONALIDAD DEL CARRITO DE COMPRAS (carrito.js)
  Gestión del carrito en localStorage, cálculo de totales, 
  descuentos por correo Duoc (20%) y simulación del proceso de compra.
  ===================================================================
*/

// ! Obtener elementos del carrito almacenados en localStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// ! Guardar el carrito en localStorage y actualizar la insignia (badge)
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarInsigniaCarrito();
}

// ! Actualizar contador flotante de items en el header
function actualizarInsigniaCarrito() {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;

  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  badge.innerText = totalItems;
}

// ! AGREGAR PRODUCTO AL CARRITO CON CANTIDAD Y REGLAS
function agregarAlCarrito(codigoProducto, cantidad = 1) {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const producto = productos.find(p => p.codigo === codigoProducto);

  if (!producto) {
    alert("El producto no existe.");
    return;
  }

  let carrito = obtenerCarrito();
  const itemExistente = carrito.find(item => item.codigo === codigoProducto);

  const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;
  if (cantidadActualEnCarrito + cantidad > producto.stock) {
    alert(`No puedes agregar más unidades de las disponibles en stock (${producto.stock}).`);
    return;
  }

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
  alert(`¡"${producto.nombre}" ha sido agregado al carrito!`);
}

// ! MODIFICAR CANTIDAD DE UN ITEM EN EL CARRITO
function cambiarCantidad(codigoProducto, cambio) {
  let carrito = obtenerCarrito();
  const item = carrito.find(i => i.codigo === codigoProducto);
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const producto = productos.find(p => p.codigo === codigoProducto);

  if (!item || !producto) return;

  const nuevaCantidad = item.cantidad + cambio;

  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(codigoProducto);
    return;
  }

  if (nuevaCantidad > producto.stock) {
    alert(`Stock máximo disponible alcanzado (${producto.stock}).`);
    return;
  }

  item.cantidad = nuevaCantidad;
  guardarCarrito(carrito);
  renderizarVistaCarrito();
}

// ! ELIMINAR UN PRODUCTO DEL CARRITO
function eliminarDelCarrito(codigoProducto) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(item => item.codigo !== codigoProducto);
  guardarCarrito(carrito);
  renderizarVistaCarrito();
}

// ! RENDERIZAR LA VISTA DE LA PÁGINA DEL CARRITO (carrito.html)
function renderizarVistaCarrito() {
  const contenedorItems = document.getElementById("contenedor-cart-items");
  const contenedorResumen = document.getElementById("contenedor-cart-resumen");
  if (!contenedorItems) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    contenedorItems.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x text-muted display-1"></i>
        <h4 class="mt-3 text-secondary">Tu carrito de compras está vacío</h4>
        <a href="productos.html" class="btn btn-electric mt-3">Explorar Catálogo</a>
      </div>
    `;
    if (contenedorResumen) contenedorResumen.innerHTML = "";
    return;
  }

  let htmlItems = "";
  let subtotal = 0;

  carrito.forEach(item => {
    const totalFila = item.precio * item.cantidad;
    subtotal += totalFila;

    htmlItems += `
      <div class="cart-item-row d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
        <img src="${item.imagen}" alt="${item.nombre}" style="width: 70px; height: 70px; object-fit: contain;">
        <div class="flex-grow-1 text-center text-sm-start">
          <h6 class="brand-font mb-1">${item.nombre}</h6>
          <small class="text-muted">Precio U.: ${formatearPrecio(item.precio)}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button onclick="cambiarCantidad('${item.codigo}', -1)" class="btn btn-outline-danger btn-sm px-2">-</button>
          <span class="fw-bold px-2 text-neon">${item.cantidad}</span>
          <button onclick="cambiarCantidad('${item.codigo}', 1)" class="btn btn-outline-success btn-sm px-2">+</button>
        </div>
        <div class="text-end">
          <div class="fw-bold text-electric">${formatearPrecio(totalFila)}</div>
          <button onclick="eliminarDelCarrito('${item.codigo}')" class="btn btn-link text-danger p-0 small text-decoration-none">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;
  });

  contenedorItems.innerHTML = htmlItems;

  // ! 20% de Descuento de por vida para correos @duoc.cl / @profesor.duoc.cl
  const usuario = obtenerUsuarioActual();
  let porcentajeDescuento = 0;
  let labelDescuento = "No aplica";

  if (usuario && usuario.descuentoDuoc) {
    porcentajeDescuento = 0.20;
    labelDescuento = "20% (Beneficio Alumno/Docente Duoc UC)";
  }

  const montoDescuento = Math.round(subtotal * porcentajeDescuento);
  const totalFinal = subtotal - montoDescuento;

  if (contenedorResumen) {
    contenedorResumen.innerHTML = `
      <div class="resumen-compra-box">
        <h5 class="brand-font text-neon mb-3">Resumen de Compra</h5>
        <div class="d-flex justify-content-between mb-2">
          <span>Subtotal:</span>
          <span class="fw-bold">${formatearPrecio(subtotal)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2 text-success">
          <span>Descuento Duoc:</span>
          <span>${montoDescuento > 0 ? '-' + formatearPrecio(montoDescuento) : '$0'}</span>
        </div>
        <small class="text-muted d-block mb-3">${labelDescuento}</small>
        <hr class="border-secondary">
        <div class="d-flex justify-content-between mb-4">
          <span class="h5 brand-font">TOTAL:</span>
          <span class="h5 brand-font text-electric">${formatearPrecio(totalFinal)}</span>
        </div>
        <button onclick="procesarCompra()" class="btn btn-neon w-100 py-2 fs-5">
          <i class="bi bi-credit-card-fill me-2"></i> Realizar Compra
        </button>
      </div>
    `;
  }
}

// ! El botón de compra tira a una página que dice "¡Felicidades, tu compra ha sido realizada!"
function procesarCompra() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  // Descontar stock de productos comprados en localStorage
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  carrito.forEach(item => {
    const p = productos.find(prod => prod.codigo === item.codigo);
    if (p) {
      p.stock = Math.max(0, p.stock - item.cantidad);
    }
  });
  localStorage.setItem("productos", JSON.stringify(productos));

  // Limpiar el carrito de compras
  localStorage.removeItem("carrito");
  actualizarInsigniaCarrito();

  // Redirigir a vista de confirmación o mostrar mensaje de felicitaciones
  const modalExito = new bootstrap.Modal(document.getElementById('modalCompraExitosa'));
  modalExito.show();
}

// Escuchar carga de documento
document.addEventListener("DOMContentLoaded", function() {
  actualizarInsigniaCarrito();
  if (window.location.pathname.includes("carrito.html")) {
    renderizarVistaCarrito();
  }
});

  // Generar número de orden aleatorio para el modal
  const elOrden = document.getElementById('orden-id-generado');
  if (elOrden) {
    // ! Generamos un número aleatorio entero entre 100000 y 999999
    const numeroOrden = Math.floor(100000 + Math.random() * 900000);
    elOrden.innerText = 'Orden ID: #LUG-' + numeroOrden;
  }