import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Upload, AlertCircle, FileText, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from "../components/ui/alert";

const AnalysisCard = ({ title, data }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 hover:bg-white/10 transition-all duration-200">
    <h3 className="text-lg font-semibold mb-3 text-blue-400">{title}</h3>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Puntaje:</span>
        <span className="text-lg font-medium">{data.puntaje}</span>
      </div>
      <p className="text-sm text-gray-300">{data.sugerencias}</p>
    </div>
  </div>
);

const TrialUpload = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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
    if (droppedFile && (droppedFile.type === "application/pdf" || 
        droppedFile.type === "application/msword" || 
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(droppedFile);
      setError('');
      setAnalysis(null);
    } else {
      setError('Por favor, sube un archivo PDF o Word.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setAnalysis(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('cvFile', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cv/analyze/trial`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      setAnalysis(response.data.analysis);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Ya has utilizado el trial. Por favor, inicia sesión o regístrate para continuar.');
      } else {
        setError('Error al procesar el CV de prueba. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Analiza tu CV Gratis
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Obtén un análisis profesional de tu CV y descubre cómo mejorarlo
        </p>

        {!analysis ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div 
              className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600 hover:border-gray-500'
              } transition-all duration-200`}
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
              <div className="flex flex-col items-center gap-4">
                <Upload className={`w-12 h-12 ${file ? 'text-blue-400' : 'text-gray-400'}`} />
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {file ? (
                      <span className="text-blue-400">{file.name}</span>
                    ) : (
                      'Arrastra tu CV aquí o haz clic para seleccionar'
                    )}
                  </p>
                  <p className="text-sm text-gray-400">
                    Soporta archivos PDF y Word
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
              {loading ? 'Analizando...' : 'Analizar CV'}
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <AnalysisCard title="Estructura" data={analysis.estructura} />
              <AnalysisCard title="Redacción" data={analysis.redaccion} />
              <AnalysisCard title="Palabras Clave" data={analysis.palabrasClave} />
              <AnalysisCard title="Compatibilidad ATS" data={analysis.compatibilidadATS} />
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">
                ¿Quieres más funcionalidades?
              </h2>
              <p className="text-gray-400 mb-6">
                Regístrate para guardar tus análisis, recibir recomendaciones personalizadas y mucho más.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all duration-200"
                >
                  Crear cuenta
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialUpload;