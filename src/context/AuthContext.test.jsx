import { render, screen, renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

// Componente auxiliar para probar la disponibilidad del contexto
const ComponenteDePrueba = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="auth-context-ok">
        {auth ? 'Contexto Cargado' : 'Error'}
      </span>
      <span data-testid="usuario-estado">
        {auth?.usuario ? 'Autenticado' : 'Sin Sesión'}
      </span>
    </div>
  );
};

describe('Contexto AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('1. Provee el contexto de autenticación correctamente a sus componentes hijos', () => {
    render(
      <AuthProvider>
        <ComponenteDePrueba />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-context-ok')).toHaveTextContent('Contexto Cargado');
  });

  test('2. Inicia con el estado por defecto sin usuario autenticado', () => {
    render(
      <AuthProvider>
        <ComponenteDePrueba />
      </AuthProvider>
    );

    expect(screen.getByTestId('usuario-estado')).toHaveTextContent('Sin Sesión');
  });

  test('3. Permite iniciar sesión con credenciales válidas y cerrar sesión', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      const loginRes = result.current.iniciarSesion('admin@duoc.cl', 'admin123');
      expect(loginRes.ok).toBe(true);
    });

    expect(result.current.usuario).not.toBeNull();
    expect(result.current.usuario.nombre).toBe('Administrador');

    act(() => {
      result.current.cerrarSesion();
    });

    expect(result.current.usuario).toBeNull();
  });

  test('4. Registra un nuevo usuario con éxito y calcula descuento si es de Duoc', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    let registroRes;
    act(() => {
      registroRes = result.current.registrarUsuario({
        nombre: 'Gamer Nuevo',
        email: 'gamer@duocuc.cl',
        edad: 20,
        password: 'password123',
      });
    });

    expect(registroRes.ok).toBe(true);
    expect(registroRes.usuario.esDuoc).toBe(true);
    expect(registroRes.usuario.descuentoDuoc).toBe(true);
  });
});
