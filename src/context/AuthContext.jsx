import React, { createContext, useContext, useState, useEffect } from "react";
import { USUARIOS_INICIALES } from "../js/data";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Cargar usuarios guardados en localStorage
  const [usuariosBD, setUsuariosBD] = useState(() => {
    try {
      const guardados = localStorage.getItem("usuarios");
      if (guardados) {
        return JSON.parse(guardados);
      }
      // Inicializar con usuarios iniciales si no existen
      localStorage.setItem("usuarios", JSON.stringify(USUARIOS_INICIALES));
      return USUARIOS_INICIALES;
    } catch (error) {
      console.error("Error al leer 'usuarios' de localStorage:", error);
      return USUARIOS_INICIALES || [];
    }
  });

  // 2. Cargar la sesión actual desde localStorage (compatible con usuarioSesion y usuarioActual)
  const [usuario, setUsuario] = useState(() => {
    try {
      const sesion = localStorage.getItem("usuarioSesion") || localStorage.getItem("usuarioActual");
      return sesion ? JSON.parse(sesion) : null;
    } catch (error) {
      console.error("Error al leer sesión de localStorage:", error);
      return null;
    }
  });

  const [mostrarModalSalir, setMostrarModalSalir] = useState(false);

  // Sincronizar Base de Datos local con localStorage
  useEffect(() => {
    try {
      localStorage.setItem("usuarios", JSON.stringify(usuariosBD));
    } catch (error) {
      console.error("Error al guardar usuarios en localStorage:", error);
    }
  }, [usuariosBD]);

  // Sincronizar Sesión activa con localStorage (ambas llaves para compatibilidad total)
  useEffect(() => {
    if (usuario) {
      try {
        localStorage.setItem("usuarioSesion", JSON.stringify(usuario));
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
      } catch (error) {
        console.error("Error al guardar sesión:", error);
      }
    } else {
      localStorage.removeItem("usuarioSesion");
      localStorage.removeItem("usuarioActual");
    }
  }, [usuario]);

  // Registrar usuario (Compatible con formato reducido y formato completo con RUN/dirección)
  const registrarUsuario = (datos) => {
    const {
      run = "",
      nombre = "",
      apellidos = "",
      correo = "",
      email = "",
      edad = 18,
      fechaNacimiento = "",
      password = "",
      region = "",
      comuna = "",
      direccion = "",
      referido = ""
    } = datos;

    const emailPrincipal = (email || correo || "").trim().toLowerCase();

    // Registro solo para mayores de 18 años
    if (Number(edad) < 18) {
      return {
        ok: false,
        msj: "Debes ser mayor de 18 años para registrarte en Level-Up Gamer.",
      };
    }

    // Verificar si el correo ya existe
    const existe = usuariosBD.some(
      (u) => (u.email || u.correo || "").toLowerCase() === emailPrincipal
    );

    if (existe) {
      return { ok: false, msj: "El correo electrónico ya está registrado." };
    }

    // Identificación de correos Duoc para 20% OFF de por vida
    const esDuoc =
      emailPrincipal.endsWith("@duocuc.cl") ||
      emailPrincipal.endsWith("@profesor.duoc.cl") ||
      emailPrincipal.endsWith("@duoc.cl");

    const puntosAsignados = referido ? 150 : 50;

    const nuevoUsuario = {
      run: run || `R${Date.now().toString().slice(-8)}`,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: emailPrincipal,
      correo: emailPrincipal,
      edad: Number(edad) || 18,
      fechaNacimiento,
      password,
      tipoUsuario: "Cliente",
      region,
      comuna,
      direccion,
      puntos: puntosAsignados,
      puntosLevelUp: puntosAsignados,
      esDuoc,
      descuentoDuoc: esDuoc,
      activo: true
    };

    setUsuariosBD((prev) => [...prev, nuevoUsuario]);
    return {
      ok: true,
      msj: "¡Cuenta creada con éxito! Redirigiendo a Iniciar Sesión...",
      usuario: nuevoUsuario
    };
  };

  // Iniciar sesión
  const iniciarSesion = (emailOcorreo, password) => {
    const emailLimpio = (emailOcorreo || "").trim().toLowerCase();

    const usuarioExiste = usuariosBD.find(
      (u) => (u.email || u.correo || "").toLowerCase() === emailLimpio
    );

    if (!usuarioExiste) {
      return {
        ok: false,
        msj: "El correo electrónico no está registrado. Por favor regístrate.",
      };
    }

    if (usuarioExiste.password !== password) {
      return {
        ok: false,
        msj: "La contraseña es incorrecta.",
      };
    }

    if (usuarioExiste.activo === false) {
      return {
        ok: false,
        msj: "Tu cuenta ha sido dada de baja. Contacta a soporte.",
      };
    }

    // Asegurar compatibilidad de campos normalizados
    const usuarioNormalizado = {
      ...usuarioExiste,
      email: usuarioExiste.email || usuarioExiste.correo,
      correo: usuarioExiste.correo || usuarioExiste.email,
      puntos: usuarioExiste.puntos ?? usuarioExiste.puntosLevelUp ?? 0,
      puntosLevelUp: usuarioExiste.puntosLevelUp ?? usuarioExiste.puntos ?? 0,
      esDuoc: usuarioExiste.esDuoc ?? usuarioExiste.descuentoDuoc ?? false,
      descuentoDuoc: usuarioExiste.descuentoDuoc ?? usuarioExiste.esDuoc ?? false,
    };

    setUsuario(usuarioNormalizado);
    return {
      ok: true,
      msj: `¡Bienvenido ${usuarioNormalizado.nombre}!`,
      usuario: usuarioNormalizado
    };
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuarioSesion");
    localStorage.removeItem("usuarioActual");
    setMostrarModalSalir(false);
  };

  const solicitarCerrarSesion = () => setMostrarModalSalir(true);
  const cancelarCerrarSesion = () => setMostrarModalSalir(false);

  // Sumar puntos LevelUp
  const agregarPuntos = (cantidadPuntos) => {
    if (!usuario) {
      return { ok: false, msj: "Debes iniciar sesión para acumular puntos." };
    }

    const puntosASumar = Number(cantidadPuntos) || 0;
    if (puntosASumar <= 0) {
      return { ok: false, msj: "La cantidad de puntos debe ser mayor a 0." };
    }

    setUsuario((prevUsuario) => {
      if (!prevUsuario) return null;

      const puntosActuales = Number(prevUsuario.puntos || prevUsuario.puntosLevelUp) || 0;
      const nuevosPuntos = puntosActuales + puntosASumar;
      const usuarioActualizado = {
        ...prevUsuario,
        puntos: nuevosPuntos,
        puntosLevelUp: nuevosPuntos
      };

      setUsuariosBD((prevBD) =>
        prevBD.map((u) => {
          const uEmail = (u.email || u.correo || "").toLowerCase();
          const actEmail = (usuarioActualizado.email || usuarioActualizado.correo || "").toLowerCase();
          return uEmail === actEmail ? usuarioActualizado : u;
        })
      );

      return usuarioActualizado;
    });

    return { ok: true, msj: `¡Has acumulado ${puntosASumar} puntos LevelUp!` };
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        usuariosBD,
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
        solicitarCerrarSesion,
        confirmarCerrarSesion: cerrarSesion,
        cancelarCerrarSesion,
        mostrarModalSalir,
        agregarPuntos,
        sumarPuntos: agregarPuntos,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
