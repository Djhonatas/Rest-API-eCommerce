const express = require('express')
const router = express.Router()

const UsuariosCrontroller = require('../controller/usuarios-controller')

router.post('/cadastro', UsuariosCrontroller.cadastrarUsuario)

router.post('/login', UsuariosCrontroller.Login)

module.exports = router