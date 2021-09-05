module.exports = (app) => {
  // remove uma propriedade padrão do header do express
  app.disable('x-powered-by')

  // libera o CORS
  app.use((req, res, next) => {
    res.set('access-control-allow-origin', '*')
    res.set('access-control-allow-methods', '*')
    res.set('access-control-allow-headers', '*')
    next()
  })
}
