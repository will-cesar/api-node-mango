const bcryptjs = require('bcryptjs')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcryptjs.compare(value, hash)
    return isValid
  }
}

describe('Encrypter', () => {
  test('Should return true if bcryptjs returns true', async () => {
    /*
      - Teste responsável por validar se o retorno da biblioteca bcrypt é true
      - Caso seja true, é necessário que o método retorne true também
    */

    const sut = new Encrypter()
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Should return false if bcryptjs returns false', async () => {
    /*
      - Teste responsável por validar se o retorno da biblioteca bcrypt é false
      - Caso seja false, é necessário que o método retorne false também
      - Por padrão, o mock "bcryptjs" retorna sempre true a propriedade "isValid"
      - Para o teste ser bem sucedido é necessário passar o valor false dentro do teste
    */

    const sut = new Encrypter()
    bcryptjs.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })
})
