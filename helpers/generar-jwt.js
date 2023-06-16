const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {

    //Requiero que trabaje con promesas, entonces:
    return new Promise( (resolve , reject) => {

        const payload = { uid }; //Solo vamos a grabar el id
        //Genero el JWT (El paquete trabaja con Callbacks, entonces tenemos que organizar para las promesas)
        //sign para firmar el nuevo token
        //Envío primero lo que voy a mandar en el payload y luego la clave secreta y luego opciones adicionales
        //Finalmente tenemos el callback donde capturamos si hubo error o tenemos el token
        jwt.sign( payload,  process.env.SECRET_KEY_JWT, {
            expiresIn: '4h' //Vivirá por 4 horas
        }, (err , token) => {
            //Si tenemos errores
            if( err ){
                console.log(err);
                reject( 'No se pudo generar el JWT, error');
            
            //No hubo ningún error
            }else{
                resolve( token );
            }
        })

    })

}

module.exports = {
    generarJWT
}