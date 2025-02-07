// src/pages/CVUploader.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CVUploader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('cvFile', file);

    try {
      setUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cv/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      // Una vez que el análisis se complete, redirige al dashboard para ver la lista actualizada
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      setError('Error al subir el archivo. Inténtalo nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subir CV</h1>
      <form onSubmit={handleUpload} className="flex flex-col space-y-4">
        <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={uploading}
        >
          {uploading ? 'Subiendo...' : 'Subir y Analizar CV'}
        </button>
      </form>
    </div>
  );
};

export default CVUploader;
