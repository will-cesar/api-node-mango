const cors = require('../middlewares/cors')

module.exports = (app) => {
  // remove uma propriedade padrão do header do express
  app.disable('x-powered-by')

  // libera o CORS
  app.use(cors)
}
