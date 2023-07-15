const express = require('express')
const router = express.Router()
const multer = require('multer')
const login = require('../middleware/login')


const ProductsController = require('../controller/products-controller')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    let data = new Date().toISOString().replace(/:/g, '-') + '-' //não sobreescrever arquivos que tenham o mesmo nome
    cb(null, data + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

router.get('/', ProductsController.getProducts)//RETORNA TODOS OS PRODUTOS
router.post('/api/products', login.required, upload.single('produtoImagem'), ProductsController.postProduct)//INSERE UM PRODUTO
router.get('/:productId', ProductsController.getProductDetail)//RETORNA OS DADOS DE UM PRODUTO
router.patch('/:productId', login.required, ProductsController.updateProduct)//ALTERAR UM PRODUTO
router.delete('/:productId', login.required, ProductsController.deleteProduct)//EXCLUI UM PRODUTO
router.post('/:productId/image', login.required, upload.single('imageProduct'), ProductsController.postImage)
router.get('/:productId/images', ProductsController.getImages)


module.exports = router