const mysql = require('../mysql').pool

//CONTROLLER QUE RETORNA TODOS OS PRODUTOS
exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(`SELECT pedidos.id_pedidos,
                       pedidos.quantidade,
                       produtos.id_produtos,
                       produtos.nome, 
                       produtos.preco
                  FROM pedidos
            INNER JOIN produtos
                    ON produtos.id_produtos = pedidos.id_produtos`,
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
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
                url: process.env.URL_API + 'produtos/' + ped.id_pedidos
              }
            }
          })
        }
        return res.status(200).send(response)
      }
    )
  })
}

//CONTROLLER PARA INSERIR PRODUTOS NA TABELA
exports.postPedidos = (req, res, next) => {

  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM produtos WHERE id_produtos = ?',
      [req.body.id_produtos],
      (error, result, field) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Produto não encontrado"
          })
        }
        conn.query(
          'INSERT INTO pedidos (id_produtos, quantidade) VALUES (?,?)',
          [req.body.id_produtos, req.body.quantidade],
          (error, result, field) => {
            conn.release()
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
              mensagem: 'Pedido inserido com sucesso',
              pedidoCriado: {
                id_pedido: result.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                Request: {
                  tipo: 'GET',
                  descricao: 'REtorna todos os pedidos',
                  url: process.env.URL_API + 'pedidos'
                }
              }
            }
            return res.status(201).send(response)
          }
        )
      })
  })
}

exports.getUmPedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM pedidos WHERE id_pedidos = ?',
      [req.params.id_pedido],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado pedido com este ID"
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

      }
    )
  })
}

exports.deletePedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) } //se não conseguir conectar no banco de dados, retorna erro 500
    conn.query(
      `DELETE FROM pedidos WHERE id_pedidos = ?`, [req.body.id_pedido],
      (error, result, field) => {
        conn.release()
        if (error) { return res.status(500).send({ error: error }) }//Erro 500 se tiver erro na query
        const response = {
          mensagem: 'Peiddo removido com sucesso',
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
      }
    )
  })
}