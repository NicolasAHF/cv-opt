import fs from 'fs';

export const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Error al eliminar el archivo ${filePath}:`, err);
    else console.log(`Archivo ${filePath} eliminado correctamente`);
  });
};
