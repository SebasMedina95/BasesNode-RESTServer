//Importamos el path para mantener un control de ubicación y enviar el archivo a donde es
const path = require('path');
//Usamos uuid para identificadores únicos para las imágenes
const { v4: uuidv4 } = require('uuid');

const extensionesDefault = ['png' , 'jpg' , 'jpeg' , 'gif'];

//Files tendrá la información del archivo
//Ext tendrá el array de extensiones válidas
const subirArchivo = ( files , extValidas = extensionesDefault, carpeta = '' ) => {

    return new Promise ( (resolve, reject) => {

        //Guardamos el archivo, desestructuro para obtenerlo
        const { archivo } = files;

        //Validemos la extensión del archivo
        //Debemos hacer el split del nombre y sacar la última posición
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];
        // console.log(nombreCortado);
        // console.log(extension);

        //Validar la extensión
        const extensionesPermitidas = extValidas;
        if(!extensionesPermitidas.includes(extension)){
            return reject(`La extensión ${extension} no es permitida, solo se permiten ${extValidas}`);
        }

        //Nombre del archivo a partir del uuid
        //no olvidar concatenar la extensión
        const nombreTemporal = uuidv4() + "." + extension;

        //Determinamos donde enviaremos el archivo capturado
        const uploadPath = path.join( __dirname, '../uploads/' , carpeta,  nombreTemporal );

        //Realizamos el mover, moveremos la imagen a donde indicamos anteriormente con mv
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)
            }

            resolve(nombreTemporal);

        });

    })

}

module.exports = {
    subirArchivo
}
