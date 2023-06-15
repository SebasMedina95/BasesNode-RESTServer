//Para tener de cierto modo "el tipado"
const { response, request } = require('express');

//Hacemos los diferentes llamados
const usuariosGet = (req = request, res = response) => {

    const { param1, param2 = 'No Name',  token } = req.query; //Obtendo los parámetros separados ? y son considerados "opcionales"
    
    res.json({
        msg : 'get API - Desde el Controlador',
        param1,
        param2,
        token
    });

}

const usuariosPut = (req, res) => {

    //Vamos a capturar "parametros"
    //Viene en los params, y seleccionamos el nombre que le dimos en la ruta '/:myId',  usuariosPut
    const id = req.params.myId;

    res.json({
        msg : 'put API - Desde el controlador',
        id
    });

}

const usuariosPost = (req, res) => {

    //Vamos a capturar lo que nos llega en la petición
    const body = req.body;
    
    //Puedo desestructurar incluso la respuesta para obtener lo que quiero
    const { nombre, correo } = req.body;

    res.json({
        msg : 'post API - Desde el controlador',
        myBody : body,
        nombre,
        correo
    });

}

const usuariosDelete = (req, res) => {

    res.json({
        msg : 'delete API - Desde el controlador'
    });

}

const usuariosPatch = (req, res) => {

    res.json({
        msg : 'patch API - Desde el controlador'
    });

}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}