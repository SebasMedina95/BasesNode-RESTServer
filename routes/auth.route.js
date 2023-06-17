const  { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.post('/login', [
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio para el login').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'El ID Token de Google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;