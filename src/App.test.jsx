import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import App from './App';

describe('Componente App', () => {
  test('Renderiza el componente correctamente', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/LEVEL-UP/i).length).toBeGreaterThan(0);
  });
});
