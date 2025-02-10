import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2, Activity, FileText, Target, Cpu } from 'lucide-react';

const ScoreIndicator = ({ score }) => {
  const scoreValue = parseFloat(score) || 0;
  const percentage = (scoreValue * 10); // Convertir a porcentaje para el círculo
  const getColor = () => {
    if (scoreValue >= 8) return 'text-green-400';
    if (scoreValue >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={175.93}
            strokeDashoffset={175.93 - (175.93 * percentage) / 100}
            className={getColor()}
          />
        </svg>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold ${getColor()}`}>
          {scoreValue}/10
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ title, data, icon: Icon }) => (
  <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-neon-blue transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-800/50 rounded-lg">
          <Icon className="w-6 h-6 text-neon-blue" />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <ScoreIndicator score={data.puntaje} />
    </div>
    <div className="space-y-4">
      <div>
        <h3 className="text-gray-400 text-sm mb-2">Sugerencias</h3>
        <p className="text-gray-300">{data.sugerencias}</p>
      </div>
      {data.detalles && (
        <div>
          <h3 className="text-gray-400 text-sm mb-2">Detalles</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {data.detalles.map((detalle, index) => (
              <li key={index}>{detalle}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const CVDetails = () => {
  const { id } = useParams();
  const [cvDetails, setCvDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/cv/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCvDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los detalles del CV:', error);
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-blue" />
      </div>
    );
  }

  if (!cvDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-300 mb-2">
            No se encontraron detalles para este CV
          </h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-neon-blue hover:text-neon-pink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { analysis_result: analysis } = cvDetails;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-neon-pink text-transparent bg-clip-text">
            Análisis del CV
          </h1>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 text-neon-blue hover:text-neon-pink border border-neon-blue hover:border-neon-pink rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>

        <div className="grid gap-6">
          {analysis.estructura && (
            <DetailCard 
              title="Estructura" 
              data={analysis.estructura}
              icon={Activity}
            />
          )}
          {analysis.redaccion && (
            <DetailCard 
              title="Redacción" 
              data={analysis.redaccion}
              icon={FileText}
            />
          )}
          {analysis.palabrasClave && (
            <DetailCard 
              title="Palabras Clave" 
              data={analysis.palabrasClave}
              icon={Target}
            />
          )}
          {analysis.compatibilidadATS && (
            <DetailCard 
              title="Compatibilidad ATS" 
              data={analysis.compatibilidadATS}
              icon={Cpu}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CVDetails;