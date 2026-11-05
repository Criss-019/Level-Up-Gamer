import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Registro from './Registro';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockRegistrarUsuario = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    registrarUsuario: mockRegistrarUsuario,
  }),
}));

describe('<Registro />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar un error y no registrar si las contraseñas no coinciden', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/ej. constanza silva/i), 'Juan Perez');
    await user.type(screen.getByPlaceholderText(/nombre@ejemplo.com/i), 'juan@test.com');
    await user.type(screen.getByPlaceholderText(/mínimo 6 caracteres/i), 'clave123');
    await user.type(screen.getByPlaceholderText(/repite tu contraseña/i), 'claveDiferente');

    await user.click(screen.getByRole('button', { name: /registrarme/i }));

    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    expect(mockRegistrarUsuario).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('debe registrar exitosamente, mostrar mensaje y redirigir al login tras 1.5s', async () => {
    const user = userEvent.setup();
    mockRegistrarUsuario.mockReturnValue({ ok: true, msj: 'Cuenta creada con éxito' });

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/ej. constanza silva/i), 'Constanza Silva');
    await user.type(screen.getByPlaceholderText(/nombre@ejemplo.com/i), 'constanza@duocuc.cl');
    await user.type(screen.getByPlaceholderText(/mínimo 6 caracteres/i), '123456');
    await user.type(screen.getByPlaceholderText(/repite tu contraseña/i), '123456');

    await user.click(screen.getByRole('button', { name: /registrarme/i }));

    expect(mockRegistrarUsuario).toHaveBeenCalled();
    expect(screen.getByText(/cuenta creada con éxito/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 2500 });
  });
});
