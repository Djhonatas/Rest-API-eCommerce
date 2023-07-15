const express = require('express')
const router = express.Router()

const UsersController = require('../controller/users-controller')

router.post('/signup', UsersController.createdUser)
router.post('/login', UsersController.Login)

module.exports = router