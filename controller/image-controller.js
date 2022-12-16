/*const mysql = require('mysql2')

exports.deleteImage = async (req, res, next) => {
  try {
    const query = `DELETE FROM productImagens WHERE imageId = ?`
    await mysql.execute(query, [req.params.imageId])

    const response = {
      message: 'Imagem removida com sucesso!',
      request: {
        type: 'POST',
        description: 'Insere um produto',
        url: process.env.URL_API + 'products/' + req.body.productId + '/image',
        body: {
          product: 'Number',
          path: 'File'
        }
      }
    }
    return res.status(201).send(response)

  } catch (error) {
    return res.status(500).send({ error: error })
  }
}*/