const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }
    return jwt.sign(id, this.secret)
  }
}

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  /*
    - Teste para garantir que a classe TokenGenerator vai retornar
    um valor null caso a biblioteca JWT também retorne null
    - Como o mock do jsonwebtoken sempre retorna um valor de token,
    é necessário mockar o token para null para passar o teste
  */

  test('Should return null if JWT retuns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('Should return a token if JWT retuns token', async () => {
    /*
    - Teste para garantir que a classe retorne um token caso
    a biblioteca retorne um token também
  */

    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('Should call JWT with correct values', async () => {
    /*
    - Teste para garantir que a biblioteca JWT receba os valores
    corretos
  */

    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Should throw if no secret is provided', async () => {
    /*
    - Teste para garantir que a classe retorne um exceção caso
    o secret não seja passado no parâmetro da classe
  */

    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })
})
