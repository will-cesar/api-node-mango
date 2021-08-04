const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  /*
    - Método factory que cria uma classe mock de repositório
  */

  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }

  const encrypterSpy = new EncrypterSpy()

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
    password: 'hashed_password'
  }
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy)

  return { sut, loadUserByEmailRepositorySpy, encrypterSpy }
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

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    /*
      - Teste para gerar uma excessão caso o LoadUserByEmailRepository não seja
      passado na hora de criar a instância da classe
    */

    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    /*
      - Teste para gerar uma excessão caso o LoadUserByEmailRepository não tenha
      o método load()
      - Está sendo passado um objeto vazio como parâmetro, assim o mesmo se torna
      undefined dentro da classe
    */

    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@email.com', 'any_password')

    expect(promise).rejects.toThrow()
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
    */

    const { sut } = makeSut()
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
})
