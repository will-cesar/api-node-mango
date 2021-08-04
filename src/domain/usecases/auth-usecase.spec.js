const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  /*
    - Método factory que cria uma classe mock de repositório
  */

  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return { sut, loadUserByEmailRepositorySpy }
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

    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
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

    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })

  test('Should return null if LoadUserByEmailRepository returns null', async () => {
    /*
      - Teste para garantir que a classe AuthUseCase vai retornar um valor null
      caso o repositório, LoadUserByEmailRepository, retorne null
      - Ou seja, caso não encontre o usuário pelo email, será retornado um valor
      null pela classe
    */

    const { sut } = makeSut()
    const accessToken = await sut.auth('invalid_email@email.com', 'any_password')

    expect(accessToken).toBeNull()
  })
})
