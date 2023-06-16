//Este archivo al llamarse index, si apunto a la carpeta de middlewares inmediatamente
//buscará primeramente este archivo, actua como una especie de "archivo barril", aquí
//vamos a contener todos los middlewares personalizados para llamarlos en un solo instante

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');

//Utilizo el operador spred ... para que exporte todos los elementos asociados
//de esta manera me evito tener que llamar uno a uno los métodos internos
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}