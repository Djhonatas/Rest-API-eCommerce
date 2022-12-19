const express = require('express')
const router = express.Router()

const OrderController = require('../controller/orders-controller')

router.get('/', OrderController.getOrders)//RETORNA TODOS OS PEDIDOS
router.post('/', OrderController.postOrders)//INSERE UM PEDIDO
router.get('/:orderId', OrderController.getOrderDetail)//RETORNA OS DADOS DE UM pedido 
router.delete('/:orderId', OrderController.deleteOrder)//EXCLUI UM PEDIDO

module.exports = router