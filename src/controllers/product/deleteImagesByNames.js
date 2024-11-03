// Importa los módulos necesarios
const express = require('express');
const { Image } = require('../../db'); // Asegúrate de ajustar la ruta según tu estructura de carpetas

const router = express.Router();

// Controlador para eliminar imágenes
router.delete('/delete-images', async (req, res) => {
    try {
        const { images } = req.body;

        // Verifica si se proporcionaron imágenes
        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ message: 'Se deben proporcionar una lista de nombres de imágenes.' });
        }

        // Elimina las imágenes de la base de datos
        await Image.destroy({
            where: {
                name: images // Asegúrate de que 'name' sea el campo correcto en tu modelo
            }
        });

        return res.status(200).json({ message: 'Imágenes eliminadas correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar las imágenes.', error });
    }
});

module.exports = router;
