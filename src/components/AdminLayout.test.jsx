import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminLayout from './AdminLayout';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

let mockUsuario = null;
const mockCerrarSesion = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: mockUsuario,
    cerrarSesion: mockCerrarSesion,
  }),
}));

describe('Componente <AdminLayout />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('1. Renderiza el panel administrativo y menú lateral para usuario Administrador', () => {
    mockUsuario = { nombre: 'Admin Master', tipoUsuario: 'Administrador' };

    render(
      <MemoryRouter>
        <AdminLayout activeTab="dashboard">
          <div data-testid="contenido-admin">Contenido de Prueba</div>
        </AdminLayout>
      </MemoryRouter>
    );

    expect(screen.getByText(/PANEL/i)).toBeInTheDocument();
    expect(screen.getByText(/ADMINISTRATIVO/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Respaldos/i)).toBeInTheDocument();
    expect(screen.getByTestId('contenido-admin')).toBeInTheDocument();
  });

  it('2. Bloquea el acceso y redirige al login si el usuario no es Administrador', () => {
    mockUsuario = { nombre: 'Cliente Normal', tipoUsuario: 'Cliente' };

    render(
      <MemoryRouter>
        <AdminLayout activeTab="dashboard">
          <div>Contenido Protegido</div>
        </AdminLayout>
      </MemoryRouter>
    );

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/Acceso denegado/i)
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
