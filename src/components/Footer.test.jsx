import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';
import FooterSecundario from './FooterSecundario';

describe('Componentes Footer', () => {
  it('debe renderizar el Footer principal con su información y enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /LEVEL-UP GAMER/i })).toBeInTheDocument();
    expect(screen.getByText(/ENLACES RÁPIDOS/i)).toBeInTheDocument();

    const enlacesEsperados = [
      { name: /catálogo completo/i, href: '/productos' },
      { name: /quiénes somos/i, href: '/nosotros' },
      { name: /guías gamer y blogs/i, href: '/blog' },
      { name: /soporte y contacto/i, href: '/contacto' },
    ];

    enlacesEsperados.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('debe renderizar el FooterSecundario sin errores', () => {
    render(
      <MemoryRouter>
        <FooterSecundario />
      </MemoryRouter>
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/Level-Up Gamer © 2026/i)).toBeInTheDocument();
  });
});
