const http = require('http');
const app = require('./app');
const port = process.env.PORT || 8080;
console.log('Servidor On')
const server = http.createServer(app);
server.listen(port);