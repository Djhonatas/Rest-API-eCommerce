const express = require('express')
const router = express.Router()
const PedidosController = require('../controller/pedidos-controller')

router.get('/', PedidosController.getPedidos)//RETORNA TODOS OS PEDIDOS
router.post('/', PedidosController.postPedidos)//INSERE UM PEDIDO
router.get('/:id_pedido', PedidosController.getUmPedido)//RETORNA OS DADOS DE UM pedido 
router.delete('/', PedidosController.deletePedido)//EXCLUI UM PEDIDO

module.exports = router