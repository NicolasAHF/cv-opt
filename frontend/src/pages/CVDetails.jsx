// src/pages/CVDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const DetailCard = ({ title, data }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="bg-white shadow-lg rounded-lg p-6 mb-6"
  >
    <h2 className="text-2xl font-bold mb-3">{title}</h2>
    <p className="text-lg">
      <span className="font-semibold">Puntaje:</span> {data.puntaje}
    </p>
    <p className="text-lg mt-2">
      <span className="font-semibold">Sugerencias:</span> {data.sugerencias}
    </p>
  </motion.div>
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
    return <div className="text-center mt-10 text-lg">Cargando...</div>;
  }
  if (!cvDetails)
    return (
      <div className="text-center mt-10 text-lg">
        No se encontraron detalles para este CV.
      </div>
    );

  const { analysis_result: analysis } = cvDetails;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Detalle del CV
      </motion.h1>
      {analysis.estructura && (
        <DetailCard title="Estructura" data={analysis.estructura} />
      )}
      {analysis.redaccion && (
        <DetailCard title="Redacción" data={analysis.redaccion} />
      )}
      {analysis.palabrasClave && (
        <DetailCard title="Palabras Clave" data={analysis.palabrasClave} />
      )}
      {analysis.compatibilidadATS && (
        <DetailCard title="Compatibilidad ATS" data={analysis.compatibilidadATS} />
      )}
      <Link to="/dashboard" className="block text-center text-blue-500 hover:underline mt-6">
        &larr; Volver al Dashboard
      </Link>
    </div>
  );
};

export default CVDetails;
