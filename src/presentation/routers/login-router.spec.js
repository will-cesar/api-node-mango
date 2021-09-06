const LoginRouter = require('./login-router')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const { ServerError, UnauthorizedError } = require('../errors')

const makeSut = () => {
  /*
    método que cria uma classe mockada de autenticação (por isso
    se utiliza do "Spy" no final do nome, para identificar que
    essa classe é mockada) e faz uma instância das classes
    AuthUseCaseSpy e LoginRouter, retornando as mesmas para
    serem utilizadas. Por padrão está sendo definido um token
    válido toda vez que é utilizado o método makeSut
  */

  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

  return { sut, authUseCaseSpy, emailValidatorSpy }
}

const makeEmailValidator = () => {
  /*
    - Factory para gerar uma instância da classe EmailValidatorSpy.
    Essa classe tem um método de validação de email.
    - Por padrão é passado a propriedade "isEmailValid" como true, para
    não precisar modificar todos os testes, assim para testar algum
    caso de uso diferente, é necessário modificar a propriedade
    apenas para aquele caso em específico.
    - Retorna uma instância do emailValidatorSpy modificada.
  */

  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  /*
    - Factory para gerar uma instância da classe EmailValidatorSpy com erro.
    - Esse método cria a classe EmailValidatorSpy simulando um erro
    e retorna a mesma.
  */
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }

  return new EmailValidatorSpy()
}

const makeAuthUseCase = () => {
  /*
    - Factory para não repetição de código.
    - Esse método cria a classe AuthUseCaseSpy e retorna a mesma.
  */

  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }

  return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
  /*
    - Factory para não repetição de código.
    - Esse método cria a classe AuthUseCaseSpy simulando um erro
    e retorna a mesma.
  */

  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', async () => {
    /*
      Nesse teste se espera o retorno "400" da requisição caso
      a propriedade email não seja passada dentro do body.
    */

    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(
      new MissingParamError('email').message
    )
  })

  test('Should return 400 if no password is provided', async () => {
    /*
      Nesse teste se espera o retorno "400" da requisição caso
      a propriedade password não seja passada dentro do body.
    */

    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(
      new MissingParamError('password').message
    )
  })

  test('Should return 400 if an invalid email is provided', async () => {
    /*
      - Nesse teste se espera o retorno "400" da requisição caso
      a propriedade email seja inválida.
      - É capturada o emailValidatorSpy do "makeSut()" e modificada
      a propriedade "isEmailValid" para false de propósito, para
      ocorrer o erro de e-mail inválido.
    */

    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(
      new InvalidParamError('email').message
    )
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    /*
      - Nesse teste se espera o retorno "500" e o body sendo ServerError()
      da requisição, caso seja chamada a requisição, mas não passe nenhum
      parâmetro para a rota.
      - No método route do "ligin-router.js" se espera um parâmetro de
      "httpRequest".
    */

    const { sut } = makeSut()

    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if httpRequest has no body', async () => {
    /*
      - Nesse teste se espera o retorno "500" e o body sendo ServerError()
      da requisição, caso o request não tenha body.
      - O objeto vazio representa o httpRequest sem o body.
    */

    const { sut } = makeSut()

    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should call AuthUserCase with correct params', () => {
    /*
      Nesse teste se espera que o email e a senha passados no
      authUseCase são os mesmos que estão sendo passados no request.
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

  test('Should return 401 when invalid credentials are provided', async () => {
    /*
      - Nesse teste se espera o retorno 401 quando é passado
      pela requisição um token inválido.
      - Como por padrão o método "makeSut()" retorna um token válido,
      é necessário readaptar o token colocando a váriavel como "null".
    */

    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null

    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.error).toBe(new UnauthorizedError().message)
  })

  test('Should return 200 when valid credentials are provided', async () => {
    /*
      - Nesse teste se espera o retorno 200 quando é passado
      pela requisição um token válido.
      - Como por padrão o método "makeSut()" retorna um token válido,
      não é preciso fazer nenhuma adaptação.
    */

    const { sut, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Should return 500 if no AuthUseCase is provided', async () => {
    /*
      - Nesse teste se espera o retorno "500" e o body sendo ServerError()
      da requisição, quando o authUseCase não é passado na requisição.
      - Foi instanciado o LoginRouter() dentro do teste, pois quando utilizamos
      o makeSut() é criada a instância do authUseCase automaticamente,
      então dessa forma retornaria um resultado positivo,
      mas não é isso que queremos nesse teste.
    */

    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if AuthUseCase has no auth method', async () => {
    /*
      - Nesse teste se espera o retorno "500" e o body sendo ServerError()
      da requisição, quando não é passado o método auth do authUseCase.
      - Foi instanciado o LoginRouter() dentro do teste, pois quando
      utilizamos o makeSut() é criada a instância do authUseCase
      automaticamente, então dessa forma retornaria um resultado positivo.
      - O LoginRouter foi instanciado passando um objeto vazio, assim forçando
      o authUseCase ser undefined, dessa forma o retorno será como esperado, 500.
    */

    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if no EmailValidator is provided', async () => {
    /*
      - Nesse teste se espera o retorno "500" e o body sendo ServerError()
      da requisição, quando o EmailValidator não for injetado dentro do
      método route().
      - Nesse caso não está sendo utilizado o "makeSut()" porque como padrão
      é injetado o EmailValidator de forma correta no route, assim nesse
      teste é necessário criar uma nova instância do LoginRouter e
      não passar o EmailValidator.
    */

    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if EmailValidator has no isValid method', async () => {
    /*
      - Nesse teste se espera o retorno "500" e o body sendo ServerError()
      da requisição, quando o EmailValidator não tem o método "isValid()".
      - Nesse caso não está sendo utilizado o "makeSut()" porque como padrão
      o EmailValidator tem o método "isValid()", assim sendo válido, mas nesse
      teste é necessário que não exista esse método.
      - Então é passado um objeto vazio para o emailValidator seja
      undefined, assim não existindo o método "isValid()"
    */

    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should call EmailValidator with correct email', () => {
    /*
      Nesse teste se espera que o email recebido pelo emailValidatorSpy
      seja o mesmo email recebido pelo response da requisição.
    */

    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  test('Should throw if invalid dependencies are provided', async () => {
    /*
      - Teste para testar as injeções de dependência na classe
      - Esse teste é necessário para garantir que o erro será emitido
      pela classe
    */

    const invalid = {}
    const authUseCase = makeAuthUseCase()

    const suts = [].concat(
      new LoginRouter(),
      new LoginRouter({}),
      new LoginRouter({
        authUseCase: invalid
      }),
      new LoginRouter({
        authUseCase
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: invalid
      })
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'any_email@email.com',
          password: 'any_password'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })

  test('Should throw if any dependency throws', async () => {
    /*
      - Teste para retornar um erro caso uma dependência retorne um erro
      também
    */

    const authUseCase = makeAuthUseCase()

    const suts = [].concat(
      new LoginRouter({
        authUseCase: makeAuthUseCaseWithError()
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: makeEmailValidatorWithError()
      })
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'any_email@email.com',
          password: 'any_password'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
