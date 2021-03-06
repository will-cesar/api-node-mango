const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')
const contentType = require('../middlewares/content-type')

module.exports = (app) => {
  // remove uma propriedade padrão do header do express
  app.disable('x-powered-by')

  // libera o CORS
  app.use(cors)

  // "ativa" o body parser nas requisições
  app.use(jsonParser)

  app.use(contentType)
}
