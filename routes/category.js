const express = require('express')
const router = express.Router()
const login = require('../middleware/login')

const CategoriesController = require('../controller/category-controller')

router.get('/', CategoriesController.getCategories)
router.post('/', login.required, CategoriesController.postCategory)



module.exports = router