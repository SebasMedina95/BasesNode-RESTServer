const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types; //Para consultar por Mongoose
const { Usuario, Categoria, Producto } = require('../models')


//Para las colecciones permitidas
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productosPorCategoria',
    'roles'
]

//Para realizar la interacción directa con la BD
//Deb recibir la response porque, una vez realizada la busqueda, entonces me salgo del procedimiento,
//ya que desde acá también obtendremos respuesta cuando llamemos desde el switch
const buscarUsuairos = async( coleccion = '' , termino = '' , res = response ) => {

    // Ese termino lo vamos a buscar a nivel de MongoID
    const esMongoId = ObjectId.isValid( termino );

    if(esMongoId){

        //Buscamos el usaurio
        const usuario = await Usuario.findById(termino);
        return res.json({
            coleccion,
            termino,
            results: 
                (usuario) ? [usuario] : [], //Si tenemos resultados por ID
        });

    }

    //Vamos a apoyarnos de una expresión regular para hacer la consulta insensible
    //Le mandamos el termino y el 'i' para que sea insensible a Mayusculas y Minusculas
    const regex = new RegExp(termino , 'i');

    //Buscamos por termino, podría ser nombre, correo ...
    const usuarios = await Usuario.find({ 
        //Condicion OR, cumple que pueda buscar por nombre O por correo O por rol
        //En ambas busquedas, el estado debe estar activo, en true. O mas elegante con $and
        $or: [{ nombre : regex /*, estado: true*/ } , 
              { correo : regex /*, estado: true*/  } ,
              { rol : regex /*, estado: true*/  }
             ],
        $and: [{ estado: true }]
    });

    const cantidad = usuarios.length;

    return res.json({
        coleccion,
        termino,
        cantidad,
        results: usuarios //Si tenemos resultados, el find siempre devuelve un array
    });

}

const buscarCategorias = async( coleccion = '' , termino = '' , res = response ) => {

    // Ese termino lo vamos a buscar a nivel de MongoID
    const esMongoId = ObjectId.isValid( termino );

    if(esMongoId){

        //Buscamos la categoria
        const categoria = await Categoria.findById(termino);
        return res.json({
            coleccion,
            termino,
            results: 
                (categoria) ? [categoria] : [], //Si tenemos resultados por ID
        });

    }

    //Vamos a apoyarnos de una expresión regular para hacer la consulta insensible
    //Le mandamos el termino y el 'i' para que sea insensible a Mayusculas y Minusculas
    const regex = new RegExp(termino , 'i');

    //Buscamos por termino, podría ser nombre, correo ...
    const categorias = await Categoria.find({ nombre : regex , estado : true});

    const cantidad = categorias.length;

    return res.json({
        coleccion,
        termino,
        cantidad,
        results: categorias //Si tenemos resultados, el find siempre devuelve un array
    });

}

const buscarProductos = async( coleccion = '' , termino = '' , res = response ) => {

    // Ese termino lo vamos a buscar a nivel de MongoID
    const esMongoId = ObjectId.isValid( termino );

    if(esMongoId){

        //Buscamos el usaurio
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
                                                         .populate('usuario', 'nombre');
        return res.json({
            coleccion,
            termino,
            results: 
                (producto) ? [producto] : [], //Si tenemos resultados por ID
        });

    }

    //Vamos a apoyarnos de una expresión regular para hacer la consulta insensible
    //Le mandamos el termino y el 'i' para que sea insensible a Mayusculas y Minusculas
    const regex = new RegExp(termino , 'i');

    //Buscamos por termino, podría ser nombre, correo ...
    const productos = await Producto.find({ 
        //Condicion OR, cumple que pueda buscar por nombre O por correo O por rol
        //En ambas busquedas, el estado debe estar activo, en true. O mas elegante con $and
        $or: [{ nombre : regex /*, estado: true*/ } , 
              { descripcion : regex /*, estado: true*/  }
             ],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre')
      .populate('usuario', 'nombre');

    const cantidad = productos.length;

    return res.json({
        coleccion,
        termino,
        cantidad,
        results: productos //Si tenemos resultados, el find siempre devuelve un array
    });

}

const buscarProductosPorCategoria = async( coleccion = '' , termino = '' , res = response ) => {

    // Ese termino lo vamos a buscar a nivel de MongoID
    const esMongoId = ObjectId.isValid( termino );

    if(esMongoId){

        //Buscamos por la categoría
        const producto = await Producto.find( {categoria : termino} ).populate('categoria', 'nombre');
        return res.json({
            coleccion,
            termino,
            results: 
                (producto) ? [producto] : [], //Si tenemos resultados por ID
        });

    }

    //Vamos a apoyarnos de una expresión regular para hacer la consulta insensible
    //Le mandamos el termino y el 'i' para que sea insensible a Mayusculas y Minusculas
    const regex = new RegExp(termino , 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true});

    if(!categorias.length){
        return res.status(400).json({
            msg : 'No hay resultados con esta busqueda categoría ...'
        });
    }

    //Buscamos por termino, podría ser nombre, correo ...
    const productos = await Producto.find({ 
        estado: true,
        $and: [{ categoria: categorias._id }]
    }).populate('categoria', 'nombre');

    const cantidad = productos.length;

    return res.json({
        coleccion,
        termino,
        cantidad,
        results: productos //Si tenemos resultados, el find siempre devuelve un array
    });

}

//Esta busqueda será especial ya qyue buscaremos productos por categoría, es decir, buscaremos
//a través de una referencia, podría ser útil

const buscar = async(req = request, res = response) => {

    const { coleccion , termino } = req.params;

    if( !coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg : 'Error con la colección proporcionada ...',
            coleccionesPermitidas : coleccionesPermitidas,
        });
    }

    //TODO: Empiezo a buscar los terminos ...

    //Para validar la consulta de la colección, usemos switch
    switch(coleccion){
        case 'usuarios':
            buscarUsuairos(coleccion, termino, res);
        break;

        case 'categorias':
            buscarCategorias(coleccion, termino, res);
        break;

        case 'productos':
            buscarProductos(coleccion, termino, res);
        break;

        case 'productosPorCategoria':
            buscarProductosPorCategoria(coleccion, termino, res);
        break;

        default:
            return res.status(500).json({
                msg : 'Se me olvido hacer esta busqueda ... O quizás no fue implementada para este elemento'
            });
    }

    // return res.json({
    //     msg : 'Buscando en nuestra API ...',
    //     coleccion,
    //     termino
    // });

}

module.exports = {
    buscar
}