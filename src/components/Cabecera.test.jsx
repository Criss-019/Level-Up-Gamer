import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import Cabecera from './Cabecera';

// Mockear useAuth
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: { nombre: 'Gamer Test', puntos: 100, descuentoDuoc: true },
    cerrarSesion: vi.fn(),
  }),
}));

// Mockear useCarrito
vi.mock('../context/CarritoContext', () => ({
  useCarrito: () => ({
    carrito: [
      { codigo: 'JM001', cantidad: 2 },
      { codigo: 'AC001', cantidad: 1 },
    ],
    totalItems: 3,
  }),
}));

describe('Componente Cabecera', () => {
  test('1. Renderiza correctamente los enlaces de navegación principales', () => {
    render(
      <BrowserRouter>
        <Cabecera />
      </BrowserRouter>
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Blog Gamer/i)).toBeInTheDocument();
    expect(screen.getByText(/Quiénes Somos/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });

  test('2. Muestra la cantidad correcta de productos en la insignia del carrito', () => {
    render(
      <BrowserRouter>
        <Cabecera />
      </BrowserRouter>
    );

    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  test('3. Muestra el saludo personalizado con el nombre del usuario autenticado', () => {
    render(
      <BrowserRouter>
        <Cabecera />
      </BrowserRouter>
    );

    expect(screen.getByText(/Hola, Gamer Test/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
  });
});
