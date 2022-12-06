const express = require('express')
const router = express.Router()

const UsersController = require('../controller/usuarios-controller')

router.post('/', UsersController.createUser)
router.post('/login', UsersController.Login)

module.exports = router