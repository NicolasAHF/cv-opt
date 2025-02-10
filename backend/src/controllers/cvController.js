// src/controllers/cvController.js
import { extractTextFromFile } from '../services/fileService.js';
import { analyzeCV as analyzeCVService } from '../services/aiService.js';
import { deleteFile } from '../utils/deleteFile.js';
import supabase from '../db.js';

const sanitizeString = (str) => str.replace(/\u0000/g, '');

export const analyzeCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Extraer y sanitizar el texto del CV
    let cvText = await extractTextFromFile(filePath, mimeType);
    cvText = sanitizeString(cvText);

    // Obtener el puesto al que postula y el nombre del CV
    const jobPosition = req.body.jobPosition || 'No especificado';
    const cvName = req.body.cvName || `CV ${new Date().toLocaleString()}`;

    // Generar el análisis con la IA, pasando el puesto
    const analysisResult = await analyzeCVService(cvText, jobPosition);

    // Insertar el registro en la base de datos, incluyendo el puesto
    const { data, error } = await supabase
      .from('cv_analyses')
      .insert(
        [
          {
            user_id: req.user.id,
            cv_text: cvText,
            analysis_result: analysisResult,
            cv_name: cvName,
            job_position: jobPosition, // Asegúrate de tener esta columna en tu tabla
          },
        ],
        { returning: 'representation' }
      )
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

export const analyzeCVTrial = async (req, res) => {
  try {
    if (req.cookies && req.cookies.trialUsed) {
      return res.status(403).json({ message: 'Ya has utilizado el trial. Por favor, inicia sesión o regístrate para continuar.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    let cvText = await extractTextFromFile(filePath, mimeType);
    cvText = sanitizeString(cvText);

    // Obtener el puesto al que postula
    const jobPosition = req.body.jobPosition || 'No especificado';
    const cvName = req.body.cvName || `CV ${new Date().toLocaleString()}`;

    // Pasar el puesto al servicio de análisis
    const analysisResult = await analyzeCVService(cvText, jobPosition);

    deleteFile(filePath);

    res.cookie('trialUsed', 'true', { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.json({ 
      analysis: analysisResult, 
      cvName,
      jobPosition // Incluir el puesto en la respuesta
    });
  } catch (error) {
    console.error('Error en analyzeCVTrial:', error);
    res.status(500).json({ message: 'Error al procesar el CV (trial)', error: error.message });
  }
};

export const listCVs = async (req, res) => {
  try {
    const userId = req.user.id;
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