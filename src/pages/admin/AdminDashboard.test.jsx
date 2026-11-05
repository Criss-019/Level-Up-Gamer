import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminDashboard from './AdminDashboard';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: { nombre: 'Admin Master', tipoUsuario: 'Administrador' },
    cerrarSesion: vi.fn(),
  }),
}));

describe('Página <AdminDashboard />', () => {
  beforeEach(() => {
    localStorage.setItem(
      'productos',
      JSON.stringify([
        { codigo: 'JM01', nombre: 'Juego 1', stock: 10, stockCritico: 3 },
        { codigo: 'JM02', nombre: 'Juego 2 (Critico)', stock: 2, stockCritico: 3 },
      ])
    );
    localStorage.setItem(
      'usuarios',
      JSON.stringify([
        { run: '1-9', nombre: 'User 1' },
        { run: '2-7', nombre: 'User 2' },
        { run: '3-5', nombre: 'User 3' },
      ])
    );
  });

  it('1. Renderiza el saludo de administrador y tarjetas de métricas', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/¡HOLA, ADMINISTRADOR!/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Alertas Stock Crítico/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuarios Registrados/i)).toBeInTheDocument();
  });

  it('2. Calcula y muestra los contadores de inventario y usuarios correctamente', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // 2 productos
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 stock critico
    expect(screen.getByText('3')).toBeInTheDocument(); // 3 usuarios
  });
});
