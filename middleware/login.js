const jwt = require('JsonWebToken')

exports.required = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token, process.env.JWT_KEY)
    req.usuario = decode
    next()
  } catch (error) {
    return res.status(401).send({ message: 'Falha na autenticação, tente novamente.' })
  }
}

exports.optional = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token, process.env.JWT_KEY)
    req.user = decode
    next()
  } catch (error) {
    next()
  }
} 