import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Carrito from './Carrito';

const mockCambiarCantidad = vi.fn();
const mockEliminarDelCarrito = vi.fn();
const mockVaciarCarrito = vi.fn();
const mockAgregarPuntos = vi.fn();

let mockCarritoState = [];
let mockUsuarioState = null;
let mockEsDuoc = false;

vi.mock('../context/CarritoContext', () => ({
  useCarrito: () => ({
    carrito: mockCarritoState,
    cambiarCantidad: mockCambiarCantidad,
    eliminarDelCarrito: mockEliminarDelCarrito,
    vaciarCarrito: mockVaciarCarrito,
    subtotal: 100000,
    descuento: mockEsDuoc ? 20000 : 0,
    esEstudianteDuoc: mockEsDuoc,
    total: mockEsDuoc ? 80000 : 100000,
  }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: mockUsuarioState,
    agregarPuntos: mockAgregarPuntos,
  }),
}));

describe('Página <Carrito />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCarritoState = [];
    mockUsuarioState = null;
    mockEsDuoc = false;
  });

  it('1. Muestra mensaje cuando el carrito está vacío', () => {
    mockCarritoState = [];

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ir al Catálogo de Productos/i })).toBeInTheDocument();
  });

  it('2. Muestra los productos agregados al carrito con sus datos', () => {
    mockCarritoState = [
      {
        codigo: 'JM001',
        nombre: 'Catan',
        precio: 29990,
        cantidad: 2,
        stock: 10,
      },
    ];

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText('Código: JM001')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('3. Permite invocar el cambio de cantidad y eliminación de producto', () => {
    mockCarritoState = [
      {
        codigo: 'JM001',
        nombre: 'Catan',
        precio: 29990,
        cantidad: 2,
        stock: 10,
      },
    ];

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    const btnAumentar = screen.getByRole('button', { name: /Aumentar Catan/i });
    fireEvent.click(btnAumentar);
    expect(mockCambiarCantidad).toHaveBeenCalledWith('JM001', 1);

    const btnEliminar = screen.getByRole('button', { name: /Eliminar Catan/i });
    fireEvent.click(btnEliminar);
    expect(mockEliminarDelCarrito).toHaveBeenCalledWith('JM001');
  });

  it('4. Aplica y muestra el descuento del 20% para alumnos Duoc', () => {
    mockCarritoState = [
      {
        codigo: 'JM001',
        nombre: 'Catan',
        precio: 100000,
        cantidad: 1,
        stock: 10,
      },
    ];
    mockEsDuoc = true;
    mockUsuarioState = { nombre: 'Gamer Duoc', email: 'estudiante@duoc.cl', descuentoDuoc: true };

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText(/Descuento Duoc \(20%\):/i)).toBeInTheDocument();
    expect(screen.getByText(/✓ Descuento de Alumno Duoc \(20%\) aplicado a tu compra/i)).toBeInTheDocument();
  });
});
