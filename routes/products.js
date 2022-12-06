const express = require('express')
const router = express.Router()
const multer = require('multer')
const login = require('../middleware/login')


const ProductsController = require('../controller/produtos-controller')

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

router.get(
  '/',
  ProductsController.getProducts)//RETORNA TODOS OS PRODUTOS

router.post(
  '/',
  login.obrigatorio,
  upload.single('produtoImagem'),
  ProductsController.postProduto
)//INSERE UM PRODUTO

router.get('/:id_produto', ProductsController.getUmProduto)//RETORNA OS DADOS DE UM PRODUTO
router.patch('/', login.obrigatorio, ProductsController.updateProduto)//ALTERAR UM PRODUTO
router.delete('/', login.obrigatorio, ProductsController.deleteProduto)//EXCLUI UM PRODUTO

router.post(
  '/:id_produto/imagem',
  login.obrigatorio,
  upload.single('produtoImagem'),
  ProductsController.postImagem
)

module.exports = router