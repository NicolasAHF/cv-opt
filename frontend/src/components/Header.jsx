import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, FileText, LogOut, ChevronDown, User } from 'lucide-react';

const Header = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 lg:px-8 py-4 flex justify-between items-center bg-black/30 backdrop-blur-md border-b border-white/10">
      <Link 
        to={token ? "/dashboard": "/trial"}  
        className="flex items-center gap-2 group"
      >
        <div className="relative">
          <FileText className="w-8 h-8 text-neon-blue group-hover:text-neon-pink transition-colors duration-300" />
          <Brain className="w-4 h-4 absolute -top-1 -right-1 text-neon-pink group-hover:text-neon-blue transition-colors duration-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-pink text-transparent bg-clip-text group-hover:from-neon-pink group-hover:to-neon-blue transition-all duration-300">
            ResumeAI Pro
          </span>
          <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
            Optimiza tu CV con IA
          </span>
        </div>
      </Link>

      <nav className="flex items-center gap-6">
        {token ? (
          <>
            <Link 
              to="/dashboard" 
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/5 ${
                isActive('/dashboard') ? 'text-neon-blue' : 'text-gray-300 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 text-neon-blue hover:text-neon-pink border border-neon-blue hover:border-neon-pink transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/5 text-gray-300 hover:text-white"
            >
              <User className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-pink hover:opacity-90 text-white transition-all duration-200"
            >
              <span>Registro</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;