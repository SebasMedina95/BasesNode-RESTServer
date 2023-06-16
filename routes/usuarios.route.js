//Para crearnos una "instancia" de nuestro Router
const  { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios.controller');
const { esRolValido, emailValido, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Distribución:
// En el primer elemento tenemos la ruta, en la segundo el middleware y en la tercera la acción

router.get('/',  usuariosGet); //No ejecutamos de forma directa, mandamos una referencia a la misma

router.put('/:myId', [
    //Debemos verificar primeramente el ID, este debe ser válido
    check('myId', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('myId').custom( (myId) => existeUsuarioPorId(myId) ),
    check('rol').custom( (rol) => esRolValido(rol) ),
    validarCampos //Dejamos para el final los personalizados que nosotros mismos creamos, para mostrar TODOS los errores
], usuariosPut); //No ejecutamos de forma directa, mandamos una referencia a la misma

//Como podemos tener varias validaciones con el check (De express validator), entonces usamos un arreglo []
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe ser texto').not().isNumeric(),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min:6 }),
    check('correo', 'El correo no es valido').isEmail(),
    //check('rol', 'El rol seleccionado no es un rol válido').isIn(['ADMIN_ROLE' , 'USER_ROLE']),
    //Podríamos obvear el tema del nombre rol, porque es el mismo nombre, pero por temas de entendimiento lo dejo
    //pero con solo llamar esRolValido así tal cual se entendería, lo mismo para emailValido
    check('rol').custom( (rol) => esRolValido(rol) ),
    check('correo').custom( (correo) => emailValido(correo) ),
    validarCampos //Dejamos para el final los personalizados que nosotros mismos creamos, para mostrar TODOS los errores
], usuariosPost); //No ejecutamos de forma directa, mandamos una referencia a la misma

router.delete('/:myId', [
    //Debemos verificar primeramente el ID, este debe ser válido
    check('myId', 'EL ID proporcionado NO es un ID válido de Mongo').isMongoId(),
    check('myId').custom( (myId) => existeUsuarioPorId(myId) ),
    validarCampos //Dejamos para el final los personalizados que nosotros mismos creamos, para mostrar TODOS los errores
], usuariosDelete); //No ejecutamos de forma directa, mandamos una referencia a la misma

router.patch('/',  usuariosPatch); //No ejecutamos de forma directa, mandamos una referencia a la misma


module.exports = router;