// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold">Mi SaaS CV</Link>
      <nav>
        {token ? (
          <>
            <Link to="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">Iniciar Sesión</Link>
            <Link to="/signup" className="mr-4 hover:underline">Registro</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
