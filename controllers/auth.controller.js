//Para tener de cierto modo "el tipado"
const { response, request } = require('express');
//Para la encriptación de contraseñas
const bcryptjs = require('bcryptjs')
//Genero el esquema para trabajar
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google.verify');


//Hacemos los diferentes llamados
const login = async(req = request, res = response) => {

    const { correo , password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo }) //Mi modelo tiene una propiedad interna llamada correo
        if(!usuario){
            return res.status(400).json({
                msg : 'Usuario y/o Password no son correctos - Correo'
            })
        }

        //Verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg : 'Usuario y/o Password no son correctos - Estado'
            })
        }

        //Verificar contraseña
        const validoPassword = bcryptjs.compareSync( password , usuario.password );
        if(!validoPassword){
            return res.status(400).json({
                msg : 'Usuario y/o Password no son correctos - Password'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            msg : "Login Ok",
            usuarioAutenticado : usuario,
            tokenGenerado : token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : "Algo salió mal con la petición"
        })
    }

}

const googleSignIn = async(req = request, res = response) => {

    //Desde el front, cuando estamos en handleCredentialResponse(response) capturamos en su parámetro
    //en el apartado const body = { id_token: response.credential } la credencial, que es la que nos trae
    //el token, mismo con el que sacaremos la información requerida para registrar en mongo
    const { id_token } = req.body;

    try {
        //Nos vamos a traer todo aunque lo podríamos desestructurar
        const googleUser = await googleVerify(id_token);
        const { correo , nombre , img } = googleUser;

        //Buscamos en el model Usuario el correo, vamos a hacer la validación
        let usuario = await Usuario.findOne({ correo });

        //Si el usuario no existe, entonces creemoslo de una vez
        if( !usuario ){
            const dataGrabar = {
                nombre,
                correo,
                celular: ':)', //Recordemos que tenemos el método que valida esto
                password: ':)', //Recordemos que tenemos el método que valida esto
                img,
                rol: 'USER_ROL',
                google: true
            };

            usuario = new Usuario( dataGrabar );
            await usuario.save();

        }

        //Si el usuario esta en estado false, o sea, borrado
        if( !usuario.estado ){
            res.status(401).json({
                msg : "El usuario está bloqueado, por favor hable con el ADMIN del sitio"
            })
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg : "Todo OK con el Token de Google - Google Sign In",
            usuario,
            id_token,
            googleUser
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg : "El Token de Google no pudo ser verificado"
        })
    }

    

}

module.exports = {
    login,
    googleSignIn
}