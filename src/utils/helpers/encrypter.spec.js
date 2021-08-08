const bcryptjs = require('bcryptjs')
const Encrypter = require('./encrypter')
const MissingParamError = require('../errors/missing-param-error')

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Should return true if bcryptjs returns true', async () => {
    /*
      - Teste responsável por validar se o retorno da biblioteca bcrypt é true
      - Caso seja true, é necessário que o método retorne true também
    */

    const sut = makeSut()
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

    const sut = makeSut()
    bcryptjs.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('Should call bcryptjs with correct values', async () => {
    /*
      - Teste para validar se o "value" e o "hash" passados para o bcryptjs
      são os valores corretos
    */

    const sut = makeSut()
    await sut.compare('any_value', 'hashed_value')
    expect(bcryptjs.value).toBe('any_value')
    expect(bcryptjs.hash).toBe('hashed_value')
  })

  test('Should throw if no params are provided', async () => {
    /*
      - Teste para retornar um erro caso nenhum parâmetro seja passado,
      ou se apenas um ou outro parâmetro seja passado
      - É obrigatório o envio dos dois parâmetros para a função Encrypter
      - Quando estamos testando uma exceção de um método assíncrono
      é necessário utilizar o "rejects"
    */

    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
