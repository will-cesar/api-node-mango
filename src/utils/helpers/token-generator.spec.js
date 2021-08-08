class TokenGenerator {
  async generate (id) {
    return null
  }
}

describe('Token Generator', () => {
  /*
    Teste para garantir que a classe TokenGenerator vai retornar
    um valor null caso a biblioteca JWT também retorne null
  */

  test('Should return null if JWT retuns null', async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
})
