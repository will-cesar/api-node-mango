const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    await this.loadUserByEmailRepository.load(email)
  }
}

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
})
