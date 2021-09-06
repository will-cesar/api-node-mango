const loginRouter = require('../composers/login-router-composer')
const expressRouterAdapter = require('../adapter/express-router-adapter')

module.exports = (router) => {
  router.post('/login', expressRouterAdapter.adapt(loginRouter))
}
