// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CVUploader from './pages/CVUploader';
import CVDetails from './pages/CVDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TrialUpload from './pages/TrialUpload';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<CVUploader />} />
          <Route path="/cv/:id" element={<CVDetails />} />
          {/* Ruta pública para el trial */}
          <Route path="/trial" element={<TrialUpload />} />
          {/* Puedes redirigir la raíz a una página de bienvenida o al trial */}
          <Route path="/" element={<TrialUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
