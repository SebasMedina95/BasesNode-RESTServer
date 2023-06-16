//Para tener de cierto modo "el tipado"
const { response, request } = require('express');
//Genero una instancia del modelo con el esquema Mongo
const Usuario = require('../models/usuario');
//Para la encriptación de contraseñas
const bcryptjs = require('bcryptjs')


//Hacemos los diferentes llamados
const usuariosGet = async(req = request, res = response) => {

    //Obtendo los parámetros separados ? y son considerados
    //Los argumentos recordemos que vienen por la query, entonces:
    //limit nos viene en la petición, por defecto lo dejamos de a 5
    const { limite = 5 , desde = 0 } = req.query;
    const q = { estado : true };
    // const usuariosLista = await Usuario.find(q) //El estado tiene que estar en True
    //     .skip(Number(desde))
    //     .limit(Number(limite))

    // const total = await Usuario.countDocuments(q);
    // const totalMostrado = usuariosLista.length;

    //Para mandar todas las promesas simultaneamente y tratar de eliminar solicitudes bloqueantes
    //Debo colocar await para que espere que resuelva primero ambas promesas
    //Con esto eliminamos los bloqueos así como maximizamos los tiempos de respuesta :) !
    //Podemos hacer desestructuración de arreglos para sacar especificamente las respuestas para mostrar
    const [ total , usuariosFiltrados ] = await Promise.all([
        Usuario.countDocuments(q),
        Usuario.find(q) //El estado tiene que estar en True
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    const totalMostrado = usuariosFiltrados.length;

    //Obtengo el usuario autenticado
    const usuarioAutenticado = req.usuarioLogeado;
    
    res.json({
        msg : 'get API - Desde el Controlador',
        usuarioAutenticado,
        totalColeccion : total,
        totalMostrado : totalMostrado,
        usuariosFiltrados
    });

}

const usuariosPut = async(req, res) => {

    //Vamos a capturar "parametros"
    //Viene en los params, y seleccionamos el nombre que le dimos en la ruta '/:myId',  usuariosPut
    const { myId } = req.params;
    //Vamos a sacar todo aquello que no queremos que se grabe
    //Extraemos también el _id para evitar errores por el Object ID de Mongo
    const { _id, password, google, correo, ...restoInfo } = req.body;

    //Quiere actualizar la contraseña
    if(password){
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        restoInfo.password = bcryptjs.hashSync( password , salt );
    }

    //Obtengo el usuario autenticado
    const usuarioAutenticado = req.usuarioLogeado;

    //Lo que hacemos es findByIdAndUpdate para que busque por el ID y que lo actualice con el restoInfo
    //debemos colocar el {new: true} para forzar a que actualice y devuelva la infor actualizada.
    const usuarioDB = await Usuario.findByIdAndUpdate( myId, restoInfo, {new: true})

    res.json({
        msg : 'put API - Desde el controlador',
        idEdit : myId,
        usuarioEdit : usuarioDB,
        usuarioAutenticado
    });

}

const usuariosPost = async(req, res) => {

    //Vamos a capturar lo que nos llega en la petición
    const body = req.body;
    //Puedo desestructurar incluso la respuesta para obtener lo que quiero
    const { nombre, correo, celular, password, rol } = req.body;
    //Creo una instancia del usuario
    //const usuarioInstancia = new Usuario(body); //Guardo todo el objeto
    const usuarioInstancia = new Usuario({ nombre, correo, celular, password, rol }); //Guardo solo los obligatorios

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuarioInstancia.password = bcryptjs.hashSync( password , salt );

    //Obtengo el usuario autenticado
    const usuarioAutenticado = req.usuarioLogeado;

    //Ordeno a mongoose que me guarde la instancia de usuarioInstancia
    //puedo colocar el await para que espere que haga la inserción.
    await usuarioInstancia.save();

    res.json({
        msg : 'post API - Desde el controlador',
        myBody : body,
        result: usuarioInstancia,
        usuarioAutenticado
    });

}

const usuariosDelete = async(req, res) => {

    //Viene en los params, y seleccionamos el nombre que le dimos en la ruta '/:myId',  usuariosDelete
    const { myId } = req.params;

    //Extraigo el uid que viene de la req, dentro del token al ser validado
    //Extraigo el usuario que pertenece al id que viene el toquen, al uid
    //const uid = req.uid;
    const usuarioAutenticado = req.usuarioLogeado;

    //Borrado "físico"
    // const usuarioDel = await Usuario.findByIdAndDelete(myId);

    //Solo podemos eliminar si se tiene rol de administrador

    //Borrado "lógico"
    const usuarioDel = await Usuario.findByIdAndUpdate(myId , {estado : false} , {new: true});

    res.json({
        msg : 'delete API - Desde el controlador',
        usuarioLogeado : usuarioAutenticado,
        usuarioEliminado : usuarioDel
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