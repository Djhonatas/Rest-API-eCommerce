const mysql = require('mysql2')

var pool = mysql.createPool({
  "connectionLimit": 100,
  "user": process.env.MYSQL_USER,
  "password": process.env.MYSQL_PASSWORD,
  "database": process.env.MYSQL_DATABASE,
  "host": process.env.MYSQL_HOST,
  "port": process.env.MYSQL_PORT
})

exports.execute = (query, params = []) => {
  return new Promise((resolve, reject) => { //dois eventos callback. resolve = deu certo, reject, deu erro
    pool.query(query, params, (error, result, fields) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

exports.pool = pool