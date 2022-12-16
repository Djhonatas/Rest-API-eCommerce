const mysql = require('../mysql')

//CONTROLLER QUE RETORNA TODOS OS PRODUTOS
exports.getPedidos = async (req, res, next) => {
  try {
    const query = `SELECT pedidos.id_pedidos,
                          pedidos.quantidade,
                          produtos.id_produtos,
                          produtos.nome, 
                          produtos.preco
                     FROM pedidos
               INNER JOIN produtos
                       ON produtos.id_produtos = pedidos.id_produtos`
    const result = await mysql.execute(query)
    const response = {
      pedidos: result.map(ped => {
        return {
          id_pedido: ped.id_pedidos,
          quantidade: ped.quantidade,
          produto: {
            id_produto: ped.id_produtos,
            nome: ped.nome,
            preco: ped.preco
          },
          Request: {
            tipo: 'GET',
            descricao: 'Retorna os detalhes de um pedido específico',
            url: process.env.URL_API + 'pedidos/' + ped.id_pedidos
          }
        }
      })
    }
    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}

//CONTROLLER PARA INSERIR PRODUTOS NA TABELA
exports.postPedidos = async (req, res, next) => {
  try {
    const queryProdutos = 'SELECT * FROM produtos WHERE id_produtos = ?'
    const resultProdutos = await mysql.execute(queryProdutos, [req.body.id_produtos])

    if (resultProdutos.length == 0) {
      return res.status(404).send({ message: "Produto não encontrado" })
    }

    const queryPedidos = 'INSERT INTO pedidos (id_produtos, quantidade) VALUES (?,?)'
    const resultPedidos = await mysql.execute(queryPedidos, [req.body.id_produtos, req.body.quantidade])

    const response = {
      message: 'Pedido inserido com sucesso',
      pedidoCriado: {
        id_pedido: resultPedidos.id_pedido,
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade,
        Request: {
          tipo: 'GET',
          descricao: 'Retorna todos os pedidos',
          url: process.env.URL_API + 'pedidos'
        }
      }
    }
    return res.status(201).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}

exports.getUmPedido = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM pedidos WHERE id_pedidos = ?'
    const result = await mysql.execute(query, [req.params.id_pedido])

    if (result.length == 0) {
      return res.status(404).send({
        message: "Não foi encontrado pedido com este ID"
      })
    }

    const response = {
      pedido: {
        id_pedido: result[0].id_pedido,
        id_produto: result[0].id_produtos,
        quantidade: result[0].quantidade,
        Request: {
          tipo: 'GET',
          descricao: 'Retorna um pedido específico',
          url: process.env.URL_API + 'pedidos'
        }
      }
    }
    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}

exports.deletePedido = async (req, res, next) => {
  try {
    const query = `DELETE FROM pedidos WHERE id_pedidos = ?`
    await mysql.execute(query, [req.body.id_pedido])

    const response = {
      message: 'Peiddo removido com sucesso',
      request: {
        tipo: 'POST',
        descricao: 'Insere um produto',
        url: process.env.URL_API + 'pedidos',
        body: {
          id_produtos: 'Number',
          quantidade: 'Number'
        }
      }
    }
    return res.status(202).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}