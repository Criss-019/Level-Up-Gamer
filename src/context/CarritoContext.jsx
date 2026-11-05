import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const CarritoContext = createContext(null);

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return context;
};

const limpiarNumero = (val) => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const numeroLimpio = String(val).replace(/[^0-9]/g, "");
  return parseInt(numeroLimpio, 10) || 0;
};

export const CarritoProvider = ({ children }) => {
  let usuario = null;
  try {
    const auth = useAuth();
    usuario = auth?.usuario;
  } catch {
    // Si se usa fuera de AuthProvider en testing aislado
    usuario = null;
  }

  const [emailCheckout, setEmailCheckout] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem("carrito") || localStorage.getItem("carrito_gamer");
      return guardado ? JSON.parse(guardado) : [];
    } catch (error) {
      console.error("Error al leer el carrito desde localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
      localStorage.setItem("carrito_gamer", JSON.stringify(carrito));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [carrito]);

  // Función para lanzar notificaciones estilizadas
  const lanzarNotificacion = (mensaje, tipo = "warning") => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => {
      setNotificacion(null);
    }, 3200);
  };

  // Agregar producto al carrito con validación de stock
  const agregarAlCarrito = (producto, cantidadDeseada = 1) => {
    const prodId = producto.codigo || producto.id || producto.idProducto;
    const stockDisponible = producto.stock !== undefined ? producto.stock : 10;

    let agregadoExitoso = false;

    setCarrito((prev) => {
      const existe = prev.find(
        (item) => (item.codigo || item.id || item.idProducto) === prodId
      );

      const cantidadActual = existe ? existe.cantidad : 0;

      if (cantidadActual + cantidadDeseada > stockDisponible) {
        lanzarNotificacion(
          `⚡ LIMITE DE INVENTARIO: Solo quedan ${stockDisponible} unidades de "${producto.nombre}"`,
          "danger"
        );
        return prev;
      }

      agregadoExitoso = true;

      if (existe) {
        return prev.map((item) =>
          (item.codigo || item.id || item.idProducto) === prodId
            ? { ...item, cantidad: item.cantidad + cantidadDeseada }
            : item
        );
      }

      return [
        ...prev,
        {
          codigo: prodId,
          id: prodId,
          idProducto: prodId,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen || "img/Logo.png",
          stock: stockDisponible,
          puntos: producto.puntos || Math.floor(limpiarNumero(producto.precio) / 1000),
          cantidad: cantidadDeseada,
        },
      ];
    });

    if (agregadoExitoso) {
      lanzarNotificacion(`¡"${producto.nombre}" añadido al carrito!`, "success");
    }
  };

  const eliminarDelCarrito = (idOcodigo) => {
    setCarrito((prev) =>
      prev.filter(
        (item) => (item.codigo || item.id || item.idProducto) !== idOcodigo
      )
    );
  };

  const cambiarCantidad = (idOcodigo, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          const itemId = item.codigo || item.id || item.idProducto;
          if (itemId === idOcodigo) {
            const nuevaCantidad = item.cantidad + delta;
            if (nuevaCantidad <= 0) return null;

            const stockDisponible = item.stock !== undefined ? item.stock : 10;
            if (nuevaCantidad > stockDisponible) {
              lanzarNotificacion(
                `⚡ STOCK MÁXIMO ALCANZADO: Límite de ${stockDisponible} unidades para "${item.nombre}"`,
                "warning"
              );
              return item;
            }

            return { ...item, cantidad: nuevaCantidad };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    try {
      localStorage.removeItem("carrito");
      localStorage.removeItem("carrito_gamer");
    } catch (error) {
      console.error("Error al limpiar carrito en localStorage:", error);
    }
  };

  const abrirCarrito = () => setMostrarModal(true);
  const cerrarCarrito = () => setMostrarModal(false);
  const toggleCarrito = () => setMostrarModal((prev) => !prev);

  const totalItemsHeader = carrito.reduce(
    (acc, item) => acc + (item.cantidad || 0),
    0
  );

  const subtotal = carrito.reduce((acc, item) => {
    const precioLimpio = limpiarNumero(item.precio);
    const cantidad = item.cantidad || 1;
    return acc + precioLimpio * cantidad;
  }, 0);

  const totalPuntosGanados = carrito.reduce((acc, item) => {
    const cantidad = item.cantidad || 1;
    const puntosDirectos = limpiarNumero(item.puntos);
    const precioLimpio = limpiarNumero(item.precio);
    const puntosUnidad =
      puntosDirectos > 0 ? puntosDirectos : Math.floor(precioLimpio / 1000);
    return acc + puntosUnidad * cantidad;
  }, 0);

  const correoAfecto =
    emailCheckout || usuario?.email || usuario?.correo || "";
  const esEstudianteDuoc =
    Boolean(correoAfecto.toLowerCase().endsWith("@duocuc.cl")) ||
    Boolean(correoAfecto.toLowerCase().endsWith("@duoc.cl")) ||
    Boolean(correoAfecto.toLowerCase().endsWith("@profesor.duoc.cl")) ||
    Boolean(usuario?.esDuoc) ||
    Boolean(usuario?.descuentoDuoc);

  const porcentajeDescuento = esEstudianteDuoc ? 0.2 : 0;
  const montoDescuento = Math.round(subtotal * porcentajeDescuento);
  const totalFinal = subtotal - montoDescuento;

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        mostrarModal,
        agregarAlCarrito,
        eliminarDelCarrito,
        cambiarCantidad,
        vaciarCarrito,
        abrirCarrito,
        cerrarCarrito,
        toggleCarrito,
        totalItemsHeader,
        totalItems: totalItemsHeader,
        subtotal,
        descuento: montoDescuento,
        esEstudianteDuoc,
        total: totalFinal,
        totalPuntosGanados,
        setEmailCheckout,
        lanzarNotificacion,
      }}
    >
      {children}

      {/* Banner de Notificación Flotante */}
      {notificacion && (
        <div
          className="position-fixed top-0 end-0 m-4 p-3 rounded-4 shadow-lg text-white d-flex align-items-center gap-3 animate__animated animate__fadeInDown"
          style={{
            zIndex: 9999,
            backgroundColor: "#0d111d",
            border: `2px solid ${
              notificacion.tipo === "danger"
                ? "#f43f5e"
                : notificacion.tipo === "success"
                ? "#39FF14"
                : "#f59e0b"
            }`,
            boxShadow: `0 0 20px ${
              notificacion.tipo === "danger"
                ? "rgba(244, 63, 94, 0.4)"
                : notificacion.tipo === "success"
                ? "rgba(57, 255, 20, 0.4)"
                : "rgba(245, 158, 11, 0.4)"
            }`,
            maxWidth: "420px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center p-2"
            style={{
              backgroundColor:
                notificacion.tipo === "danger"
                  ? "rgba(244, 63, 94, 0.2)"
                  : notificacion.tipo === "success"
                  ? "rgba(57, 255, 20, 0.2)"
                  : "rgba(245, 158, 11, 0.2)",
              fontSize: "1.3rem",
            }}
          >
            {notificacion.tipo === "danger"
              ? "🚨"
              : notificacion.tipo === "success"
              ? "🎮"
              : "⚡"}
          </div>
          <div className="flex-grow-1">
            <span
              className="fw-bold d-block text-uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "1px",
                color:
                  notificacion.tipo === "danger"
                    ? "#f43f5e"
                    : notificacion.tipo === "success"
                    ? "#39FF14"
                    : "#f59e0b",
              }}
            >
              Alerta Level-Up
            </span>
            <span style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>
              {notificacion.mensaje}
            </span>
          </div>
          <button
            onClick={() => setNotificacion(null)}
            className="btn-close btn-close-white ms-2 shadow-none"
            style={{ fontSize: "0.7rem" }}
          ></button>
        </div>
      )}
    </CarritoContext.Provider>
  );
};

export default CarritoContext;
