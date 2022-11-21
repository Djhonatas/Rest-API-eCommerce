const express = require('express')
const router = express.Router()
const multer = require('multer')
const login = require('../middleware/login')

const ProdutosController = require('../controller/produtos-controller')

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
  ProdutosController.getProdutos)//RETORNA TODOS OS PRODUTOS

router.post(
  '/',
  login.obrigatorio,
  upload.single('produtoImagem'),
  ProdutosController.postProduto)//INSERE UM PRODUTO

router.get(
  '/:id_produto',
  ProdutosController.getUmProduto)//RETORNA OS DADOS DE UM PRODUTO

router.patch(
  '/',
  login.obrigatorio,
  ProdutosController.updateProduto)//ALTERAR UM PRODUTO

router.delete(
  '/',
  login.obrigatorio,
  ProdutosController.deleteProduto)//EXCLUI UM PRODUTO

module.exports = router