const mysql = require('../mysql')

exports.getProdutos = async (req, res, next) => {
  try {
    const result = await mysql.execute("SELECT * FROM produtos")
    const response = {
      quantidade: result.length,
      produtos: result.map(prod => {
        return {
          id_produto: prod.id_produtos,
          nome: prod.nome,
          preco: prod.preco,
          imagem_produto: prod.imagem_produto,
          Request: {
            tipo: 'GET',
            descricao: 'Retorna os detalhes de um produto específico',
            url: process.env.URL_API + 'produtos/' + prod.id_produtos
          }
        }
      })
    }
    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}

exports.postProduto = async (req, res, next) => {
  try {
    const query = 'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)'
    const result = await mysql.execute(query, [
      req.body.nome,
      req.body.preco,
      req.file.path
    ])
    console.log(result)
    const response = {
      mensagem: 'Produto inserido com sucesso',
      produtoCriado: {
        id_produto: result.id_produtos,
        nome: req.body.nome,
        preco: req.body.preco,
        imagem_produto: req.file.path,
        Request: {
          tipo: 'GET',
          descricao: 'Retorna todos os produtos',
          url: process.env.URL_API + 'produtos'
        }
      }
    }
    return res.status(201).send(response)
  } catch (error) {
    console.error(error)
    return res.status(500).send({ error: error })
  }
}

exports.getUmProduto = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM produtos WHERE id_produtos = ?'
    const result = await mysql.execute(query, [req.params.id_produto])
    if (result.length == 0) {
      return res.status(404).send({
        mensagem: "Não foi encontrado produto com este ID"
      })
    }

    const response = {
      produto: {
        id_produto: result[0].id_produtos,
        nome: result[0].nome,
        preco: result[0].preco,
        imagem_produto: result[0].imagem_produto,
        Request: {
          tipo: 'GET',
          descricao: 'Retorna todos os produtos',
          url: process.env.URL_API + 'produtos'
        }
      }
    }
    return res.status(200).send(response)
  } catch (error) {
    console.error(error)
    return res.status(500).send({ error: error })
  }
}

exports.updateProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      `UPDATE produtos
        SET nome          = ?, 
            preco         = ?
        WHERE id_produtos  = ?`,
      [
        req.body.nome,
        req.body.preco,
        req.body.id_produtos
      ],
      (error, result, field) => {
        conn.release()
        if (error) { return res.status(500).send({ error: error }) }
        const response = {
          mensagem: 'Produto atualizado com sucesso',
          produtoAtualizado: {
            id_produto: req.body.id_produtos,
            nome: req.body.nome,
            preco: req.body.preco,
            Request: {
              tipo: 'GET',
              descricao: 'Retorna os detalhes de um produto específico',
              url: process.env.URL_API + 'produtos/' + req.body.id_produtos
            }
          }
        }
        return res.status(200).send(response)
      }
    )
  })
}

exports.deleteProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `DELETE FROM produtos WHERE id_produtos = ?`, [req.body.id_produtos],
      (error, result, field) => {
        conn.release()
        if (error) { return res.status(500).send({ error: error }) }
        const response = {
          mensagem: 'Produto removido com sucesso',
          request: {
            tipo: 'POST',
            descricao: 'Insere um produto',
            url: process.env.URL_API + 'produtos',
            body: {
              nome: 'String',
              preco: 'Number'
            }
          }
        }
        return res.status(202).send(response)
      }
    )
  })
}