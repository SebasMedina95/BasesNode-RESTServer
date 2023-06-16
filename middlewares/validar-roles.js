const { request, response } = require('express');



const esAdminRole = (req = request , res = response , next) => {

    //Cuando validamos el token, en la req nos quedo el usuario logeado, aprovechoemos !
    //recordemos que lo llamamos usuarioLogeado
    if( !req.usuarioLogeado ){
        return res.status(500).json({
            msg : 'Se quiere verificar el rol sin validar el token primero, ERROR.'
        });
    }

    const { nombre , rol } = req.usuarioLogeado;
    if( rol !== 'ADMIN_ROL' ){
        return res.status(401).json({
            msg : `El usuaro ${nombre} no es administrador, por tanto no puede realizar la operación`
        });
    }

    next();

}

//Vamos a pedir el resto de los argumentos que vienen, por tanto, para mandar varios por URL
//lo que hacemos es que lo enviamos con el operador spret
const tieneRole = ( ...restoRoles ) => {

    //El nos debe retornar una función, entonces el retorno acomodamos los operadores que ya sabemos
    return (req = request , res = response , next) => {
        
        //Valido de igual manera que haya pasado por el token
        if( !req.usuarioLogeado ){
            return res.status(500).json({
                msg : 'Se quiere verificar el rol sin validar el token primero, ERROR.'
            });
        }

        //Ahora si valido el rol, si el rol que tiene el logeado coincide con el/los rol permitido desde las rutas
        if( !restoRoles.includes( req.usuarioLogeado.rol ) ){
            return res.status(401).json({
                msg : `El servicio como tal requiere uno de estos roles: ${restoRoles}`
            });
        }


        // console.log(restoRoles);
        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}