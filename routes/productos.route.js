const  { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, 
        obtenerProductos, 
        obtenerProductosPorId, 
        actualizarProducto, 
        eliminarProducto } = require('../controllers/productos.controller');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, 
        validarCampos, 
        tieneRole } = require('../middlewares');

const router = Router();

//Validamos Middleware personalizado - Si Existe Categoria

router.get('/', [
    validarJWT,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL', 'USER_ROL'),
], obtenerProductos)

// Obtener una producto por ID
router.get('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL', 'USER_ROL'),
    check('id', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('id').custom( (id) => existeProductoPorId(id) ),
    validarCampos
], obtenerProductosPorId)

// Agregar una nueva producto - privado - cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatoria').not().isEmpty(),
    check('categoria', 'EL ID proporcionado de categoría NO es un ID válido de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto)

// Actualizar producto por ID - privado - cualquier persona con token válido
router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL'),
    check('categoria').optional().custom( existeCategoriaPorId ), //CAMPO OPCIONAL !! Buena forma validar :)
    check('id', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('id').custom( (id) => existeProductoPorId(id) ),
    validarCampos
], actualizarProducto)

// Eliminar categoría por ID - privado - cualquier persona con token válido y que sea ADMIN
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL'),
    check('id', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('id').custom( (id) => existeProductoPorId(id) ),
    validarCampos
], eliminarProducto)





module.exports = router;