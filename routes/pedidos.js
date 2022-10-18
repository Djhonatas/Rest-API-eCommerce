const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool


//RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM pedidos',
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        const response = {
          quantidade: result.length,
          pedidos: result.map(ped => {
            return {
              id_pedido: ped.id_pedidos,
              id_produto: ped.id_produtos,
              quantidade: ped.quantidade,
              Request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um pedido específico',
                url: 'https://localhost:3000/produtos/' + ped.id_pedidos
              }
            }
          })
        }
        return res.status(200).send(response)
      }
    )
  })
})

//INSERE UM PEDIDO
router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'INSERT INTO pedidos (id_produtos, quantidade) VALUES (?,?)',
      [req.body.id_produto, req.body.quantidade],
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
              url: 'https://localhost:3000/pedidos'
            }
          }
        }
        return res.status(201).send(response)
      }
    )
  })
})

//RETORNA OS DADOS DE UM pedido 
router.get('/:id_pedido', (req, res, next) => {
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
            id_produtos: result[0].id_produtos,
            quantidade: result[0].quantidade,
            Request: {
              tipo: 'GET',
              descricao: 'Retorna um pedido específico',
              url: 'https://localhost:3000/pedido'
            }
          }
        }
        return res.status(200).send(response)

      }
    )
  })
})

//EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `DELETE FROM pedidos WHERE id_pedidos = ?`, [req.body.id_pedido],
      (error, result, field) => {
        conn.release()
        if (error) { return res.status(500).send({ error: error }) }
        const response = {
          mensagem: 'Peiddo removido com sucesso',
          request: {
            tipo: 'POST',
            descricao: 'Insere um produto',
            url: 'https://localhost:3000/pedidos',
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
})

module.exports = router