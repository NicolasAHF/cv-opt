// src/components/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

// Usamos MemoryRouter para simular el contexto de enrutamiento
test('Renderiza el Header y muestra el título', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  const titleElement = screen.getByText(/Mi SaaS CV/i);
  expect(titleElement).toBeInTheDocument();
});
