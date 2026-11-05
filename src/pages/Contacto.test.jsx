import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contacto from './Contacto';

describe('Página <Contacto />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('1. Renderiza los campos del formulario de contacto', () => {
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Tu nombre y apellidos/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ejemplo@duoc.cl/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escribe tu mensaje aquí/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ENVIAR MENSAJE/i })).toBeInTheDocument();
  });

  it('2. Muestra errores de validación si los campos requeridos están vacíos', async () => {
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>
    );

    const btnEnviar = screen.getByRole('button', { name: /ENVIAR MENSAJE/i });
    fireEvent.click(btnEnviar);

    expect(screen.getByText(/El nombre completo es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/El mensaje o comentario es obligatorio/i)).toBeInTheDocument();
  });

  it('3. Valida y envía el formulario exitosamente con datos correctos', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Tu nombre y apellidos/i), 'Mario Bros');
    await user.type(screen.getByPlaceholderText(/ejemplo@duoc.cl/i), 'mario@duoc.cl');
    await user.type(screen.getByPlaceholderText(/Escribe tu mensaje aquí/i), 'Consulta sobre despachos');

    await user.click(screen.getByRole('button', { name: /ENVIAR MENSAJE/i }));

    expect(window.alert).toHaveBeenCalled();
  });
});
