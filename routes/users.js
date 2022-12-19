const express = require('express')
const router = express.Router()

const UsersController = require('../controller/users-controller')

router.post('/', UsersController.createdUser)
router.post('/login', UsersController.Login)

module.exports = router