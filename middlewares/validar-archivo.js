const { request, response } = require('express');

//Para que no se nos suba vacío, debemos verificar que se mande la imagen
const validarArchivoSubida = (req = request , res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: "No hay archivos en la petición realizada ... Validación de Archivo"
        });
    }

    next();

}

module.exports = {
    validarArchivoSubida
}