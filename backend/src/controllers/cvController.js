// src/controllers/cvController.js
import { extractTextFromFile } from '../services/fileService.js';
import { analyzeCV as analyzeCVService } from '../services/aiService.js';
import { deleteFile } from '../utils/deleteFile.js';
import supabase from '../db.js';

const sanitizeString = (str) => str.replace(/\u0000/g, '');

// Función auxiliar para limpiar un objeto JSON recursivamente (opcional)
const sanitizeObject = (obj) => {
  // Convertir el objeto a string, remover los caracteres nulos y volver a parsearlo
  return JSON.parse(JSON.stringify(obj).replace(/\u0000/g, ''));
};

export const analyzeCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Extraer el texto del CV
    let cvText = await extractTextFromFile(filePath, mimeType);
    // Sanitizar el texto para eliminar caracteres nulos
    cvText = sanitizeString(cvText);

    // Generar el análisis del CV usando la IA
    let analysisResult = await analyzeCVService(cvText);
    // Sanitizar el resultado (si es un objeto, limpiamos todos sus strings)
    analysisResult = sanitizeObject(analysisResult);

    // Insertar el análisis en la base de datos, asociándolo al usuario autenticado
    const { data, error } = await supabase
      .from('cv_analyses')
      .insert([
        {
          user_id: req.user.id,
          cv_text: cvText,
          analysis_result: analysisResult
        }
      ], { returning: 'representation' })
      .single();

    if (error) {
      console.error('Error al guardar el análisis:', error);
      return res.status(500).json({ message: 'Error al guardar el análisis en la base de datos' });
    }

    // Eliminar el archivo temporal
    deleteFile(filePath);

    res.json({ analysis: analysisResult, dbRecord: data });
  } catch (error) {
    console.error('Error en analyzeCV:', error);
    res.status(500).json({ message: 'Error al procesar el CV', error: error.message });
  }
};

export const listCVs = async (req, res) => {
  try {
    // Se asume que el middleware de autenticación asigna el usuario a req.user
    const userId = req.user.id;
    // Consulta los análisis de CV asociados al usuario
    const { data, error } = await supabase
      .from('cv_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error al obtener los CVs:', error);
      return res.status(500).json({ message: 'Error al obtener los CVs' });
    }
    
    return res.json(data);
  } catch (error) {
    console.error('List CVs error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const getCVDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el registro de cv_analyses con el id proporcionado
    const { data, error } = await supabase
      .from('cv_analyses')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      return res.status(404).json({ message: 'CV no encontrado' });
    }
    
    return res.json(data);
  } catch (error) {
    console.error('Error al obtener detalle del CV:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
