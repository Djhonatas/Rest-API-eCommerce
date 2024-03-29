const cors = require('cors')
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const routeProducts = require('./routes/products')
const routeOrders = require('./routes/orders')
const routeUsers = require('./routes/users')
const routeImages = require('./routes/images')
const routeCategory = require('./routes/category')



app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))//apenas dados simples
app.use(bodyParser.json())//json de entrada no body
app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', GET)
    return res.status(200).send({})
  }
  next()
})

app.use('/products', routeProducts)
app.use('/orders', routeOrders)
app.use('/users', routeUsers)
app.use('/images', routeImages);
app.use('/categories', routeCategory)



//quando não encontra rota, entra aqui
app.use((req, res, next) => {
  const erro = new Error('Não encontrado')
  erro.status = 404
  next(erro)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  return res.send({
    erro: {
      message: error.message
    }
  })
})

module.exports = app