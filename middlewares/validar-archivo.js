const { request, response } = require('express');

//Para que no se nos suba vacío, debemos verificar que se mande la imagen
const validarArchivoSubida = (req = request , res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: "No hay archivos en la petición realizada ... Validación de Archivo"
        });
    }

    //Validemos el tamaño de una vez, las extensiones se validan por aparte pero siempre
    //vamos a permitir archivos de máximo 2MB -> 2000000Byte
    if(req.files.archivo.size > 2000000){
        return res.status(400).json({
            msg: "El archivo subido no debe exceder los 2MB de peso ... Validación de Archivo"
        });
    }

    next();

}

module.exports = {
    validarArchivoSubida
}