const mysql = require('../mysql')

exports.getProducts = async (req, res, next) => {
  try {
    const result = await mysql.execute("SELECT * FROM products")
    const response = {
      quantity: result.length,
      product: result.map(prod => { //prod = product
        return {
          productId: prod.productId,
          nome: prod.nome,
          preco: prod.preco,
          imagem_produto: prod.imagem_produto,
          Request: {
            tipo: 'GET',
            descricao: 'Retorna os detalhes de um produto específico',
            url: process.env.URL_API + 'produtos/' + prod.productId
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
    const response = {
      message: 'Produto inserido com sucesso',
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
    return res.status(500).send({ error: error })
  }
}

exports.getUmProduto = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM produtos WHERE id_produtos = ?'
    const result = await mysql.execute(query, [req.params.id_produto])
    if (result.length == 0) {
      return res.status(404).send({
        message: "Não foi encontrado produto com este ID"
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

exports.updateProduto = async (req, res, next) => {
  try {
    const query = ` UPDATE produtos
                     SET nome          = ?, 
                         preco         = ?
                    WHERE id_produtos  = ?`
    await mysql.execute(query, [
      req.body.nome,
      req.body.preco,
      req.body.id_produtos
    ])

    const response = {
      message: 'Produto atualizado com sucesso',
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
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}

exports.deleteProduto = async (req, res, next) => {
  try {
    const query = `DELETE FROM produtos WHERE id_produtos = ?`
    await mysql.execute(query, [req.body.id_produtos])

    const response = {
      message: 'Produto removido com sucesso',
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
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}


exports.postImagem = (req, res, next) => {
  try {
    const query = 'INSERT INTO imagens_produtos (id_produtos,  caminho) VALUES (?,?)'
    const result = mysql.execute(query, [
      req.params.id_produtos,
      req.file.path
    ])

    const response = {
      message: 'Imagem inserida com sucesso',
      imagemCriada: {
        id_produto: req.params.id_produtos,
        id_imagem: result.id_produtos,
        imagem_produto: req.file.path,
        // Request: {
        //   tipo: 'GET',
        //   descricao: 'Retorna todos os produtos',
        //   url: process.env.URL_API + 'produtos'
        // }
      }
    }
    return res.status(201).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}