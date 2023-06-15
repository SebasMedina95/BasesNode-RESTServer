//Para crearnos una "instancia" de nuestro Router
const  { Router } = require('express');
const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios.controller');

const router = Router();

router.get('/',  usuariosGet); //No ejecutamos de forma directa, mandamos una referencia a la misma
router.put('/:myId',  usuariosPut); //No ejecutamos de forma directa, mandamos una referencia a la misma
router.post('/',  usuariosPost); //No ejecutamos de forma directa, mandamos una referencia a la misma
router.delete('/',  usuariosDelete); //No ejecutamos de forma directa, mandamos una referencia a la misma
router.patch('/',  usuariosPatch); //No ejecutamos de forma directa, mandamos una referencia a la misma


module.exports = router;