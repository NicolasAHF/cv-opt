import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, FileText, X } from 'lucide-react';
import { Alert, AlertDescription } from "../components/ui/alert";

const CVUploader = () => {
  const [file, setFile] = useState(null);
  const [cvName, setCvName] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFileType(droppedFile)) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Por favor, sube un archivo PDF o Word.');
    }
  };

  const isValidFileType = (file) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      if (isValidFileType(e.target.files[0])) {
        setFile(e.target.files[0]);
        setError('');
      } else {
        setError('Por favor, sube un archivo PDF o Word.');
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
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
    formData.append('cvName', cvName.trim() || 'CV sin nombre');
    formData.append('jobPosition', jobPosition.trim() || 'Sin posición específica');

    try {
      setUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cv/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Error al subir el archivo. Por favor, inténtalo nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-800">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-blue to-neon-pink text-transparent bg-clip-text">
            Sube tu CV
          </h1>
          <p className="text-gray-400 mb-8">
            Sube tu CV y obtén un análisis detallado para aumentar tus posibilidades
          </p>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del CV
                </label>
                <input
                  type="text"
                  value={cvName}
                  onChange={(e) => setCvName(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                  placeholder="Ej: CV Desarrollador Senior"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Puesto al que postulas
                </label>
                <input
                  type="text"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                  placeholder="Ej: Frontend Developer"
                />
              </div>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-neon-blue bg-neon-blue/10' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {!file ? (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-300">
                      Arrastra tu CV aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Formatos soportados: PDF, DOC, DOCX (máx. 10MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-neon-blue" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-300">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-neon-blue to-neon-pink text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Subir y Analizar CV
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CVUploader;