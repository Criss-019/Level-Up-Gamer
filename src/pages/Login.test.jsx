import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockIniciarSesion = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    iniciarSesion: mockIniciarSesion,
  }),
}));

describe('<Login />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/nombre@ejemplo.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('debe mostrar un error si las credenciales son incorrectas', async () => {
    const user = userEvent.setup();
    mockIniciarSesion.mockReturnValue({ ok: false, msj: 'credenciales incorrectas. revisa tu correo o contraseña.' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/nombre@ejemplo.com/i), 'test@test.com');
    await user.type(screen.getByPlaceholderText(/••••••••/i), 'clave123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mockIniciarSesion).toHaveBeenCalledWith('test@test.com', 'clave123');
    expect(
      screen.getByText(/credenciales incorrectas. revisa tu correo o contraseña./i)
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('debe redirigir al inicio (/) si el login es exitoso', async () => {
    const user = userEvent.setup();
    mockIniciarSesion.mockReturnValue({ ok: true, usuario: { tipoUsuario: 'Cliente' } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/nombre@ejemplo.com/i), 'duoc@duocuc.cl');
    await user.type(screen.getByPlaceholderText(/••••••••/i), 'secreta');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mockIniciarSesion).toHaveBeenCalledWith('duoc@duocuc.cl', 'secreta');
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(screen.queryByText(/credenciales incorrectas/i)).not.toBeInTheDocument();
  });
});
