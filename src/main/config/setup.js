module.exports = (app) => {
  // remove uma propriedade padrão do header do express
  app.disable('x-powered-by')
}
