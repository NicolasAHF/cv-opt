// src/services/fileService.js
import fs from 'fs';
import pdfModule from 'pdf-parse';
const pdfParse = pdfModule.default || pdfModule;
import mammoth from 'mammoth';

export const extractTextFromFile = async (filePath, mimeType) => {
  if (!filePath) {
    throw new Error('No se proporcionó una ruta de archivo válida.');
  }
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`El archivo no existe en la ruta: ${filePath}`);
  }
  
  if (mimeType === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    if (!dataBuffer || dataBuffer.length === 0) {
      throw new Error('El buffer del archivo PDF está vacío.');
    }
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error('Tipo de archivo no soportado');
  }
};
