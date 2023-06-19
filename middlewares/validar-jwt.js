const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');



const validarJWT = async(req = request , res = response , next) => {

    //Primero obtenemos el JWT, estos por lo general cuando son de acceso vienen en los headers
    //Leemos los headers
    //Llamamos tal cual como lo llamamos en nuestro header cuando lo enviamos (este caso desde postman)
    const token = req.header('x-token');
    
    if( !token ){
        return res.status(401).json({
            msg : 'No hay un token en la petición'
        })
    }

    try {
        
        //Verificamos el token, requerimos el token y la private key
        const payload = jwt.verify(token , process.env.SECRET_KEY_JWT);
        const { uid } = payload;

        //Creamos una propiedad nueva dentro del request y le asigno al uid extraído del token
        //Recordemos que en JS los objetos pasan por referencia
        //req.uid = uid;

        //Leemos el usuario que corresponda al uid
        //Creamos una propiedad nueva dentro del request y le asigno el usuario que corresponda al uid extraído del token
        const usuario = await Usuario.findById(uid);

        //Verificar que el usuario si exista
        if( !usuario ){
            return res.status(401).json({
                msg : 'Token no valido - El usuario no fue encontrado en BD Mongo'
            })
    
        }

        //Verifiquemos que no debe estar borrado, el estado debe estar en true
        if( !usuario.estado ){
            return res.status(401).json({
                msg : 'Token no valido - El usuario esta inhabilitado en BD Mongo'
            })
    
        }

        req.usuarioLogeado = usuario;
        //Para que continue si pasa ...
        next();

    } catch (error) {
        
        console.log(error);
        res.status(401).json({
            msg : 'El Token no es válido o no hay Token en la petición'
        })

    }

    

}

module.exports = {
    validarJWT
}
