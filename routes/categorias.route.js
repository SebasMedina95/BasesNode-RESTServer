const  { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoriasPorId, 
        actualizarCategoria, 
        eliminarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, 
        validarCampos, 
        tieneRole } = require('../middlewares');

const router = Router();

//Validamos Middleware personalizado - Si Existe Categoria

router.get('/', [
    validarJWT,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL', 'USER_ROL'),
], obtenerCategorias)

// Obtener una categoría por ID
router.get('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL', 'USER_ROL'),
    check('id', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('id').custom( (id) => existeCategoriaPorId(id) ),
    validarCampos
], obtenerCategoriasPorId)

// Agregar una nueva categoría - privado - cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre de la categoría es obligatoria').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar categoría por ID - privado - cualquier persona con token válido
router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('id').custom( (id) => existeCategoriaPorId(id) ),
    validarCampos
], actualizarCategoria)

// Eliminar categoría por ID - privado - cualquier persona con token válido y que sea ADMIN
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROL' , 'VENTAS_ROL'),
    check('id', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('id').custom( (id) => existeCategoriaPorId(id) ),
    validarCampos
], eliminarCategoria)





module.exports = router;