const mysql = require('../mysql')

//========================== ROTA QUE RETORNA TODOS OS PRODUTOS ==================================== //

exports.getProducts = async (req, res, next) => {
  try {
    let name = ''
    if (req.query.name) {
      name = req.body.name
    }
    const query = `
        SELECT * 
        FROM products
        WHERE categoryId = ?
        AND name LIKE '%${name}%' 
    `
    const result = await mysql.execute(query, [
      req.query.categoryId
    ])

    const response = {
      quantity: result.length,
      product: result.map(prod => { //prod = product
        return {
          productId: prod.productId,
          name: prod.name,
          price: prod.price,
          productImage: prod.productImage,
          Request: {
            type: 'GET',
            description: 'Retorna os detalhes de um produto específico',
            url: process.env.URL_API + 'products/' + prod.productId
          }
        }
      })
    }
    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}


//========================== ROTA PARA INSERIR UM PRODUTO ==================================== //

exports.postProduct = async (req, res, next) => {
  try {
    const query = 'INSERT INTO products (name, price, productImage, categoryId) VALUES (?,?,?,?)'
    const result = await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.file.path,
      req.body.categoryId
    ])
    console.log(result)
    const response = {
      message: 'Produto inserido com sucesso',
      createdProduct: {
        productId: result.productId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
        categoryId: req.body.categoryId,
        Request: {
          type: 'GET',
          description: 'Retorna todos os produtos',
          url: process.env.URL_API + 'products'
        }
      }
    }
    return res.status(201).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error })
  }
}

//========================== ROTA QUE RETORNA 1 PRODUTO ESPECÍFICO ==================================== //

exports.getProductDetail = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM products WHERE productId = ?'
    const result = await mysql.execute(query, [req.params.productId])
    if (result.length == 0) {
      return res.status(404).send({
        message: "Não foi encontrado produto com este ID"
      })
    }

    const response = {
      product: {
        productId: result[0].productId,
        name: result[0].name,
        price: result[0].price,
        productImage: result[0].productImage,
        Request: {
          type: 'GET',
          description: 'Retorna todos os produtos',
          url: process.env.URL_API + 'products'
        }
      }
    }
    return res.status(200).send(response)
  } catch (error) {
    console.error(error)
    return res.status(500).send({ error: error })
  }
}

//========================== ROTA QUE ALTERA 1 PRODUTO ESPECÍFICO ==================================== //

exports.updateProduct = async (req, res, next) => {
  try {
    const query = ` UPDATE products
                       SET name       = ?, 
                           price      = ?
                     WHERE productId  = ?`
    await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.params.productId
    ])

    const response = {
      message: 'Produto atualizado com sucesso',
      updatedProduct: {
        productId: req.body.productId,
        name: req.body.name,
        price: req.body.price,
        Request: {
          type: 'GET',
          description: 'Retorna os detalhes de um produto específico',
          url: process.env.URL_API + 'products/' + req.body.productId
        }
      }
    }
    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}

//========================== ROTA PARA DELETAR 1 PRODUTO ESPECÍFICO ==================================== //

exports.deleteProduct = async (req, res, next) => {
  try {
    const query = `DELETE FROM products WHERE productId = ?`
    await mysql.execute(query, [req.params.productId])

    const response = {
      message: 'Produto removido com sucesso',
      request: {
        type: 'POST',
        description: 'Insere um produto',
        url: process.env.URL_API + 'products',
        body: {
          name: 'String',
          price: 'Number'
        }
      }
    }
    return res.status(202).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}


exports.postImage = async (req, res, next) => {
  try {
    const query = 'INSERT INTO productImages (productId,  path) VALUES (?,?)'
    const result = await mysql.execute(query, [
      req.params.productId,
      req.file.path
    ])

    console.log(result)

    const response = {
      message: 'Imagem inserida com sucesso',
      createdImage: {
        productId: parseInt(req.params.productId),
        imageId: result.insertId,
        imageProduct: req.file.path,
        Request: {
          type: 'GET',
          description: 'Retorna todas as imagens',
          url: process.env.URL_API + 'products/' + req.params.productId + '/images'
        }
      }
    }
    return res.status(201).send(response)
  } catch (error) {
    //console.log(error)
    return res.status(500).send({ error: error })
  }
}

exports.getImages = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM productImages WHERE productId = ?'
    const result = await mysql.execute(query, [req.params.productId])
    const response = {
      quantity: result.length,
      images: result.map(img => {
        return {
          productId: parseInt(req.params.productId),
          imageId: img.imageId,
          path: process.env.URL_API + img.path
        }
      })
    }
    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error })
  }
}