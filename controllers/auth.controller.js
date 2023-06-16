//Para tener de cierto modo "el tipado"
const { response, request } = require('express');
//Para la encriptación de contraseñas
const bcryptjs = require('bcryptjs')
//Genero el esquema para trabajar
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


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

module.exports = {
    login
}