//Para tener de cierto modo "el tipado"
const { response, request } = require('express');
const { Categoria } = require('../models')

//Obtener Categorías - Paginado - Verse el total - Populate
//Obtener Categoría  - Populate
//Actualizar Categoría
//Borrar Categoría - Cambiar estado a false

const obtenerCategorias = async(req = request, res = response) =>{

    const { limite = 5 } = req.query;
    const q = { estado : true };

    // const categorias = await Categoria.countDocuments().limit(Number(limite))
    const [ total , categorias ] = await Promise.all([
        Categoria.countDocuments(),
        Categoria.find(q)
        .limit(Number(limite))
        .populate('usuario' , 'nombre')
        .exec()
    ]);

    //Obtengo el usuario autenticado
    const usuarioAutenticado = req.usuarioLogeado;

    res.json({
        msg : 'GET API - Categorías - Desde el controlador - Todo OK',
        usuarioAutenticado,
        limitadoPor : limite,
        totalColeccion : total,
        categorias
    });

}

const obtenerCategoriasPorId = async(req = request, res = response) =>{

    //Viene en los params, y seleccionamos el nombre que le dimos en la ruta '/:id',  usuariosPut
    const { id } = req.params;

    //Obtengo el usuario autenticado
    const usuarioAutenticado = req.usuarioLogeado;

    const categoriaDB = await Categoria.findById( id ).populate('usuario' , 'nombre');

    res.status(200).json({
        msg : 'GET API - Categorías (Obtenida por ID) - Desde el controlador - Todo OK',
        result: categoriaDB,
        usuarioAutenticado
    });

}

const crearCategoria = async(req = request, res = response) => {

    //Vamos a capturar lo que nos llega en la petición
    const body = req.body;
    const nombreUpper = body.nombre.toUpperCase(); //Para guardar en mayúsculas

    // console.log("........ " , nombreUpper);

    //Vamos a revisar primero que no haya una misma categoría en la BD
    const categoriaDB = await Categoria.findOne({ nombre : nombreUpper });

    // console.log("........ " , categoriaDB);

    if( categoriaDB ){
        return res.status(400).json({
            msg : `La categoría ${categoriaDB.nombre} ya existe en la BD Mongo`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre : nombreUpper,
        usuario : req.usuarioLogeado._id //Recordemos que cuando validamos el JWT,guardamos al usuario logeado, por tanto, el usuario contiene el ID de mongo, este es el que vamos a guardar para la referencia.
    }

    //Instancio y guardo en la base de datos mongo
    const categoriaGuardar = new Categoria( data );
    await categoriaGuardar.save();

    res.status(201).json({
        msg : 'POST API - Categorías - Desde el controlador - Todo OK',
        myBody : body,
        result: categoriaGuardar,
        usuarioAutenticado : req.usuarioLogeado
    });

}

const actualizarCategoria = async(req = request, res = response) => {

    //El parámetro que nos debe llegar por URL
    const { id } = req.params;
    //Extraigo el estado y usuario que no se puede actualizar y el resto lo separo ...
    const { estado, usuario, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuarioLogeado._id; //Enviamos el usuario inmediatamente autenticado

    const categoria = await Categoria.findByIdAndUpdate(id , resto , {new: true});

    res.status(200).json({
        msg : 'PUT API - Categorías - Desde el controlador - Todo OK',
        result: categoria,
        usuarioAutenticado : req.usuarioLogeado
    });

}

const eliminarCategoria = async(req = request, res = response) => {

    //El parámetro que nos debe llegar por URL
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id , {estado : false} , {new: true});

    res.status(200).json({
        msg : 'DELETE API - Categorías - Desde el controlador - Todo OK',
        result: categoria,
        usuarioAutenticado : req.usuarioLogeado
    });

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasPorId,
    actualizarCategoria,
    eliminarCategoria
}