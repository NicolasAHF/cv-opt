// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    return <div className="text-center mt-10 text-lg">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mis Currículums</h1>
      <div className="flex justify-end mb-6">
        <Link
          to="/upload"
          className="bg-blue-500 text-white px-6 py-3 rounded transition-transform transform hover:scale-105 hover:bg-blue-600"
        >
          Subir Nuevo CV
        </Link>
      </div>
      {cvList.length === 0 ? (
        <p className="text-center text-xl">No tienes CVs analizados aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvList.map((cv, index) => (
            <motion.div
              key={cv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow">
                <h2 className="font-semibold text-xl mb-2">CV #{cv.id.substring(0, 8)}</h2>
                <p className="text-gray-600 mb-3">
                  Fecha: {new Date(cv.created_at).toLocaleDateString()}
                </p>
                <Link
                  to={`/cv/${cv.id}`}
                  className="text-blue-500 hover:underline font-medium"
                >
                  Ver detalles
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
