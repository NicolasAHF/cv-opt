import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, FileText, Loader2, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/cv/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCvList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los CVs:', error);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-neon-pink text-transparent bg-clip-text">
            Mis Currículums
          </h1>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black/30 text-neon-blue hover:text-neon-pink border border-neon-blue hover:border-neon-pink rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo CV</span>
          </Link>
        </div>

        {cvList.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No tienes CVs analizados aún
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza subiendo tu primer CV para obtener un análisis detallado
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-pink text-white rounded-lg hover:opacity-90 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Subir CV</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvList.map((cv) => (
              <Link
                to={`/cv/${cv.id}`}
                key={cv.id}
                className="group bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-neon-blue transition-all duration-200 hover:shadow-lg hover:shadow-neon-blue/10"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(cv.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <h2 className="text-xl font-semibold text-white group-hover:text-neon-blue transition-colors">
                      {cv.cv_name || `CV #${cv.id.substring(0, 8)}`}
                    </h2>
                    {cv.jobPosition && (
                      <p className="text-gray-400 text-sm">
                        {cv.jobPosition}
                      </p>
                    )}
                  </div>
                  <FileText className="w-5 h-5 text-gray-500 group-hover:text-neon-blue transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;