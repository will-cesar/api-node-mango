const HttpResponse = require('../helpers/http-response')
const MissingParamError = require('../helpers/missing-param-error')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    /*
      O try catch foi utilizado nesse caso pois, cada erro
      que pode ocorrer vai quebrar algum método de alguma forma,
      assim caindo o catch. Dessa forma não é necessário fazer
      uma validação para cada dependência que faltar. As validações
      esperadas nesse try catch são !httpRequest, !httpRequest.body,
      !this.authUseCase, !this.authUseCase.auth, e quando o authUseCase
      retorna algum erro interno
    */

    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ accessToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
