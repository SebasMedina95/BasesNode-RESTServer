
const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google.verify');
const subirArchivo = require('./subir-archivo');

//Vamos a exportarlos PERO debemos esparcir todo el contenido para
//que nos tome todas las funciones internamente definidas según sea el caso
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}
