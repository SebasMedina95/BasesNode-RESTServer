const  { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, 
        actualizarImagen, //Remplazadas para imagenes Cloudinary
        mostrarImagen, //Remplazadas para imagenes Cloudinary
        actualizarImagenCloudinary,
        mostrarImagenCloudinary} = require('../controllers/subidas.controller');
const { coleccionesPermitidas } = require('../helpers');

const { validarJWT, 
        validarCampos, 
        tieneRole,
        validarArchivoSubida } = require('../middlewares');

const router = Router();


router.post('/' , [
    validarJWT,
    validarArchivoSubida
], cargarArchivo)

router.put('/:coleccion/:id' , [
    validarJWT,
    validarArchivoSubida,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL'),
    check('id' , 'El ID debe ser un ID de Mongo').isMongoId(),
    //Realizamos esta validacion para solo permitir las colecciones que son permitidas en la API
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios' , 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    validarJWT,
    check('id' , 'El ID debe ser un ID de Mongo').isMongoId(),
    //Realizamos esta validacion para solo permitir las colecciones que son permitidas en la API
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios' , 'productos'] ) ),
    validarCampos
], mostrarImagenCloudinary)


module.exports = router;