const  { Router } = require('express');
const { buscar } = require('../controllers/buscar.controller');
const { validarJWT, 
        validarCampos, 
        tieneRole } = require('../middlewares');

const router = Router();


router.get('/' , [
    validarJWT,
], buscar)


router.get('/:coleccion/:termino' , [
    validarJWT,
], buscar)


module.exports = router;

