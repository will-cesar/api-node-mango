const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')

const makeSut = () => {
  /*
        método que cria uma classe mockada de autenticação (por isso
        se utiliza do "Spy" no final do nome, para identificar que
        essa classe é mockada) e faz uma instância das classes
        AuthUseCaseSpy e LoginRouter, retornando as mesmas para
        serem utilizadas. Por padrão está sendo definido um token
        válido toda vez que é utilizado o método makeSut
    */
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy)

  return { sut, authUseCaseSpy }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    /*
            Nesse teste se espera o retorno "400" da requisição caso
            a propriedade email não seja passada dentro do body
        */
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    /*
            Nesse teste se espera o retorno "400" da requisição caso
            a propriedade password não seja passada dentro do body
        */
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provided', () => {
    /*
            Nesse teste se espera o retorno "500" da requisição caso
            seja chamada a requisição, mas não passe nenhum parâmetro
            para a rota. No método route do "ligin-router.js" se espera
            um parâmetro de "httpRequest"
        */
    const { sut } = makeSut()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if httpRequest has no body', () => {
    /*
            Nesse teste se espera o retorno "500" da requisição caso
            o request não tenha body. O objeto vazio representa o
            httpRequest sem o body
        */
    const { sut } = makeSut()

    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should call AuthUserCase with correct params', () => {
    /*
            Nesse teste se espera que o email e a senha passados no
            authUseCase são os mesmos que estão sendo passados no request
        */

    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Should return 401 when invalid credentials are provided', () => {
    /*
            Nesse teste se espera o retorno 401 quando é passado
            pela requisição um token inválido. Como por padrão o
            método "makeSut()" retorna um token válido, é necessário
            readaptar o token colocando a váriavel como "null"
        */

    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null

    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 when valid credentials are provided', () => {
    /*
            Nesse teste se espera o retorno 200 quando é passado
            pela requisição um token válido. Como por padrão o método
            "makeSut()" retorna um token válido, não é preciso fazer
            nenhuma adaptação
        */
    const { sut, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Should return 500 if no AuthUseCase is provided', () => {
    /*
            Nesse teste se espera o retorno 500 quando o authUseCase não
            é passado na requisição. Foi instanciado o LoginRouter()
            dentro do teste, pois quando utilizamos o makeSut() é criada a
            instância do authUseCase automaticamente, então dessa forma retornaria
            um resultado positivo, mas não é isso que queremos nesse teste
        */
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if AuthUseCase has no auth method', () => {
    /*
            Nesse teste se espera o retorno 500 quando não é passado o método
            auth do authUseCase. Foi instanciado o LoginRouter()
            dentro do teste, pois quando utilizamos o makeSut() é criada a
            instância do authUseCase automaticamente, então dessa forma retornaria
            um resultado positivo. O LoginRouter foi instanciado passando um objeto
            vazio, assim forçando o authUseCase ser undefined, dessa forma
            o retorno será como esperado, 500
        */

    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
