const mysql = require('../mysql')


//========================== RETORNA TODAS AS CATEGORIAS ==================================== //

exports.getCategories = async (req, res, next) => {
  try {
    const query = `
        SELECT * 
          FROM categories
          `
    const result = await mysql.execute(query)

    const response = {
      length: result.length,
      categories: result.map(category => {
        return {
          categoryId: category.categoryId,
          name: category.name
        }
      })
    }
    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}


//========================== INSERIR UMA CATEGORIA ==================================== //

exports.postCategory = async (req, res, next) => {
  try {
    const query = 'INSERT INTO categories (name) VALUES (?)'
    const result = await mysql.execute(query, [req.body.name])

    console.log(result)
    const response = {
      message: 'Categoria inserida com sucesso',
      createdCategory: {
        categoryId: result.productId,
        name: req.body.name,

        Request: {
          type: 'GET',
          description: 'Retorna todas oa categorias',
          url: process.env.URL_API + 'categories'
        }
      }
    }
    return res.status(201).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error })
  }
}