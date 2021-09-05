/*
  Middleware para garantir que todas as requisições respondam com o
  header do Content-Type do tipo JSON
*/

module.exports = (req, res, next) => {
  res.type('json')
  next()
}
