const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL ); //Configuramos con mi cuenta de Cloudinary

const { response, request } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');


const cargarArchivo = async(req = request, res = response) => {

    //Impresión de guía
    // console.log('req.files >>>', req.files); // eslint-disable-line

    try {
        
        //Llamamos la subida que nos viene desde los helpers
        const archivoSubido = await subirArchivo(req.files , ['jpg' , 'png'], 'imagenes');

        res.status(201).json({
            msg : 'Se cargó el archivo exitodamente',
            archivoSubido
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg : "Se encontraron errores con la petición",
            error
        })
    }

}

const actualizarImagen = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    //Obtengo el usuario autenticado
    //Recordemos que nos viene desde el token JWT
    const usuarioAutenticado = req.usuarioLogeado;

    let modelo; //Condicional

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : "No existe un usuario con el ID",
                    error : `ID ${id} no encontrado o errado!.`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : "No existe un producto con el ID",
                    error : `ID ${id} no encontrado o errado!.`
                })
            }
        break;

        default:
            return res.status(500).json({
                msg : "Colección inválida",
                error : `La colección ${coleccion} es errada!.`
            })

    }

    //Limpiar imágenes previas.
    //Si existe, deberíamos eliminar la que hay para poner la nueva con tranquilidad
    if( modelo.img ){
        //Borrar la imagen del server
        //Primero ubicamos el path, pero tengamos en cuenta que posiblemente no existiría, por eso hago otra validación
        const pathImagen = path.join(__dirname, '../uploads', coleccion,  modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync( pathImagen ); //Eliminamos si existe la imagen
        }
    }

    //Si pasamos el filtro, realizamos entonces la actualización con base a la propiedad img
    const archivoSubido = await subirArchivo(req.files , ['jpg' , 'png'], coleccion);
    modelo.img = archivoSubido;

    await modelo.save();

    res.status(200).json({
        msg: 'Foto actualizada satisfactoriamente',
        coleccion,
        id,
        usuarioAutenticado,
        modelo
    })

}

const mostrarImagen = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    //Obtengo el usuario autenticado
    //Recordemos que nos viene desde el token JWT
    const usuarioAutenticado = req.usuarioLogeado;

    let modelo; //Condicional

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : "No existe un usuario con el ID",
                    error : `ID ${id} no encontrado o errado!.`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : "No existe un producto con el ID",
                    error : `ID ${id} no encontrado o errado!.`
                })
            }
        break;

        default:
            return res.status(500).json({
                msg : "Colección inválida",
                error : `La colección ${coleccion} es errada!.`
            })

    }

    //Limpiar imágenes previas.
    //Si existe, deberíamos eliminar la que hay para poner la nueva con tranquilidad
    const pathImagenDefault = path.join(__dirname, '../assets', 'img-default', 'no-image.jpg');
    if( modelo.img ){
        //Borrar la imagen del server
        //Primero ubicamos el path, pero tengamos en cuenta que posiblemente no existiría, por eso hago otra validación
        const pathImagen = path.join(__dirname, '../uploads', coleccion,  modelo.img);
        if(fs.existsSync(pathImagen)){
            
            //Necesito responder la imagen
            return res.sendFile( pathImagen )

        }else{

            //Me traería la imagen por defecto
            return res.sendFile( pathImagenDefault )

        }
    }else{

        //Me traería la imagen por defecto
        return res.sendFile( pathImagenDefault )

    }

    // res.json({
    //     msg: 'Falta el placeholder ...'
    // })

}

//A diferencia del de arriba, este nos va a guardar en la cuenta de Cloudinary
//y configuramos los elementos necesarios
const actualizarImagenCloudinary = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    //Obtengo el usuario autenticado
    //Recordemos que nos viene desde el token JWT
    const usuarioAutenticado = req.usuarioLogeado;

    let modelo; //Condicional

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : "No existe un usuario con el ID",
                    error : `ID ${id} no encontrado o errado!.`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : "No existe un producto con el ID",
                    error : `ID ${id} no encontrado o errado!.`
                })
            }
        break;

        default:
            return res.status(500).json({
                msg : "Colección inválida",
                error : `La colección ${coleccion} es errada!.`
            })

    }

    //Limpiar imágenes previas.
    //Si existe, deberíamos eliminar la que hay para poner la nueva con tranquilidad
    if( modelo.img ){
        //Borrar la imagen del server de cloudinary
        const nombreArr = modelo.img.split('/'); //La url completa separa por /
        const nombre = nombreArr[nombreArr.length - 1]; //Al final tenemos la imagen con su extension
        const [ name , ext ] = nombre.split('.'); //Separo la extensión de la imagen y lo que me queda es el nombre de la imagen, el cual, viene siendo en últimas el mismo id que asigna cloudinary
        console.log(name); 
        console.log(ext); 

        //Borramos con una función propia de cloudinary
        await cloudinary.uploader.destroy(name);
    }

    // Cuando le aplicamos un console.log a req.files.archivo, nos encontramos varias propiedades que nos puede traer
    // las imágenes como tal, sin embargo, podríamos mandar a cloudinary el atributo buffer que tiene la imagen
    // o también podríamos enviar el archivo temporal que se nos genera en el atributo tempFilePath, este último
    // es el que vamos a usar para este caso
    const { tempFilePath } = req.files.archivo;
    const { secure_url, ...resto } = await cloudinary.uploader.upload( tempFilePath ); //Devuelve una promesa y secure_url traería la imagen que nos queda guardada
    modelo.img = secure_url;

    await modelo.save();

    res.status(200).json({
        msg: 'Foto actualizada satisfactoriamente',
        coleccion,
        id,
        usuarioAutenticado,
        modelo,
        cloudinaryUrl : secure_url,
        cloudinaryGeneral : resto
    })

}

const mostrarImagenCloudinary = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    //Obtengo el usuario autenticado
    //Recordemos que nos viene desde el token JWT
    const usuarioAutenticado = req.usuarioLogeado;

    let modelo; //Condicional

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : "No existe un usuario con el ID",
                    error : `ID ${id} no encontrado o errado!.`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg : "No existe un producto con el ID",
                    error : `ID ${id} no encontrado o errado!.`
                })
            }
        break;

        default:
            return res.status(500).json({
                msg : "Colección inválida",
                error : `La colección ${coleccion} es errada!.`
            })

    }

    //Limpiar imágenes previas.
    //Si existe, deberíamos eliminar la que hay para poner la nueva con tranquilidad
    const pathImagenDefault = path.join(__dirname, '../assets', 'img-default', 'no-image.jpg');
    if( modelo.img ){
        
        return res.redirect(modelo.img)

    }else{

        //Me traería la imagen por defecto
        return res.sendFile( pathImagenDefault )

    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
}