const mysql = require('../mysql')

//=======================ROTA PARA VISUALIZAR TODOS OS PEDIDOS=================================//

exports.getOrders = async (req, res, next) => {
  try {
    const query = `SELECT orders.orderId,
                          orders.quantity,
                          products.productId,
                          products.name, 
                          products.price
                     FROM orders
               INNER JOIN products
                       ON products.productId = orders.productId`
    const result = await mysql.execute(query)
    const response = {
      orders: result.map(ped => {
        return {
          orderId: ped.id_orders,
          quantity: ped.quantity,
          product: {
            productId: ped.productId,
            name: ped.name,
            price: ped.price
          },
          Request: {
            type: 'GET',
            description: 'Retorna os detalhes de um pedido específico',
            url: process.env.URL_API + 'orders/' + ped.id_orders
          }
        }
      })
    }
    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}

//================================= ROTA PARA INSERIR PEDIDOS ================================================//

exports.postOrders = async (req, res, next) => {
  try {
    const queryproducts = 'SELECT * FROM products WHERE productId = ?'
    const resultproducts = await mysql.execute(queryproducts, [req.body.productId])

    if (resultproducts.length == 0) {
      return res.status(404).send({ message: "product não encontrado" })
    }

    const queryorders = 'INSERT INTO orders (productId, quantity) VALUES (?,?)'
    const resultorders = await mysql.execute(queryorders, [req.body.productId, req.body.quantity])

    const response = {
      message: 'Pedido inserido com sucesso',
      createdOrder: {
        orderId: resultorders.orderId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        Request: {
          type: 'GET',
          description: 'Retorna todos os orders',
          url: process.env.URL_API + 'orders'
        }
      }
    }
    return res.status(201).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}


//================================= ROTA PARA RETORNAR PEDIDO ESPECÍFICO ================================================//

exports.getOrderDetail = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM orders WHERE orderId = ?'
    const result = await mysql.execute(query, [req.params.orderId])

    if (result.length == 0) {
      return res.status(404).send({
        message: "Não foi encontrado order com este ID"
      })
    }
    console.log(result)
    const response = {
      order: {
        orderId: result[0].orderId,
        productId: result[0].productId,
        quantity: result[0].quantity,
        Request: {
          type: 'GET',
          description: 'Retorna um order específico',
          url: process.env.URL_API + 'orders'
        }
      }
    }
    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error })
  }
}



//================================= ROTA PARA DELETAR PEDIDO ESPECÍFICO ================================================//

exports.deleteOrder = async (req, res, next) => {
  try {
    const query = `DELETE FROM orders WHERE orderId = ?`
    await mysql.execute(query, [req.params.orderId])

    const response = {
      message: 'Peiddo removido com sucesso',
      request: {
        type: 'POST',
        description: 'Insere um product',
        url: process.env.URL_API + 'orders',
        body: {
          productId: 'Number',
          quantity: 'Number'
        }
      }
    }
    return res.status(202).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}