import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CarritoProvider, useCarrito } from './CarritoContext';

const mockAuth = { usuario: null };
vi.mock('./AuthContext', () => ({
  useAuth: () => mockAuth,
}));

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear();
    mockAuth.usuario = null;
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => <CarritoProvider>{children}</CarritoProvider>;

  it('debe agregar productos y acumular la cantidad si ya existen', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    const producto = { id: 101, codigo: 'TECL-01', nombre: 'Teclado Gamer', precio: 50000, stock: 10 };

    act(() => {
      result.current.agregarAlCarrito(producto);
      result.current.agregarAlCarrito(producto);
    });

    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].cantidad).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBe(100000);
  });

  it('debe aplicar un 20% de descuento si el usuario es de Duoc UC (@duocuc.cl)', () => {
    mockAuth.usuario = { email: 'estudiante@duocuc.cl', esDuoc: true };
    const { result } = renderHook(() => useCarrito(), { wrapper });

    act(() => {
      result.current.agregarAlCarrito({ id: 1, codigo: 'SG01', nombre: 'Silla Gamer', precio: 100000, stock: 5 });
    });

    expect(result.current.esEstudianteDuoc).toBe(true);
    expect(result.current.descuento).toBe(20000);
    expect(result.current.total).toBe(80000);
  });

  it('debe respetar el límite de stock y no agregar más unidades de las disponibles', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    const productoPocoStock = { id: 2, codigo: 'MS01', nombre: 'Mouse Pro', precio: 30000, stock: 2 };

    act(() => {
      result.current.agregarAlCarrito(productoPocoStock, 2);
    });
    expect(result.current.totalItems).toBe(2);

    act(() => {
      result.current.agregarAlCarrito(productoPocoStock, 1);
    });
    // Debe mantenerse en 2 porque superaba el stock disponible de 2
    expect(result.current.totalItems).toBe(2);
  });

  it('debe eliminar productos y cambiar cantidades correctamente', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    const prod = { id: 3, codigo: 'AU01', nombre: 'Audífonos Gamer', precio: 20000, stock: 5 };

    act(() => {
      result.current.agregarAlCarrito(prod, 2);
    });
    expect(result.current.totalItems).toBe(2);

    act(() => {
      result.current.cambiarCantidad('AU01', -1);
    });
    expect(result.current.totalItems).toBe(1);

    act(() => {
      result.current.eliminarDelCarrito('AU01');
    });
    expect(result.current.totalItems).toBe(0);
    expect(result.current.carrito).toHaveLength(0);
  });
});
