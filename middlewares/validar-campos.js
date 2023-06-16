//Validaciones usando Express
const { validationResult } = require('express-validator');

//La razón del tercer argumento es la función que llamamos si el middleware pasa
const validarCampos = (req , res , next) => {

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json(errores)
    }

    next(); //Continua ...

}

module.exports = {
    validarCampos
}
