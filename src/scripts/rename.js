const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../ImagesProducts'); // Ajusta la ruta a tu carpeta de imágenes

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error('Error leyendo el directorio: ', err);
  }

  files.forEach(file => {
    if (path.extname(file) === '.png') {
      const oldPath = path.join(directoryPath, file);
      const newPath = path.join(directoryPath, file.replace(/\.png$/, '.jpg'));

      fs.rename(oldPath, newPath, err => {
        if (err) {
          console.error('Error renombrando archivo: ', err);
        } else {
          console.log(`Renombrado: ${file} a ${path.basename(newPath)}`);
        }
      });
    }
  });
});
