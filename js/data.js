/* 
  ===================================================================
  LEVEL-UP GAMER - DATOS DE INICIALIZACIÓN (data.js)
  Contiene los datos iniciales de productos, 
  regiones/comunas de Chile, blogs y usuarios por defecto.
  ===================================================================
*/

// ! Lista de Productos
const PRODUCTOS_INICIALES = [
  {
    codigo: "JM001",
    categoria: "Juegos de Mesa",
    nombre: "Catan",
    precio: 29990,
    stock: 15,
    stockCritico: 3,
    descripcion: "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "JM002",
    categoria: "Juegos de Mesa",
    nombre: "Carcassonne",
    precio: 24990,
    stock: 8,
    stockCritico: 2,
    descripcion: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "AC001",
    categoria: "Accesorios",
    nombre: "Controlador Inalámbrico Xbox Series X",
    precio: 59990,
    stock: 20,
    stockCritico: 5,
    descripcion: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "AC002",
    categoria: "Accesorios",
    nombre: "Auriculares Gamer HyperX Cloud II",
    precio: 79990,
    stock: 12,
    stockCritico: 4,
    descripcion: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "CO001",
    categoria: "Consolas",
    nombre: "PlayStation 5",
    precio: 549990,
    stock: 5,
    stockCritico: 2,
    descripcion: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "CG001",
    categoria: "Computadores Gamers",
    nombre: "PC Gamer ASUS ROG Strix",
    precio: 1299990,
    stock: 3,
    stockCritico: 1,
    descripcion: "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para rendimiento excepcional.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "SG001",
    categoria: "Sillas Gamers",
    nombre: "Silla Gamer Secretlab Titan",
    precio: 349990,
    stock: 7,
    stockCritico: 2,
    descripcion: "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones prolongadas.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "MS001",
    categoria: "Mouse",
    nombre: "Mouse Gamer Logitech G502 HERO",
    precio: 49990,
    stock: 25,
    stockCritico: 5,
    descripcion: "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan control preciso.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "MP001",
    categoria: "Mousepad",
    nombre: "Mousepad Razer Goliathus Extended Chroma",
    precio: 29990,
    stock: 18,
    stockCritico: 4,
    descripcion: "Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme.",
    imagen: "img/Logo.png",
    activo: true
  },
  {
    codigo: "PP001",
    categoria: "Poleras Personalizadas",
    nombre: "Polera Gamer Personalizada 'Level-Up'",
    precio: 14999,
    stock: 30,
    stockCritico: 5,
    descripcion: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.",
    imagen: "img/Logo.png",
    activo: true
  }
];

// ! Arreglo de Regiones y Comunas de Chile
const REGIONES_Y_COMUNAS = [
  {
    region: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto", "La Florida", "San Bernardo"]
  },
  {
    region: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", "San Antonio"]
  },
  {
    region: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles", "Coronel"]
  },
  {
    region: "Región de la Araucanía",
    comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"]
  },
  {
    region: "Región de Ñuble",
    comunas: ["Chillán", "Linares", "Longaví", "San Carlos", "Bulnes"]
  }
];

// ! Artículos del Blog Gamer
const BLOGS_INICIALES = [
  {
    id: 1,
    titulo: "¿Cómo optimizar tu PC Gamer para obtener máximo FPS?",
    fecha: "2026-09-01",
    autor: "LevelUp Team",
    resumen: "Descubre los mejores trucos y configuraciones para exprimir hasta el último fotograma por segundo en tus juegos favoritos.",
    contenido: "Optimizar tu equipo no solo consiste en comprar la tarjeta de video más cara. La gestión de drivers, la limpieza del sistema operativo, el control de temperaturas y el overclocking seguro son piezas clave para asegurar una experiencia de juego fluida a 144Hz o más...",
    imagen: "img/Logo.png"
  },
  {
    id: 2,
    titulo: "Los 5 periféricos indispensables para E-Sports en 2026",
    fecha: "2026-08-25",
    autor: "Pro Gamer Pro",
    resumen: "Analizamos los teclados mecánicos, mouses ultra livianos y audífonos con sonido 7.1 que marcan la diferencia competitiva.",
    contenido: "En el mundo competitivo donde milisegundos deciden la victoria, contar con periféricos de baja latencia es fundamental. En esta guía te mostramos los modelos más utilizados por profesionales en torneos internacionales...",
    imagen: "img/Logo.png"
  }
];

// ! Usuarios por defecto (Incluyendo Administrador para probar la sección privada)
const USUARIOS_INICIALES = [
  {
    run: "19011022K",
    nombre: "Administrador",
    apellidos: "LevelUp",
    correo: "admin@duoc.cl",
    password: "admin123",
    fechaNacimiento: "1995-05-15",
    tipoUsuario: "Administrador",
    region: "Región Metropolitana de Santiago",
    comuna: "Providencia",
    direccion: "Av. Manuel Montt 123",
    puntosLevelUp: 500,
    descuentoDuoc: true,
    activo: true
  },
  {
    run: "201234567",
    nombre: "Juan",
    apellidos: "Pérez",
    correo: "juan.perez@gmail.com",
    password: "user123",
    fechaNacimiento: "2000-10-20",
    tipoUsuario: "Cliente",
    region: "Región de Valparaíso",
    comuna: "Viña del Mar",
    direccion: "Calle 1 Norte 456",
    puntosLevelUp: 100,
    descuentoDuoc: false,
    activo: true
  }
];

// ! Función que inicializa los datos en localStorage si no existen
function inicializarLocalStorage() {
  if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(PRODUCTOS_INICIALES));
  }
  if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(USUARIOS_INICIALES));
  }
  if (!localStorage.getItem("blogs")) {
    localStorage.setItem("blogs", JSON.stringify(BLOGS_INICIALES));
  }
  if (!localStorage.getItem("carrito")) {
    localStorage.setItem("carrito", JSON.stringify([]));
  }
  if (!localStorage.getItem("pedidos")) {
    localStorage.setItem("pedidos", JSON.stringify([]));
  }
}

// Ejecutamos la inicialización al cargar la script
inicializarLocalStorage();
