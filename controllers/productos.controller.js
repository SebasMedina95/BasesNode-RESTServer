//Para tener de cierto modo "el tipado"
const { response, request } = require('express');
const { Producto, Categoria } = require('../models')

const obtenerProductos = async(req = request, res = response) =>{

    const { limite = 5 } = req.query;
    const q = { estado : true };

    const [ total , productos ] = await Promise.all([
        Producto.countDocuments(),
        Producto.find(q)
        .limit(Number(limite))
        .populate('usuario' , 'nombre')
        .populate('categoria' , 'nombre')
    ]);

    //Obtengo el usuario autenticado
    const usuarioAutenticado = req.usuarioLogeado;

    res.json({
        msg : 'GET API - Productos - Desde el controlador - Todo OK',
        usuarioAutenticado,
        limitadoPor : limite,
        totalColeccion : total,
        productos
    });

}

const obtenerProductosPorId = async(req = request, res = response) =>{

    //Viene en los params, y seleccionamos el nombre que le dimos en la ruta '/:id',  usuariosPut
    const { id } = req.params;

    //Obtengo el usuario autenticado
    const usuarioAutenticado = req.usuarioLogeado;

    const productoDB = await Producto.findById( id )
        .populate('usuario' , 'nombre')
        .populate('categoria' , 'nombre');

    res.status(200).json({
        msg : 'GET API - Productos (Obtenida por ID) - Desde el controlador - Todo OK',
        result: productoDB,
        usuarioAutenticado
    });

}

const crearProducto = async(req = request, res = response) => {

    //Vamos a capturar lo que nos llega en la petición
    //Vamos a dejar solo lo que requerimos insertar
    const { estado, usuario, ...body } = req.body;

    //Vamos a revisar primero que no haya una misma categoría en la BD
    const productoDB = await Producto.findOne({ nombre : body.nombre });

    if( productoDB ){
        return res.status(400).json({
            msg : `El producto ${productoDB.nombre} ya existe en la BD Mongo`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body, //Envío todo lo demás
        nombre : body.nombre.toUpperCase(),
        usuario : req.usuarioLogeado._id //Recordemos que cuando validamos el JWT,guardamos al usuario logeado, por tanto, el usuario contiene el ID de mongo, este es el que vamos a guardar para la referencia.
    }

    //Instancio y guardo en la base de datos mongo
    const productoGuardar = new Producto( data );
    await productoGuardar.save();

    res.status(201).json({
        msg : 'POST API - Productos - Desde el controlador - Todo OK',
        usuarioAutenticado : req.usuarioLogeado,
        myBody : body,
        result: productoGuardar
    });

}

const actualizarProducto = async(req = request, res = response) => {

    //El parámetro que nos debe llegar por URL
    const { id } = req.params;
    //Extraigo el estado y usuario que no se puede actualizar y el resto lo separo ...
    const { estado, usuario, ...resto } = req.body;

    //Si nos viene el nombre capitalizamos
    if( resto.nombre ){
        resto.nombre = resto.nombre.toUpperCase();
    }

    resto.usuario = req.usuarioLogeado._id; //Enviamos el usuario inmediatamente autenticado

    const producto = await Producto.findByIdAndUpdate(id , resto , {new: true});

    res.status(200).json({
        msg : 'PUT API - Productos - Desde el controlador - Todo OK',
        result: producto,
        usuarioAutenticado : req.usuarioLogeado
    });

}

const eliminarProducto = async(req = request, res = response) => {

    //El parámetro que nos debe llegar por URL
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id , {estado : false} , {new: true});

    res.status(200).json({
        msg : 'DELETE API - Productos - Desde el controlador - Todo OK',
        result: producto,
        usuarioAutenticado : req.usuarioLogeado
    });

}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductosPorId,
    actualizarProducto,
    eliminarProducto
}