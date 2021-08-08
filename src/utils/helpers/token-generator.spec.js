const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (id) {
    return jwt.sign(id, 'secret')
  }
}

const makeSut = () => {
  return new TokenGenerator()
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
})
