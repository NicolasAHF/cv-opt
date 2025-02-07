// src/pages/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';

// Simular el módulo axios para controlar las respuestas de la API
jest.mock('axios');

describe('Login Page', () => {
  test('envía datos de inicio de sesión y redirige al usuario', async () => {
    // Simular una respuesta exitosa
    axios.post.mockResolvedValueOnce({ data: { token: 'fakeToken' } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Encuentra y rellena el campo de email y contraseña
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });

    // Envía el formulario
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    // Espera que se haya llamado a axios.post
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
