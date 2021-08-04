const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  /*
    - Método factory que cria uma classe mock do Encrypter
  */

  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeEncrypterWithError = () => {
  /*
    - Método factory para retornar um erro
  */

    class EncrypterSpy {
      async compare () {
        throw new Error()
      }
    }
  
    return new EncrypterSpy()
}

const makeTokenGenerator = () => {
  /*
    - Método factory que cria uma classe mock de geração de token
    de usuário
    - O método generate() captura um userId e retorna um token
    - Por padrão ela retorna um valor de token válido 
  */

  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'

  return tokenGeneratorSpy
}

const makeTokenGeneratorWithError = () => {
  /*
    - Método factory para retornar um erro
  */

  class TokenGeneratorSpy {
    async generate (userId) {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

const makeLoadUserByEmailRepository = () => {
  /*
    - Método factory que cria uma classe mock de repositório
  */

  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email

      return this.user
    }
  }

  /*
    - loadUserByEmailRepositorySpy simula a consulta no banco de dados
    retornando os dados de um usuário
  */
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  /*
    - Método factory para retornar um erro
  */

  class LoadUserByEmailRepositorySpy {
    async load () {
      throw new Error()
    }
  }

  return new LoadUserByEmailRepositorySpy()
}


const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy, 
    encrypter: encrypterSpy, 
    tokenGenerator: tokenGeneratorSpy
  })

  return { 
    sut, 
    loadUserByEmailRepositorySpy, 
    encrypterSpy, 
    tokenGeneratorSpy 
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', () => {
    /*
      - Nesse teste é esperado o retorno de um erro do tipo MissingParamError
      quando não passar um email na chamada da classe AuthUseCase()
      - const promise => está sendo retornada uma promise pois o método auth()
      é assíncrono, e a variável "promise" não está utilizando await para esperar o retorno
    */

    const { sut } = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', () => {
    /*
      - Nesse teste é esperado o retorno de um erro do tipo MissingParamError
      quando não passar uma senha na chamada da classe AuthUseCase()
    */

    const { sut } = makeSut()
    const promise = sut.auth('any_email@email.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    /*
      - Teste para certificar que o email recebido dentro da classe LoadUserByEmailRepository
      seja o mesmo que está sendo passado na classe AuthUseCase
    */

    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')

    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@email.com')
  })

  test('Should return null if an invalid email is provided', async () => {
    /*
      - Teste para garantir que a classe AuthUseCase vai retornar um valor null
      caso o repositório, LoadUserByEmailRepository, retorne null
      - Ou seja, caso não encontre o usuário pelo email, será retornado um valor
      null pela classe
    */

    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@email.com', 'any_password')

    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password is provided', async () => {
    /*
      - Teste para garantir que a classe AuthUseCase vai retornar um valor null
      caso o repositório, LoadUserByEmailRepository, retorne null
      - Ou seja, caso o password seja inválido, será retornado um valor
      null pela classe
      - Como por padrão do mock a password está sempre válida, está sendo mockado 
      o valor de isValid como false para testar um valor inválido
    */

    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@email.com', 'invalid_password')

    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    /*
      - Teste para garantir a integração do AuthUseCase com a biblioteca
      de criptografia de senhas
      - O Encrypter precisa receber o password da chamada do método, e o 
      password criptografado recebido do user de dentro do método auth
    */

    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGenerator with correct userId', async () => {
    /*
      - Teste para verificar se o id do usuário recebido do 
      loadUserByEmailRepositorySpy seja o mesmo que o tokenGeneratorSpy 
      recebeu na chamada
    */

    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'valid_password')

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('Should return an accessToken if correct credentials are provided', async () => {
    /*
      - Teste para verificar se as credenciais de acesso são corretas,
      retornar um token válido
      - Se espera que o token retornado pelo método auth() seja o mesmo token
      que está na classe spy tokenGeneratorSpy
      - Também se espera que o accessToken não seja null
    */

    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@email.com', 'valid_password')

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('Should throw if invalid dependencies are provided', async () => {
    /*
      - Teste para testar as injeções de dependência na classe 
      - Esse teste é necessário para garantir que o erro será emitido
      pela classe AuthUseCase, para a outra classe que chamou ela, a LoginRouter
      receba o erro e trate ele
    */

    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()

    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({ 
        loadUserByEmailRepository: invalid 
      }),
      new AuthUseCase({ 
        loadUserByEmailRepository
      }),
      new AuthUseCase({ 
        loadUserByEmailRepository,
        encrypter: invalid 
      }),
      new AuthUseCase({ 
        loadUserByEmailRepository,
        encrypter
      }),
      new AuthUseCase({ 
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid 
      })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if dependency throws', async () => {
    /*
      - Teste para retornar um erro caso uma dependência retorne um erro 
      também
    */
   
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const suts = [].concat(
      new AuthUseCase({ 
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError() 
      }),
      new AuthUseCase({ 
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({ 
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})

